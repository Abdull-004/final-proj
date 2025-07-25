// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'admin@example.com';
    const password = 'admin123'; // change this
    const hashed = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing) {
        console.log('Admin already exists.');
        process.exit(0);
    }

    const admin = new User({
        name: 'Super Admin',
        email,
        password: hashed,
        role: 'admin',
        isAdmin: true,
    });

    await admin.save();
    console.log('Admin created successfully!');
    process.exit(0);
}

createAdmin();
