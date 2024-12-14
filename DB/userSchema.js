const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required !"],
        trim: true
    },

    lastName: {
        type: String,
        required: [true, "Last Name is required !"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "Email is required !"],
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required !"]
    },
});

const user = mongoose.model('user', userSchema);

module.exports = user;