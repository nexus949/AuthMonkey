const jwt = require('jsonwebtoken');

//basic token authntication
const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;

    //initially set the header as null (invalid or no token present)
    req.user = null;

    if (token) {
        try {
            //verify the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY_);

            req.user = decodedToken;
        }
        catch (error) {
            console.log(error);
        }
    }

    next();
}

//token authentication for password reset(forgot password) request
const authenticateResetPassReq = (req, res, next) => {
    const token = req.cookies.resetPassToken;

    req.resetToken = null;

    if(token){
        try{
            //verify the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY_);

            req.resetToken = decodedToken;
        }
        catch(error){
            console.log(error);
        }
    }

    next();
}

const generateToken = (reqData, expiry) => {
    return jwt.sign(reqData, process.env.JWT_SECRET_KEY_, { expiresIn: `${expiry}s` });
}

module.exports = { authenticate, generateToken, authenticateResetPassReq };