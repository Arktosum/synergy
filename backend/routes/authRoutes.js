const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.get("/test", (req, res) => {
  res.status(401).json({ success: "bad" });
});

module.exports = router;
