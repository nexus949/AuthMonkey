const express = require('express');
const router = express.Router();

const { 
    
    getRegisterPage,
    getLoginPage,
    createNewUser,
    loginUser,
    getResetPasswordPage

} = require('./../controllers/loginAndRegController.js');

router.get('/register', getRegisterPage);
router.get('/login', getLoginPage);
router.post('/register', createNewUser);
router.post('/login', loginUser);
router.get('/password/reset-password', getResetPasswordPage);

module.exports = router;