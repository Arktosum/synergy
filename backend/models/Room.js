const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    participants :  [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    messages : [{
        from : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        content : String,
        createdAt: { type: Date, default: Date.now }
    }]
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
