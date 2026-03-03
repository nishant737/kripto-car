import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { services } from '../data/services';
import { serviceAPI } from '../utils/api';
import { indianCities } from '../data/dealerships';
import BookingModal from '../components/BookingModal';
import CustomDropdown from '../components/CustomDropdown';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ServiceDetailPage() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  
  // Decode the service name from URL
  const decodedServiceName = decodeURIComponent(serviceName);
  
  // Find the service details from services.js
  const currentService = services.find(s => s.title === decodedServiceName);
  
  // State for dealer services from database
  const [dealerServices, setDealerServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for filters
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for booking modal
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Redirect if service not found
  useEffect(() => {
    if (!currentService) {
      navigate('/');
    }
  }, [currentService, navigate]);
  
  // Fetch dealer services from database
  useEffect(() => {
    if (currentService) {
      fetchDealerServices();
    }
  }, [currentService]);
  
  const fetchDealerServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await serviceAPI.browseServices({
        serviceCategory: decodedServiceName
      });
      setDealerServices(response.services || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter services based on city and search
  const filteredServices = dealerServices.filter(service => {
    const matchesCity = selectedCity === 'All Cities' || service.city === selectedCity;
    const matchesSearch = !searchQuery || 
      service.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCity && matchesSearch;
  });
  
  // Handle booking
  const handleBookNow = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };
  
  // If service not found, return null (will redirect)
  if (!currentService) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Service Header */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Background Pattern */}
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
            onClick={() => navigate('/')}
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
            <span className="font-semibold">Back to Services</span>
          </motion.button>
          
          {/* Service Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {currentService.title}
              {currentService.highlight && (
                <span className="ml-3 text-yellow-400">⭐</span>
              )}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl">
              Find the best services for <span className="text-yellow-400">{currentService.title}</span> across India
            </p>
          </motion.div>
          
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Services
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Search Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by business name, service type..."
                    className="w-full px-4 py-3 pl-10 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* City Filter */}
              <CustomDropdown
                label="Location"
                value={selectedCity}
                options={['All Cities', ...indianCities]}
                onChange={setSelectedCity}
                placeholder="Select city"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
            </div>
            
            {/* Active Filters Display */}
            <div className="mt-6 flex flex-wrap gap-3">
              {searchQuery && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-lg border border-yellow-400/30"
                >
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-yellow-400 text-sm font-semibold">"{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.div>
              )}
              
              {selectedCity !== 'All Cities' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-lg border border-yellow-400/30"
                >
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-yellow-400 text-sm font-semibold">{selectedCity}</span>
                  <button
                    onClick={() => setSelectedCity('All Cities')}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading services...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-xl text-red-400 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}
          
          {/* Results Count */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              <p className="text-gray-400 text-base sm:text-lg">
                Found <span className="text-yellow-400 font-bold text-xl">{filteredServices.length}</span>{' '}
                {filteredServices.length === 1 ? 'service' : 'services'}
              </p>
            </motion.div>
          )}
          
          {/* Services Grid */}
          {!loading && !error && filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-yellow-400/50 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Business Name */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-200">
                      {service.businessName}
                    </h3>
                    
                    {/* Service Type */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Service Types:</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{service.serviceType}</p>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2 mb-3 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{service.city}, {service.state}</span>
                    </div>
                    
                    {/* Timing */}
                    <div className="flex items-center gap-2 mb-3 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{service.openingTime} - {service.closingTime}</span>
                    </div>
                    
                    {/* Price */}
                    {service.price && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                          {service.price}
                        </span>
                      </div>
                    )}
                    
                    {/* Description */}
                    {service.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    
                    {/* Book Now Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBookNow(service)}
                      className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-yellow-400/50"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : !loading && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="bg-gray-800/50 border-2 border-gray-700 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto">
                <div className="text-6xl sm:text-7xl mb-6">🔍</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  No Services Found
                </h3>
                <p className="text-gray-400 mb-8 text-base sm:text-lg">
                  We couldn't find any services matching your filters. Try adjusting your search criteria.
                </p>
                <motion.button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('All Cities');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 cursor-pointer"
                >
                  Clear All Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      
      <Footer />
      
      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          dealerService={selectedService}
          serviceCategory={currentService}
        />
      )}
    </div>
  );
}
