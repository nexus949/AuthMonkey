const { authenticate, generateToken } = require('./../auth.js');
const path = require('node:path');
const userModel = require('./../DB/userSchema.js');

async function getDashboardPage(req, res){
    try{
        if(!req.user) return res.status(401).redirect('/user/login');

        res.status(200).sendFile(path.join(__dirname, './../pages/dashboard.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

async function getUserData(req, res){
    try{
        const id = req.user.id;
    
        const user = await userModel.findById(id).select('-password -_id');
        if(!user) return res.status(404).json("User not found !");
    
        res.status(200).json(user);
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

module.exports = {
    getDashboardPage,
    getUserData
}