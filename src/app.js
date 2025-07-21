// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const messageRoutes = require('./routes/message');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');

const app = express();

// Body parser middleware
app.use(express.json());

// CORS middleware - dynamically allow specific origins
app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = ['http://localhost:5173', 'http://localhost:5000'];
            // Allow requests with no origin (like Postman or curl)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
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
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

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
