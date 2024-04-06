const express = require("express");
const router = express.Router();
const Room = require("../models/roomModel");
const User = require("../models/userModel");

exports.fetchRoom = async (req, res) => {
  try {
    const roomid = req.params.roomid;
    const room = await Room.findById(roomid);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { participants, admins } = req.body;
    const room = new Room({ participants, admins });

    // Update each participant's user document with the room ID
    await Promise.all(
      participants.map(async (participantId) => {
        await User.findByIdAndUpdate(participantId, {
          $addToSet: { rooms: room._id },
        });
      })
    );

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete(req.params.roomid);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

exports.setAdmin = async (req, res) => {
  try {
    const userid = req.params.userid;
    const roomid = req.params.roomid;
    const room = await Room.findByIdAndUpdate(
      roomid,
      { $addToSet: { admins: userid } },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeAdmin = async (req, res) => {
  try {
    const userid = req.params.userid;
    const roomid = req.params.roomid;
    const room = await Room.findByIdAndUpdate(
      roomid,
      { $pull: { admins: userid } },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.kickUser = async (req, res) => {
  try {
    const { roomid, adminid, userid } = req.params;
    // Check if the admin exists and is indeed an admin of the room
    const admin = await User.findById(adminid);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const room = await Room.findById(roomid);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (!room.admins.includes(adminid)) {
      return res
        .status(403)
        .json({ message: "You are not an admin of this room" });
    }

    // Remove the user from the room's participants and admins
    await Room.findByIdAndUpdate(roomid, {
      $pull: { participants: userid, admins: userid },
    });

    // Remove the room from the user's rooms
    await User.findByIdAndUpdate(userid, {
      $pull: { rooms: roomid },
    });

    res.status(200).json({ message: "User kicked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, author } = req.body;
    const message = { content, author, timestamp: new Date() };
    const room = await Room.findByIdAndUpdate(
      req.params.roomid,
      { $push: { messages: message } },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
