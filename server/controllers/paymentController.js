const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mockKeySecret',
});

// @desc    Create Razorpay order
// @route   POST /api/payment/razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json({ id: order.id, currency: order.currency, amount: order.amount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createRazorpayOrder };
