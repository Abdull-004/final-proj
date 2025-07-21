const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    // Add these logs to see what's happening
    console.log("--- Register endpoint hit ---");
    console.log("Request body:", req.body);

    try {
        if (!req.body) {
            console.log("Error: Request body is missing.");
            return res.status(400).json({ message: "Request body is missing." });
        }

        const { name, email, password, role, location } = req.body;

        if (!name || !email || !password || !role || !location) {
            console.log("Error: A required field is missing.");
            return res.status(400).json({ message: "All fields are required." });
        }

        let user = await User.findOne({ email });
        if (user) {
            console.log(`Error: User already exists with email: ${email}`);
            return res.status(400).json({ message: "User already exists." });
        }

        console.log("Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed.");

        console.log("Creating new user...");
        user = new User({ name, email, password: hashedPassword, role, location });
        await user.save();
        console.log("User saved to database.");

        const payload = { id: user._id, role: user.role };

        console.log("Signing JWT...");
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
        console.log("JWT signed.");

        res.status(201).json({
            token,
            user: { id: user._id, name, email, role, location }
        });

    } catch (err) {
        // This is the most important part for debugging
        console.error("--- CATCH BLOCK ERROR in Register ---");
        console.error("Full error object:", err);
        console.error("-------------------------------------");

        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
