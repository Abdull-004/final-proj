const Order = require('../models/Order');
const User = require('../models/User');

// Client: Place order
exports.createOrder = async (req, res) => {
    try {
        const { items, customerName, customerEmail, customerPhone, customerAddress } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must have at least one item.' });
        }
        if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
            return res.status(400).json({ message: 'All customer info is required.' });
        }
        const order = new Order({ items, customerName, customerEmail, customerPhone, customerAddress });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Get all orders
exports.getOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Only admin can view orders.' });
        }
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Client: Get my orders
exports.getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(403).json({ message: 'Not authorized.' });
        }
        const orders = await Order.find({ customerEmail: user.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}; 