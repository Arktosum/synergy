const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (e) {
    console.log(e.message);
    res.send(false);
  }
});
router.post("/read", async (req, res) => {
  try {
    const user = await User.find(req.body)
    res.send(user);
  } catch (e) {
    console.log(e.message);
    res.send(false);
  }
});

router.post("/exists", (req, res) => {
  User.exists(req.body, (err, result) => {
    if (err) {
      res.send(false);
    }
    if(result==null){
        res.send(false);
    }
    else{
        res.send(true);
    }
  });
});
router.post("/delete", async (req, res) => {
  try {
    await User.deleteOne(req.body);
    res.send(true);
  } catch (e) {
    console.log(e.message);
    res.send(false);
  }
});
module.exports = router;
