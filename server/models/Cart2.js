const mongoose = require('mongoose');

const cartSchema2 = new mongoose.Schema({
  client_id: {
    type: String,
    required: 'this fild is required',
  },
  product_obj: {
    type: Array,
    required: 'this fild is required',
  },
});

module.exports = mongoose.model('cart2', cartSchema2);
