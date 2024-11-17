const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;

    if (token) {
        try {
            //verify the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY_);

            req.user = decodedToken;
            next();
        }
        catch (error) {
            console.log(error);
            res.status(401).redirect('/');
        }
    }
}

const generateToken = (reqData) => {
    return jwt.sign(reqData, process.env.JWT_SECRET_KEY_, { expiresIn: '5000s' });
}

module.exports = { authenticate, generateToken };