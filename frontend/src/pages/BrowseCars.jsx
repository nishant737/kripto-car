import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { carAPI } from '../utils/api';
import { carCompanies } from '../data/carData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import CustomDropdown from '../components/CustomDropdown';

const BrowseCars = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter options
  const [availableCities, setAvailableCities] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableBodyTypes, setAvailableBodyTypes] = useState([]);
  
  // Booking modal state
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Set category from URL parameter on mount
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedBodyType(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Fetch cars when filters change
  useEffect(() => {
    fetchCars();
  }, [selectedCity, selectedBrand, selectedModel, selectedBodyType]);

  // Update available models when brand changes
  useEffect(() => {
    if (selectedBrand && carCompanies[selectedBrand]) {
      setAvailableModels(carCompanies[selectedBrand]);
      setSelectedModel(''); // Reset model selection
    } else {
      setAvailableModels([]);
    }
  }, [selectedBrand]);

  const fetchFilterOptions = async () => {
    try {
      const response = await carAPI.getFilterOptions();
      setAvailableCities(response.filters.cities || []);
      setAvailableBodyTypes(response.filters.bodyTypes || []);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters = {};
      if (selectedCity) filters.city = selectedCity;
      if (selectedBrand) filters.brand = selectedBrand;
      if (selectedModel) filters.model = selectedModel;
      if (selectedBodyType) filters.bodyType = selectedBodyType;
      
      const response = await carAPI.getAllCars(filters);
      setCars(response.cars || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter on displayed cars
  const filteredCars = cars.filter(car => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      car.brand.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query) ||
      car.dealerName.toLowerCase().includes(query) ||
      car.location.city.toLowerCase().includes(query)
    );
  });

  const handleBookNow = (car) => {
    // Transform car data to match booking modal format
    const serviceData = {
      _id: car._id,
      businessName: car.dealerName,
      serviceType: `${car.brand} ${car.model}`,
      serviceCategory: 'New Cars',
      city: car.location.city,
      state: car.location.state,
      phone: car.contactPhone,
      email: car.contactEmail,
      dealerId: car.dealerId
    };
    
    setSelectedCar(serviceData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCar(null), 300);
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
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Header Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 1px, transparent 0, transparent 50%)',
              backgroundSize: '10px 10px'
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => categoryFromUrl ? navigate('/cars/categories') : navigate('/')}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 sm:mb-8 transition-colors cursor-pointer group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-semibold">{categoryFromUrl ? 'Back to Categories' : 'Back to Home'}</span>
          </motion.button>
          
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {categoryFromUrl ? (
                <>
                  <span className="text-yellow-400">{categoryFromUrl}</span> Cars
                </>
              ) : (
                <>
                  Browse <span className="text-yellow-400">New Cars</span>
                </>
              )}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl">
              {categoryFromUrl ? `Explore our collection of ${categoryFromUrl} vehicles` : 'Find your dream car from our extensive collection'}
            </p>
          </motion.div>
          
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm border-2 border-yellow-400/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Cars
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Search Filter */}
              <div className="w-full">
                <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Brand, model, dealer..."
                    className="w-full px-4 py-3 sm:py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base shadow-lg hover:border-yellow-400/50"
                  />
                </div>
              </div>
              
              {/* Location Filter */}
              <CustomDropdown
                label="Location"
                value={selectedCity}
                options={['All Cities', ...availableCities]}
                onChange={(value) => setSelectedCity(value === 'All Cities' ? '' : value)}
                placeholder="All Cities"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                }
              />
              
              {/* Brand Filter */}
              <CustomDropdown
                label="Car Brand"
                value={selectedBrand}
                options={['All Brands', ...Object.keys(carCompanies)]}
                onChange={(value) => setSelectedBrand(value === 'All Brands' ? '' : value)}
                placeholder="All Brands"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                }
              />
              
              {/* Model Filter */}
              <div className={!selectedBrand ? 'opacity-50 pointer-events-none' : ''}>
                <CustomDropdown
                  label="Car Model"
                  value={selectedModel}
                  options={selectedBrand ? ['All Models', ...availableModels] : ['Select brand first']}
                  onChange={(value) => setSelectedModel(value === 'All Models' ? '' : value)}
                  placeholder="All Models"
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  }
                />
              </div>
              
              {/* Body Type Filter */}
              <CustomDropdown
                label="Car Type"
                value={selectedBodyType}
                options={['All Types', ...availableBodyTypes]}
                onChange={(value) => setSelectedBodyType(value === 'All Types' ? '' : value)}
                placeholder="All Types"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                  </svg>
                }
              />
            </div>
            
            {/* Clear Filters Button */}
            {(selectedCity || selectedBrand || selectedModel || selectedBodyType || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <button
                  onClick={() => {
                    setSelectedCity('');
                    setSelectedBrand('');
                    setSelectedModel('');
                    setSelectedBodyType(categoryFromUrl || '');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-yellow-500/20 text-yellow-300 border-2 border-yellow-500/50 rounded-xl hover:bg-yellow-500/30 hover:border-yellow-400 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </button>
                {categoryFromUrl && (
                  <button
                    onClick={() => navigate('/cars/categories')}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-700/50 text-gray-300 border-2 border-gray-600 rounded-xl hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Change Category
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Cars Grid Section */}
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <p className="text-gray-400">
              {loading ? 'Loading...' : `Showing ${filteredCars.length} car${filteredCars.length !== 1 ? 's' : ''}`}
            </p>
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
                onClick={fetchCars}
                className="px-6 py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Cars Found */}
          {!loading && !error && filteredCars.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Cars Found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters to see more results</p>
              <button
                onClick={() => {
                  setSelectedCity('');
                  setSelectedBrand('');
                  setSelectedModel('');
                  setSearchQuery('');
                }}
                className="px-6 py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-colors font-semibold"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}

          {/* Cars Grid */}
          {!loading && !error && filteredCars.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 hover:border-yellow-400/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300"
                >
                  {/* Car Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
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
                    <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      {formatPrice(car.price)}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Available
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    {/* Brand & Model */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-1">
                      {car.brand} {car.model}
                    </h3>
                    
                    {/* Year & Color */}
                    {(car.specifications?.year || car.specifications?.color) && (
                      <p className="text-gray-400 text-sm mb-3">
                        {car.specifications.year && `${car.specifications.year}`}
                        {car.specifications.year && car.specifications.color && ' • '}
                        {car.specifications.color && car.specifications.color}
                      </p>
                    )}
                    
                    {/* Specifications */}
                    {(car.specifications?.fuelType || car.specifications?.transmission) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {car.specifications.fuelType && (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                            {car.specifications.fuelType}
                          </span>
                        )}
                        {car.specifications.transmission && (
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
                            {car.specifications.transmission}
                          </span>
                        )}
                        {car.specifications.mileage && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
                            {car.specifications.mileage}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Divider */}
                    <div className="border-t border-gray-700 my-4"></div>
                    
                    {/* Dealer Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="text-gray-300 flex-1">{car.dealerName}</span>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 flex-1">{car.location.city}, {car.location.state}</span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button
                      onClick={() => handleBookNow(car)}
                      className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/50"
                    >
                      Book Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          service={selectedCar}
        />
      )}
    </div>
  );
};

export default BrowseCars;
