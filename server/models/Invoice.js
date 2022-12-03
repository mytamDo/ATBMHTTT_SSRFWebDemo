const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  createTime: {
    type: Date,
    required: 'this fild is required',
  },
  desciption: {
    type: String,
    required: 'this fild is required',
  },
  items: {
    type: Array,
    required: 'this fild is required',
  },
  value: {
    type: Number,
    required: 'this fild is required',
  },
  client: {
    type: String,
    required: 'this fild is required',
  },
  deliveryAddress: {
    type: String,
    required: 'this fild is required',
  },
  phoneNumber: {
    type: String,
    required: 'this fild is required',
  },
  status: {
    type: String,
    required: 'this fild is required',
  },
});
module.exports = mongoose.model('invoice', invoiceSchema);
