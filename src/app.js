const express = require('express');
const bodyParser = require('body-parser');
const { raw } = require('body-parser');
const mongo = require('./models/dbConnection');
var mongoose = require("mongoose");


const app = express();
const port = process.env.PORT || 5050;
const apiVersion = "v0";

//Body parsers
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
app.use(`/api/${apiVersion}`, require(`./routes/api/${apiVersion}/index.js`));

//DB connect
//mongo.connectDB();

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Server listener
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;
 