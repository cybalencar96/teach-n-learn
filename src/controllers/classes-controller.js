const classes = require('../models/classes');

exports.getClasses = async (req,res) => {
    const data = await classes.getCollectionData('classes') 
    res.send(data); 
};

exports.getClassByQuery = async (req,res) => {
    let data;
    if (!!req.query.teacher){
        data = await classes.getCollectionData('classes',req.query.teacher,"multiple")
        .catch(err => console.log(err));
    }
    else if (!!req.query.name) {
        data = await classes.getClassByName(req.query.name)
        .catch(err => console.log(err));
    }
    
    res.send(data); 
};

exports.getClassById = async (req,res) => {
    const data = await classes.getCollectionData('classes',req.params.id,"single") ;
    res.send(data); 
};

exports.insertClass = async (req,res) => {
    const data = await classes.insertClass(req.body.body);
    res.send(data);
};

exports.deleteClass = async (req,res) => {
    const data = await classes.deleteClass(req.params.id);
    res.send(data);
};

exports.updateClass = async (req,res) => {
    //necessário enviar objeto da classe editada com seu id
    const data = await classes.updateClass(req.body.body);
    res.send(data);
};

exports.bookClass = async (req,res) => {
    //necessário frontend passar o id do usuário logado
    const data = await classes.bookClass(req.body.body.userId,req.params.id,"book");
    res.send(data);
};

exports.unbookClass = async (req,res) => {
    //necessário frontend passar o id do usuário logado
    const data = await classes.bookClass(req.body.body.userId,req.params.id,"unbook");
    res.send(data);
};