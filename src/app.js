// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

const app = express();

// Body parser middleware
app.use(express.json());

// CORS middleware - updated to allow your frontend & Render
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://final-proj-frontend-lrzm.vercel.app',
    'https://final-proj-2-ypf3.onrender.com'
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // Allow Postman / health checks

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`🛑 Blocked by CORS: ${origin}`);
                callback(null, false); // Don't crash, just deny
            }
        },
        credentials: true,
    })
);

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// Debugging middleware - log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', require('./routes/admin'));

// Base endpoint
app.get('/', (req, res) => {
    res.send('Garissa Market Hub API');
});

// General error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

module.exports = app;
