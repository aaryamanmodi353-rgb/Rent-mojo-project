import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Hook must be INSIDE the component
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTenure, setSelectedTenure] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        if (res.data.tenureOptions.length > 0) {
          setSelectedTenure(res.data.tenureOptions[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Function must be INSIDE the component
  const handleBookNow = () => {
    if (!selectedTenure) return alert("Please select a tenure!");
    
    navigate('/checkout', { 
      state: { 
        product, 
        tenure: selectedTenure 
      } 
    });
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
        &larr; Back to Catalog
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="h-96 bg-white rounded-xl shadow-lg overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div>
          <span className="text-sm font-bold text-indigo-500 uppercase tracking-wider">
            {product.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Tenure</h3>
            
            {/* ✅ Corrected Tenure Buttons */}
            <div className="flex gap-4 mb-6">
              {product.tenureOptions.map((months) => (
                <button
                  key={months}
                  onClick={() => setSelectedTenure(months)}
                  className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${
                    selectedTenure === months
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                  }`}
                >
                  {months} Months
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <div>
                <p className="text-sm text-gray-500">Security Deposit: ₹{product.securityDeposit}</p>
                <div className="flex items-baseline mt-1">
                  <span className="text-3xl font-bold text-indigo-600">₹{product.monthlyRent}</span>
                  <span className="text-gray-500 ml-1">/ month</span>
                </div>
              </div>
              
              {/* ✅ Single Book Now Button with Logic */}
              <button 
                onClick={handleBookNow}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;