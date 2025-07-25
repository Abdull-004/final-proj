const Order = require('../models/Order');
const User = require('../models/User');

// Place an Order (Public / Customer)
exports.createOrder = async (req, res) => {
    try {
        const { items, customerName, customerEmail, customerPhone, customerAddress } = req.body;

        if (!items?.length) {
            return res.status(400).json({ message: 'Order must include at least one item.' });
        }

        if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
            return res.status(400).json({ message: 'All customer fields are required.' });
        }

        const order = new Order({
            items,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully.', order });
    } catch (err) {
        console.error('Create Order Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: View All Orders
exports.getOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user?.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        console.error('Get Orders Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Authenticated User: View Their Orders
exports.getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found or unauthorized.' });
        }

        const orders = await Order.find({ customerEmail: user.email }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        console.error('Get My Orders Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

