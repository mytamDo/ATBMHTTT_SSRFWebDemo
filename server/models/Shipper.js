const mongoose = require('mongoose');
const shipperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'this fild is required'
    },
    birthday: {
        type: Date,
        required: 'this fild is required'
    },
    avatar: {
        type: String,
        required: 'this fild is required'
    },
    status: {
        type: String,
        required: 'this fild is required'
    },
    begin: {
        type: String,
        required: 'this fild is required'
    },
    finish: {
        type: String,
        required: 'this fild is required'
    },
    product: {
        type: String,
        required: 'this fild is required'
    },  
})
module.exports = mongoose.model('shipper', shipperSchema);