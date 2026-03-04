import axios from 'axios';
import { type Product } from "../data/products"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Simulated Mock Backend API -> Now Real Backend API
export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        // Map _id from Mongo back to id for frontend compatibility
        return data.map((product: any) => ({
            ...product,
            id: product._id,
        }));
    } catch (error) {
        console.error("Error fetching products", error);
        return [];
    }
}

export const fetchProductById = async (id: string | number): Promise<Product | undefined> => {
    try {
        const { data } = await axios.get(`${API_URL}/api/products/${id}`);
        data.id = data._id;
        return data as Product;
    } catch (error) {
        console.error("Error fetching product by ID", error);
        return undefined;
    }
}

// Admin Helpers
export const syncProductsToStorage = async (newProducts: Product[]) => {
    // Left as mock placeholder for simple usage, but realistically admin logic should hit the POST/PUT /api/products endpoint
    console.warn(`syncProductsToStorage is deprecated. Admin API should be used. Products count: ${newProducts.length}`);
}
