const mongoose = require('mongoose');
const express = require('express');

const app = express();

// Define the Fertilizer schema
const fertilizerSchema =  mongoose.Schema({
fertilizername:{
    required:true,
    type:String
},
quantity: {
    required:true,
    type: Number
    
}
})
// Create a Fertilizer model from the schema
const Fertilizer = mongoose.model('Fertilizer', fertilizerSchema);



module.exports = Fertilizer
