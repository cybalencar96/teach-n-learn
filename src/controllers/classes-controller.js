const mongo = require('../models/dbConnection');

exports.getClasses = async (req,res) => {
    const data = await mongo.getCollectionData('classes') 
    res.send(data); 
};

exports.getClassByTeacher = async (req,res) => {
    const data = await mongo.getCollectionData('classes',req.query.keyword,"multiple")
    .catch(err => console.log(err));
    res.send(data); 
};

exports.getClassById = async (req,res) => {
    const data = await mongo.getCollectionData('classes',req.params.id,"single") ;
    res.send(data); 
};

exports.insertClass = async (req,res) => {
    const data = await mongo.insertClass(req.body);
    res.send(data);
};

exports.deleteClass = async (req,res) => {
    const data = await mongo.deleteClass(req.params.id);
    res.send(data);
};

exports.updateClass = async (req,res) => {
    //necessário enviar objeto da classe editada com seu id
    const data = await mongo.updateClass(req.body);
    res.send(data);
};

exports.bookClass = async (req,res) => {
    //necessário frontend passar o id do usuário logado
    const data = await mongo.bookClass(req.body.userId,req.params.id,"book");
    res.send(data);
};

exports.unbookClass = async (req,res) => {
    //necessário frontend passar o id do usuário logado
    const data = await mongo.bookClass(req.body.userId,req.params.id,"unbook");
    res.send(data);
};