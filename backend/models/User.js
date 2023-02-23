const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatarUrl: String,
  connections: String,
});

let FinanceItem = mongoose.model("users", Schema);
module.exports = FinanceItem;
