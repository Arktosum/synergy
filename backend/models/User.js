const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    avatarUrl: String,
    connections: [String],
  },
  { timestamps: true }
);

let User = mongoose.model("user", Schema);
module.exports = User;
