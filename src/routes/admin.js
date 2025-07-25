const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminController');

// Admin login route
router.post('/login', adminLogin);

// You can optionally add admin-only routes here in future
// Example:
// const { getAllUsers, deleteUser } = require('../controllers/adminController');
// router.get('/users', authenticate, authorizeAdmin, getAllUsers);

module.exports = router;
