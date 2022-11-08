const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'this fild is required'
    },
    price: {
        type: Number,
        required: 'this fild is required'
    },
    number: {
        type: Number,
        required: 'this fild is required'
    },
    description: {
        type: String,
        required: 'this fild is required'
    },
    photograph: {
        type: String,
        required: 'this fild is required'
    },
    classiy: {
        type: String,
        enum: ['drinks', 'food'],
        required: 'this fild is required'
    },
})
module.exports = mongoose.model('product', productSchema);