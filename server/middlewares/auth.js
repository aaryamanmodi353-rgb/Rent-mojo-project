const jwt = require('jsonwebtoken');

// ✅ The "Auth" Guard: Checks if the user is logged in
const auth = (req, res, next) => {
  // Get token from header (Checking both 'x-auth-token' and 'Authorization')
  let token = req.header('x-auth-token') || req.header('Authorization');

  // If using "Bearer <token>", extract just the token part
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token - Best practice: Use process.env.JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
    
    // Attach user payload (id, role) to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token Validation Error:", err.message);
    res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

// ✅ The "Admin" Guard: Checks for specific privileges
const admin = (req, res, next) => {
  // Ensure the auth middleware ran first
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user data found' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
  
  next();
};

module.exports = { auth, admin };