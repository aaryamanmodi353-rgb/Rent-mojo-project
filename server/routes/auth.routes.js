const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // 2. Create the user (PASS PLAIN PASSWORD)
    // The User Model's pre('save') hook handles the hashing
    user = new User({
      name,
      email,
      password, // Plain text here, hashed on .save()
      phone,
      address,
      role: 'user' // Default role
    });

    await user.save(); 

    // 3. Generate Token using environment variable
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret_key_123', 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    // 2. Validate Password (Compare plain text with hashed DB version)
    // Ensure password is cast to String to avoid "Illegal arguments" errors
    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    // 3. Generate Token (Include Role for Admin access)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret_key_123', 
      { expiresIn: '1d' }
    );

    // 4. Send Response
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;