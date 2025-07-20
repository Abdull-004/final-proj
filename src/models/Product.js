const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Crops', 'Livestock', 'Services', 'Tools/Inputs'],
        required: true,
    },
    images: [{ type: String }],
    location: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema); 