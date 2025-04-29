const mongoose = require('mongoose');

// Define a Message schema
const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);// Create the Message model from the schema

// Export the Message model
export default Message;