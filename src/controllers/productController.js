const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { title, price, description, category, images, location } = req.body;
        const product = new Product({
            user: req.user.id,
            title,
            price,
            description,
            category,
            images,
            location,
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category) query.category = category;
        if (search) query.title = { $regex: search, $options: 'i' };
        const products = await Product.find(query).populate('user', 'name role location');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'name role location');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const updates = req.body;
        Object.assign(product, updates);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        product.isVerified = true;
        await product.save();
        res.json({ message: 'Product verified', product });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unverifyProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        product.isVerified = false;
        await product.save();
        res.json({ message: 'Product unverified', product });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}; 