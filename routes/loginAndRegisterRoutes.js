const express = require('express');
const router = express.Router();
const path = require('node:path');
const { hashPassword, verifyPassword } = require('./../encrypt.js');
const { authenticate, generateToken } = require('./../auth.js');
const userModel = require('./../DB/userSchema.js');

router.get('/register', async (req, res)=>{
    try{
        res.status(200).sendFile(path.join(__dirname, './../pages/register.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
})

router.get('/login', async (req, res)=>{
    try{
        res.status(200).sendFile(path.join(__dirname, './../pages/login.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
})

router.post('/register', async (req, res)=>{
    try{
        const recievedRegisterData = req.body;
        
        if(!recievedRegisterData || Object.keys(recievedRegisterData).length === 0 ) res.status(401).send("Invalid Data !");

        // validation if the user is already present
        if(await userModel.findOne({ email: recievedRegisterData.email })){
            res.status(409).send("User Already Exists !");
            return;
        } 

        const newUser = new userModel(recievedRegisterData);
        newUser.password = await hashPassword(newUser.password);
        await newUser.save();

        let payload = {
            id: newUser.id,
            jti: Math.random().toString(36)   
        }

        let token = generateToken(payload);
        console.log(token);

        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: true
        }).status(200).end();
        //redirect is handeled at the frontend
    }
    catch(error){
        if (error.name === 'ValidationError') {
            // Handle validation errors
            // gather the error values(messages) from error.errors object and put them in an array
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors: validationErrors });
        }
        
        console.log(error);
        res.status(500).json("Some error occured");
    }
})

router.post('/login', async (req, res)=>{
    try{
        const { email, password } = req.body;
        console.log(email, password);
        
        let existingUser = await userModel.findOne({ email: email });
        if(!existingUser) res.status(404).send("User not found !");

        if(!await verifyPassword(existingUser.password, password)){
            res.status(401).send("password is incorrect !");
        }

        let payload = {
            id: existingUser.id,
            jti: Math.random().toString(36)   
        }

        let token = generateToken(payload);
        console.log(token);

        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: true
        }).status(200).redirect('/dashboard');
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
})

module.exports = router;