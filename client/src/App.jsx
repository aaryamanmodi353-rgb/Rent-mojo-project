import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';

// Import components
import Register from './components/Register';
import Home from './components/Home';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import Login from './components/Login';
import MyOrders from './components/MyOrders';
import AddProduct from './components/AddProduct';
import Cart from './components/Cart'; 
import AdminDashboard from './components/AdminDashboard'; 

// Navbar Component
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 flex items-center gap-2 tracking-tight">
          Rent Mojo
        </Link>
        
        <div>
          {user ? (
            <div className="flex items-center gap-6">
              
              {/* User Profile Section */}
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-semibold text-sm hidden sm:block">
                  {user?.name ? user.name.split(' ')[0] : 'User'}
                </span>
              </div>
              
              {/* ✅ FIXED: Only show these if user is ADMIN */}
              {user?.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-600 hover:text-indigo-600 font-bold text-sm hidden md:block">
                    Dashboard
                  </Link>
                  
                  <Link to="/admin/add-product" className="text-indigo-600 hover:text-indigo-800 font-bold text-sm hidden md:block">
                    + Add Item
                  </Link>
                </>
              )}

              {/* Cart Icon */}
              <Link to="/cart" className="relative group text-gray-500 hover:text-indigo-600 transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>

              {/* My Orders Link */}
              <Link to="/my-orders" className="text-gray-500 hover:text-indigo-600 font-medium text-sm hidden sm:block">
                My Orders
              </Link>
              
              <button 
                onClick={logout} 
                className="text-gray-400 hover:text-red-600 transition"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-bold py-2">
                Log In
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}