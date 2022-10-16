const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user: {
        type : String,
        required:true,
        
        maxlength:15,
        unique: true
    },
    email:{
        type : String,
        required:true,
        
        maxlength:30,
        unique: true
    },
    password:{
        type : String,
        required:true,
        

    },
    inrooms :{
        type : String,

    },
    admin:{
        type:Boolean,
        default:false
    }
    ,avarta: {
        type : String,
        required:false,
        unique: false
    },
    inGame: {
        type : String,
        required:true,
        minlength:1,
        maxlength:15,
        unique: true
    }
},
{timestamps:true}
);

module.exports = mongoose.model("User",userSchema)