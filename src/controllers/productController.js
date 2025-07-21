const Product = require('../models/Product');
const User = require('../models/User');

// Admin: Create product
exports.createProduct = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Only admin can add products.' });
        }
        const { name, image, price, description, category, stock } = req.body;
        if (!name || !image || !price || !description || !category) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const product = new Product({ name, image, price, description, category, stock });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Public: Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Public: Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Update product
exports.updateProduct = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Only admin can update products.' });
        }
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        Object.assign(product, req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Only admin can delete products.' });
        }
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 