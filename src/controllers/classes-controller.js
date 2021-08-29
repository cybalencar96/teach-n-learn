const mongo = require('../models/dbConnection');

exports.getClasses = async (req,res) => {
    const data = await mongo.getCollectionData('classes') 
    res.send(data); 
};

exports.getClassByQuery = async (req,res) => {
    let data;
    if (!!req.query.teacher){
        data = await mongo.getCollectionData('classes',req.query.teacher,"multiple")
        .catch(err => console.log(err));
    }
    else if (!!req.query.name) {
        data = await mongo.getClassByName(req.query.name)
        .catch(err => console.log(err));
    }
    
    res.send(data); 
};

exports.getClassById = async (req,res) => {
    const data = await mongo.getCollectionData('classes',req.params.id,"single") ;
    res.send(data); 
};

exports.insertClass = async (req,res) => {
    const data = await mongo.insertClass(req.body.body);
    res.send(data);
};

exports.deleteClass = async (req,res) => {
    const data = await mongo.deleteClass(req.params.id);
    res.send(data);
};

exports.updateClass = async (req,res) => {
    //necessário enviar objeto da classe editada com seu id
    const data = await mongo.updateClass(req.body.body);
    res.send(data);
};

exports.bookClass = async (req,res) => {
    //necessário frontend passar o id do usuário logado
    const data = await mongo.bookClass(req.body.body.userId,req.params.id,"book");
    res.send(data);
};

exports.unbookClass = async (req,res) => {
    //necessário frontend passar o id do usuário logado
    const data = await mongo.bookClass(req.body.body.userId,req.params.id,"unbook");
    res.send(data);
};