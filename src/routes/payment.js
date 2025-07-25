const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

/**
 * Simulate M-Pesa Payment
 * This is a mock endpoint. In production, you'd use Safaricom's Daraja API.
 * Example: STK Push simulation with callback handling.
 */
router.post('/simulate', async (req, res) => {
    const { orderId, phone } = req.body;

    if (!orderId || !phone) {
        return res.status(400).json({ message: 'Order ID and phone number are required.' });
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Simulate payment success
        order.paymentStatus = 'paid';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment simulated successfully. Order marked as paid.',
            orderId: order._id,
        });
    } catch (err) {
        console.error('Payment simulation error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
