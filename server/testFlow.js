const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const runTest = async () => {
    try {
        const resReg = await axios.post('http://localhost:5000/api/users/register', {
            name: 'testbot', email: `bot${Date.now()}@test.com`, password: 'password123'
        });
        console.log("Registered user -> token:", resReg.data.token.substring(0, 10));

        // Get a product
        const resProd = await axios.get('http://localhost:5000/api/products');
        const product = resProd.data[0];
        console.log("Got product ID:", product._id);

        // Add to cart
        const config = { headers: { Authorization: `Bearer ${resReg.data.token}` } };
        const resCart = await axios.post('http://localhost:5000/api/cart/add', {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty: 1
        }, config);
        console.log("Added to cart:", resCart.data.cartItems.length, "items");

        // Get cart
        const gotCart = await axios.get('http://localhost:5000/api/cart', config);
        console.log("Fetched cart from db:", gotCart.data.cartItems.length, "items");

        // Add to wishlist
        const resWish = await axios.post('http://localhost:5000/api/wishlist/add', {
            product: product._id
        }, config);
        console.log("Added to wishlist:", resWish.data.products.length, "items");

        // Add order
        const orderData = {
            orderItems: [{ product: product._id, name: product.name, qty: 1, image: product.image, price: product.price }],
            shippingAddress: { address: '123 Fake', city: 'City', postalCode: '1000', country: 'US' },
            paymentMethod: 'Test',
            itemsPrice: 100, taxPrice: 10, shippingPrice: 5, totalPrice: 115
        };
        const resOrder = await axios.post('http://localhost:5000/api/orders', orderData, config);
        console.log("Created order ID:", resOrder.data._id);

    } catch (e) {
        console.error("ERROR:", e.response?.data || e.message);
    }
};
runTest();
