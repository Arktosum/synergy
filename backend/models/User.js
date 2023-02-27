const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    username: {type:String},
    email: {type:String},
    password: {type:String},
    avatarUrl: {type:String}
  },
  { timestamps: true }
);

let User = mongoose.model("User", Schema);
module.exports = User;
