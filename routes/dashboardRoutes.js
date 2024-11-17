const express = require('express');
const router = express.Router();
const { authenticate, generateToken } = require('./../auth.js');
const path = require('node:path');

router.get('/dashboard', authenticate, async (req, res) =>{
    try{
        res.status(200).sendFile(path.join(__dirname, './../pages/dashboard.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
})

module.exports = router;