const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'this fild is required',
  },
  pass: {
    type: String,
    required: 'this fild is required',
  },
  role: {
    type: Number,
    required: 'this fild is required',
  },
});

module.exports = mongoose.model('user', userSchema);
