const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: String,
            price: Number,
            quantity: { type: Number, default: 1 },
            image: String,
        }
    ],
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    status: { type: String, default: 'pending' },
    paymentStatus: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema); 