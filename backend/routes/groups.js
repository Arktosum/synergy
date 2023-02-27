const express = require("express");
const mongoose = require("mongoose");

const Group = require("../models/Group");
const router = express.Router();

router.post("/create", async(req, res) => {
    try{
        const group = new Group(req.body)
        await group.save();
        res.send(group);
    }
    catch(e){
        console.log(e.group)
        res.send(false);  
    }
});
router.post("/read", async(req, res) => {
    try{
        const group = await Group.find(req.body).populate('users');
        res.send(group);
    }
    catch(e){
        console.log(e.group)
        res.send(false);  
    }
});

router.post("/exists", async(req, res) => {
    try{
        const group = await Group.exists(req.body);
        res.send(group);
    }
    catch(e){
        console.log(e.group)
        res.send(false);  
    }
});
router.post("/delete", async(req, res) => {
    try{
        await Group.deleteOne(req.body);
        res.send(true);
    }
    catch(e){
        console.log(e.group)
        res.send(false);  
    }
});
module.exports = router;
