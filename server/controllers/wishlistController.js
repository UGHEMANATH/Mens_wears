const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, userEmail: req.user.email, products: [] });
        } else if (!wishlist.userEmail) {
            wishlist.userEmail = req.user.email;
            await wishlist.save();
        }
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { product } = req.body; // Product ID
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, userEmail: req.user.email, products: [] });
        } else if (!wishlist.userEmail) {
            wishlist.userEmail = req.user.email;
        }

        const itemExists = wishlist.products.find(id => id.toString() === product);

        if (!itemExists) {
            wishlist.products.push(product);
            await wishlist.save();
        }

        const populatedWishlist = await wishlist.populate('products');
        res.json(populatedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { product } = req.body;
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== product);
            await wishlist.save();
            const populatedWishlist = await wishlist.populate('products');
            res.json(populatedWishlist);
        } else {
            res.status(404).json({ message: 'Wishlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
