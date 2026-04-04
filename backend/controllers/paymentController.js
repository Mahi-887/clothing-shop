const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @route   POST /api/payment/process
exports.processPayment = async (req, res, next) => {
  try {
    const { amount, currency = 'usd', paymentMethodId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      metadata: { orderId: orderId || '' },
    });

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: Date.now(),
        status: 'processing',
        paymentResult: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          updateTime: new Date().toISOString(),
        },
      });
    }

    res.json({ success: true, paymentIntent });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/payment/create-payment-intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/payment/webhook
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      if (paymentIntent.metadata.orderId) {
        await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
          isPaid: true,
          paidAt: Date.now(),
          status: 'processing',
        });
      }
      break;
    }
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  res.json({ received: true });
};
