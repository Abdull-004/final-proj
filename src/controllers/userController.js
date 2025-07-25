const User = require('../models/User');

// 🔄 Update User Profile - for Vets & Service Providers
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { qualifications } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!['Vet', 'Service Provider'].includes(user.role)) {
            return res.status(403).json({ message: 'Access denied: Only Vets and Service Providers can update qualifications.' });
        }

        // Only update if qualifications are provided
        if (qualifications) {
            user.qualifications = qualifications;
            await user.save();
        }

        res.status(200).json({
            message: 'Profile updated successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                qualifications: user.qualifications,
            }
        });
    } catch (err) {
        console.error('Update User Profile Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
