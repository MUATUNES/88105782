// DOM Elements
const roomIdInput = document.getElementById('roomId');
const joinBtn = document.getElementById('joinBtn');
const createBtn = document.getElementById('createBtn');
const shareBtn = document.getElementById('shareBtn');
const stopShareBtn = document.getElementById('stopShareBtn');
const leaveBtn = document.getElementById('leaveBtn');
const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
const statusEl = document.getElementById('status');
const roomInfoEl = document.getElementById('roomInfo');
const sharingControls = document.getElementById('sharingControls');

// State
let socket;
let currentRoomId = null;
let currentUserId = null;
let localStream = null;
let peerConnections = new Map();

// ICE servers configuration
const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

// Initialize Socket.IO connection
function initializeSocket() {
    socket = io();
    
    socket.on('connect', () => {
        console.log('Connected to server');
        updateStatus('Connected to server', 'success');
    });
    
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        updateStatus('Disconnected from server', 'error');
    });
    
    socket.on('user-connected', (userId) => {
        console.log(`User connected: ${userId}`);
        updateStatus(`User ${userId} joined the room`);
    });
    
    socket.on('existing-users', (users) => {
        console.log('Existing users:', users);
    });
    
    socket.on('user-disconnected', (userId) => {
        console.log(`User disconnected: ${userId}`);
        updateStatus(`User ${userId} left the room`);
        removeRemoteVideo(userId);
    });
    
    socket.on('offer', async ({ offer, from }) => {
        console.log('Received offer from:', from);
        await handleOffer(offer, from);
    });
    
    socket.on('answer', async ({ answer, from }) => {
        console.log('Received answer from:', from);
        await handleAnswer(answer, from);
    });
    
    socket.on('ice-candidate', async ({ candidate, from }) => {
        console.log('Received ICE candidate from:', from);
        await handleIceCandidate(candidate, from);
    });
    
    socket.on('screen-share-started', (userId) => {
        console.log('Screen share started by:', userId);
        updateStatus(`User ${userId} started sharing screen`);
    });
    
    socket.on('screen-share-stopped', (userId) => {
        console.log('Screen share stopped by:', userId);
        updateStatus(`User ${userId} stopped sharing screen`);
        removeRemoteVideo(userId);
    });
}

// Generate random room ID
function generateRoomId() {
    return 'room-' + Math.random().toString(36).substring(2, 11);
}

// Join a room
function joinRoom() {
    const roomId = roomIdInput.value.trim() || generateRoomId();
    if (!roomId) {
        alert('Please enter a room ID');
        return;
    }
    
    currentRoomId = roomId;
    currentUserId = 'user-' + Math.random().toString(36).substring(2, 11);
    
    socket.emit('join-room', currentRoomId, currentUserId);
    
    roomIdInput.value = currentRoomId;
    document.querySelector('.room-controls').style.display = 'none';
    sharingControls.style.display = 'flex';
    
    updateStatus(`Joined room: ${currentRoomId}`, 'success');
    roomInfoEl.textContent = `Room ID: ${currentRoomId} | Your ID: ${currentUserId}`;
}

// Leave room
function leaveRoom() {
    if (localStream) {
        stopScreenShare();
    }
    
    // Close all peer connections
    peerConnections.forEach(pc => pc.close());
    peerConnections.clear();
    
    // Clear remote videos
    remoteVideos.innerHTML = '';
    
    currentRoomId = null;
    currentUserId = null;
    
    document.querySelector('.room-controls').style.display = 'flex';
    sharingControls.style.display = 'none';
    
    updateStatus('Left room', 'success');
    roomInfoEl.textContent = '';
    
    // Reinitialize socket
    if (socket) {
        socket.disconnect();
        initializeSocket();
    }
}

// Start screen sharing
async function startScreenShare() {
    try {
        localStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: 'always'
            },
            audio: false
        });
        
        localVideo.srcObject = localStream;
        
        shareBtn.style.display = 'none';
        stopShareBtn.style.display = 'inline-block';
        
        socket.emit('start-screen-share', currentRoomId);
        updateStatus('Sharing your screen', 'success');
        
        // Handle stream ended (user clicked browser's stop sharing button)
        localStream.getVideoTracks()[0].onended = () => {
            stopScreenShare();
        };
        
        // Create peer connections for existing users
        // In a real implementation, you would signal to other peers
        
    } catch (error) {
        console.error('Error starting screen share:', error);
        updateStatus('Failed to start screen sharing: ' + error.message, 'error');
    }
}

// Stop screen sharing
function stopScreenShare() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
        localStream = null;
    }
    
    shareBtn.style.display = 'inline-block';
    stopShareBtn.style.display = 'none';
    
    socket.emit('stop-screen-share', currentRoomId);
    updateStatus('Stopped sharing screen');
}

// Create peer connection
function createPeerConnection(peerId) {
    const pc = new RTCPeerConnection(iceServers);
    
    // Add local stream tracks if available
    if (localStream) {
        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
        });
    }
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', {
                candidate: event.candidate,
                to: peerId
            });
        }
    };
    
    // Handle incoming tracks
    pc.ontrack = (event) => {
        console.log('Received remote track from:', peerId);
        addRemoteVideo(peerId, event.streams[0]);
    };
    
    peerConnections.set(peerId, pc);
    return pc;
}

// Handle offer
async function handleOffer(offer, from) {
    const pc = createPeerConnection(from);
    
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    socket.emit('answer', {
        answer: answer,
        to: from
    });
}

// Handle answer
async function handleAnswer(answer, from) {
    const pc = peerConnections.get(from);
    if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
}

// Handle ICE candidate
async function handleIceCandidate(candidate, from) {
    const pc = peerConnections.get(from);
    if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
}

// Add remote video
function addRemoteVideo(userId, stream) {
    // Remove existing video if any
    removeRemoteVideo(userId);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'remote-video-wrapper';
    wrapper.id = `remote-${userId}`;
    
    const label = document.createElement('div');
    label.className = 'remote-user-label';
    label.textContent = userId;
    
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsinline = true;
    video.srcObject = stream;
    
    wrapper.appendChild(label);
    wrapper.appendChild(video);
    remoteVideos.appendChild(wrapper);
}

// Remove remote video
function removeRemoteVideo(userId) {
    const wrapper = document.getElementById(`remote-${userId}`);
    if (wrapper) {
        wrapper.remove();
    }
    
    const pc = peerConnections.get(userId);
    if (pc) {
        pc.close();
        peerConnections.delete(userId);
    }
}

// Update status
function updateStatus(message, type = '') {
    statusEl.textContent = message;
    statusEl.parentElement.className = 'status ' + type;
}

// Event listeners
joinBtn.addEventListener('click', joinRoom);
createBtn.addEventListener('click', () => {
    roomIdInput.value = generateRoomId();
    joinRoom();
});
shareBtn.addEventListener('click', startScreenShare);
stopShareBtn.addEventListener('click', stopScreenShare);
leaveBtn.addEventListener('click', leaveRoom);

roomIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoom();
    }
});

// Initialize
initializeSocket();
