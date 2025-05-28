# CLI Message Broadcast Server & Client

This project implements a command-line based message broadcast system using WebSockets. It consists of a server that listens for client connections and broadcasts messages received from any client to all other connected clients, and a client that can connect to this server to send and receive messages.

## Features

*   **Server Mode**: Starts a WebSocket server on a specified port.
*   **Client Mode**: Connects to a WebSocket server at a specified address and port.
*   **Message Broadcasting**: Messages sent by one client are broadcast to all other connected clients.
*   **Connection/Disconnection Notifications**: Clients are notified when other users join or leave.
*   **Graceful Shutdown**: The server attempts to close client connections gracefully on SIGINT/SIGTERM.
*   **CLI Interface**: Uses `yargs` for easy command-line interaction.

## Requirements

*   [Node.js](https://nodejs.org/) (v14.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1.  Clone the repository or download the files to your local machine.
2.  Navigate to the project directory:
    ```bash
    cd /home/tushar/tutorial-projects/backend/msg-broadcast-server
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  (Optional) Make the CLI script executable globally or link it. For local execution, `node cli.js` is sufficient. If you want to use `broadcast-server` directly after `npm link` or global install:
    ```bash
    chmod +x cli.js
    # To make it available as `broadcast-server` command (optional)
    # npm link
    ```

## Usage

The application can be run in two modes: `start` (for the server) and `connect` (for the client).

### Starting the Server

To start the broadcast server, run the following command in your terminal:

```bash
node cli.js start
```

This will start the server on the default port (3000).

**Options:**

*   `--port <number>` or `-p <number>`: Specifies the port for the server to listen on.
    ```bash
    node cli.js start --port 3001
    ```

The server will log when it starts, when clients connect/disconnect, and any messages it receives and broadcasts.

### Connecting as a Client

To connect to the server as a client, open a new terminal window and run:

```bash
node cli.js connect
```

This will attempt to connect to a server running on `localhost:3000`.

**Options:**

*   `--host <hostname>`: Specifies the hostname or IP address of the server. (Default: `localhost`)
*   `--port <number>` or `-p <number>`: Specifies the port the server is running on. (Default: `3000`)

Example connecting to a server on a different host or port:

```bash
node cli.js connect --host 192.168.1.100 --port 3001
```

Once connected, you can type messages and press Enter to send them. Received messages will be displayed in the console.
To disconnect the client, press `Ctrl+C` or `Ctrl+D`.

## Project Structure

*   `cli.js`: The main command-line interface entry point. Parses arguments and calls server or client logic.
*   `server.js`: Contains the WebSocket server implementation. Handles client connections, disconnections, and message broadcasting.
*   `client.js`: Contains the WebSocket client implementation. Connects to the server, sends user input, and displays received messages.
*   `package.json`: Defines project metadata, dependencies, and scripts.

## How it Works

1.  **Server (`server.js`)**:
    *   Uses the `ws` library to create a `WebSocketServer`.
    *   Maintains a `Set` of connected clients.
    *   On a new connection:
        *   Adds the client to the set.
        *   Notifies other clients about the new user.
        *   Sends a welcome message to the new client.
    *   On receiving a message from a client:
        *   Broadcasts the message (prepended with the sender's ID) to all connected clients.
    *   On a client disconnection:
        *   Removes the client from the set.
        *   Notifies other clients about the user leaving.
    *   Handles server errors (e.g., port in use) and graceful shutdown signals.

2.  **Client (`client.js`)**:
    *   Uses the `ws` library to create a WebSocket client instance.
    *   Uses `readline` to get user input from the console.
    *   On successful connection:
        *   Sets up the `readline` interface for sending messages.
    *   On receiving a message from the server:
        *   Prints the message to the console, ensuring it doesn't mess with the current input line.
    *   When the user types a message and presses Enter:
        *   Sends the message to the server.
    *   Handles disconnection and connection errors.

3.  **CLI (`cli.js`)**:
    *   Uses `yargs` to define and parse command-line arguments (`start`, `connect`) and their options (`--port`, `--host`).
    *   Calls the appropriate function (`startServer` or `connectClient`) based on the parsed command.
```// filepath: /home/tushar/tutorial-projects/backend/msg-broadcast-server/README.md
# CLI Message Broadcast Server & Client

This project implements a command-line based message broadcast system using WebSockets. It consists of a server that listens for client connections and broadcasts messages received from any client to all other connected clients, and a client that can connect to this server to send and receive messages.

## Features

*   **Server Mode**: Starts a WebSocket server on a specified port.
*   **Client Mode**: Connects to a WebSocket server at a specified address and port.
*   **Message Broadcasting**: Messages sent by one client are broadcast to all other connected clients.
*   **Connection/Disconnection Notifications**: Clients are notified when other users join or leave.
*   **Graceful Shutdown**: The server attempts to close client connections gracefully on SIGINT/SIGTERM.
*   **CLI Interface**: Uses `yargs` for easy command-line interaction.

## Requirements

*   [Node.js](https://nodejs.org/) (v14.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1.  Clone the repository or download the files to your local machine.
2.  Navigate to the project directory:
    ```bash
    cd /home/tushar/tutorial-projects/backend/msg-broadcast-server
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  (Optional) Make the CLI script executable globally or link it. For local execution, `node cli.js` is sufficient. If you want to use `broadcast-server` directly after `npm link` or global install:
    ```bash
    chmod +x cli.js
    # To make it available as `broadcast-server` command (optional)
    # npm link
    ```

## Usage

The application can be run in two modes: `start` (for the server) and `connect` (for the client).

### Starting the Server

To start the broadcast server, run the following command in your terminal:

```bash
node cli.js start
```

This will start the server on the default port (3000).

**Options:**

*   `--port <number>` or `-p <number>`: Specifies the port for the server to listen on.
    ```bash
    node cli.js start --port 3001
    ```

The server will log when it starts, when clients connect/disconnect, and any messages it receives and broadcasts.

### Connecting as a Client

To connect to the server as a client, open a new terminal window and run:

```bash
node cli.js connect
```

This will attempt to connect to a server running on `localhost:3000`.

**Options:**

*   `--host <hostname>`: Specifies the hostname or IP address of the server. (Default: `localhost`)
*   `--port <number>` or `-p <number>`: Specifies the port the server is running on. (Default: `3000`)

Example connecting to a server on a different host or port:

```bash
node cli.js connect --host 192.168.1.100 --port 3001
```

Once connected, you can type messages and press Enter to send them. Received messages will be displayed in the console.
To disconnect the client, press `Ctrl+C` or `Ctrl+D`.

## Project Structure

*   `cli.js`: The main command-line interface entry point. Parses arguments and calls server or client logic.
*   `server.js`: Contains the WebSocket server implementation. Handles client connections, disconnections, and message broadcasting.
*   `client.js`: Contains the WebSocket client implementation. Connects to the server, sends user input, and displays received messages.
*   `package.json`: Defines project metadata, dependencies, and scripts.

## How it Works

1.  **Server (`server.js`)**:
    *   Uses the `ws` library to create a `WebSocketServer`.
    *   Maintains a `Set` of connected clients.
    *   On a new connection:
        *   Adds the client to the set.
        *   Notifies other clients about the new user.
        *   Sends a welcome message to the new client.
    *   On receiving a message from a client:
        *   Broadcasts the message (prepended with the sender's ID) to all connected clients.
    *   On a client disconnection:
        *   Removes the client from the set.
        *   Notifies other clients about the user leaving.
    *   Handles server errors (e.g., port in use) and graceful shutdown signals.

2.  **Client (`client.js`)**:
    *   Uses the `ws` library to create a WebSocket client instance.
    *   Uses `readline` to get user input from the console.
    *   On successful connection:
        *   Sets up the `readline` interface for sending messages.
    *   On receiving a message from the server:
        *   Prints the message to the console, ensuring it doesn't mess with the current input line.
    *   When the user types a message and presses Enter:
        *   Sends the message to the server.
    *   Handles disconnection and connection errors.

3.  **CLI (`cli.js`)**:
    *   Uses `yargs` to define and parse command-line arguments (`start`, `connect`) and their options (`--port`, `--host`).
    *   Calls the appropriate function (`startServer` or `connectClient`) based on the parsed command.