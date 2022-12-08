const mongoose = require('mongoose');
const transportSchema = new mongoose.Schema({
  time: {
    type: Date,
  },
  staff_id: {
    type: String,
    required: 'this fild is required',
  },
  invoice_id: {
    type: String,
    required: 'this fild is required',
  },
});
module.exports = mongoose.model('transport', transportSchema);
