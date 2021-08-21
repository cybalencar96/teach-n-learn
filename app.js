var express = require('express');
var mongo = require("./db/dbConnection");

const classTest = {
    teacher: "Sr Winglerson",
    class: "port",
    date: new Date().toLocaleString()
}

let response;
try {
    response = mongo.insertClass(classTest);
} catch {
    console.log('erro');
}


const app = express();
const port = 5050;

//Routes
app.get('/api/v0/classes', async (req,res) => {
    res.send( await mongo.getCollection('classes') ); 
});
app.post('/api/v0/classes', (req,res) => {
    //request estará recebendo um objeto referente a classe.
    req = {
        teacher: "Sr Winglerson",
        class: "português",
        price: 60,
        maxStudents: 20,
        qtyStudents:12,
        dateClass: [
            {
                weekday: "mon",
                hasClass: true,
                startHour: "15:00",
                endHour:"17:00"
            },
            {
                weekday: "tue",
                hasClass: false,
                startHour: "XX:XX",
                endHour:"XX:XX"
            },
            {
                weekday: "wed",
                hasClass: true,
                startHour: "08:00",
                endHour:"10:00"
            },
        ],
        createdAt: new Date().toLocaleString()
    }

    res.send(await mongo.insertClass(req));
})

//Server listener
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;