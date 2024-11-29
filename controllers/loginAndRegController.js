let path = require('node:path');
const { hashPassword, verifyPassword } = require('./../encrypt.js');
const { generateToken } = require('./../auth.js');
const userModel = require('./../DB/userSchema.js');

async function getRegisterPage(req, res){
    try{
        res.status(200).sendFile(path.join(__dirname, './../pages/register.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

async function getLoginPage(req, res){
    try{
        res.status(200).sendFile(path.join(__dirname, './../pages/login.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

async function createNewUser(req, res){
    try{
        const recievedRegisterData = req.body;
        if(!recievedRegisterData || Object.keys(recievedRegisterData).length === 0 ) res.status(401).send({ message: "Invalid Data !" });

        // validation if the user is already present
        if(await userModel.findOne({ email: recievedRegisterData.email })) return res.status(409).json({ message: "User Already Exists !" });

        //email regex (checks if the email format is a valid one)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let email = recievedRegisterData.email;
        if(!emailRegex.test(email)) return res.status(400).json({ message: "Invalid Email !" });

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
            sameSite: 'lax'
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
}

async function loginUser(req, res){
    try{
        const { email, password } = req.body;
    
        let user = await userModel.findOne({ email: email });
        if(!user) return res.status(404).json({ message: "User Not Found !" });

        let isValidPassword = await verifyPassword(user.password, password);
        if(!isValidPassword) return res.status(401).json({ message: "Incorrect Password !" });

        let payload = {
            id: user.id,
            jti: Math.random().toString(36)   
        }

        let token = generateToken(payload);
        console.log(token);

        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'lax'
        }).status(200).end();
    }
    catch(error){
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors: validationErrors });
        }

        console.log(error);
        res.status(500).json("Some error occured");
    }
}

async function getResetPasswordPage(req, res){
    try{
        res.status(200).sendFile(path.join(__dirname, './../pages/resetPassword.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

module.exports = {
    getRegisterPage,
    getLoginPage,
    createNewUser,
    loginUser,
    getResetPasswordPage
}