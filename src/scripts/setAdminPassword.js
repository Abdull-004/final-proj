const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();
const User = require('../models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (query) => new Promise(resolve => rl.question(query, resolve));

async function setAdminPassword() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not defined in .env file');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const email = await ask('Enter admin email: ');
        const admin = await User.findOne({ email, isAdmin: true });

        if (!admin) {
            console.log('❌ Admin user not found.');
            process.exit(1);
        }

        const newPassword = await ask('Enter new password: ');
        const hashed = await bcrypt.hash(newPassword, 10);

        admin.password = hashed;
        await admin.save();

        console.log('🎉 Admin password updated successfully!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        rl.close();
        mongoose.connection.close();
    }
}

setAdminPassword();
