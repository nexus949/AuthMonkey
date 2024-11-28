const jwt = require('jsonwebtoken');

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

const generateToken = (reqData) => {
    return jwt.sign(reqData, process.env.JWT_SECRET_KEY_, { expiresIn: '5000s' });
}

module.exports = { authenticate, generateToken };