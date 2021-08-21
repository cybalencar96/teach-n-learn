var {MongoClient} = require('mongodb');
const { collection } = require('./models/user');

const DATABASECONNECTION = "mongodb+srv://testdb:testdb@cluster0.4ucbz.mongodb.net/teach-n-learn-db?retryWrites=true&w=majority"
const client = new MongoClient(DATABASECONNECTION);
const db = client.db('teach-n-learn-db');

async function insertClass(classObj) {
    const classTable = db.collection('classes');
    await client.connect();

    //verifica se ja existe este professor dando esta matéria
    const teacherClassExists = await classTable.findOne({"teacher":classObj.teacher, "class":classObj.class});
    
    if (teacherClassExists === undefined) {
        await classTable.insertOne(classObj)
        .then((res) => {
            console.log('inseri sucesso')
            //retorna o id da nova inserção
            return {
                status:200,
                id: res.insertedId.toHexString()
            }
        })
        .catch((err) => {
            console.log(err)
        })
    } 
    else {
        console.log('não inseri');
        return {
            status: 400,
            id: null
        }
    }
}

async function getCollection(colllectionName) {
    const table = db.collection(colllectionName);
    await client.connect();

    return await table.find().sort({teacher:1}).toArray()
}





module.exports = {
    insertClass,
    getCollection,
}