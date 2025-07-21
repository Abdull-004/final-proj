const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();
const User = require('../models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function setAdminPassword() {
    await mongoose.connect(process.env.MONGO_URI);
    rl.question('Enter admin email: ', async (email) => {
        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin) {
            console.log('Admin user not found.');
            process.exit(1);
        }
        rl.question('Enter new password: ', async (newPassword) => {
            const hashed = await bcrypt.hash(newPassword, 10);
            admin.password = hashed;
            await admin.save();
            console.log('Admin password updated successfully!');
            process.exit(0);
        });
    });
}

setAdminPassword(); 