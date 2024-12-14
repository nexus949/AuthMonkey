const express = require('express');
const router = express.Router();
const { authenticateResetPassReq } = require('./../auth.js');

const { 
    
    getRegisterPage,
    getLoginPage,
    createNewUser,
    loginUser,
    getForgotPasswordPage,
    sendResetPassLink,
    getResetPasswordPage,
    resetPassword

} = require('./../controllers/loginAndRegController.js');

//register page get and post
router.get('/register', getRegisterPage);
router.post('/register', createNewUser);

//login page get and post
router.get('/login', getLoginPage);
router.post('/login', loginUser);

//forgot password page get and post
router.get('/password/forgotPassword', getForgotPasswordPage);
router.post('/password/forgotPassword', sendResetPassLink);

//reset password page get and post
router.get('/password/resetPassword/:id', authenticateResetPassReq, getResetPasswordPage);
router.post('/password/resetPassword', authenticateResetPassReq, resetPassword);

module.exports = router;