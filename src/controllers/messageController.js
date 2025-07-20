const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiver, product, content } = req.body;
        const message = new Message({
            sender: req.user.id,
            receiver,
            product,
            content,
        });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { withUser, product } = req.query;
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
        res.status(500).json({ message: 'Server error' });
    }
}; 