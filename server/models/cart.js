const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  client_id: {
    type: String,
    required: 'this fild is required',
  },
  product_id: {
    type: String,
    enum: ['6384c49c6fe7981a128addf5', '6384c4ba6fe7981a128addfc', '6384c6d99dccfce13938968c'],
    required: 'this fild is required'
  }
});

module.exports = mongoose.model('cart', cartSchema);
