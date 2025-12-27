const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow all origins for development. In production, restrict to specific domains
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Store active rooms and users
const rooms = new Map();
const users = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle user joining a room
  socket.on('join-room', (roomId, userId) => {
    console.log(`User ${userId} joining room ${roomId}`);
    
    socket.join(roomId);
    users.set(socket.id, { userId, roomId });
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    // Notify other users in the room
    socket.to(roomId).emit('user-connected', userId);
    
    // Send list of existing users to the new user
    const existingUsers = Array.from(rooms.get(roomId))
      .filter(id => id !== socket.id)
      .map(id => users.get(id)?.userId)
      .filter(Boolean);
    
    socket.emit('existing-users', existingUsers);
  });
  
  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    console.log(`Offer from ${socket.id} to ${data.to}`);
    socket.to(data.to).emit('offer', {
      offer: data.offer,
      from: socket.id
    });
  });
  
  socket.on('answer', (data) => {
    console.log(`Answer from ${socket.id} to ${data.to}`);
    socket.to(data.to).emit('answer', {
      answer: data.answer,
      from: socket.id
    });
  });
  
  socket.on('ice-candidate', (data) => {
    console.log(`ICE candidate from ${socket.id} to ${data.to}`);
    socket.to(data.to).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id
    });
  });
  
  // Handle screen sharing start
  socket.on('start-screen-share', (roomId) => {
    console.log(`Screen sharing started by ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit('screen-share-started', socket.id);
  });
  
  // Handle screen sharing stop
  socket.on('stop-screen-share', (roomId) => {
    console.log(`Screen sharing stopped by ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit('screen-share-stopped', socket.id);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const userData = users.get(socket.id);
    if (userData) {
      const { userId, roomId } = userData;
      
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
        }
      }
      
      socket.to(roomId).emit('user-disconnected', userId);
      users.delete(socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Remote Desktop Sharing Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
