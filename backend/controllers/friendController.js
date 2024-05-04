const Friend = require("../models/friendSchema");

const createFriend = async (req, res) => {
  try {
    // Implied that unique attributes are set as required.
    const newData = new Friend(req.body);
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const fetchFriendById = async (req, res) => {
  try {
    const user = await Friend.findById(req.params.id);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await Friend.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const deleteFriend = async (req, res) => {
  try {
    const { id } = req.params;
    await Friend.findByIdAndDelete(id);
    res.json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const fetchAllFriends = async (req, res) => {
  try {
    const data = await Friend.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const fetchFriendsRegex = async (req, res) => {
  try {
    const { regex } = req.params;
    const REGEXP = new RegExp(regex, "i"); // 'i' flag for case-insensitive matching
    const users = await Friend.find({ name: REGEXP });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createFriend,
  fetchFriendById,
  updateFriend,
  deleteFriend,
  fetchAllFriends,
  fetchFriendsRegex,
};
