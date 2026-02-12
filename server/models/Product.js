const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Furniture', 'Appliances'] 
  },
  subCategory: { type: String }, // e.g., 'Sofa', 'Fridge'
  description: { type: String },
  image: { type: String, required: true }, // URL to image
  
  // Pricing & Tenure
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  tenureOptions: [{ type: Number }], // e.g., [3, 6, 12] months
  
  // Inventory Management
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);