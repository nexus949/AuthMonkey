let path = require('node:path');
const { hashPassword, verifyPassword, encodeId, decodeId } = require('./../encrypt.js');
const { generateToken } = require('./../auth.js');
const userModel = require('./../DB/userSchema.js');
const nodemailer = require('nodemailer');
const { authenticateResetPassReq } = require('./../auth.js');

async function getRegisterPage(req, res) {
    try {
        res.status(200).sendFile(path.join(__dirname, './../pages/register.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

async function getLoginPage(req, res) {
    try {
        res.status(200).sendFile(path.join(__dirname, './../pages/login.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

async function createNewUser(req, res) {
    try {
        const recievedRegisterData = req.body;
        if (!recievedRegisterData || Object.keys(recievedRegisterData).length === 0) res.status(401).send({ message: "Invalid Data !" });

        // validation if the user is already present
        if (await userModel.findOne({ email: recievedRegisterData.email })) return res.status(409).json({ message: "User Already Exists !" });

        //email regex (checks if the email format is a valid one)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let email = recievedRegisterData.email;
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid Email !" });

        const newUser = new userModel(recievedRegisterData);
        newUser.password = await hashPassword(newUser.password);
        await newUser.save();

        let payload = {
            id: encodeId(newUser.id),
            jti: Math.random().toString(36)
        }

        let token = generateToken(payload, 5000);
        console.log(token);

        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'lax'
        }).status(200).end();
        //redirect is handeled at the frontend
    }
    catch (error) {
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

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(404).json({ message: "User Not Found !" });

        let isValidPassword = await verifyPassword(user.password, password);
        if (!isValidPassword) return res.status(401).json({ message: "Incorrect Password !" });

        let payload = {
            id: encodeId(user.id),
            jti: Math.random().toString(36)
        }

        let token = generateToken(payload, 5000);
        console.log(token);

        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'lax'
        }).status(200).end();
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors: validationErrors });
        }

        console.log(error);
        res.status(500).json({ message: "Some error occured" });
    }
}

async function getForgotPasswordPage(req, res) {
    try {
        res.status(200).sendFile(path.join(__dirname, './../pages/forgotPassword.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some error occured" });
    }
}

async function sendResetPassLink(req, res) {
    try {
        const { email } = req.body;

        //checks if email is valid (email regex)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid Email !" });

        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(404).json({ message: "No User Found !" });

        const encodedId = encodeId(user.id);
        const payload = { id: encodedId };
        let token = generateToken(payload, 600); //token valid for 10 minutes

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth:{
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASS,
            }
        });
        const resetLink = `https://authmonkey.onrender.com/user/password/resetPassword/${encodedId}`;
        const reciever = {
            from: process.env.MAIL_ID,
            to: user.email,
            subject: 'Auth Monkey - Password reset request',
            html: `<b>This is an automated email, please do not reply to this email.</b><br>
            You are recieveing this because you have reqeuested a password reset request from Auth Monkey.<br><br>
            <b>Below Given is the password reset link</b>, click this link to go to the password reset page.<br><br>
            <b>This link is only valid for 10 minutes !</b><br><br>
            <a href="${resetLink}">Click Here to reset your Password</a><br><br>
            If you did not request this, please ignore this email.`
        }

        user.resetTokens = token; //set the resetToken
        await user.save();

        await transporter.sendMail(reciever);
        res.status(200).json({ message: "A password reset link has been sent to your email !"})
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some error occured" });
    }
}

async function getResetPasswordPage(req, res){
    try {

        //this id is sent through params
        const paramId = req.params.id;
        if(!paramId) return res.status(401).redirect('/user/login');

        const actualId = decodeId(paramId);
        const user = await userModel.findById(actualId);

        if(!user) return res.status(401).redirect('/user/login');

        if(!user.resetTokens || !authenticateResetPassReq(user.resetTokens)){ 
            return res.status(401).redirect('/user/login'); //check if the reset token is valid or not
        }

        res.status(200).sendFile(path.join(__dirname, './../pages/resetPassword.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some error occured" });
    }
}

async function resetPassword(req, res){
    try {
        const { password, encodedId } = req.body;
        let id = decodeId(encodedId);

        let user = await userModel.findById(id);
        if(!user) return res.status(404).json({ message: "User Not Found !" });

        let isJWTValid = authenticateResetPassReq(user.resetTokens);
        if(!isJWTValid) return res.status(401).redirect('/user/login');

        let matchesOldPassword = await verifyPassword(user.password, password);
        if(matchesOldPassword) return res.status(400).json( { message: "New Password cannot be the same as Old Password !" });

        let newHashedPassword = await hashPassword(password);
        await userModel.findByIdAndUpdate(id, { password: newHashedPassword });

        user.resetTokens = null; //when the password is reset successfully invalidate and clear the JWT immidiately
        await user.save();

        res.status(200).json({ message: "Password Updated Successfully ! Please Login to Access your Account. " });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Some error occured" });
    }
}

module.exports = {
    getRegisterPage,
    getLoginPage,
    createNewUser,
    loginUser,
    getForgotPasswordPage,
    sendResetPassLink,
    getResetPasswordPage,
    resetPassword
}