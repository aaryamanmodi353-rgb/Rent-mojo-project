import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [returnOrderId, setReturnOrderId] = useState(null);
  const [pickupDate, setPickupDate] = useState('');

  // ✅ HELPER: Ensures every request has the correct Auth Header
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'x-auth-token': token // Matches your backend 'auth' middleware
      }
    };
  };

  const fetchOrders = async () => {
    // Check for both .id and ._id depending on your AuthContext structure
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      // ✅ FIX: Changed http://localhost:5000/api/rentals to relative path /api/rentals
      const res = await axios.get(
        `/api/rentals/my-orders/${userId}`, 
        getAuthConfig()
      );
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = (orderId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-800">Cancel this delivery?</span>
        <div className="flex gap-2 justify-end mt-1">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-sm bg-gray-100 rounded-md">No</button>
          <button onClick={() => confirmCancel(orderId, t.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-md">Yes, Cancel</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const confirmCancel = async (orderId, toastId) => {
    toast.dismiss(toastId);
    const loadingToast = toast.loading("Cancelling order...");

    try {
        // ✅ FIX: Changed http://localhost:5000/api/rentals to relative path /api/rentals
        await axios.put(
          `/api/rentals/cancel/${orderId}`, 
          {}, 
          getAuthConfig()
        );
        
        toast.success("Delivery Cancelled", { id: loadingToast });
        fetchOrders(); // Sync state with the database
    } catch (err) {
        console.error("Cancellation Error Details:", err.response?.data);
        const msg = err.response?.data?.message || "Failed to cancel";
        toast.error(msg, { id: loadingToast });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 text-white">
          <div>
             <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">My Rental History</h1>
             <p className="mt-2 text-indigo-200">Manage deliveries and returns</p>
          </div>
          <Link to="/" className="mt-4 md:mt-0 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition backdrop-blur-md border border-white/30">
            &larr; Browse Catalog
          </Link>
        </div>
        
        <div className="space-y-8">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                <p className="text-xl font-semibold">No rental history found.</p>
                <Link to="/" className="text-indigo-300 hover:text-indigo-100 underline mt-2 block">Start renting now</Link>
              </div>
            ) : (
              orders.map((order) => {
                const product = order.products[0]?.product;
                const isAvailable = !!product;
                const isDelivered = new Date() > new Date(order.deliveryDate);
                const isCancelled = order.status === 'cancelled';

                return (
                  <div key={order._id} className={`rounded-2xl overflow-hidden shadow-2xl border transition-all ${isCancelled ? 'bg-gray-100/90 border-gray-400/50 opacity-75' : 'bg-white/95 border-white/50'}`}>
                    <div className={`px-8 py-5 border-b flex justify-between items-center ${isCancelled ? 'bg-gray-200' : 'bg-indigo-50/50'}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-gray-800 font-bold">#{order._id.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                            order.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col sm:flex-row gap-8">
                      <div className="h-32 w-32 rounded-xl bg-gray-100 overflow-hidden relative">
                         {isAvailable ? <img src={product.image} className={`w-full h-full object-cover ${isCancelled ? 'grayscale' : ''}`} alt="" /> : <div className="p-4 text-xs text-center text-gray-400">Unavailable</div>}
                      </div>
                      <div className="flex-1">
                          <h3 className={`text-2xl font-extrabold ${isCancelled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{isAvailable ? product.name : "Product Unavailable"}</h3>
                          <p className="text-sm text-gray-500 mt-1">Delivery scheduled for: <span className="font-bold text-gray-800">{new Date(order.deliveryDate).toDateString()}</span></p>
                          
                          {!isCancelled && (
                              <div className="mt-6 flex flex-wrap gap-4 items-center">
                                  {!isDelivered ? (
                                      <button 
                                          onClick={() => handleCancelOrder(order._id)}
                                          className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 border border-red-200 shadow-sm transition"
                                      >
                                          Cancel Delivery
                                      </button>
                                  ) : (
                                      <p className="text-sm font-bold text-green-600">Delivered</p>
                                  )}
                              </div>
                          )}
                      </div>
                      <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Monthly Rent</p>
                          <p className={`text-3xl font-extrabold ${isCancelled ? 'text-gray-400' : 'text-indigo-600'}`}>₹{order.totalMonthlyRent}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;