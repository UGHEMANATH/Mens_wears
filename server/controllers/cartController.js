const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, userEmail: req.user.email, cartItems: [] });
        } else if (!cart.userEmail) {
            cart.userEmail = req.user.email;
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { product, name, image, price, qty } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, userEmail: req.user.email, cartItems: [] });
        } else if (!cart.userEmail) {
            cart.userEmail = req.user.email;
        }

        const itemExists = cart.cartItems.find(x => x.product.toString() === product);

        if (itemExists) {
            itemExists.qty += qty;
        } else {
            cart.cartItems.push({ product, name, image, price, qty });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const { product } = req.body; // Product ID
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.cartItems = cart.cartItems.filter(x => x.product.toString() !== product);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart
};
