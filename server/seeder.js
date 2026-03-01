const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Order = require('./models/Order');

// Dummy Users
const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
    },
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected!');

        // Clear Database
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        await Wishlist.deleteMany();

        console.log('Collections Cleared...');

        // Seed Users
        const createdUsers = await User.insertMany(users);
        const adminUserId = createdUsers[0]._id;
        const normalUser = createdUsers[1];

        console.log('Users Inserted...');

        // Dummy Products
        const products = [
            {
                name: 'Premium Slim Fit Formal Shirt',
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
                description: 'A premium slim fit cotton formal shirt for men, perfectly suited for office wear.',
                brand: 'NovaCart',
                category: 'shirts',
                price: 1299,
                countInStock: 25,
                rating: 4.8,
                numReviews: 12,
                user: adminUserId,
            },
            {
                name: 'Classic Casual T-Shirt',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
                description: 'Comfortable everyday casual t-shirt with premium cotton fabric.',
                brand: 'NovaCart',
                category: 'tshirts',
                price: 599,
                countInStock: 50,
                rating: 4.2,
                numReviews: 34,
                user: adminUserId,
            },
            {
                name: 'Rugged Denim Jeans',
                image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
                description: 'Durable, stylish and timeless denim jeans for everyday wear.',
                brand: 'NovaCart',
                category: 'jeans',
                price: 1899,
                countInStock: 15,
                rating: 4.5,
                numReviews: 8,
                user: adminUserId,
            },
            {
                name: 'Modern Leather Jacket',
                image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38',
                description: 'Stay warm and stylish with this premium modern leather jacket.',
                brand: 'NovaCart',
                category: 'jackets',
                price: 3499,
                countInStock: 8,
                rating: 4.9,
                numReviews: 21,
                user: adminUserId,
            }
        ];

        // Seed Products
        const createdProducts = await Product.insertMany(products);

        console.log('Products Inserted...');

        // Seed Cart
        const dummyCart = {
            user: normalUser._id,
            cartItems: [
                {
                    product: createdProducts[0]._id,
                    name: createdProducts[0].name,
                    image: createdProducts[0].image,
                    price: createdProducts[0].price,
                    qty: 2,
                },
            ],
        };
        await Cart.create(dummyCart);

        console.log('Cart Inserted...');

        // Seed Wishlist
        const dummyWishlist = {
            user: normalUser._id,
            products: [createdProducts[1]._id, createdProducts[2]._id],
        };
        await Wishlist.create(dummyWishlist);

        console.log('Wishlist Inserted...');

        // Seed Orders
        const dummyOrder = {
            user: normalUser._id,
            orderItems: [
                {
                    product: createdProducts[3]._id,
                    name: createdProducts[3].name,
                    image: createdProducts[3].image,
                    price: createdProducts[3].price,
                    qty: 1,
                },
            ],
            shippingAddress: {
                address: '123 Fake Street',
                city: 'Mumbai',
                postalCode: '400001',
                country: 'India',
            },
            paymentMethod: 'Credit Card',
            itemsPrice: 3499,
            shippingPrice: 100,
            taxPrice: 629,
            totalPrice: 4228,
            isPaid: true,
            paidAt: Date.now(),
            isDelivered: false,
        };
        await Order.create(dummyOrder);

        console.log('Orders Inserted...');
        console.log('✅ DATABASE SUCCESSFULLY SEEDED WITH DUMMY DATA!');

        process.exit(0);
    } catch (error) {
        console.error('Error with Data Import:', error);
        process.exit(1);
    }
};

importData();
