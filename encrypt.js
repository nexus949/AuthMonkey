const argon2 = require('argon2');

async function hashPassword(password){
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}

async function verifyPassword(storedPassword, incomingPassword){
    try{
        const isValid = await argon2.verify(storedPassword, incomingPassword);
        return isValid;
    }
    catch(error){
        console.error("Error verifying password:", error); 
        return false;
    }
}

//every user.id shall be encoded
const encodeId = (id) => {
    try {
        // Convert the id to a string and encode it in Base64
        return Buffer.from(id.toString()).toString('base64');
    } catch (err) {
        console.error('Error encoding ID:', err);
        return null;
    }
};

const decodeId = (encodedId) => {
    try {
        // Decode the Base64 string to get the original id
        return Buffer.from(encodedId, 'base64').toString('utf-8');
    } catch (err) {
        console.error('Error decoding ID:', err);
        return null;
    }
};

module.exports = { hashPassword, verifyPassword, encodeId, decodeId };