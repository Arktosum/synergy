const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  chatName : String,
  users : [{type:'ObjectId',ref:'User'}]
},
{ timestamps: true }
);

let GroupItem = mongoose.model("Group", Schema);
module.exports = GroupItem;
