import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import Message from './models/message.js'; // Import the Message model

const app = express();


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});


// Socket.io setup

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {


  socket.on('login', (username) => {
    socket.username = username;

    // Fetch all messages from the database and send them to the newly logged in user
    Message.find({})
      .sort({ timestamp: 1 })
      .then(messages => {
        // Send all existing messages to the newly connected user
        socket.emit('message-history', messages);

        // Let everyone know a new user has joined
        io.emit('user-joined', {
          user: username,
          timestamp: Date.now()
        });
      })
      .catch(error => {
        console.error('Error retrieving message history:', error);
        socket.emit('error', 'Failed to load message history');
      });
  });

  socket.on('message', async (message) => {

    // Create a new message document
    const newMessage = new Message({
      sender: socket.username,
      message: message.message || message,
      timestamp: Date.now(),
      read: false
    });

    try {
      // Save the message to the database
      const savedMessage = await newMessage.save();

      // Emit the message with database ID to all clients
      const enhancedMessage = {
        ...savedMessage.toObject(),
        user: socket.username,
        sender: socket.username,
        message: message.message || message,
        timestamp: savedMessage.timestamp,
        read: savedMessage.read
      };
      io.emit('message', enhancedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      // Still emit the message even if saving fails
      io.emit('message', { user: socket.username, message: message.message || message });
    }
  });


  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  }

  );

  socket.on('stopTyping', (username) => {


    socket.broadcast.emit('stopTyping', username);

  });



  socket.on('mark-read', async (messageId) => {
    try {
      // Update the message in the database
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );

      if (updatedMessage) {
        // Broadcast to all clients that the message has been read
        socket.broadcast.emit('mark-read', messageId);
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });


  socket.on('disconnect', () => {
  });

});
app.use(express.static('html'));

app.use(express.static('socket.io'));



const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app', {
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});

export default app;
// Mongoose setu