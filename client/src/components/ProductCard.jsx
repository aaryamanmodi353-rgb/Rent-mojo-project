import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductCard = ({ product, refreshProducts }) => {
  const { user } = useContext(AuthContext);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-800">Delete {product.name}?</span>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-sm bg-gray-100 rounded-md">Cancel</button>
          <button onClick={() => confirmDelete(t.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md">Delete</button>
        </div>
      </div>
    ));
  };

  const confirmDelete = async (toastId) => {
    toast.dismiss(toastId);
    const token = localStorage.getItem('token');

    try {
      // ✅ FIX: Changed http://localhost:5000/api/products to relative path /api/products
      await axios.delete(`/api/products/${product._id}`, {
        headers: {
          'x-auth-token': token 
        }
      });
      
      toast.success('Product Deleted');
      if (refreshProducts) refreshProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete';
      toast.error(errorMsg); 
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items");
      return;
    }

    const token = localStorage.getItem('token');
    const loadingToast = toast.loading("Adding to cart...");
    
    try {
      // ✅ FIX: Changed http://localhost:5000/api/cart/add to relative path /api/cart/add
      await axios.post('/api/cart/add', {
        userId: user.id,
        productId: product._id,
        tenure: 3 
      }, {
        headers: {
          'x-auth-token': token 
        }
      });
      toast.success("Added to Cart!", { id: loadingToast });
    } catch (err) {
      if (err.response && err.response.data.message === 'Item already in cart') {
        toast.error("Item is already in your cart", { id: loadingToast });
      } else {
        toast.error("Failed to add", { id: loadingToast });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full flex flex-col relative">
      <div className="h-64 overflow-hidden relative bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>
        
        {user && user.role === 'admin' && (
            <button
              onClick={handleDelete}
              className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              title="Delete Product"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
            In Stock
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Monthly Rent</p>
            <p className="text-xl font-bold text-indigo-600">₹{product.monthlyRent}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-indigo-50 text-indigo-700 p-2.5 rounded-lg hover:bg-indigo-100 transition"
            title="Add to Cart"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-indigo-200 shadow-md">
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;