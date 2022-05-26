const mongoose = require("mongoose");//mongoose를 부르기 위해서

const connect = () =>
{
    mongoose.connect("mongodb://localhost:27017/spa_mal",{ignoreUndefined:true}).catch((err)=>{//db연결
        console.error(err);
    })
};

module.exports = connect;