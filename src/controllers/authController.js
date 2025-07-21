const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, shopName, shopDescription, location } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (role === 'seller' && !shopName) {
            return res.status(400).json({ message: 'Shop name is required for sellers.' });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            shopName: role === 'seller' ? shopName : undefined,
            shopDescription: role === 'seller' ? shopDescription : undefined,
            location,
            isAdmin: role === 'admin',
        });
        await user.save();
        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name, email, role: user.role, shopName: user.shopName, shopDescription: user.shopDescription, location: user.location } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, shopName: user.shopName, shopDescription: user.shopDescription, location: user.location } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Get Profile error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const updates = req.body;
        delete updates.password;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error('Update Profile error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
