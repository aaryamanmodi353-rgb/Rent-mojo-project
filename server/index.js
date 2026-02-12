const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/Product.routes');
const rentalRoutes = require('./routes/Rental.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Global Middleware
app.use(express.json());
app.use(cors());

// 2. Database Connection Logic
const connectDB = async () => {
  try {
    // Uses the MONGO_URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// 3. API Routes (Must be defined BEFORE production static serving)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/cart', cartRoutes);

// 4. Production Static Serving
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app's dist/build folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // The "Catch-All" route: any request that doesn't match an API route
  // is sent to the React index.html for client-side routing.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  // Basic Development Route
  app.get('/', (req, res) => {
    res.send('Rent Mojo Backend is Running in Development Mode!');
  });
}

// 5. Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});