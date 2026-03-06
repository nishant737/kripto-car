import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { carAPI, authUtils } from '../utils/api';
import { carCompanies } from '../data/carData';

// Indian states list
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
];

const indianCities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Vadodara',
  'Coimbatore', 'Kochi', 'Mysore', 'Chandigarh', 'Gurgaon', 'Noida'
];

const transmissionTypes = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];
const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const bodyTypes = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Wagon', 'Pickup Truck', 'EV/Electric', 'Luxury'];

const AddCarListing = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    dealerName: '',
    brand: '',
    model: '',
    bodyType: '',
    price: '',
    city: '',
    state: '',
    engine: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    seatingCapacity: '',
    color: '',
    year: new Date().getFullYear(),
    contactPhone: '',
    contactEmail: '',
    description: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [customBrand, setCustomBrand] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [showCustomBrand, setShowCustomBrand] = useState(false);
  const [showCustomModel, setShowCustomModel] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      navigate('/');
    } else {
      const dealer = authUtils.getDealerInfo();
      if (dealer) {
        setFormData(prev => ({
          ...prev,
          dealerName: dealer.email,
          contactPhone: dealer.phone || '',
          contactEmail: dealer.email || ''
        }));
      }
    }
  }, [navigate]);

  // Update available models when brand changes
  useEffect(() => {
    if (formData.brand === 'Other') {
      setShowCustomBrand(true);
      setAvailableModels([]);
      setFormData(prev => ({ ...prev, model: '' }));
    } else if (formData.brand && carCompanies[formData.brand]) {
      setShowCustomBrand(false);
      setCustomBrand('');
      setAvailableModels(carCompanies[formData.brand]);
      setFormData(prev => ({ ...prev, model: '' })); // Reset model selection
    } else {
      setShowCustomBrand(false);
      setAvailableModels([]);
    }
  }, [formData.brand]);

  // Handle custom model input visibility
  useEffect(() => {
    if (formData.model === 'Other') {
      setShowCustomModel(true);
    } else {
      setShowCustomModel(false);
      setCustomModel('');
    }
  }, [formData.model]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (selectedImages.length + files.length > 10) {
      setError('You can upload a maximum of 10 images');
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    // Create image previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setError('');
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      processFiles(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    // Validate brand
    const finalBrand = formData.brand === 'Other' ? customBrand.trim() : formData.brand;
    const finalModel = formData.model === 'Other' ? customModel.trim() : formData.model;

    if (!finalBrand || !finalModel || !formData.bodyType || !formData.price || !formData.city || !formData.state) {
      setError('Please fill in all required fields (Brand, Model, Car Type, Price, Location)');
      return;
    }

    if (selectedImages.length === 0) {
      setError('Please upload at least one car image');
      return;
    }

    setLoading(true);

    try {
      // Create FormData object
      const data = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          // Use custom brand/model if "Other" is selected
          if (key === 'brand' && formData.brand === 'Other') {
            data.append('brand', finalBrand);
          } else if (key === 'model' && formData.model === 'Other') {
            data.append('model', finalModel);
          } else {
            data.append(key, formData[key]);
          }
        }
      });

      // Append images
      selectedImages.forEach(image => {
        data.append('images', image);
      });

      // Submit to API
      const response = await carAPI.addCar(data);

      setSuccess('Car listing created successfully!');
      
      // Redirect to dealer dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dealer-dashboard');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to create car listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <button
            onClick={() => navigate('/dealer-dashboard')}
            className="group flex items-center gap-2 text-gray-400 hover:text-yellow-400 mb-6 transition-all duration-300"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-2xl">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                List Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Premium Car</span>
              </h1>
            </div>
          </div>
          <p className="text-gray-400 text-lg">Create a professional listing to reach thousands of potential buyers</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleSubmit}
          className="space-y-6 lg:space-y-8"
        >
          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 rounded-2xl text-red-300 flex items-start gap-3"
              >
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 rounded-2xl text-green-300 flex items-start gap-3"
              >
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Car Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 lg:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-400/10 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Car Details</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {/* Dealer Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Dealer Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="dealerName"
                  value={formData.dealerName}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('dealerName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    focusedField === 'dealerName' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                  required
                  disabled
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Car Brand <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('brand')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white appearance-none focus:outline-none transition-all duration-300 ${
                      focusedField === 'brand' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">Select Brand</option>
                    {Object.keys(carCompanies).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                    <option value="Other">Other (Custom Brand)</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showCustomBrand && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    type="text"
                    placeholder="Enter custom brand name"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    onFocus={() => setFocusedField('customBrand')}
                    onBlur={() => setFocusedField(null)}
                    className={`mt-3 w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white focus:outline-none transition-all duration-300 ${
                      focusedField === 'customBrand' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    required
                  />
                )}
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Car Model <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('model')}
                    onBlur={() => setFocusedField(null)}
                    disabled={!formData.brand}
                    className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white appearance-none focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      focusedField === 'model' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                    <option value="Other">Other (Custom Model)</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showCustomModel && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    type="text"
                    placeholder="Enter custom model name"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    onFocus={() => setFocusedField('customModel')}
                    onBlur={() => setFocusedField(null)}
                    className={`mt-3 w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white focus:outline-none transition-all duration-300 ${
                      focusedField === 'customModel' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    required
                  />
                )}
              </div>

              {/* Car Type / Body Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Car Type / Body Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="bodyType"
                    value={formData.bodyType}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('bodyType')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white appearance-none focus:outline-none transition-all duration-300 ${
                      focusedField === 'bodyType' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">Select Car Type</option>
                    {bodyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price (₹) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('price')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="850000"
                    className={`w-full pl-10 pr-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                      focusedField === 'price' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Manufacturing Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('year')}
                  onBlur={() => setFocusedField(null)}
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    focusedField === 'year' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Exterior Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('color')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., Pearl White, Metallic Black"
                  className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    focusedField === 'color' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Location Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 lg:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-400/10 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Location Details</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  State <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('state')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white appearance-none focus:outline-none transition-all duration-300 ${
                      focusedField === 'state' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  City <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white appearance-none focus:outline-none transition-all duration-300 ${
                      focusedField === 'city' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">Select City</option>
                    {indianCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Specifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 lg:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-400/10 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Technical Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {/* Engine */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Engine Type
                </label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('engine')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., 1.5L Turbo Petrol"
                  className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    focusedField === 'engine' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Mileage
                </label>
                <input
                  type="text"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('mileage')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., 18 kmpl, 25 km/charge"
                  className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    focusedField === 'mileage' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Transmission Type
                </label>
                <div className="relative">
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('transmission')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white appearance-none focus:outline-none transition-all duration-300 ${
                      focusedField === 'transmission' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <option value="">Select Transmission</option>
                    {transmissionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Fuel Type
                </label>
                <div className="relative">
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('fuelType')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white appearance-none focus:outline-none transition-all duration-300 ${
                      focusedField === 'fuelType' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Seating Capacity */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Seating Capacity
                </label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('seatingCapacity')}
                  onBlur={() => setFocusedField(null)}
                  min="2"
                  max="10"
                  placeholder="e.g., 5, 7"
                  className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    focusedField === 'seatingCapacity' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 lg:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-400/10 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('contactPhone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., +91 9876543210"
                  className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    focusedField === 'contactPhone' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('contactEmail')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., dealer@example.com"
                  className={`w-full px-5 py-3.5 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    focusedField === 'contactEmail' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 lg:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-400/10 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Additional Details</h2>
            </div>
            
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                rows="5"
                placeholder="Describe the car's condition, features, service history, unique selling points, or any other relevant details that would help buyers make an informed decision..."
                className={`w-full px-5 py-4 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none ${
                  focusedField === 'description' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-700 hover:border-gray-600'
                }`}
                maxLength="1000"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-400">
                  Add detailed information to attract potential buyers
                </p>
                <p className={`text-sm font-medium ${formData.description.length >= 1000 ? 'text-red-400' : 'text-gray-400'}`}>
                  {formData.description.length}/1000
                </p>
              </div>
            </div>
          </motion.div>

          {/* Car Images Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 lg:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-400/10 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Car Photos <span className="text-red-400">*</span></h2>
                <p className="text-sm text-gray-400 mt-0.5">Upload high-quality images to attract buyers</p>
               </div>
            </div>
            
            {/* Drag and Drop Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                dragActive 
                  ? 'border-yellow-400 bg-yellow-400/10 scale-[1.02]' 
                  : 'border-gray-700 hover:border-yellow-400/50 bg-gray-800/30 hover:bg-gray-800/50'
              }`}
            >
              <div className="px-8 py-12 text-center">
                <motion.div
                  animate={{ 
                    y: dragActive ? -10 : 0,
                    scale: dragActive ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                    dragActive ? 'bg-yellow-400/20' : 'bg-gray-700/50'
                  }`}>
                    <svg 
                      className={`w-16 h-16 transition-colors duration-300 ${
                        dragActive ? 'text-yellow-400' : 'text-gray-400'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                    dragActive ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {dragActive ? 'Drop images here' : 'Upload Car Images'}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 max-w-md">
                    Drag and drop your images here, or click to browse
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                    <span className="px-4 py-2 bg-gray-700/50 rounded-full text-gray-300">
                      Maximum 10 images
                    </span>
                    <span className="px-4 py-2 bg-gray-700/50 rounded-full text-gray-300">
                      JPG, PNG, WEBP
                    </span>
                    <span className="px-4 py-2 bg-gray-700/50 rounded-full text-gray-300">
                      Up to 5MB each
                    </span>
                  </div>
                </motion.div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Image Previews */}
            <AnimatePresence mode="popLayout">
              {imagePreviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-gray-300">
                      Uploaded Images ({imagePreviews.length}/10)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImages([]);
                        setImagePreviews([]);
                      }}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group aspect-square"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl border-2 border-gray-700 group-hover:border-yellow-400 transition-all duration-300"
                        />
                        
                        {/* Image overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 transform hover:scale-110"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Image number badge */}
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                          {index + 1}
                        </div>
                        
                        {/* Primary badge */}
                        {index === 0 && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg">
                            Primary
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    The first image will be used as the primary display image
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              type="button"
              onClick={() => navigate('/dealer-dashboard')}
              className="flex-1 group relative px-8 py-4 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-600 hover:bg-gray-800"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-semibold text-lg">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </span>
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Listing...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Car Listing
                </span>
              )}
              
              {/* Animated background effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700"></div>
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddCarListing;
