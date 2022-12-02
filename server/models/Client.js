const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'this fild is required',
  },
  name: {
    type: String,
    required: 'this fild is required',
  },
  address: {
    type: String,
    required: 'this fild is required',
  },
  tel: {
    type: String,
    required: 'this fild is required',
  },
  gender: {
    type: String,
    required: 'this fild is required',
  },
});

module.exports = mongoose.model('client', clientSchema);
