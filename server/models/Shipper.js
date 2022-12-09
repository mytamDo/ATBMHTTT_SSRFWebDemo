const mongoose = require('mongoose');
const shipperSchema = new mongoose.Schema({
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
  status: {
    type: Number,
    required: 'this fild is required',
  },
  email: {
    type: String,
    required: 'this fild is required',
  },
});
module.exports = mongoose.model('shipper', shipperSchema);
