const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { simulatePayment } = require('../controllers/paymentController');

router.post('/simulate', auth, simulatePayment);

module.exports = router; 