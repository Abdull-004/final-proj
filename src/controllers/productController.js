const Product = require('../models/Product');
const User = require('../models/User');

// 🟢 Admin: Create a Product
async function createProduct(req, res) {
    try {
        const { name, image, price, description, category, stock } = req.body;

        if (!name || !image || !price || !description || !category) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        const user = await User.findById(req.user.id);
        if (!user?.isAdmin) {
            return res.status(403).json({ message: 'Only admin can add products.' });
        }

        const product = new Product({
            name,
            image,
            price,
            description,
            category,
            stock: stock ?? 0,
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully.', product });
    } catch (err) {
        console.error('Create Product Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// 🌍 Public: Get All Products
async function getProducts(req, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        console.error('Get Products Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// 🌍 Public: Get a Single Product by ID
async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found.' });
        res.status(200).json(product);
    } catch (err) {
        console.error('Get Product by ID Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// 🟠 Admin: Update a Product
async function updateProduct(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user?.isAdmin) {
            return res.status(403).json({ message: 'Only admin can update products.' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found.' });

        Object.assign(product, req.body);
        await product.save();

        res.status(200).json({ message: 'Product updated successfully.', product });
    } catch (err) {
        console.error('Update Product Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// 🔴 Admin: Delete a Product
async function deleteProduct(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user?.isAdmin) {
            return res.status(403).json({ message: 'Only admin can delete products.' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found.' });

        await product.deleteOne();
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Delete Product Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// ✅ Export all functions
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
