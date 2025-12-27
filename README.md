# MUA!_TUNES RADIO - Remote Desktop Sharing

A WebRTC-based remote desktop sharing application that allows team members to share their screens securely in real-time.

## Features

- 🖥️ **Screen Sharing**: Share your entire desktop or specific application windows
- 🔒 **Peer-to-Peer**: Direct WebRTC connections for secure, low-latency streaming
- 👥 **Multi-User Rooms**: Multiple users can join the same room and share screens
- 🎨 **Modern UI**: Clean, responsive interface with real-time status updates
- 🚀 **Easy Setup**: Simple installation and usage with minimal configuration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MUATUNES/88105782.git
cd 88105782
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. To share your screen:
   - Enter a room ID or click "Create Random Room"
   - Click "Join Room"
   - Click "Share My Screen"
   - Select the screen or window you want to share
   - Share the room ID with others to join

4. To view someone else's screen:
   - Enter the same room ID
   - Click "Join Room"
   - You'll see remote screens as they start sharing

## Technology Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript
- **WebRTC**: For peer-to-peer screen sharing
- **Socket.IO**: For signaling and room management

## Architecture

The application uses a client-server architecture with WebRTC for peer-to-peer connections:

1. **Server** (`server/server.js`): Handles Socket.IO connections, room management, and WebRTC signaling
2. **Client** (`client/`): Web interface for screen sharing and viewing
   - `index.html`: Main HTML structure
   - `styles.css`: Styling and responsive design
   - `client.js`: WebRTC logic and Socket.IO client

## Security Considerations

- All screen sharing requires explicit user permission via browser APIs
- WebRTC uses DTLS-SRTP for encrypted media streams
- Uses STUN servers for NAT traversal (Google's public STUN servers)
- For production use, consider:
  - Adding authentication and authorization
  - Implementing TURN servers for better connectivity
  - Using HTTPS/WSS for secure connections
  - Adding rate limiting and room access controls

## Browser Compatibility

This application requires a modern browser with WebRTC support:
- ✅ Chrome/Chromium 74+
- ✅ Firefox 66+
- ✅ Safari 12.1+
- ✅ Edge 79+

## Troubleshooting

**Screen sharing not working?**
- Ensure you're using HTTPS or localhost (HTTP is only allowed on localhost)
- Check browser permissions for screen sharing
- Verify your browser supports `getDisplayMedia` API

**Can't connect to other users?**
- Ensure both users are in the same room
- Check your firewall settings
- For restrictive networks, you may need a TURN server

**Server won't start?**
- Check if port 3000 is already in use
- Set a different port: `PORT=8080 npm start`
- Ensure all dependencies are installed

## Development

To run in development mode with auto-reload, you can use nodemon:

```bash
npm install -g nodemon
nodemon server/server.js
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Credits

Created for MUA!_TUNES RADIO project
