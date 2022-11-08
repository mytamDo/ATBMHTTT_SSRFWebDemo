const mongoose = require('mongoose');
const revenueSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: 'this fild is required'
    },
    sum: {
        type: Number,
        required: 'this fild is required'
    },
    component: {
        type: String,
        required: 'this fild is required'
    },
})
module.exports = mongoose.model('revenue', revenueSchema);