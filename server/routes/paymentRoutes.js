const express = require('express');
const router = express.Router();
const { createRazorpayOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/razorpay', protect, createRazorpayOrder);

router.get('/config', (req, res) => {
    res.json({ keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId' });
});

module.exports = router;
