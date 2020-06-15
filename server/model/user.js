const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = {
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
};


module.exports = mongoose.model('User',User);