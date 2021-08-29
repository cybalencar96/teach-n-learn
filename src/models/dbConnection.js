var {MongoClient, ObjectId} = require('mongodb');
var mongoose = require("mongoose");

const DATABASECONNECTION = process.env.MONGODB_URI || "mongodb+srv://testdb:testdb@cluster0.4ucbz.mongodb.net/teach-n-learn-db?retryWrites=true&w=majority"
const client = new MongoClient(DATABASECONNECTION);
const db = client.db('teach-n-learn-db');

// async function connectDB() {
//     await mongoose.connect(DATABASECONNECTION, {useUnifiedTopology:true, useNewUrlParser:true,useCreateIndex:true})
//     .then(function(x) {
//        console.log( `Connected to Mongo! Database name: "${x.connections[0].name}"`);
//     })
//     .catch (function(err){
//         console.error('Error connecting to mongo', err);
//         mongoose.connection.close();
//     }); 
//     return mongoose;
// };



async function insertClass(classObj) {
    const classes = db.collection('classes');
    const users = db.collection('users');
    let insertionInfo;
    await client.connect();
    //verifica se ja existe este professor dando esta matéria
    classObj.teacherId = new ObjectId(classObj.teacherId);
    const teacherClassExists = await classes.findOne({"class":classObj.class, "teacherId":classObj.teacherId});

    const teacherExists = await users.findOne({"_id":classObj.teacherId});
    if (!teacherExists) {
        return {
            status: 204,
            text: "No Content",
            description: "Teacher from this class not found"
        }
    }

    classObj["students"] = [];
    
    if (!teacherClassExists) {
        classObj["createdAt"] = new Date().toLocaleString();
        await classes.insertOne(classObj)
        .then(async (res) => {
            const updateUserDoc = {
                $push: {
                    teaching: res.insertedId
                }
            }
            await users.updateOne({"_id":classObj.teacherId},updateUserDoc).catch(err => console.log(err));
            
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

    const classExists = await classes.findOne({"_id":classIdObj});
    if (!classExists) {
        return {
            status: 401,
            text: "Unauthorized",
            description: "Class doens't exists or was already deleted"
        }
    }

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
                description: "Class excludex successfully!"
            }
        })

    })


    return result;
}

async function updateClass(classObj) {
    await client.connect();
    const classes = db.collection('classes');
    const users = db.collection('users');

    classObj._id = new ObjectId(classObj._id);
    const teacherObjId = new ObjectId(classObj.teacherId);
    classObj["students"] = [];

    let result;
    const teacherExists = await users.findOne({"_id":teacherObjId});
    if (!teacherExists) {
        return {
            status: 204,
            text: "No Content",
            description: "Teacher from this class not found"
        }
    }

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
                status: 204,
                text: "No Content",
                description: "Class not found"
            }
        }
    });

    return result
}

async function getCollectionData(colllectionName,id,mode) {
    const table = db.collection(colllectionName);
    await client.connect();
    let result;
    //get one class by id
    if (!!id && mode === "single") { 
        const classObjId = new ObjectId(id);
        result =  await table.findOne({"_id": classObjId})
    }
    //get all classes from given teacher
    if (!!id && mode === "multiple") { 
        const teacherObjId = new ObjectId(id);
        result = await table.find({"teacherId":teacherObjId}).sort({class:1}).toArray(); 
    }
    //get all classes
    if (!id) { result = await table.find().sort({class:1}).toArray() }

    if (!result) {
        return {
            status:204,
            text: "No Content",
            description: "Data not found"
        }
    } else {
        return result;
    }
}

async function getClassByName(className) {
    const classes = db.collection('classes');
    await client.connect();

    const matches = await classes.find({class: {$regex: className, $options: "$i"}}).sort({class:1}).toArray();
    if (!!matches) {
        return matches;
    } else {
        return {
            status:204,
            text: "No Content",
            description: "Data not found"
        }
    }
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
                    phone: userInfo.phone,
                    profileImg: userInfo.profileImg
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
        signInfo = {
            status: 401,
            text:"Unauthorized",
            description:"Username is already being used",
            userId: null
        }
    }

    return signInfo;
}

async function updateUserInfo(userId, newInfos,isPassword) {
    const users = db.collection('users');
    await client.connect();

    const userIdObj = ObjectId(userId);
    let updateUserDoc;
    if (!isPassword) {
        updateUserDoc = {
            $set: {
                "credentials.public.name": newInfos.name,
                "credentials.public.email": newInfos.email,
                "credentials.public.phone": newInfos.phone,
                "credentials.public.profileImg": newInfos.profileImg,
            }
        }
    } else {
        updateUserDoc = {
            $set: {
                "credentials.private.password": newInfos.password
            }
        }
    }
    const res = await users.updateOne({"_id":userIdObj},updateUserDoc).catch(err => console.log(err));
    let result;
    if (res.matchedCount >= 1) {
        if(res.modifiedCount >= 1) {
            const user = await users.findOne({"_id":userIdObj});
            result = {
                status: 200,
                text: "OK",
                description: "User info updated successfully",
                userInfo: user.credentials.public
            }
        } else {
            result = {
                status: 401,
                text: "Unauthorized",
                description: "No changes were made"
            }
        }
    } else {
        result = {
            status: 204,
            text: "No Content",
            description: "User not found"
        }
    }
    
    return result;
}


module.exports = {
    //connectDB,
    insertClass,
    getCollectionData,
    signUser,
    loginUser,
    bookClass,
    deleteClass,
    updateClass,
    getClassByName,
    updateUserInfo,
}