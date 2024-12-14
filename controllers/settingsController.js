const path = require('node:path');
const { hashPassword, verifyPassword, encodeId, decodeId } = require('./../encrypt.js');
const userModel = require('./../DB/userSchema.js');

async function getSettingsPage(req, res){
    try {
        if (!req.user) return res.status(401).redirect('/user/login');

        res.status(200).sendFile(path.join(__dirname, './../pages/settings.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

async function updateInfo(req, res){
    try {
        let id = decodeId(req.user.id);
        let { firstName, lastName, email, password } = req.body;

        let existingUser = await userModel.findById(id);

        let isValidPassword = await verifyPassword(existingUser.password, password);
        if (!isValidPassword) return res.status(401).json({ message: "Incorrect Password !" });

        existingUser.firstName = await userModel.updateOne({ firstName: firstName });
        existingUser.lastName = await userModel.updateOne({ lastName: lastName });
        existingUser.email = await userModel.updateOne({ email: email });

        res.status(200).json({ message: "Update Successful !" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: "Some error occured" });
    }
}

async function logoutUser(req, res){
    try {
        res.clearCookie('authToken');
        res.status(200).end();
        //redirect handled at the frontend
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Some error occured");
    }
}

async function changeUserPassword(req, res){
    try{
        const id = decodeId(req.user.id);
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        if(!currentPassword || !newPassword || !confirmNewPassword) return res.status(400).json({ message: "Password is required" });
    
        const user = await userModel.findById(id);
        let isValid = await verifyPassword(user.password, currentPassword);
        if(!isValid) return res.status(401).json({ message: "Invalid Password" });

        if(newPassword !== confirmNewPassword) return res.status(400).json({ message: "Both the New passwords Should Match!" });

        let newHashedPassword = await hashPassword(user.password, newPassword);
        await userModel.findByIdAndUpdate(id, { password: newHashedPassword });
        res.status(200).json({ message: "Password Updated Successfully !" });
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured")
    }
}

async function deleteAnUser(req, res){
    try{
        const id = decodeId(req.user.id);
        const { password } = req.body;
        if(!password) return res.status(400).json({ message: "Password is required" });
    
        const user = await userModel.findById(id);
        let isValid = await verifyPassword(user.password, password);
        if(!isValid) return res.status(401).json({ message: "Invalid Password" });
    
        await userModel.findByIdAndDelete(id);
        res.status(200).end();
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");  
    }
}

module.exports = {
    getSettingsPage,
    updateInfo,
    logoutUser,
    changeUserPassword,
    deleteAnUser
}