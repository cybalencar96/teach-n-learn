const users = require("../models/users")

exports.signIn = async (req,res) => {
    
    const data = await users.signUser(req.body.body);
    res.send(data);
};

exports.logIn = async (req,res) => {
    const data = await users.loginUser(req.body.body);
    res.send(data);
};

exports.updateUserInfo = async (req,res) => {
    const data = await users.updateUserInfo(req.params.id,req.body.body,false)
    res.send(data);
}

exports.updatePassword = async (req,res) => {
    const data = await users.updateUserInfo(req.params.id,req.body.body,true)
    res.send(data);
}

