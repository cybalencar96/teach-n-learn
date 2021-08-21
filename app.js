var express = require('express');
var mongo = require("./db/dbConnection");

const classTest = {
    teacher: "Sr Winglerson",
    class: "historia",
    maxStudents: 20,
    qtyStudents: 12,
    price: 60,
    dateClass: [
        {
            weekday: "mon",
            hasClass: true,
            startHour: "15:00",
            endHour:"17:00"
        },
        {
            weekday: "mon",
            hasClass: false,
            startHour: "XX:XX",
            endHour:"XX:XX"
        },
        {
            hasClass: true,
            weekday: "mon",
            startHour: "08:00",
            endHour:"10:00"
        },
    ],
    createdAt: new Date().toLocaleString()
}




const app = express();
const port = 5050;

//Routes
app.get('/api/v0/classes', async (req,res) => {
    res.send( await mongo.getCollection('classes') ); 
});
app.post('/api/v0/classes', async (req,res) => {
    //resquest estará recebendo um objeto referente a classe.
    res.send(await mongo.insertClass(classTest))
})

//CODIGO PARA TESTAR O POST CLASS
// try {
//     mongo.insertClass(classTest).then(res => console.log(res));
// } catch {
//     console.log('erro');
// }

//Server listener
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;