const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Initialize environment variables mapping to process.env
dotenv.config();

// Securely connect to MongoDB Atlas cluster
connectDB();

const app = express();

app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:3000'
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
// Body parsing middleware to parse JSON encoded bodies
app.use(express.json());

// Main Entry Point routes
app.get('/', (req, res) => {
    res.send('NovaCart Auth API is running...');
});

// Authentication System Routes
app.use('/api/users', userRoutes);

// Core Data Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server dynamically running on port ${PORT}`);
});
