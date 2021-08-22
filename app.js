var express = require('express');
var mongo = require("./db/dbConnection");

const classTest = {
    //id do usuario que está salvando a classe
    userId: "612199022a2acd898fe3e256",
    teacher: "Sr Winglerson",
    class: "portugues",
    maxStudents: 20,
    students: [],
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
    name:"usuario 1",
    email: "usuario1@usuario1.com",
    username: "usuario1",
    password: "usuario1",
    phone: "+5521900001111"
}

const user = {
    credentials: {
        public: {
            name: "admin",
            email: "admin@admin.com",
            phone:"+5521988887777"
        },
        private: {
            username:"admin123",
            password:"admin123"
        }   
    },
    teaching: [],
    learning: [],

}


const app = express();
const port = 5050;

//Routes
//Buscando todas as classes
app.get('/api/v0/classes', async (req,res) => {
    const data = await mongo.getCollectionData('classes') 
    res.send(data); 
});
// Buscando todas as classes de um professor pelo seu id na forma: /api/v0/classes/search?keyword=userId
app.get('/api/v0/classes/search', async (req,res) => {
    const data = await mongo.getCollectionData('classes',req.query.keyword,"multiple")
    .catch(err => console.log(err))
    res.send(data); 
});
//Buscando apenas uma classe
app.get('/api/v0/classes/:id', async (req,res) => {
    const data = await mongo.getCollectionData('classes',req.params.id,"single") 
    res.send(data); 
});
app.post('/api/v0/classes', async (req,res) => {
    const data = await mongo.insertClass(classTest)
    res.send(data)
})

app.post('/api/v0/login', async (req,res) => {
    const data = await mongo.loginUser(req.body)
    res.send(data);
})
app.post('/api/v0/signin', async (req,res) => {
    const data = await mongo.signUser(req.body)
    res.send(data);
})

app.post('/api/v0/classes/:id/book', async (req,res) => {
    const data = await mongo.bookClass(req.body.userId,req.params.id);
    res.send(data);
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
// try {
//     mongo.loginUser(loginUser).then(res => console.log(res));
// }
// catch {
//     console.log('deu erro');
//}

//CODIGO PARA TESTAR POST BOOK
// try {
//     mongo.bookClass("6121b4b4e900d91b3141e489","6121b44e5fdcc3ab7a17c62f").then(res => console.log(res));
// }
// catch {
//     console.log('deu erro');
// }




//Server listener
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

module.exports = app;
