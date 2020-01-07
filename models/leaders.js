const mongoose = require('mongoose');
const leaderSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique : true
    },
    image: {
        type:String,
        required:true,
    },
    abbr: {
        type:String,
        default:''
    },
    description: {
        type:String,
        required:true
    },
    featured: {
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const Leaders = mongoose.model('Leaders',leaderSchema)
module.exports = Leaders;
