const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  let { email, password, username } = req.body;
  const findUser = await User.findOne({ email: req.body.email });
  if (findUser)
    return res.status(400).send("User already registered with this email!");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  await user.save();
  res.send("User registered successfully!");
};

const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.cookie("jwt", token, { httpOnly: true });
  let { password, ...rest } = user._doc;
  res.send(rest);
};
const logoutUser = async (req, res) => {
  res.clearCookie("jwt");
  res.send("Logged out successfully!");
};

module.exports = { loginUser, registerUser, logoutUser };
