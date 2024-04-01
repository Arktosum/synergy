const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");

// Message routes
router.post("/", createMessage);
router.get("/", getMessages);

module.exports = router;
