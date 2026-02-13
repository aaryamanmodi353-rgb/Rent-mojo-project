import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  // ✅ HELPER: Always gets the latest token from storage
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token // Matches your backend 'auth' middleware requirement
      }
    };
  };

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to checkout");
      navigate('/login');
    }
  }, [user, navigate]);

  if (!state) return null;

  const isBulk = state.isBulk || false;
  
  let itemsToCheckout = [];
  
  if (isBulk) {
    itemsToCheckout = state.cartItems.map(item => ({
      product: item.product,
      tenure: item.tenure,
      rent: item.product.monthlyRent,
      deposit: item.product.securityDeposit
    }));
  } else {
    itemsToCheckout = [{
      product: state.product,
      tenure: state.tenure,
      rent: state.product.monthlyRent,
      deposit: state.product.securityDeposit
    }];
  }

  const totalMonthlyRent = itemsToCheckout.reduce((acc, item) => acc + item.rent, 0);
  const totalDeposit = itemsToCheckout.reduce((acc, item) => acc + item.deposit, 0);
  const totalDueNow = totalMonthlyRent + totalDeposit;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    deliveryDate: '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCardChange = (e) => setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.address || !formData.deliveryDate) {
        toast.error("Please fill in all delivery details");
        return;
    }
    setShowPaymentModal(true);
  };

  const handleFinalPayment = async () => {
    if (!cardDetails.number || !cardDetails.cvv) {
      toast.error("Please enter card details");
      return;
    }

    setShowPaymentModal(false); 
    const loadingToast = toast.loading('Processing Payment...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating gateway response

      const orderPayload = {
        userId: user.id || user._id,
        userDetails: formData,
        deliveryDate: formData.deliveryDate,
        totalMonthlyRent,
        totalSecurityDeposit: totalDeposit,
        products: itemsToCheckout.map(item => ({
            product: item.product._id,
            tenure: item.tenure,
            rentAtTimeOfBooking: item.rent
        }))
      };

      // ✅ FIX: Changed http://localhost:5000/api/rentals to relative path /api/rentals
      await axios.post(
        '/api/rentals', 
        orderPayload, 
        getAuthConfig()
      );
      
      toast.success('Payment Successful! Order Placed.', { id: loadingToast, duration: 5000, icon: '🎉' });
      navigate('/my-orders');
    } catch (err) {
      console.error("Checkout Error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Payment Failed. Please try again.';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary ({itemsToCheckout.length} items)</h3>
            
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2 mb-6 custom-scrollbar">
              {itemsToCheckout.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded inline-block mt-1">
                      {item.tenure} Months Plan
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{item.rent}</p>
                    <p className="text-xs text-gray-400">Rent</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Total Monthly Rent</span>
                <span>₹{totalMonthlyRent}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Security Deposit</span>
                <span>₹{totalDeposit}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-200 mt-2 text-gray-900">
                <span>Total Due Now</span>
                <span>₹{totalDueNow}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleProceedToPayment} className="space-y-5 h-fit">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm p-3 border bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm p-3 border bg-gray-50" placeholder="+91 " />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Delivery Date</label>
                  <input 
                    required 
                    type="date" 
                    name="deliveryDate" 
                    value={formData.deliveryDate || ''} 
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]} 
                    className="w-full rounded-lg border-gray-300 shadow-sm p-3 border bg-gray-50" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Address</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} className="w-full rounded-lg border-gray-300 shadow-sm p-3 border bg-gray-50" rows="3"></textarea>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Pay ₹{totalDueNow}
            </button>
        </form>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4">Confirm Payment</h3>
              <div className="space-y-3 mb-6">
                  <input name="number" placeholder="Card Number" className="w-full border p-3 rounded-lg" onChange={handleCardChange} />
                  <div className="grid grid-cols-2 gap-3">
                      <input name="expiry" placeholder="MM/YY" className="w-full border p-3 rounded-lg" onChange={handleCardChange} />
                      <input name="cvv" placeholder="CVV" className="w-full border p-3 rounded-lg" onChange={handleCardChange} />
                  </div>
              </div>
              <button onClick={handleFinalPayment} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
                  Pay ₹{totalDueNow}
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;