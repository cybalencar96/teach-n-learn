
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

exports.updateUserInfo = (req,res,next) => {
    const id = req.params.id;
    const data = req.body.body;
    if (!id || !isHexa(id)) {
        res.send(error);
        return;
    }

    if (!data.name || !data.email || !data.profileImg || !data.phone) {
        res.send(error);
        return;
    }

    if (Object.keys(data).length !== 4) {
        res.send(error);
        return;
    }

    next();
}

exports.updatePassword = (req,res,next) => {
    const id = req.params.id;
    const data = req.body.body;

    if (!id || !isHexa(id)) {
        res.send(error);
        return;
    }

    if (!data.password) {
        res.send(error);
        return;
    }
    
    if (Object.keys(data).length !== 1) {
        res.send(error);
        return;
    }

    next();
}

function isHexa(str) {
    const hexa = "0123456789abcdef";
    for (let i = 0; i < str.length; i++) {
        if (!hexa.includes(str[i])) {
            return false;
        }
    }
    return true;
}

const error = {
    status: 400,
    text: "Bad Request",
    description: "Object sent does not match with requirements"
}