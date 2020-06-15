const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Answer = new Schema({
    userId:{
        type:String,
        required:true
    },
    queId:{
        type:String,
        required:true
    }
    ,
    ans:[]
},{timestamps:true})

module.exports = mongoose.model('Answer',Answer);