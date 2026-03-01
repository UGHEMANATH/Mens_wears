const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Generate a secure JWT valid for 30 days
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
