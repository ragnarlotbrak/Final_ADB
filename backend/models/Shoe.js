const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: String,
    required: true
  },
  color: String,
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  image_url: String,
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

shoeSchema.index({ category_id: 1, stock: 1 });
shoeSchema.index({ price: 1 });

module.exports = mongoose.model('Shoe', shoeSchema);
