import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Furniture',
    description: '',
    image: '',
    monthlyRent: '',
    securityDeposit: '',
    stock: 5
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token 
      }
    };

    const loadingToast = toast.loading("Adding product to catalog...");

    try {
      const payload = {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        securityDeposit: Number(formData.securityDeposit),
        stock: Number(formData.stock),
        tenureOptions: [3, 6, 12]
      };

      // ✅ FIX: Changed http://localhost:5000/api/products to relative path /api/products
      await axios.post('/api/products', payload, config);
      
      toast.success('Product Added Successfully!', { id: loadingToast });
      navigate('/');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to add product';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
    <div 
      className="min-h-screen relative bg-cover bg-center bg-fixed flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')" 
      }}
    >
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-2xl w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Inventory</h2>
            <p className="text-indigo-100 text-sm mt-1">Expand your catalog with premium items</p>
          </div>
          <Link to="/" className="text-white/80 hover:text-white transition text-sm font-medium bg-white/10 px-4 py-2 rounded-lg">
            Cancel
          </Link>
        </div>

        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input 
                required name="name" onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50 transition-all focus:bg-white" 
                placeholder="e.g. Ergonomic Office Chair"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select 
                    name="category" onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50 appearance-none"
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Initial Stock</label>
                <input 
                  required type="number" name="stock" onChange={handleChange} defaultValue={5}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
              <input 
                required name="image" onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50" 
                placeholder="https://images.unsplash.com/..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Use a URL from <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Unsplash</a> for best results.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                required name="description" onChange={handleChange} rows="3"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-gray-50" 
                placeholder="Describe the features and benefits..."
              />
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-4 uppercase tracking-wider">Pricing Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">Monthly Rent (₹)</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input 
                      required type="number" name="monthlyRent" onChange={handleChange}
                      className="block w-full rounded-md border-indigo-200 pl-7 p-3 focus:border-indigo-500 focus:ring-indigo-500 border" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">Security Deposit (₹)</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input 
                      required type="number" name="securityDeposit" onChange={handleChange}
                      className="block w-full rounded-md border-indigo-200 pl-7 p-3 focus:border-indigo-500 focus:ring-indigo-500 border" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1"
            >
              + Add Product to Catalog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;