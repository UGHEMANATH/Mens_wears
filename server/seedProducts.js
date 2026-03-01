const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Order = require('./models/Order');

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected!');

        // Read the productsMock.json
        const rawData = fs.readFileSync('productsMock.json', 'utf8');
        const mockProducts = JSON.parse(rawData);

        // Get admin user
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        if (!adminUser) {
            console.error("Admin user not found. Run previous seeder first.");
            process.exit(1);
        }

        // Clear old products, cart, wishlist, orders (since old ObjectIds won't match)
        await Product.deleteMany();
        await Cart.deleteMany();
        await Wishlist.deleteMany();
        await Order.deleteMany();

        console.log('Collections Cleared...');

        // Map mock products to Mongoose schema
        const newProducts = mockProducts.map(p => {
            return {
                name: p.name,
                price: p.price,
                image: p.image,
                category: p.category,
                brand: p.brand,
                description: p.description,
                rating: p.rating || 4,
                countInStock: 50, // Default mock stock
                numReviews: Math.floor(Math.random() * 50) + 5,
                user: adminUser._id
            }
        });

        // Seed Data
        await Product.insertMany(newProducts);

        console.log(`✅ successfully seeded ${newProducts.length} real products to MongoDB Atlas!`);

        process.exit(0);
    } catch (error) {
        console.error('Error with Data Import:', error);
        process.exit(1);
    }
};

importData();
