const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { updateUserProfile } = require('../controllers/userController');

router.put('/profile', auth, role(['Vet', 'Service Provider']), updateUserProfile);

module.exports = router; 