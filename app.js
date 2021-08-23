var express = require('express');
var {ObjectId} = require('mongodb');
var mongo = require("./db/dbConnection");
var bodyParser = require('body-parser');
const { raw } = require('body-parser');

const classTest = {
    "teacherId": "61228c873bd167b478aa5ab5",
    "teacher": "Sr Winglerson",
    "class": "Sexologia II",
    "maxStudents": 20,
    "students": [],
    "price": 60,
    "dateClass": [
        {
            "weekday": "mon",
            "hasClass": true,
            "startHour": "15:00",
            "endHour":"17:00"
        },
        {
            "weekday": "mon",
            "hasClass": false,
            "startHour": "XX:XX",
            "endHour":"XX:XX"
        },
        {
            "hasClass": true,
            "weekday": "mon",
            "startHour": "08:00",
            "endHour":"10:00"
        }
    ]
}

const loginUser = {
    "username": "admin123",
    "password": "admin123"
}

const signUser = {
    "name":"usuario",
    "email": "usuario@usuario.com",
    "username": "usuario123",
    "password": "usuario123",
    "phone": "+5521900001111"
}

const user = {
    "credentials": {
        "public": {
            "name": "admin",
            "email": "admin@admin.com",
            "phone":"+5521988887777"
        },
        "private": {
            "username":"admin123",
            "password":"admin123"
        }   
    },
    "teaching": [],
    "learning": [],

}


const app = express();
const port = 5050;

app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
//Buscando todas as classes
app.get('/api/v0/classes', async (req,res) => {
    const data = await mongo.getCollectionData('classes') 
    res.send(data); 
});
// Buscando todas as classes de um professor pelo seu id na forma: /api/v0/classes/search?keyword=userId
app.get('/api/v0/classes/search', async (req,res) => {
    const data = await mongo.getCollectionData('classes',req.query.keyword,"multiple")
    .catch(err => console.log(err));
    res.send(data); 
});
//Buscando apenas uma classe
app.get('/api/v0/classes/:id', async (req,res) => {
    const data = await mongo.getCollectionData('classes',req.params.id,"single") ;
    res.send(data); 
});
app.post('/api/v0/classes', async (req,res) => {
    const data = await mongo.insertClass(req.body);
    res.send(data);
});
app.delete('/api/v0/classes/:id', async (req,res) => {
    const data = await mongo.deleteClass(req.params.id);
    res.send(data);
});
app.put('/api/v0/classes/:id', async (req,res) => {
    //necessário enviar objeto da classe editada com seu id
    const data = await mongo.updateClass(req.body);
    res.send(data);
});
app.post('/api/v0/classes/:id/book', async (req,res) => {
    //necessário frontend passar o id do usuário logado
    const data = await mongo.bookClass(req.body.userId,req.params.id,"book");
    res.send(data);
});
app.post('/api/v0/classes/:id/unbook', async (req,res) => {
    //necessário frontend passar o id do usuário logado
    const data = await mongo.bookClass(req.body.userId,req.params.id,"unbook");
    res.send(data);
});
app.post('/api/v0/login', async (req,res) => {
    const data = await mongo.loginUser(req.body);
    res.send(data);
});
app.post('/api/v0/signin', async (req,res) => {
    const data = await mongo.signUser(req.body);
    res.send(data);
})

//Server listener
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;
 