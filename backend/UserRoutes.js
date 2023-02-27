const express = require('express');
const router = express.Router()

router.get('/read',(req,res)=>{
    res.send("Works!");
})

module.exports = router