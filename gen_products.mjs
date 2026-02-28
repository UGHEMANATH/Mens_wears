import fs from 'fs';

const generateProducts = () => {
    const products = [];
    const categories = [
        { name: "shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c", title: "Premium Men's Shirt" },
        { name: "tshirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", title: "Classic Cotton T-Shirt" },
        { name: "jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246", title: "Modern Fit Jeans" },
        { name: "jackets", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb", title: "Stylish Men's Jacket" }
    ];

    const badges = ["New", "Best Seller", "Sale", ""];

    let idCounter = 1;

    for (const cat of categories) {
        for (let i = 1; i <= 20; i++) {
            const price = Math.floor(Math.random() * 2000) + 500;
            const hasBadge = Math.random() > 0.5 ? badges[Math.floor(Math.random() * 3)] : "";
            products.push({
                id: idCounter.toString(),
                name: `${cat.title} Edition ${i}`,
                price: price,
                image: cat.image,
                category: cat.name,
                brand: "NovaCart Exclusive",
                description: `High quality ${cat.name} designed for everyday comfort and modern style. Edition ${i} brings a unique touch to your wardrobe.`,
                rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
                sizes: ["S", "M", "L", "XL"],
                badge: hasBadge
            });
            idCounter++;
        }
    }

    const fileContent = `export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    brand: string;
    description: string;
    rating: number;
    sizes: string[];
    badge?: string;
}

export const products: Product[] = ${JSON.stringify(products, null, 4)};
`;

    fs.writeFileSync('./src/data/products.ts', fileContent);
    console.log('Products generated successfully!');
};

generateProducts();
