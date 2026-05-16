const jwt = require('jsonwebtoken');

// ✅ The "Auth" Guard: Checks if the user is logged in
const auth = (req, res, next) => {
  // 1. Get token from header (Checks 'x-auth-token' OR 'Authorization')
  let token = req.header('x-auth-token') || req.header('Authorization');

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Clean the token (Remove "Bearer " if present)
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }

  try {
    // 4. Verify token
    // CRITICAL: Never fallback to a hardcoded string like 'secret_key_123' in production.
    // If process.env.JWT_SECRET is missing, the app should fail rather than be insecure.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user payload to request
    // NOTE: This assumes you signed your token as { id: '...', role: '...' }
    // If you signed it as { user: { id: '...' } }, change this to: req.user = decoded.user;
    req.user = decoded; 
    
    next();
  } catch (err) {
    console.error("Token Validation Error:", err.message);
    res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

// ✅ The "Admin" Guard: Checks for specific privileges
const admin = (req, res, next) => {
  // 1. Ensure the auth middleware ran and attached the user
  if (!req.user) {
    return res.status(500).json({ message: 'Server Error: Admin middleware called without Auth.' });
  }

  // 2. Check Role
  // Ensure your database/token uses 'admin' (lowercase) consistent with this check
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
  
  next();
};

module.exports = { auth, admin };