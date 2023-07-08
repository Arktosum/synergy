const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  friends : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  }],
  requests : [{
    requester : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    type : {
      type: String,
      enum: ['incoming', 'outgoing']
    },
    status : {
      type : String,
      enum : ['pending','accepted','rejected'],
      default : 'pending'
    }
  }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
