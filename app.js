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

const loginUser = {
    username: "admin123",
    password: "admin123"
}

const signUser = {
    name:"Administrador 123",
    email: "admin123@admin.com",
    username: "admin123",
    password: "admin123"
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

app.post('/api/v0/login', async (req,res) => {
    res.send(await mongo.loginUser(req));
})
app.post('/api/v0/signin', async (req,res) => {
    res.send(await mongo.signUser(req));
})
//CODIGO PARA TESTAR O POST CLASS
// try {
//     mongo.insertClass(classTest).then(res => console.log(res));
// } catch {
//     console.log('erro');
// }

//CODIGO PARA TESTAR POST SIGNIN
// try {
//     mongo.signUser(signUser).then(res => console.log(res));
// }
// catch {
//     console.log('deu erro');
// }

//CODIGO PARA TESTAR POST LOGIN
try {
    mongo.loginUser(loginUser).then(res => console.log(res));
}
catch {
    console.log('deu erro');
}

//Server listener
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;
