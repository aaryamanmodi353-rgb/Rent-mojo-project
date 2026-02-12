const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// @route   GET /api/cart/:userId
// @desc    Get user cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
router.post('/add', async (req, res) => {
  const { userId, productId, tenure } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if product already exists
      const itemIndex = cart.items.findIndex(p => p.product == productId);

      if (itemIndex > -1) {
        // Product exists, just update tenure or ignore
        return res.status(400).json({ message: 'Item already in cart' });
      } else {
        // Add new item
        cart.items.push({ product: productId, tenure: tenure || 3 });
      }
      cart = await cart.save();
      return res.json(cart);
    } else {
      // Create new cart
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: productId, tenure: tenure || 3 }]
      });
      return res.json(newCart);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/cart/remove/:userId/:productId
// @desc    Remove item from cart
router.delete('/remove/:userId/:productId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product != req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;