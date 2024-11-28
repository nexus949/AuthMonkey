const express = require('express');
const router = express.Router();
const { authenticate, generateToken } = require('./../auth.js');

const {

    getSettingsPage,
    updateInfo,
    logoutUser,
    changeUserPassword,
    deleteAnUser

} = require('./../controllers/settingsController.js');

router.get('/settings', authenticate, getSettingsPage);
router.put('/settings/updateInfo', authenticate, updateInfo);
router.put('/settings/changePassword', authenticate, changeUserPassword);
router.post('/settings/logout', authenticate, logoutUser);
router.delete('/settings/deleteUser', authenticate, deleteAnUser);

module.exports = router;