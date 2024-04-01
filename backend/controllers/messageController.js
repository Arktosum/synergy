// controllers/messageController.js

const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    const message = await Message.create({ sender, recipient, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
