const express = require("express");
const mongoose = require("mongoose");

const Message = require("../models/Message");
const router = express.Router();

router.post("/create", async(req, res) => {
    try{
        const message = new Message(req.body)
        await message.populate('from to');
        await message.save();
        res.send(message);
    }
    catch(e){
        console.log(e.message)
        res.send(false);  
    }
});
router.post("/read", async(req, res) => {
    try{
        const message = await Message.find(req.body).populate('from to');
        res.send(message);
    }
    catch(e){
        console.log(e.message)
        res.send(false);  
    }
});

router.post("/exists", async(req, res) => {
    try{
        const message = await Message.exists(req.body);
        res.send(message);
    }
    catch(e){
        console.log(e.message)
        res.send(false);  
    }
});
router.post("/delete", async(req, res) => {
    try{
        await Message.deleteOne(req.body);
        res.send(true);
    }
    catch(e){
        console.log(e.message)
        res.send(false);  
    }
});
module.exports = router;
