import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ UPDATED: Fetch Cart Data with relative path and token
    useEffect(() => {
        if (user) {
            const fetchCart = async () => {
                try {
                    const token = localStorage.getItem('token');
                    // Changed from localhost to relative path + added headers
                    const res = await axios.get(`/api/cart/${user.id}`, {
                        headers: { 'x-auth-token': token }
                    });
                    setCartItems(res.data.items || []);
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to load cart");
                    setLoading(false);
                }
            };
            fetchCart();
        }
    }, [user]);

    // ✅ UPDATED: Handle Remove Item with relative path and token
    const handleRemove = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            // Changed from localhost to relative path + added headers
            await axios.delete(`/api/cart/remove/${user.id}/${productId}`, {
                headers: { 'x-auth-token': token }
            });
            setCartItems(prev => prev.filter(item => item.product._id !== productId));
            toast.success("Item removed");
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove item");
        }
    };

    // Calculate Totals (Remains the same)
    const totalRent = cartItems.reduce((acc, item) => acc + (item.product?.monthlyRent || 0), 0);
    const totalDeposit = cartItems.reduce((acc, item) => acc + (item.product?.securityDeposit || 0), 0);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-gray-500">Looks like you haven't added any items yet.</p>
                        <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500">{item.tenure} Months Plan</p>
                                        <div className="mt-2 flex gap-4 text-sm">
                                            <span className="font-semibold text-indigo-600">Rent: ₹{item.product.monthlyRent}/mo</span>
                                            <span className="text-gray-500">Deposit: ₹{item.product.securityDeposit}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.product._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition"
                                        title="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="w-full lg:w-96 h-fit bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Total Monthly Rent</span>
                                    <span className="font-medium">₹{totalRent}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Security Deposit</span>
                                    <span className="font-medium">₹{totalDeposit}</span>
                                </div>
                                <div className="border-t pt-4 mt-4 flex justify-between text-base font-bold text-gray-900">
                                    <span>Total Payable Now</span>
                                    <span>₹{totalRent + totalDeposit}</span>
                                </div>
                            </div>

                            <button
                                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
                                onClick={() => {
                                    navigate('/checkout', {
                                        state: {
                                            cartItems: cartItems,
                                            isBulk: true
                                        }
                                    });
                                }}
                            >
                                Proceed to Checkout
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                (Note: For this demo, please use the "Rent Now" button on individual items to complete payment.)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;