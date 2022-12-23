const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'this fild is required',
  },
  price: {
    type: Number,
    required: 'this fild is required',
  },
  description: {
    type: String,
    required: 'this fild is required',
  },
  type: {
    type: String,
    required: 'this fild is required',
  },
  image_url: {
    type: String,
    required: 'This fild is requied',
  },
  cloudinary_id: {
    type: String,
    required: 'This fild is requied',
  },
});
productSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('product', productSchema);
