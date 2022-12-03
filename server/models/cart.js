const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  client_id: {
    type: String,
    required: 'this fild is required',
  },
  product_id: {
    type: Array,
    required: 'this fild is required',
  },
});

module.exports = mongoose.model('cart', cartSchema);
