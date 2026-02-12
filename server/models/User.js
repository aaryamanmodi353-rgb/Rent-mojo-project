const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },    // Required for your form
  address: { type: String, required: true },  // Required for your form
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// ✅ REWRITTEN ASYNC HOOK: Fixes "next" and "Illegal arguments" errors
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    // Explicitly cast to String to prevent the "number" error
    this.password = await bcrypt.hash(String(this.password), salt);
  } catch (err) {
    throw new Error('Encryption failed: ' + err.message);
  }
});

module.exports = mongoose.model('User', UserSchema);