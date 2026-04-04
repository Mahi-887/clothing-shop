const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route   GET /api/users/profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/change-password
router.put('/change-password', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/addresses
router.get('/addresses', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/users/addresses
router.post('/addresses', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/users/addresses/:id
router.delete('/addresses/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/wishlist
router.get('/wishlist', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'wishlist',
      'name price images rating category'
    );
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/users/wishlist/:productId
router.post('/wishlist/:productId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/users/wishlist/:productId
router.delete('/wishlist/:productId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
});

// Admin: GET /api/users (all users)
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments();
    const users = await User.find().sort('-createdAt').skip(skip).limit(Number(limit));
    res.json({ success: true, users, total });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
