const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // 1. Check for Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing'
            });
        }

        // 2. Extract and verify token format
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Use: Bearer <token>'
            });
        }

        const token = tokenParts[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user to request
        req.user = {
            id: decoded.id,
            role: decoded.role
            // Add other necessary decoded fields
        };

        // 5. Proceed to next middleware
        next();

    } catch (err) {
        console.error('Authentication Error:', err);

        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                shouldRefresh: true
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = auth;