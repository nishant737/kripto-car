import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, authUtils } from '../utils/api';

const DealerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      navigate('/');
      return;
    }

    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getDealerBookings();
      setBookings(response.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingBookingId(bookingId);
      setError('');
      
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: newStatus } : b
      ));
      
      // Auto-switch to the new status tab if not on "all"
      if (selectedStatus !== 'all' && selectedStatus !== newStatus) {
        setSelectedStatus(newStatus);
      }
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleBack = () => {
    navigate('/dealer-dashboard');
  };

  // Filter bookings by status
  const filteredBookings = selectedStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === selectedStatus);

  // Count bookings by status
  const bookingCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/95 border-b border-yellow-400/30 sticky top-0 z-50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={handleBack}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                <span className="text-yellow-400">Kripto</span> Car
              </h1>
              <span className="ml-3 px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-400/30">
                Dealer
              </span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-sm transition-colors duration-200 border border-gray-700"
            >
              ← Back
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Customer <span className="text-yellow-400">Bookings</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage and track all customer booking requests
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {[
            { key: 'all', label: 'All Bookings', icon: '📋' },
            { key: 'pending', label: 'Pending', icon: '⏳' },
            { key: 'confirmed', label: 'Confirmed', icon: '✓' },
            { key: 'completed', label: 'Completed', icon: '✅' },
            { key: 'cancelled', label: 'Cancelled', icon: '❌' },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStatus(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
                selectedStatus === tab.key
                  ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20'
                  : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700 hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                selectedStatus === tab.key
                  ? 'bg-black/20 text-black'
                  : 'bg-gray-800 text-gray-300'
              }`}>
                {bookingCounts[tab.key]}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/40 rounded-xl text-red-400 flex items-center gap-3"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 font-medium">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-gray-800 shadow-xl">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Bookings Found</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {selectedStatus === 'all' 
                ? "You haven't received any booking requests yet. They will appear here once customers book your services."
                : `No ${selectedStatus} bookings at the moment.`
              }
            </p>
          </motion.div>
        )}

        {/* Bookings Table */}
        {!loading && filteredBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border-b-2 border-yellow-400/30">
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Booking ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Customer Name
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Phone Number
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Address
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Car Company
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Car Model
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Service Requested
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Booking Date
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <AnimatePresence mode="popLayout">
                    {filteredBookings.map((booking, index) => (
                      <motion.tr
                        key={booking._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className="hover:bg-gray-800/30 transition-colors duration-200"
                      >
                        {/* Booking ID */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xs">📋</span>
                            </div>
                            <span className="text-xs font-mono text-gray-300">
                              {booking._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Customer Name */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xs">👤</span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                              {booking.customerName}
                            </span>
                          </div>
                        </td>

                        {/* Phone Number */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm text-gray-300">
                              {booking.customerPhone}
                            </span>
                          </div>
                        </td>

                        {/* Address */}
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2 max-w-xs">
                            <svg className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm text-gray-300 line-clamp-2">
                              {booking.customerAddress}
                            </span>
                          </div>
                        </td>

                        {/* Car Company */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-200">
                            {booking.carBrand || 'N/A'}
                          </span>
                        </td>

                        {/* Car Model */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-200">
                            {booking.carModel}
                          </span>
                        </td>

                        {/* Service Requested */}
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2 max-w-xs">
                            <svg className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm text-gray-300 line-clamp-2">
                              {booking.serviceRequirement}
                            </span>
                          </div>
                        </td>

                        {/* Booking Date */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-300">
                              {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                            disabled={updatingBookingId === booking._id}
                            className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 cursor-pointer ${
                              updatingBookingId === booking._id
                                ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-700 text-gray-500'
                                : booking.status === 'pending'
                                  ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30'
                                  : booking.status === 'confirmed'
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30'
                                    : booking.status === 'completed'
                                      ? 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30'
                                      : 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                            }`}
                          >
                            <option value="pending" className="bg-gray-900 text-yellow-400">⏳ Pending</option>
                            <option value="confirmed" className="bg-gray-900 text-blue-400">✓ Confirmed</option>
                            <option value="completed" className="bg-gray-900 text-green-400">✅ Completed</option>
                            <option value="cancelled" className="bg-gray-900 text-red-400">❌ Cancelled</option>
                          </select>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DealerBookings;
