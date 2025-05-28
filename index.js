// filepath: /home/tushar/tutorial-projects/backend/msg-broadcast-server/server.js
import { WebSocketServer, WebSocket } from 'ws';

const clients = new Set();
let wssInstance = null;

export function startServer(port) {
  if (wssInstance) {
    console.log('Server is already running or was not properly shut down.');
    return;
  }
  const wss = new WebSocketServer({ port });
  wssInstance = wss;

  wss.on('listening', () => {
    console.log(`Server started and listening on ws://localhost:${port}`);
  });

  wss.on('connection', (ws, req) => {
    const clientId = req.headers['sec-websocket-key'] || `Client-${Date.now()}`;
    const shortClientId = clientId.substring(0, 6);
    console.log(`Client ${shortClientId} connected.`);
    clients.add(ws);

    // Notify other clients about new connection
    clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(`System: User ${shortClientId} has joined.`);
        }
    });

    ws.send('System: Welcome to the broadcast server! Type your messages below.');

    ws.on('message', (message) => {
      const messageString = message.toString().trim();
      if (messageString) {
        console.log(`Received from ${shortClientId}: ${messageString}`);
        // Broadcast to all clients
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(`User ${shortClientId}: ${messageString}`);
          }
        });
      }
    });

    ws.on('close', () => {
      console.log(`Client ${shortClientId} disconnected.`);
      clients.delete(ws);
      // Notify other clients about disconnection
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`System: User ${shortClientId} has left.`);
        }
      });
    });

    ws.on('error', (error) => {
      console.error(`Error with client ${shortClientId}:`, error.message);
      clients.delete(ws); // Ensure removal on error
    });
  });

  wss.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please use a different port or stop the existing service.`);
    }
    wssInstance = null; // Allow restart attempt
  });

  wss.on('close', () => {
    console.log('Server has been shut down.');
    wssInstance = null;
  });
}

// Graceful shutdown
const gracefulShutdown = () => {
  if (!wssInstance) {
    process.exit(0);
    return;
  }
  console.log('\nShutting down server...');
  let closedCount = 0;
  const totalClients = wssInstance.clients.size;

  if (totalClients === 0) {
    wssInstance.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
    return;
  }

  wssInstance.clients.forEach(client => {
    client.close(1000, 'Server is shutting down');
    // WebSocket 'close' event on client side will handle their exit
  });

  // Wait for clients to close, then close server
  let checks = 0;
  const interval = setInterval(() => {
    checks++;
    if (wssInstance.clients.size === 0 || checks > 20) { // Max 5 seconds wait
        clearInterval(interval);
        wssInstance.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
    }
  }, 250);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);