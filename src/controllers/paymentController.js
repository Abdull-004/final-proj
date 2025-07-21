exports.simulatePayment = async (req, res) => {
    try {
        const { productId, buyerId, amount } = req.body;
        if (!productId || !buyerId || !amount) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // Simulate payment logic (no real integration)
        const success = Math.random() > 0.1; // 90% chance of success
        if (success) {
            return res.json({
                status: 'success',
                message: 'Payment simulated successfully',
                transactionId: Math.random().toString(36).substring(2, 12),
                productId,
                buyerId,
                amount,
            });
        } else {
            return res.status(400).json({ status: 'failed', message: 'Payment simulation failed' });
        }
    } catch (err) {
        console.error('Simulate Payment error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
