import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [rentals, setRentals] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, orders: 0, active: 0 });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/rentals/all');
                setRentals(res.data);

                // Calculate Stats
                const totalRevenue = res.data.reduce((acc, curr) => acc + (curr.totalMonthlyRent || 0), 0);
                const activeOrders = res.data.filter(r => r.status === 'active').length;

                setStats({
                    revenue: totalRevenue,
                    orders: res.data.length,
                    active: activeOrders
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchAllData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Revenue (MRR)</h3>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">₹{stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Active Rentals</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800">Recent Rentals</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Items</th>
                                    <th className="px-6 py-3">Delivery Date</th>
                                    <th className="px-6 py-3">Maintenance</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {rentals.map((rental) => (
                                    <tr key={rental._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600">#{rental._id.slice(-6)}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{rental.userDetails?.name || 'Guest'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {rental.products.map(p => p.product?.name).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(rental.deliveryDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {rental.maintenanceStatus === 'requested' ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Requested</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">
                                                {rental.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {rental.pickupStatus === 'scheduled' ? (
                                                <span className="text-orange-600 font-bold">
                                                    {new Date(rental.pickupDate).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">--</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;