// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Debugging middleware - log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes with verification
const loadRouter = (path) => {
    try {
        const router = require(path);
        if (typeof router !== 'function') {
            throw new Error(`Router at ${path} is not a function`);
        }
        return router;
    } catch (err) {
        console.error(`Failed to load router at ${path}:`, err);
        process.exit(1);
    }
};

app.use('/api/auth', loadRouter('./routes/auth'));
app.use('/api/products', loadRouter('./routes/product'));
app.use('/api/messages', loadRouter('./routes/message'));
app.use('/api/payments', loadRouter('./routes/payment'));

app.get('/', (req, res) => {
    res.send('Garissa Market Hub API');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

module.exports = app;