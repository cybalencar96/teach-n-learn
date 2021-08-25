
exports.signIn = (req,res,next) => {
    const data = req.body.body
    if(!!data.name && !!data.email && !!data.profileImg && !!data.username && !!data.password && !!data.phone) {
        next();
    } else {
        res.send(error);
    }
};

exports.logIn = (req,res,next) => {
    const data = req.body.body
    if(!!data.username && !!data.password) {
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