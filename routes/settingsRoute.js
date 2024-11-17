const express = require('express');
const router = express.Router();
const path = require('node:path');

router.get('/settings', async (req, res)=>{
    try{
        res.status(200).sendFile(path.join(__dirname, './../pages/settings.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
})

module.exports = router;