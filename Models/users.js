const mongoose = require('mongoose') ;
const schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    username: String,
    profile_pic: String,
    type:String
},{
    timestamps:true
}
)
module.exports = mongoose.model('users',schema) ;