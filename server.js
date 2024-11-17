require('dotenv').config();

const express = require('express');
const app = express();
const path = require('node:path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./DB/db.js');

let port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) =>{
    try{
        res.status(200).sendFile(path.join(__dirname, 'pages', 'index.html'));
    }
    catch(error){
        console.log(error);
        res.status(500).json("Some error occured");
    }
})

let loginAndRegisterRoutes = require('./routes/loginAndRegisterRoutes.js');
let dashboardRoutes = require('./routes/dashboardRoutes.js');
let settingsRoutes = require('./routes/settingsRoute.js');

app.use('/', loginAndRegisterRoutes);
app.use('/', dashboardRoutes);
app.use('/', settingsRoutes);

app.listen(port, () =>{
    console.log("listening on port " + port);
})