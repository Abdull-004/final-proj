const User = require('../models/User');

exports.updateUserProfile = async (req, res) => {
    try {
        const { qualifications } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'Vet' && user.role !== 'Service Provider') {
            return res.status(403).json({ message: 'Only Vets and Service Providers can add qualifications' });
        }

        user.qualifications = qualifications || user.qualifications;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}; 