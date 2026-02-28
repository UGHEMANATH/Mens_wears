import { products as initialProducts, type Product } from "../data/products"

// Helper to get products from local storage, seeding them if they don't exist
const getLocalProducts = (): Product[] => {
    const stored = localStorage.getItem("admin_products_v2");
    if (stored) {
        return JSON.parse(stored);
    }
    // Seed initial products to localStorage
    localStorage.setItem("admin_products_v2", JSON.stringify(initialProducts));
    return initialProducts;
}

// Simulated Mock Backend API
export const fetchProducts = async (): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.05) {
                reject(new Error("Failed to fetch products from server. Please try again."))
            } else {
                resolve(getLocalProducts())
            }
        }, 1500) // 1.5s simulated network delay
    })
}

export const fetchProductById = async (id: string | number): Promise<Product | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = getLocalProducts();
            resolve(products.find(p => String(p.id) === String(id)))
        }, 800)
    })
}

// Admin Helpers
export const syncProductsToStorage = (newProducts: Product[]) => {
    localStorage.setItem("admin_products_v2", JSON.stringify(newProducts));
}
