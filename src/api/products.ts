// src/api/products.ts
import api from './index';

// Fetch all products (for public view or admin dashboard)
export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

// Fetch a single product by ID
export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

// Admin creates a product
export const createProduct = async (productData, token) => {
    const response = await api.post('/products', productData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Admin updates a product
export const updateProduct = async (id, productData, token) => {
    const response = await api.put(`/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Admin deletes a product
export const deleteProduct = async (id, token) => {
    const response = await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
// src/api/products.ts
import api from './index';

// Fetch all products (for public view or admin dashboard)
export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

// Fetch a single product by ID
export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

// Admin creates a product
export const createProduct = async (productData, token) => {
    const response = await api.post('/products', productData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Admin updates a product
export const updateProduct = async (id, productData, token) => {
    const response = await api.put(`/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Admin deletes a product
export const deleteProduct = async (id, token) => {
    const response = await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
