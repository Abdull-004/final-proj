// src/api/products.ts (example)
import api from './index';

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};