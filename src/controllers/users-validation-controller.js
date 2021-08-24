
exports.signIn = (req,res,next) => {
    if(!!req.body.name && !!req.body.email && !!req.body.profileImg && !!req.body.username && !!req.body.password && !!req.body.phone) {
        next();
    } else {
        res.send(error);
    }
};

exports.logIn = (req,res,next) => {
    if(!!req.body.username && !!req.body.password) {
        next();
    } else {
        res.send(error);
    }
};

const error = {
    status: 400,
    text: "Bad Request",
    description: "Object sent does not match with requirements"
}