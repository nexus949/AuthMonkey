const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost:27017/AuthMonkey';
mongoose.connect(process.env.db_REMOTE_URL || dbURL);
// mongoose.connect(dbURL);

let db = mongoose.connection;

//server event listeners
db.on('connected', () =>{
    console.log("Connected to database");
})

db.on('disconnected', () =>{
    console.log("Disconnected from database");
})

db.on('error', (error) =>{
    console.log("MongoDB connection error" + error);
})

module.exports = db;