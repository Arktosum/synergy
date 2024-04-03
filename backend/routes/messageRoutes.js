const express = require("express");
const router = express.Router();


// Message routes
router.post("/", createMessage);
router.get("/", getMessages);

module.exports = router;
