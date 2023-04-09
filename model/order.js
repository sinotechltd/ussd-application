const mongoose = require('mongoose');
const userSchema =  mongoose.Schema({
productname:{
    required:true,
    type:String
},
quantity: {
    required:true,
    type:String
},
phone_number: {
    type: Number,
    required: true
}
})
const Order = mongoose.model('Order', userSchema);

module.exports = Order

