const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Simulate M-Pesa payment
router.post('/simulate', async (req, res) => {
    const { orderId, phone } = req.body;
    if (!orderId || !phone) {
        return res.status(400).json({ message: 'Order ID and phone are required.' });
    }
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        // Simulate payment success
        order.paymentStatus = 'paid';
        await order.save();
        res.json({ success: true, message: 'Payment successful. Order marked as paid.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router; 