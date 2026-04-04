const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect, adminOnly);

// @route   GET /api/admin/analytics
router.get('/analytics', async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      revenueData,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),
      Order.aggregate([
        { $unwind: '$orderItems' },
        { $group: { _id: '$orderItems.product', totalSold: { $sum: '$orderItems.quantity' } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
      ]),
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      analytics: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue,
        recentOrders,
        topProducts,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/users
router.get('/users', async (req, res, next) => {
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

// @route   PUT /api/admin/users/:id/toggle
router.put('/users/:id/toggle', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
