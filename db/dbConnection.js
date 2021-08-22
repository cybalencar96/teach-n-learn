var {MongoClient, ObjectId} = require('mongodb');

const DATABASECONNECTION = "mongodb+srv://testdb:testdb@cluster0.4ucbz.mongodb.net/teach-n-learn-db?retryWrites=true&w=majority"
const client = new MongoClient(DATABASECONNECTION);
const db = client.db('teach-n-learn-db');

async function insertClass(classObj) {
    const classTable = db.collection('classes');
    let insertionInfo;
    await client.connect();

    //verifica se ja existe este professor dando esta matéria
    let objId = new ObjectId(classObj.userId)
    const teacherClassExists = await classTable.findOne({"userId":objId,"teacher":classObj.teacher, "class":classObj.class});
    
    if (!teacherClassExists) {
        
        await classTable.insertOne(classObj)
        .then((res) => {
            console.log('inseri classe com sucesso')
            //retorna o id da nova inserção
            console.log(res.insertedId.toHexString())
            insertionInfo = {
                status: 200,
                insertedId: res.insertedId.toHexString()
            }
        })
        .catch((err) => {
            console.log(err)
        })
    } 
    else {
        console.log('não inseri classe');
        insertionInfo = {
            status: 400,
            id: null
        }
    }

    return insertionInfo;
}

async function getCollectionData(colllectionName,id,mode) {
    const table = db.collection(colllectionName);
    await client.connect();
    //get all classes
    if (!id) { return await table.find().sort({teacher:1}).toArray() }
    //get one class
    if (!!id && mode === "single") { 
        let objId = new ObjectId(id);
        return await table.findOne({"_id": objId})
    }
    //get all classes from given teacher
    if (!!id && mode === "multiple") { 
        return await table.find({"userId":id}).sort({teacher:1}).toArray() 
    }

}

async function loginUser(userInfo) {
    const table = db.collection('users');
    let loginInfo;
    await client.connect();
    
    const userExists = await table.findOne({"username":userInfo.username});

    if (!!userExists) {
        const passwordMatches = await table.findOne({"username":userInfo.username, "password":userInfo.password})
        if (!!passwordMatches) {
            loginInfo = {
                status:200,
                description: `${userInfo.username} is logged in!`
            }
        }
        else {
            loginInfo = {
                status:400,
                description: "incorrect password"
            }
        }
    }
    else {
        loginInfo = {
            status: 400,
            description: "username doesn't exists"
        }
    }

    return loginInfo;
}

async function signUser(userInfo) {
    const table = db.collection('users');
    let signInfo;
    await client.connect();

    const userExists = await table.findOne({"username":userInfo.username});

    if (!userExists) {
        await table.insertOne(userInfo)
        .then((res) => {
            console.log('inseri usuario com sucesso')
            //retorna o id da nova inserção
            signInfo = {
                status: 200,
                userId: res.insertedId.toHexString()
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
    else {
        console.log('não inseri usuario');
        signInfo = {
            status: 400
        }
    }

    return signInfo;
}

module.exports = {
    insertClass,
    getCollectionData,
    signUser,
    loginUser
}