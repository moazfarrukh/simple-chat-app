# Getting Started

To run this application, follow these steps:

## Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your system.

## Installation

First, install the required dependencies:
```bash
bun install
```
```bash
# Start the server
bun run app.js
```
## Architecture Overview

This is a real-time chat application using:

- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML, CSS, and vanilla JavaScript
- **Runtime**: Bun (JavaScript runtime)

The application follows a client-server architecture where:

- Express serves static HTML/CSS/JS files
- Socket.IO facilitates real-time bidirectional communication
- MongoDB stores persistent chat messages
- Clients connect through a browser interface


## Project Limitations

This is a minimal implementation with the following constraints:
- Basic authentication with username only (no passwords)
- No message encryption or security features
- Single chat room with no private messaging capabilities
- Simple UI with minimal features


## Improvements

## Improvements

Future improvements could include:

- **Enhanced Security**: Implement proper authentication with username/password, JWT tokens, and message encryption
- **Advanced Features**: Add support for private messaging, multiple chat rooms, and file sharing
- **Responsive Design**: Improve the UI with a responsive design that works well on mobile devices
- **Scalability**: Implement a more scalable architecture using Redis for session management and message queuing
