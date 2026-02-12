const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, admin } = require('../middlewares/auth.js');

// @route   GET /api/products
// @desc    Get all products (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    console.log(`Found ${products.length} products`); // Debug log
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/products
// @desc    Add product (ADMIN ONLY)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const newProduct = new Product({ ...req.body, isAvailable: true });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (ADMIN ONLY)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;