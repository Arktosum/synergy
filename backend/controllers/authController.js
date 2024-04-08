// controllers/todoController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if username already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: `https://avatar.iran.liara.run/username?username=${username}`,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30m",
    });

    res
      .cookie("jwt", token, {
        maxAge: 30 * 60 * 1000, // in milliseconds
        httpOnly: true, // Prevent XSS ( Cross - site scripting) attacks
        sameSite: "strict", // CSRF Attacks , Cross Site Request Forgery Protection
      })
      .status(200)
      .json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res
      .clearCookie("jwt")
      .status(200)
      .json({ message: "Logged out successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
