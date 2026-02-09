const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  payment_method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'cash'],
    default: 'credit_card'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transaction_id: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for order lookup
paymentSchema.index({ order_id: 1 });
paymentSchema.index({ customer_id: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
