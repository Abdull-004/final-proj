// FIXED routes/product.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only
router.post('/', auth, role(['admin']), createProduct);
router.put('/:id', auth, role(['admin']), updateProduct);
router.delete('/:id', auth, role(['admin']), deleteProduct);

module.exports = router;
