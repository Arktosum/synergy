const express = require('express');
const Room = require('../models/Room');
const router = express.Router();
router.post('/fetch', async (req, res) => {
    try {
      const { participants } = req.body;
      // Validate the request body
      if (!participants || !Array.isArray(participants) || participants.length < 2) {
        return res.status(400).json({ error: 'Invalid participants' });
      }
      // Sort the participants to ensure consistent room creation and retrieval
      participants.sort();
  
      // Find an existing room with the same participants
      const existingRoom = await Room.findOne({ participants }).exec();
  
      if (existingRoom) {
        return res.status(200).json({ room: existingRoom });
      }
  
      // Create a new room if it doesn't exist
      const newRoom = await Room.create({ participants });
  
      return res.status(201).json({ room: newRoom });
    } catch (error) {
      console.error('Error creating/reading room:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:roomId', async (req, res) => {
    try {
      const { roomId } = req.params;
  
      // Find the room by its ID and populate the participants
      const room = await Room.findById(roomId)
        .populate('participants', 'username email')
        .exec();
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      return res.status(200).json({room});
    } catch (error) {
      console.error('Error retrieving room participants:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
