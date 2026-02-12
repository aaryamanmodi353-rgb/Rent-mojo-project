const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      tenure: Number,
      rentAtTimeOfBooking: Number
    }
  ],
  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  // ✅ NEW: Pickup Scheduling Fields
  pickupDate: {
    type: Date
  },
  pickupStatus: {
    type: String,
    enum: ['none', 'scheduled', 'completed'],
    default: 'none'
  },
  maintenanceStatus: {
    type: String,
    enum: ['none', 'requested', 'in-progress', 'resolved'],
    default: 'none'
  },
  userDetails: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  totalMonthlyRent: Number,
  totalSecurityDeposit: Number
}, { timestamps: true });

module.exports = mongoose.model('Rental', RentalSchema);