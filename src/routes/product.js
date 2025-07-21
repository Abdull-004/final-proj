const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router; 