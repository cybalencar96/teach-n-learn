var {MongoClient, ObjectId} = require('mongodb');

const DATABASECONNECTION = "mongodb+srv://testdb:testdb@cluster0.4ucbz.mongodb.net/teach-n-learn-db?retryWrites=true&w=majority"
const client = new MongoClient(DATABASECONNECTION);
const db = client.db('teach-n-learn-db');

async function insertClass(classObj) {
    const classes = db.collection('classes');
    const users = db.collection('users');
    let insertionInfo;
    await client.connect();

    //verifica se ja existe este professor dando esta matéria
    const teacherIdObj = new ObjectId(classObj.teacherId);
    const teacherClassExists = await classes.findOne({"teacherId":teacherIdObj,"teacher":classObj.teacher, "class":classObj.class});
    
    if (!teacherClassExists) {
        
        await classes.insertOne(classObj)
        .then(async (res) => {
            const updateUserDoc = {
                $push: {
                    teaching: res.insertedId
                }
            }
            await users.updateOne({"_id":teacherIdObj},updateUserDoc).catch(err => console.log(err));
            
            insertionInfo = {
                status: 200,
                text: "OK",
                description: "Classe inserida com sucesso!",
                //retorna o id da nova inserção
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

async function deleteClass(classId) {
    await client.connect();
    const classes = db.collection('classes');
    const users = db.collection('users');
    const classIdObj = new ObjectId(classId);
    let result;
    await classes.deleteOne({"_id":classIdObj}).then(async res => {
        const updateUserDoc = {
            $pull: {
                learning: classIdObj
            }
        }
        const updateTeacherDoc = {
            $pull: {
                teaching: classIdObj
            }
        }
        await users.updateMany({teaching:classIdObj},updateTeacherDoc)
        result = await users.updateMany({learning:classIdObj},updateUserDoc).then(res => {
            return {
                status: 200,
                text:"OK",
                description: "Classe excluída com sucesso!"
            }
        })

    })
    .catch(err => {
        console.log(err);
        result = {
            status: 401,
            text:"Unauthorized",
            description: "Não foi possível excluir classe. Verifique id."
        }
    })

    return result;
}

async function updateClass(classObj) {
    await client.connect();
    const classes = db.collection('classes');
    let result;
    await classes.updateOne({"_id":classObj._id},{$set: classObj}).then(res => {
        if (res.matchedCount >= 1) {
            if(res.modifiedCount >= 1) {
                result = {
                    status: 200,
                    text: "OK",
                    description: "Class updated successfully"
                }
            } else {
                result = {
                    status: 401,
                    text: "Unauthorized",
                    description: "Class found but not modified"
                }
            }
        } else {
            result = {
                status: 401,
                text: "Unauthorized",
                description: "Class not found"
            }
        }
    });

    return result
}

async function getCollectionData(colllectionName,id,mode) {
    const table = db.collection(colllectionName);
    await client.connect();
    //get all classes
    if (!id) { return await table.find().sort({teacher:1}).toArray() }
    //get one class
    if (!!id && mode === "single") { 
        const classObjId = new ObjectId(id);
        return await table.findOne({"_id": classObjId})
    }
    //get all classes from given teacher
    if (!!id && mode === "multiple") { 
        const teacherObjId = new ObjectId(id)
        return await table.find({"userId":teacherObjId}).sort({teacher:1}).toArray() 
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
                description: `${userInfo.username} successfully verified!`,
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

async function bookClass(userId,classId,operation) {
    const users = db.collection('users');
    const classes = db.collection('classes');
    await client.connect();

    const userIdObj = new ObjectId(userId);
    const classIdObj = new ObjectId(classId);
    
    const user = await users.findOne({"_id":userIdObj});
    const classs = await classes.findOne({"_id":classIdObj});
    let bookedStudent;
    if (!classs || !user){
        return {
            status: 401,
            text: "Unauthorized",
            description:"Class or user invalid"
        }
    }
    bookedStudent = classs.students.find(student => student.toHexString() === userId );

    if (operation === "book") {
        if (classs.students.length < classs.maxStudents){
            if (!!bookedStudent) {
                return {
                    status: 401,
                    text: "Unauthorized",
                    description:"Student is already in this class"
                }
            }
            const updateUserDoc = {
                $push: {
                    learning: classIdObj
                }
            }
            const updateClassDoc = {
                $push: {
                    students: userIdObj
                }
            }

            await classes.updateOne({"_id":classIdObj},updateClassDoc).catch(err => console.log(err));
            await users.updateOne({"_id":userIdObj},updateUserDoc).catch(err => console.log(err));

            return {
                status: 200,
                text: "OK",
                description: "booking successfull"
            }
        }
        else {
            return {
                status: 400,
                text: "Bad request",
                description: "booking failed, class is not available anymore."
            }
        }
    } else if (operation === "unbook") {
        // se o estudante não tiver bookado ainda, retorna erro
        if (!bookedStudent) {
            return {
                status: 401,
                text: "Unauthorized",
                description:"Student is not in this class"
            }
        }
        const updateUserDoc = {
            $pull: {
                learning: classIdObj
            }
        }
        const updateClassDoc = {
            $pull: {
                students: userIdObj
            }
        }

        await classes.updateOne({"_id":classIdObj},updateClassDoc).catch(err => console.log(err));
        const result = await users.updateOne({"_id":userIdObj},updateUserDoc)
        .then(res => {
            return {
                status: 200,
                text: "OK",
                description: "unbooking successfull"
            }                
        })
        .catch(err => {
            console.log(err);
            return {
                status: 401,
                text: "Unauthorized",
                description: "Error on unbooking, try again later"
            }
        });

        return result;
    }
}

module.exports = {
    insertClass,
    getCollectionData,
    signUser,
    loginUser,
    bookClass,
    deleteClass,
    updateClass
}