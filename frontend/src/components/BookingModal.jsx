import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { carCompanies as allCarCompanies } from '../data/carData';
import ImageCarousel from './ImageCarousel';
import { bookingAPI } from '../utils/api';

export default function BookingModal({ isOpen, onClose, dealership, dealerService, serviceCategory }) {
  // Form state for customer information
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    address: '',
    carCompany: '',      // New field: Selected car company
    carModel: '',        // New field: Selected car model (depends on company)
    serviceRequired: ''  // New field: Specific service from category
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for custom confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  
  // Determine which data to use (dealership or dealerService)
  const serviceData = dealerService || dealership;
  const serviceName = dealerService ? dealerService.businessName : dealership?.name;
  const serviceLocation = dealerService 
    ? `${dealerService.city}, ${dealerService.state}` 
    : `${dealership?.area}, ${dealership?.city}`;
  
  /**
   * Parse dealer-specific data from serviceType field
   * 
   * The serviceType field contains comma-separated values like:
   * "Tyre Replacement, Wheel Balancing, Maruti Suzuki, Hyundai, Swift, Baleno, Creta"
   * 
   * We need to separate:
   * 1. Service types (actual service names)
   * 2. Car companies (brands that the dealer selected)
   * 3. Car models (models that the dealer selected for each company)
   * 
   * IMPORTANT: Only show what the dealer actually configured!
   */
  const dealerSpecificData = useMemo(() => {
    // If no serviceType data, return empty arrays
    if (!dealerService?.serviceType) {
      return {
        carCompanies: [],
        carModelsByCompany: {},
        serviceTypes: []
      };
    }
    
    // Split the comma-separated serviceType string into array
    const serviceTypeArray = dealerService.serviceType
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // Get all known car company names (keys from carCompanies object)
    const knownCompanyNames = Object.keys(allCarCompanies);
    
    // Step 1: Extract car companies (only companies the dealer actually selected)
    // These are items that match known company names
    const dealerCompanies = serviceTypeArray.filter(item => 
      knownCompanyNames.includes(item)
    );
    
    // Step 2: Build models by company
    // For each company the dealer selected, find which models they selected
    const modelsByCompany = {};
    
    dealerCompanies.forEach(company => {
      // Get the predefined models for this company from allCarCompanies
      const companyPredefinedModels = allCarCompanies[company] || [];
      
      // Find which of the dealer's selected items are models for this specific company
      const dealerSelectedModels = serviceTypeArray.filter(item => 
        companyPredefinedModels.includes(item)
      );
      
      // Only add to map if there are models
      if (dealerSelectedModels.length > 0) {
        modelsByCompany[company] = dealerSelectedModels;
      }
    });
    
    // Step 3: Extract service types - these are items that are NOT car companies or car models
    // Get all known model names from all companies
    const allKnownModels = Object.values(allCarCompanies).flat();
    
    // Service types are items that are neither companies nor models
    const supportedServices = serviceTypeArray.filter(item => 
      !dealerCompanies.includes(item) && !allKnownModels.includes(item)
    );
    
    return {
      carCompanies: dealerCompanies,
      carModelsByCompany: modelsByCompany,
      serviceTypes: supportedServices
    };
  }, [dealerService?.serviceType]);
  
  // Get dealer-specific car companies (only brands this dealer supports)
  const carCompanies = dealerSpecificData.carCompanies;
  
  // Get dealer-specific car models based on selected company
  // Only shows models that this dealer supports for the selected company
  const carModels = formData.carCompany 
    ? (dealerSpecificData.carModelsByCompany[formData.carCompany] || [])
    : [];
  
  // Get dealer-specific services (only services this dealer provides)
  // NO fallback - only show what dealer actually configured
  const availableServices = dealerSpecificData.serviceTypes;

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for car company change
    // When company changes, reset the car model since models depend on company
    if (name === 'carCompany') {
      setFormData(prev => ({
        ...prev,
        carCompany: value,
        carModel: '' // Reset model when company changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters';
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address (minimum 10 characters)';
    }
    
    // Car Company validation - NEW
    if (!formData.carCompany) {
      newErrors.carCompany = 'Please select a car company';
    }
    
    // Car Model validation - NEW
    if (!formData.carModel) {
      newErrors.carModel = 'Please select a car model';
    }
    
    // Service Required validation - NEW
    if (!formData.serviceRequired) {
      newErrors.serviceRequired = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Generate WhatsApp Click-to-Chat Link
   * 
   * This function creates a WhatsApp URL that opens WhatsApp with a pre-filled message.
   * How it works:
   * 1. Extracts dealer's phone number from dealerService data (stored in database)
   * 2. Cleans the phone number by removing all non-digit characters
   * 3. Adds India country code (91) if not already present
   * 4. Creates a formatted message with all booking details INCLUDING car and service info
   * 5. Encodes the message for URL compatibility
   * 6. Returns WhatsApp link format: https://wa.me/{phone}?text={encoded_message}
   * 
   * @returns {string|null} WhatsApp Click-to-Chat URL or null if phone number unavailable
   */
  const generateWhatsAppLink = () => {
    // Get dealer's phone number from dealerService data
    // This phone number was stored when dealer registered their service
    const dealerPhone = dealerService?.contactPhone;
    
    // Validate phone number exists
    if (!dealerPhone) {
      alert('Unable to send booking request. Dealer contact information not available.');
      return null;
    }
    
    // Clean phone number: remove spaces, dashes, parentheses, etc.
    // Example: "98765 43210" becomes "9876543210"
    const cleanPhone = dealerPhone.replace(/\D/g, '');
    
    // Add Indian country code (91) if not already present
    // WhatsApp international format requires country code
    const phoneWithCountryCode = cleanPhone.startsWith('91') 
      ? cleanPhone 
      : `91${cleanPhone}`;
    
    // Create professionally formatted WhatsApp message
    // NOW INCLUDING: Car Company, Car Model, and Specific Service
    const message = `🚗 *New Booking Request from Kripto Car*

Hello! You have received a new service booking request.

📋 *Customer Details:*
• Name: ${formData.name}
• Phone: ${formData.phone}
• Location: ${formData.location}
• Address: ${formData.address}

🚘 *Vehicle Information:*
• Car: ${formData.carCompany} ${formData.carModel}

🔧 *Service Requested:*
${formData.serviceRequired}
(Category: ${serviceCategory?.title || serviceName})

📍 *Your Business:*
${serviceData?.businessName || serviceName}
${serviceLocation}

✅ Please contact the customer to confirm the booking.

Thank you!
— Kripto Car Team`;
    
    // Encode message for URL
    // This converts special characters (spaces, newlines, etc.) to URL-safe format
    // Example: space becomes %20, newline becomes %0A
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp Click-to-Chat URL
    // Format: https://wa.me/{country_code}{phone}?text={encoded_message}
    const whatsappLink = `https://wa.me/${phoneWithCountryCode}?text=${encodedMessage}`;
    
    return whatsappLink;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Prepare booking data to send to backend
        const bookingData = {
          dealerServiceId: dealerService?._id,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerLocation: formData.location,
          customerAddress: formData.address,
          carBrand: formData.carCompany,
          carModel: formData.carModel,
          serviceRequirement: formData.serviceRequired,
          // Optional fields - will be set to defaults in backend if not provided
          customerEmail: '', // Not collected in form
          preferredDate: new Date().toISOString().split('T')[0], // Today's date
          preferredTime: 'Not specified',
          message: `Booking from Kripto Car website`
        };

        // Log booking data for debugging
        console.log('=== SAVING BOOKING TO DATABASE ===');
        console.log('Booking Data:', bookingData);
        console.log('Service:', serviceName);
        console.log('Service Category:', serviceCategory?.title);
        console.log('Timestamp:', new Date().toISOString());
        console.log('===================================');

        // Save booking to database
        const response = await bookingAPI.createBooking(bookingData);
        
        console.log('✅ Booking saved successfully!');
        console.log('Booking ID:', response.booking._id);

        // Generate WhatsApp Click-to-Chat link with booking details
        const generatedLink = generateWhatsAppLink();
        
        if (generatedLink) {
          // Store WhatsApp link and show custom confirmation modal
          setWhatsappLink(generatedLink);
          setShowConfirmation(true);
          setIsSubmitting(false);
        } else {
          // WhatsApp link generation failed but booking was saved
          alert('Booking saved successfully! However, we could not generate the WhatsApp link.');
          setIsSubmitting(false);
          // Close modal after showing message
          setTimeout(() => {
            setFormData({ 
              name: '', 
              phone: '', 
              location: '', 
              address: '',
              carCompany: '',
              carModel: '',
              serviceRequired: ''
            });
            setErrors({});
            onClose();
          }, 1000);
        }
      } catch (error) {
        // Error saving booking
        console.error('❌ Error saving booking:', error);
        alert(`Failed to save booking: ${error.message || 'Please try again.'}`);
        setIsSubmitting(false);
      }
    }
  };

  // Handle confirmation - Send booking via WhatsApp
  const handleConfirmBooking = () => {
    // Open WhatsApp in new tab/window
    // On mobile: Opens WhatsApp app
    // On desktop: Opens WhatsApp Web
    window.open(whatsappLink, '_blank');
    
    // Close confirmation modal
    setShowConfirmation(false);
    
    // Reset form and close main modal after short delay
    setTimeout(() => {
      setFormData({ 
        name: '', 
        phone: '', 
        location: '', 
        address: '',
        carCompany: '',
        carModel: '',
        serviceRequired: ''
      });
      setErrors({});
      onClose();
    }, 500);
  };
  
  // Handle cancellation of confirmation
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setWhatsappLink('');
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({ 
      name: '', 
      phone: '', 
      location: '', 
      address: '',
      carCompany: '',
      carModel: '',
      serviceRequired: ''
    });
    setErrors({});
    setShowConfirmation(false);
    setWhatsappLink('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-2 border-yellow-400/30 rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 sm:p-8 rounded-t-2xl sm:rounded-t-3xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                      Book Service
                    </h3>
                    <p className="text-black/80 text-sm sm:text-base font-medium">
                      {serviceName}
                    </p>
                    <p className="text-black/70 text-xs sm:text-sm">
                      {serviceLocation}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-black/80 hover:text-black transition-colors p-1"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Service Images and Description Section */}
              {dealerService && (dealerService.images?.length > 0 || dealerService.description || dealerService.price) && (
                <div className="px-6 sm:px-8 pt-6 space-y-4">
                  {/* Image Carousel */}
                  {dealerService.images && dealerService.images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ImageCarousel 
                        images={dealerService.images} 
                        alt={`${serviceName} service`}
                      />
                    </motion.div>
                  )}

                  {/* Service Description and Price */}
                  <div className="space-y-3">
                    {/* Service Description */}
                    {dealerService.description && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <svg 
                            className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </svg>
                          <h4 className="text-white font-semibold text-sm">About This Service</h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {dealerService.description}
                        </p>
                      </motion.div>
                    )}

                    {/* Price Information */}
                    {dealerService.price && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2">
                          <svg 
                            className="w-5 h-5 text-yellow-400 flex-shrink-0" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </svg>
                          <div>
                            <h4 className="text-yellow-400 font-semibold text-sm">Price Range</h4>
                            <p className="text-white text-sm font-medium">{dealerService.price}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/20'
                    }`}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs sm:text-sm mt-2"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/20'
                    }`}
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs sm:text-sm mt-2"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                {/* Location Field */}
                <div>
                  <label htmlFor="location" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                    City/Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Bangalore, Mumbai, Delhi"
                    className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                      errors.location
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/20'
                    }`}
                  />
                  {errors.location && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs sm:text-sm mt-2"
                    >
                      {errors.location}
                    </motion.p>
                  )}
                </div>
                
                {/* Address Field */}
                <div>
                  <label htmlFor="address" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                    Full Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    rows="3"
                    className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base resize-none ${
                      errors.address
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/20'
                    }`}
                  />
                  {errors.address && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs sm:text-sm mt-2"
                    >
                      {errors.address}
                    </motion.p>
                  )}
                </div>

                {/* Car Company Dropdown - Dealer-Specific */}
                <div>
                  <label htmlFor="carCompany" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                    Car Company *
                  </label>
                  <select
                    id="carCompany"
                    name="carCompany"
                    value={formData.carCompany}
                    onChange={handleChange}
                    disabled={carCompanies.length === 0}
                    className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                      carCompanies.length === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : errors.carCompany
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/20'
                    }`}
                  >
                    <option value="" className="bg-gray-800">
                      {carCompanies.length === 0 ? 'No car brands available' : 'Select Car Company'}
                    </option>
                    {carCompanies.map(company => (
                      <option key={company} value={company} className="bg-gray-800">
                        {company}
                      </option>
                    ))}
                  </select>
                  {errors.carCompany && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs sm:text-sm mt-2"
                    >
                      {errors.carCompany}
                    </motion.p>
                  )}
                  {carCompanies.length > 0 && (
                    <p className="text-gray-400 text-xs mt-1">
                      🚗 Showing {carCompanies.length} brand{carCompanies.length > 1 ? 's' : ''} supported by this dealer
                    </p>
                  )}
                </div>

                {/* Car Model Dropdown - DEPENDENT on Car Company */}
                <div>
                  <label htmlFor="carModel" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                    Car Model *
                  </label>
                  <select
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    disabled={!formData.carCompany}
                    className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                      !formData.carCompany
                        ? 'opacity-50 cursor-not-allowed'
                        : errors.carModel
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/20'
                    }`}
                  >
                    <option value="" className="bg-gray-800">
                      {formData.carCompany ? 'Select Car Model' : 'Select Company First'}
                    </option>
                    {carModels.map(model => (
                      <option key={model} value={model} className="bg-gray-800">
                        {model}
                      </option>
                    ))}
                  </select>
                  {errors.carModel && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs sm:text-sm mt-2"
                    >
                      {errors.carModel}
                    </motion.p>
                  )}
                  {formData.carCompany && carModels.length > 0 && (
                    <p className="text-gray-400 text-xs mt-1">
                      💡 {carModels.length} {formData.carCompany} model{carModels.length > 1 ? 's' : ''} serviced here
                    </p>
                  )}
                  {formData.carCompany && carModels.length === 0 && (
                    <p className="text-yellow-400 text-xs mt-1">
                      ⚠️ This dealer doesn't service {formData.carCompany} models
                    </p>
                  )}
                </div>

                {/* Service Required Dropdown - Shows services from category */}
                <div>
                  <label htmlFor="serviceRequired" className="block text-white font-semibold mb-2 text-sm sm:text-base">
                    Service Required *
                  </label>
                  <select
                    id="serviceRequired"
                    name="serviceRequired"
                    value={formData.serviceRequired}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                      errors.serviceRequired
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/20'
                    }`}
                  >
                    <option value="" className="bg-gray-800">Select Service</option>
                    {availableServices.map(service => (
                      <option key={service} value={service} className="bg-gray-800">
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.serviceRequired && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs sm:text-sm mt-2"
                    >
                      {errors.serviceRequired}
                    </motion.p>
                  )}
                  {availableServices.length > 0 && (
                    <p className="text-gray-400 text-xs mt-1">
                      🔧 {availableServices.length} service{availableServices.length > 1 ? 's' : ''} offered by this dealer
                    </p>
                  )}
                </div>
                {/* Warning Box - Show if dealer hasn't configured car/service options */}
                {(carCompanies.length === 0 || availableServices.length === 0) && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-xs sm:text-sm">
                      ⚠️ <strong>Limited Options:</strong>{' '}
                      {carCompanies.length === 0 && 'This dealer has not specified supported car brands. '}
                      {availableServices.length === 0 && 'This dealer has not specified available services. '}
                      Please contact them directly for booking details.
                    </p>
                  </div>
                )}
                {/* Info Box */}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                  <p className="text-yellow-400 text-xs sm:text-sm">
                    � <strong>WhatsApp Booking:</strong> Your booking request will be sent directly to the dealer via WhatsApp. They will contact you to confirm.
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg hover:shadow-yellow-400/50 cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </motion.button>

                <p className="text-gray-400 text-xs text-center">
                  * All fields are required
                </p>
              </form>
            </motion.div>
          </motion.div>
          
          {/* Custom Confirmation Modal */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
                onClick={handleCancelConfirmation}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-900 border-2 border-yellow-400/30 rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-t-2xl sm:rounded-t-3xl">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black text-center">
                      Booking Summary
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 space-y-4">
                    {/* Dealer Info */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Dealer</p>
                      <p className="text-white font-semibold text-lg">
                        {serviceName}
                      </p>
                    </div>

                    {/* Car Info */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Vehicle</p>
                      <p className="text-white font-semibold text-lg">
                        {formData.carCompany} {formData.carModel}
                      </p>
                    </div>

                    {/* Service Info */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Service</p>
                      <p className="text-white font-semibold text-lg">
                        {formData.serviceRequired}
                      </p>
                    </div>

                    {/* Location Info */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Location</p>
                      <p className="text-white font-semibold text-lg">
                        {formData.location}
                      </p>
                    </div>

                    {/* Info Message */}
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mt-6">
                      <p className="text-yellow-400 text-xs sm:text-sm text-center">
                        Your booking request will be sent to the dealer via WhatsApp
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-0 sm:p-8 sm:pt-0 flex gap-3">
                    <motion.button
                      onClick={handleCancelConfirmation}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base bg-gray-800 text-white border-2 border-gray-700 hover:border-gray-600 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleConfirmBooking}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300"
                    >
                      Send via WhatsApp
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
