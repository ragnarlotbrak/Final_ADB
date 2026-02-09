const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on name for faster queries
categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
