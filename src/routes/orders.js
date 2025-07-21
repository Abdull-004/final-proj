const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createOrder, getOrders, getMyOrders } = require('../controllers/orderController');

// Client: Place order
router.post('/', createOrder);

// Client: Get my orders
router.get('/my', auth, getMyOrders);

// Admin: Get all orders
router.get('/', auth, getOrders);

module.exports = router; 