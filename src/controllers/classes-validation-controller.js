
exports.insertClass = (req,res,next) => {
    const data = req.body
    if (!data.teacherId || !data.class || !data.maxStudents || !data.price || !data.dateClass) {
        res.send(error);
        return;
    }
    //verifica número de atributos
    if ((!data._id && Object.keys(data).length !== 5) || (!!data._id && Object.keys(data).length !== 7)) {
        console.log("oi")
        console.log( Object.keys(data).length);
        res.send(error);
        return;
    }
    if (data.dateClass.length !== 7) {
        res.send(error);
        return;
    }
    // const result = data.dateClass.forEach((day,index) => {
    //     const days = ["monday","tuesday", "wednesday", "thursday", "friday","saturday","sunday"];
    //     if (day.weekday !== days[index]) {
    //         console.log(day.weekday !== days[index])

    //         return false
    //     }
    //     // if (typeof(day.hasClass) !== "boolean") {
    //     //     return false;
    //     // }
    //     return true
    // });
    
    // if (!result) { 
    //     console.log("ooi")

    //     res.send(error);
    //     return;
    // }

    next();
}


//ALTEREI A ESTRUTURA DESSE OBJETO, REVER DB CONNECTION
const classTest = {
    "teacherId": "61228c873bd167b478aa5ab5",
    "class": "Sexologia II",
    "maxStudents": 20,
    "price": 60,
    "dateClass": [
        {
            "weekday": "mon",
            "hasClass": true,
            "startHour": "15:00",
            "endHour":"17:00"
        },
        {
            "weekday": "mon",
            "hasClass": false,
            "startHour": "XX:XX",
            "endHour":"XX:XX"
        },
        {
            "hasClass": true,
            "weekday": "mon",
            "startHour": "08:00",
            "endHour":"10:00"
        }
    ]
}
const classTest2 = {
    "teacherId": "61228c873bd167b478aa5ab5",
    "class": "Sexologia II",
    "maxStudents": 20,
    "students": [],
    "price": 60,
    "dateClass": [
        {
            "weekday": "monday",
            "hasClass": true,
            "startHour": "15:00",
            "endHour":"17:00"
        },
        {
            "weekday": "tuesday",
            "hasClass": false,
            "startHour": "XX:XX",
            "endHour":"XX:XX"
        },
        {
            "weekday": "wednesday",
            "hasClass": true,
            "startHour": "08:00",
            "endHour":"10:00"
        },
        {
            "weekday": "thursday",
            "hasClass": true,
            "startHour": "08:00",
            "endHour":"10:00"
        },
        {
            "weekday": "friday",
            "hasClass": true,
            "startHour": "08:00",
            "endHour":"10:00"
        },
        {
            "weekday": "saturday",
            "hasClass": true,
            "startHour": "08:00",
            "endHour":"10:00"
        },
        {
            "weekday": "sunday",
            "hasClass": true,
            "startHour": "08:00",
            "endHour":"10:00"
        }
    ]
}

const error = {
    status: 400,
    text: "Bad Request",
    description: "Object sent does not match with requirements"
}