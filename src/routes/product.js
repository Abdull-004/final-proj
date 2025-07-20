const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    verifyProduct,
    unverifyProduct,
} = require('../controllers/productController');

router.post('/', auth, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);
router.patch('/:id/verify', auth, role(['Admin']), verifyProduct);
router.patch('/:id/unverify', auth, role(['Admin']), unverifyProduct);

module.exports = router; 