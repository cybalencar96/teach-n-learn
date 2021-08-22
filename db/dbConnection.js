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
            status: 401,
            text:"Unauthorized",
            description: "Class already exists",
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
    
    const userExists = await table.findOne({"credentials.private.username":userInfo.username});

    if (!!userExists) {
        const user = await table.findOne({"credentials.private.username":userInfo.username, "credentials.private.password":userInfo.password})
        if (!!user) {
            loginInfo = {
                status:200,
                description: `${userInfo.username} is logged in!`,
                userData: {
                    id: user._id.toHexString(),
                    basicInfo: user.credentials.public,
                    teaching: user.teaching,
                    learning: user.learning
                }
            }
        }
        else {
            loginInfo = {
                status:401,
                text:"Unauthorized",
                description: "incorrect password",
                userData: null
            }
        }
    }
    else {
        loginInfo = {
            status: 401,
            text:"Unauthorized",
            description: "username doesn't exists",
            userData: null
        }
    }

    return loginInfo;
}

async function signUser(userInfo) {
    const table = db.collection('users');
    let signInfo;
    await client.connect();

    const userExists = await table.findOne({"credentials.private.username":userInfo.username});

    if (!userExists) {
        const newUser = {
            credentials: {
                public: {
                    name: userInfo.name,
                    email: userInfo.email,
                    phone: userInfo.phone
                },
                private: {
                    username: userInfo.username,
                    password: userInfo.password,
                }
            },
            teaching: [],
            learning: [],        
        }
        await table.insertOne(newUser)
        .then((res) => {
            console.log('inseri usuario com sucesso')
            //retorna o id da nova inserção
            signInfo = {
                status: 200,
                text:"OK",
                description:"User sign in successful",
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
            status: 401,
            text:"Unauthorized",
            description:"Username is already being used",
            userId: null
        }
    }

    return signInfo;
}

async function bookClass(userId,classId) {
    const users = db.collection('users');
    const classes = db.collection('classes');
    await client.connect();

    const userIdObj = new ObjectId(userId);
    const classIdObj = new ObjectId(classId);

    const user = await users.findOne({"_id":userIdObj})
    const classs = await classes.findOne({"_id":classIdObj});
    
    const alreadyBooked = classs.students.find(student => student.email === user.credentials.public.email);
    if (!!alreadyBooked) {
        return {
            status: 401,
            text: "Unauthorized",
            description:"Student is already in this class"
        }
    }
    if (!!user && !!classs){
        user.learning.push(classs);
        classs.students.push(user.credentials.public);
        const updateUserDoc = {
            $set: {
                learning: user.learning
            }
        }
        const updateClassDoc = {
            $set: {
                students: classs.students
            }
        }

        await classes.updateOne({"_id":classIdObj},updateClassDoc).catch(err => console.log(err));
        await users.updateOne({"_id":userIdObj},updateUserDoc).catch(err => console.log(err));

        return {
            status: 200,
            description: "booking successfull"
        }
    }
    else {
        return {
            status: 400,
            description: "booking failed, user or class not valid anymore. Reload page."
        }
    }


}

module.exports = {
    insertClass,
    getCollectionData,
    signUser,
    loginUser,
    bookClass
}