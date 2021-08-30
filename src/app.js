const express = require('express');
const bodyParser = require('body-parser');
const { raw } = require('body-parser');
const mongo = require('./models/dbConnection');
var mongoose = require("mongoose");
const cors = require("cors")

const app = express();
const port = process.env.PORT || 5050;
const apiVersion = "v0";

app.use(cors());

//Body parsers
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
app.use(`/api/${apiVersion}`, require(`./routes/api/${apiVersion}/index.js`));

//Server listener
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;
 