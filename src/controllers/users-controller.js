const mongo = require("../models/dbConnection")

exports.signIn = async (req,res) => {
    
    const data = await mongo.signUser(req.body.body);
    res.send(data);
};

exports.logIn = async (req,res) => {
    const data = await mongo.loginUser(req.body.body);
    res.send(data);
};

exports.updateUserInfo = async (req,res) => {
    const data = await mongo.updateUserInfo(req.params.id,req.body.body,false)
    res.send(data);
}

exports.updatePassword = async (req,res) => {
    const data = await mongo.updateUserInfo(req.params.id,req.body.body,true)
    res.send(data);
}

