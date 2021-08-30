var {ObjectId} = require('mongodb');
const client = require("./dbConnection");
const db = client.db('teach-n-learn-db');

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
    loginUser,
    signUser,
    updateUserInfo
}