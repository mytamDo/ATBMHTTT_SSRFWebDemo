const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: 'this fild is required'
    }
})
module.exports = mongoose.model('role', roleSchema);