const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiver, product, content } = req.body;
        if (!receiver || !product || !content) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const message = new Message({
            sender: req.user.id,
            receiver,
            product,
            content,
        });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        console.error('Send Message error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { withUser, product } = req.query;
        if (!withUser) {
            return res.status(400).json({ message: 'withUser query param is required.' });
        }
        const query = {
            $or: [
                { sender: req.user.id, receiver: withUser },
                { sender: withUser, receiver: req.user.id },
            ],
        };
        if (product) query.product = product;
        const messages = await Message.find(query)
            .sort({ createdAt: 1 })
            .populate('sender', 'name')
            .populate('receiver', 'name');
        res.json(messages);
    } catch (err) {
        console.error('Get Messages error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 