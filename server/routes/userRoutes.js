const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Public route to register new user
router.post('/register', registerUser);

// Public route to authenticate and login returning JWT
router.post('/login', authUser);

// Protected route to view profile, utilizes `protect` middleware
router.get('/profile', protect, getUserProfile);

module.exports = router;
