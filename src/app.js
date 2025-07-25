// src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://final-proj-frontend-lrzm.vercel.app',
    'https://final-proj-2-ypf3.onrender.com'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow Postman, curl, etc.
        if (allowedOrigins.includes(origin)) return callback(null, true);
        console.warn(`🛑 CORS Blocked: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Static file serving (e.g. uploaded images)
app.use('/uploads', express.static('uploads'));

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// Routes
app.use('/api/products', require('./routes/product'));

app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
    res.send('✅ Garissa Market Hub API is running');
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;

