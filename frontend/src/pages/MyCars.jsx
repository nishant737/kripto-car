import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { carAPI, authUtils } from '../utils/api';

const MyCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      navigate('/');
    } else {
      fetchMyCars();
    }
  }, [navigate]);

  const fetchMyCars = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await carAPI.getMyCars();
      setCars(response.cars || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your car listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car listing?')) {
      return;
    }

    try {
      setDeleteLoading(carId);
      await carAPI.deleteCar(carId);
      // Remove the car from the list
      setCars(cars.filter(car => car._id !== carId));
      alert('Car listing deleted successfully!');
    } catch (err) {
      alert(err.message || 'Failed to delete car listing');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dealer-dashboard')}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/dealer/add-car-listing')}
              className="px-4 py-2 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-colors font-semibold"
            >
              + Add New Car
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            My <span className="text-yellow-400">Car Listings</span>
          </h1>
          <p className="text-gray-400">Manage your car listings</p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-4">⚠️ {error}</p>
            <button
              onClick={fetchMyCars}
              className="px-6 py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Cars */}
        {!loading && !error && cars.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Car Listings Yet</h3>
            <p className="text-gray-400 mb-6">Start by adding your first car listing</p>
            <button
              onClick={() => navigate('/dealer/add-car-listing')}
              className="px-6 py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-colors font-semibold"
            >
              Add Your First Car
            </button>
          </motion.div>
        )}

        {/* Cars Grid */}
        {!loading && !error && cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl overflow-hidden"
              >
                {/* Car Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.images && car.images[0] ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${car.images[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm">
                    {formatPrice(car.price)}
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                    car.status === 'available' ? 'bg-green-500 text-white' :
                    car.status === 'sold' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-black'
                  }`}>
                    {car.status.toUpperCase()}
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {car.brand} {car.model}
                  </h3>
                  
                  {(car.specifications?.year || car.specifications?.color) && (
                    <p className="text-gray-400 text-sm mb-3">
                      {car.specifications.year && `${car.specifications.year}`}
                      {car.specifications.year && car.specifications.color && ' • '}
                      {car.specifications.color && car.specifications.color}
                    </p>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {car.location.city}, {car.location.state}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteCar(car._id)}
                      disabled={deleteLoading === car._id}
                      className="flex-1 px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading === car._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCars;
