const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  createTime: {
    type: Date,
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
    //0 - cancle -> 1 - created -> 2 admin confirm -> 3 -> delivering -> 4 done
    type: String,
    required: 'this fild is required',
  },
  note: {
    type: String,
  },
});
module.exports = mongoose.model('invoice', invoiceSchema);
