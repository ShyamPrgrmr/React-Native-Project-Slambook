const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Que = new Schema({
    userId:{
        type:String,
        required:true
    },
    que:[]
},{timestamps:true})
module.exports = mongoose.model('Que',Que)
