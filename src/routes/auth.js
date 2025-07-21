const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Register (customer or seller)
router.post('/register', register);

// Login (customer, seller, or admin)
router.post('/login', login);

module.exports = router; 