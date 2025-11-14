// mock-server/wsServer.js
// Mock WebSocket server that periodically broadcasts "post:new" events.

const { WebSocketServer } = require('ws');

// Create a WebSocket server listening on port 3001
const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (socket) => {
  console.log('[WSS] client connected');

  // Optional: send a greeting
  socket.send(JSON.stringify({ type: 'hello', message: 'Connected to mock WSS' }));

  socket.on('close', () => {
    console.log('[WSS] client disconnected');
  });
});

// Every 25 seconds, broadcast a fake "post:new" event
setInterval(() => {
  const event = {
    type: 'post:new',
    postId: String(Date.now()), // pretend this is the new post's ID
  };

  console.log('[WSS] broadcasting', event);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(event));
    }
  });
}, 25_000);

console.log('[WSS] WebSocket server listening on ws://localhost:3001');
