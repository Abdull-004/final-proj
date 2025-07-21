const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Farmer', 'Buyer', 'Vet', 'Service Provider', 'Admin'],
        required: true,
    },
    location: { type: String },
    qualifications: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 