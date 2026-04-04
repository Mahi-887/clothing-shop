const express = require('express');
const router = express.Router();
const {
  processPayment,
  createPaymentIntent,
  webhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/process', protect, processPayment);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', webhook);

module.exports = router;
