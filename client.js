// filepath: /home/tushar/tutorial-projects/backend/msg-broadcast-server/client.js
import WebSocket from 'ws';
import readline from 'readline';

export function connectClient(serverAddress) {
  const ws = new WebSocket(serverAddress);
  let rl;

  const setupReadline = () => {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });

    rl.prompt();

    rl.on('line', (line) => {
      const message = line.trim();
      if (message) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        } else {
          console.log('Not connected to server. Cannot send message.');
        }
      }
      rl.prompt();
    }).on('close', () => {
      console.log('Exiting chat. Goodbye!');
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
      process.exit(0);
    });
  };

  ws.on('open', () => {
    console.log(`Connected to server at ${serverAddress}`);
    console.log('Type your messages and press Enter. Press Ctrl+D or Ctrl+C to exit.');
    setupReadline();
  });

  ws.on('message', (data) => {
    const message = data.toString();
    if (rl) {
      // Clear current line, print message, then restore prompt and input
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
      console.log(message);
      rl.prompt(true);
    } else {
      console.log(message); // Should not happen if rl is setup on 'open'
    }
  });

  ws.on('close', (code, reason) => {
    const reasonString = reason ? reason.toString() : 'No reason provided';
    if (rl) {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
    }
    console.log(`\nDisconnected from server. Code: ${code}, Reason: ${reasonString}`);
    if (rl) {
      rl.close(); // This will trigger its 'close' event and process.exit
    } else {
      process.exit(0);
    }
  });

  ws.on('error', (error) => {
    if (rl) {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
    }
    console.error('Connection error:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error(`Could not connect to ${serverAddress}. Ensure the server is running.`);
    }
    if (rl) {
      rl.close();
    } else {
      process.exit(1);
    }
  });
}