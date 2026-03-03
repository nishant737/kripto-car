import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { dealerAPI, authUtils } from '../utils/api';

const DealerDashboard = () => {
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      window.location.href = '/';
      return;
    }

    // Try to get dealer info from localStorage first
    const storedDealer = authUtils.getDealerInfo();
    if (storedDealer) {
      setDealer(storedDealer);
      setLoading(false);
    }

    // Fetch fresh dealer data from API to verify token
    const fetchDealerProfile = async () => {
      try {
        const response = await dealerAPI.getProfile();
        setDealer(response.dealer);
        authUtils.setDealerInfo(response.dealer);
      } catch (err) {
        setError('Session expired. Please login again.');
        // If token is invalid, logout and redirect
        authUtils.logout();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchDealerProfile();
  }, []);

  // Handle click outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    authUtils.logout();
    window.location.href = '/';
  };

  const handleServiceCardClick = (categoryTitle) => {
    // Navigate to the service registration page with the category
    navigate(`/dealer/register-service/${encodeURIComponent(categoryTitle)}`);
  };

  // Service categories data
  const serviceCategories = [
    {
      id: 1,
      title: 'New Cars',
      gradient: 'from-blue-500/20 to-blue-600/20',
      hoverGradient: 'hover:from-blue-500/30 hover:to-blue-600/30',
      bgImage: 'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=800&q=80'
    },
    {
      id: 2,
      title: 'Used Cars',
      gradient: 'from-green-500/20 to-green-600/20',
      hoverGradient: 'hover:from-green-500/30 hover:to-green-600/30',
      bgImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
    },
    {
      id: 3,
      title: 'Tyres & Wheels',
      gradient: 'from-purple-500/20 to-purple-600/20',
      hoverGradient: 'hover:from-purple-500/30 hover:to-purple-600/30',
      bgImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80'
    },
    {
      id: 4,
      title: 'Wheel Alignment & Suspension',
      gradient: 'from-orange-500/20 to-orange-600/20',
      hoverGradient: 'hover:from-orange-500/30 hover:to-orange-600/30',
      bgImage: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&q=80'
    },
    {
      id: 5,
      title: 'Car Wash & Cleaning',
      gradient: 'from-cyan-500/20 to-cyan-600/20',
      hoverGradient: 'hover:from-cyan-500/30 hover:to-cyan-600/30',
      bgImage: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80'
    },
    {
      id: 6,
      title: 'Car Detailing Services',
      gradient: 'from-pink-500/20 to-pink-600/20',
      hoverGradient: 'hover:from-pink-500/30 hover:to-pink-600/30',
      bgImage: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80'
    },
    {
      id: 7,
      title: 'Denting & Painting',
      gradient: 'from-red-500/20 to-red-600/20',
      hoverGradient: 'hover:from-red-500/30 hover:to-red-600/30',
      bgImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80'
    },
    {
      id: 8,
      title: 'Emission Test & Legal Services',
      gradient: 'from-indigo-500/20 to-indigo-600/20',
      hoverGradient: 'hover:from-indigo-500/30 hover:to-indigo-600/30',
      bgImage: 'https://images.unsplash.com/photo-1632823469850-2b2e9affc842?w=800&q=80'
    },
    {
      id: 9,
      title: 'General Service & Maintenance',
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      hoverGradient: 'hover:from-yellow-500/30 hover:to-yellow-600/30',
      bgImage: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&q=80'
    },
    {
      id: 10,
      title: 'Accessories & Customization',
      gradient: 'from-teal-500/20 to-teal-600/20',
      hoverGradient: 'hover:from-teal-500/30 hover:to-teal-600/30',
      bgImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <p className="text-gray-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Custom Dashboard Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/95 border-b border-yellow-400/30 sticky top-0 z-50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                <span className="text-yellow-400">Kripto</span> Car
              </h1>
              <span className="ml-3 px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-400/30">
                Dealer
              </span>
            </motion.div>

            {/* Hamburger Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-l border-yellow-400/30 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-yellow-400">Menu</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {/* User Profile Section */}
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xl">
                    {dealer?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{dealer?.email}</p>
                    <p className="text-xs text-gray-400">{dealer?.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-700">
                  <div>
                    <p className="text-xs text-gray-400">Role</p>
                    <p className="text-sm text-white font-semibold capitalize">{dealer?.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Member Since</p>
                    <p className="text-sm text-white font-semibold">
                      {dealer?.createdAt ? new Date(dealer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Menu Items */}
            <div className="p-4 space-y-3">
              {/* Dashboard Option */}
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dealer/my-services')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-yellow-400/50 rounded-xl transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400/30 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold group-hover:text-yellow-400 transition-colors duration-200">Dashboard</p>
                  <p className="text-xs text-gray-400">Manage your services</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

              {/* Bookings Option */}
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dealer/my-bookings')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-yellow-400/50 rounded-xl transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400/30 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold group-hover:text-yellow-400 transition-colors duration-200">Bookings</p>
                  <p className="text-xs text-gray-400">View customer requests</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

              {/* Divider */}
              <div className="border-t border-gray-800 my-4"></div>

              {/* Logout Option */}
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 hover:border-red-600/50 rounded-xl transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-red-600/30 rounded-lg flex items-center justify-center text-red-400 group-hover:bg-red-600/40 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold group-hover:text-red-400 transition-colors duration-200">Logout</p>
                  <p className="text-xs text-gray-400">Sign out of your account</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-black/50">
              <p className="text-xs text-gray-400 text-center">
                <span className="text-yellow-400 font-semibold">Kripto Car</span> Dealer Dashboard
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Version 1.0
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Choose Your <span className="text-yellow-400">Service</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Select a service category to manage your automobile business
          </p>
        </motion.div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -8 }}
              onClick={() => handleServiceCardClick(category.title)}
              className="relative rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden border border-gray-800 hover:border-yellow-400/70 shadow-lg hover:shadow-2xl hover:shadow-yellow-400/20"
            >
              {/* Background Image with Zoom Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${category.bgImage})`,
                  }}
                />
                {/* Dark Overlay with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/80 group-hover:from-black/70 group-hover:via-black/65 group-hover:to-black/70 transition-all duration-300" />
                {/* Colored Glow Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[200px]">
                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300 drop-shadow-lg">
                  {category.title}
                </h3>

                {/* Manage Button */}
                <div className="flex items-center text-gray-300 group-hover:text-yellow-400 transition-colors duration-300">
                  <span className="text-sm font-medium">Manage</span>
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Glow Effect Border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl ring-2 ring-yellow-400/50 blur-sm" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-yellow-400">Welcome to Your Service Hub</h3>
              <p className="text-gray-300">
                Manage all aspects of your automobile business from this dashboard. 
                Select a service category to view and manage bookings, inventory, pricing, and more.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DealerDashboard;
