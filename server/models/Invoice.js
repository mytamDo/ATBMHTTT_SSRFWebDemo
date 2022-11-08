const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: 'this fild is required'
    },
    desciption: {
        type: String,
        required: 'this fild is required'
    },
    component: {
        type: String,
        required: 'this fild is required'
    },
    value: {
        type: Number,
        required: 'this fild is required'
    },
    status: {
        type: String,
        enum: ['yes', 'no'],
        required: 'this fild is required'
    },
})
module.exports = mongoose.model('invoice', invoiceSchema);