// routes/orders.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createOrder,
    getOrders,
    getMyOrders
} = require('../controllers/orderController');

router.post('/', createOrder);            // Public: Place order
router.get('/my', auth, getMyOrders);     // Authenticated: My orders
router.get('/', auth, getOrders);         // Admin: All orders

module.exports = router;
