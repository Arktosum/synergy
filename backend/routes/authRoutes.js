const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.get("/logout", verifyToken, authController.logoutUser);

module.exports = router;
