const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
fullname:{
    required: true,
    type: String
},
id_number:{
    required: true,
    type: Number
},
location:{
    required: true,
    type: String   
},
phone_number: {
    type: Number,
    required: true
}
})
const User = mongoose.model('User', userSchema);

module.exports = User