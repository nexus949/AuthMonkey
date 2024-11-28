const express = require('express');
const router = express.Router();
const { authenticate } = require('./../auth.js');

const {

    getDashboardPage,
    getUserData

} = require('./../controllers/dashboardController');

router.get('/dashboard', authenticate, getDashboardPage);
router.get('/getUserData', authenticate, getUserData);

module.exports = router;