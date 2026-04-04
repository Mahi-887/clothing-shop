const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// In-memory cart fallback (for guest users). For logged-in users, cart is stored in session.
// Production: store cart in DB or Redis.

// @route   GET /api/cart
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('cart');
    res.json({ success: true, cart: user.cart || [] });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/cart
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId, quantity, size, color } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.cart) user.cart = [];

    const existingItem = user.cart.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, size, color });
    }

    await user.save({ validateBeforeSave: false });
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/cart/:itemId
router.put('/:itemId', protect, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart && user.cart.find((i) => i._id.toString() === req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    item.quantity = quantity;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart/:itemId
router.delete('/:itemId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i._id.toString() !== req.params.itemId);
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart
router.delete('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, cart: [] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
