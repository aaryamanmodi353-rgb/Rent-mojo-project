const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      tenure: {
        type: Number,
        default: 3 // Default tenure if not selected
      }
    }
  ]
});

module.exports = mongoose.model('Cart', CartSchema);