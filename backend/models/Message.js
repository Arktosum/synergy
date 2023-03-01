const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  content : String,
  from : {type:'ObjectId',ref:'User'},
  to : {type:'ObjectId',ref:'Group'}
},
{ timestamps: true }
);

let Message = mongoose.model("Message", Schema);
module.exports = Message;
