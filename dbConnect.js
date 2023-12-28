const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/School").then(()=>{
    console.log("database connected successfully");
}).catch((e)=>{
    console.log(e);
})