const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  payOrder,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/admin', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/pay', protect, payOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
