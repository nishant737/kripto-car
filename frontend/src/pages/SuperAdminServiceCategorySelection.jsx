import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { superAdminAPI, authUtils } from '../utils/api';

const serviceCategories = [
  { 
    name: 'New Cars', 
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    description: 'New car sales and delivery' 
  },
  { 
    name: 'Used Cars', 
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    bgImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    description: 'Certified pre-owned vehicles' 
  },
  { 
    name: 'Tyres & Wheels', 
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    bgImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Tyre sales and services' 
  },
  { 
    name: 'Wheel Alignment & Suspension', 
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    bgImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    description: 'Alignment and suspension work' 
  },
  { 
    name: 'Car Wash & Cleaning', 
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    bgImage: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80',
    description: 'Professional car cleaning' 
  },
  { 
    name: 'Car Detailing Services', 
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    bgImage: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
    description: 'Premium detailing packages' 
  },
  { 
    name: 'Denting & Painting', 
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    bgImage: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
    description: 'Body repair and paint work' 
  },
  { 
    name: 'Emission Test & Legal Services', 
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    bgImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    description: 'PUC and documentation' 
  },
  { 
    name: 'General Service & Maintenance', 
    gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    bgImage: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
    description: 'Regular maintenance services' 
  },
  { 
    name: 'Accessories & Customization', 
    gradient: 'linear-gradient(135deg, #f67280 0%, #c06c84 100%)',
    bgImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    description: 'Car accessories and upgrades' 
  }
];

const SuperAdminServiceCategorySelection = () => {
  const { dealerId } = useParams();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if super admin is authenticated
    if (!authUtils.isAuthenticated()) {
      navigate('/');
      return;
    }

    const dealerInfo = authUtils.getDealerInfo();
    if (!dealerInfo || dealerInfo.role !== 'superadmin') {
      navigate('/');
      return;
    }

    fetchDealerInfo();
  }, [navigate, dealerId]);

  const fetchDealerInfo = async () => {
    try {
      setLoading(true);
      const response = await superAdminAPI.getAllDealerships();
      const dealerData = response.dealerships.find(d => d._id === dealerId);
      setDealer(dealerData);
    } catch (err) {
      console.error('Failed to load dealer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (categoryName) => {
    // Navigate to service registration page with dealer ID
    navigate(`/superadmin/dealer/${dealerId}/service/${encodeURIComponent(categoryName)}/register`);
  };

  const handleSkipAndFinish = () => {
    navigate('/superadmin/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

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
            <motion.div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                <span className="text-yellow-400">Kripto</span> Car
              </h1>
              <span className="ml-3 px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-400/30">
                Super Admin
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-yellow-400/30 rounded-2xl p-6">
            <h1 className="text-3xl font-bold mb-2">
              Add Service for <span className="text-yellow-400">{dealer?.dealershipName || 'Dealership'}</span>
            </h1>
            {dealer && (
              <div className="flex flex-col gap-2 text-gray-400 mt-4">
                <div className="flex items-center gap-4 text-sm">
                  <span>📧 {dealer.email}</span>
                  <span>📱 {dealer.phone}</span>
                  {dealer.city && dealer.state && (
                    <span>📍 {dealer.city}, {dealer.state}</span>
                  )}
                </div>
              </div>
            )}
            <p className="text-gray-400 mt-4">
              Select a service category to configure for this dealership
            </p>
          </div>
        </motion.div>

        {/* Service Category Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
        >
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectCategory(category.name)}
              className="cursor-pointer relative overflow-hidden rounded-2xl shadow-2xl group h-72"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${category.bgImage})`,
                }}
              />
              
              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 z-10">
                <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                  <h3 className="font-bold text-2xl text-white mb-2 drop-shadow-lg">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200 mb-4 drop-shadow-md line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center text-yellow-400 text-sm font-semibold">
                    <span className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/30 group-hover:border-yellow-400/60 transition-all flex items-center gap-2">
                      <span>Configure Service</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Border Glow on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-2xl transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkipAndFinish}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all border border-gray-700"
          >
            Skip & Finish
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminServiceCategorySelection;
