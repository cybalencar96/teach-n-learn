const express = require('express');
const bodyParser = require('body-parser');
const { raw } = require('body-parser');

const app = express();
const port = 5050;
const apiVersion = "v0";

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
 