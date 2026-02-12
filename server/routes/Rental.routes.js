const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Cart = require('../models/Cart');
const { auth, admin } = require('../middlewares/auth.js'); // ✅ Import the security guard

// @route   POST /api/rentals
// @desc    Create a rental order (Logged-in users only)
router.post('/', auth, async (req, res) => {
  const { products, userDetails, totalMonthlyRent, totalSecurityDeposit, deliveryDate } = req.body;

  try {
    const newRental = new Rental({
      user: req.user.id, // ✅ Use the ID from the token, not just the request body
      products,
      status: 'active',
      deliveryDate: deliveryDate || new Date(),
      totalMonthlyRent,
      totalSecurityDeposit,
      userDetails
    });

    const savedRental = await newRental.save();

    // Clear Cart for this specific user
    await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } });

    res.json(savedRental);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not create order' });
  }
});

// @route   GET /api/rentals/all
// @desc    ADMIN ONLY: Get ALL rentals for dashboard
router.get('/all', [auth, admin], async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'name email')
      .populate('products.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/rentals/my-orders/:userId
// @desc    Get rentals for a specific user (Protected)
router.get('/my-orders/:userId', auth, async (req, res) => {
  try {
    // ✅ Security check: Ensure users can only see their own history
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to view these orders' });
    }

    const rentals = await Rental.find({ user: req.params.userId })
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/rentals/maintenance/:id
// @desc    Request Maintenance (Protected)
router.put('/maintenance/:id', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Order not found' });

    // Verify ownership
    if (rental.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    rental.maintenanceStatus = 'requested';
    await rental.save();
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/rentals/schedule-pickup/:id
// @desc    Schedule Return Pickup
router.put('/schedule-pickup/:id', auth, async (req, res) => {
  const { pickupDate } = req.body;
  
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Order not found' });

    if (rental.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    rental.pickupDate = pickupDate;
    rental.pickupStatus = 'scheduled';
    
    await rental.save();
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/rentals/cancel/:id
// @desc    Cancel an order before delivery
router.put('/cancel/:id', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Order not found' });

    // Verify ownership or Admin status
    if (rental.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized cancellation request' });
    }

    rental.status = 'cancelled';
    await rental.save();
    res.json({ message: 'Order cancelled successfully', rental });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/rentals/:id
// @desc    Delete order history (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Order not found' });

    if (rental.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized deletion' });
    }

    await Rental.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order removed from history' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; // ✅ Only one export needed!