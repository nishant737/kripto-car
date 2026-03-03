import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceAPI, authUtils } from '../utils/api';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { carCompanies } from '../data/carData';

// Service type options for each category
const serviceTypeOptions = {
  'New Cars': [
    'Hatchback',
    'Sedan',
    'SUV',
    'EV',
    'Luxury Cars',
    'Booking & Delivery Support'
  ],
  'Used Cars': [
    'Certified Pre-Owned Cars',
    'Budget Cars',
    'Premium Used Cars',
    'Exchange Available',
    'RC & Documentation Support'
  ],
  'Tyres & Wheels': [
    'Tyre Replacement',
    'Wheel Balancing',
    'Tyre Rotation',
    'Alloy Wheels',
    'Puncture Repair',
    'Custom Wheels'
  ],
  'Wheel Alignment & Suspension': [
    'Wheel Alignment',
    'Suspension Repair',
    'Shock Absorber Replacement',
    'Spring Replacement',
    'Steering System Repair'
  ],
  'Car Wash & Cleaning': [
    'Exterior Wash',
    'Interior Cleaning',
    'Steam Wash',
    'Underbody Wash',
    'Engine Bay Cleaning',
    'Full Service Wash'
  ],
  'Car Detailing Services': [
    'Paint Protection',
    'Ceramic Coating',
    'Interior Detailing',
    'Leather Treatment',
    'Headlight Restoration',
    'Premium Detailing Package'
  ],
  'Denting & Painting': [
    'Dent Removal',
    'Full Body Painting',
    'Scratch Repair',
    'Bumper Repair',
    'Panel Replacement',
    'Custom Paint Jobs'
  ],
  'Emission Test & Legal Services': [
    'PUC Certificate',
    'Emission Testing',
    'Vehicle Registration',
    'Insurance Documentation',
    'RC Transfer',
    'Fitness Certificate'
  ],
  'General Service & Maintenance': [
    'Oil Change',
    'Brake Service',
    'Battery Replacement',
    'AC Service',
    'Engine Diagnostics',
    'Periodic Maintenance'
  ],
  'Accessories & Customization': [
    'Audio System Installation',
    'Seat Covers',
    'Body Kits',
    'Performance Upgrades',
    'Interior Accessories',
    'Exterior Styling'
  ]
};

// Indian states list
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
];

const ServiceRegistration = () => {
  const { category, serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Decode the category from URL
  const serviceCategory = category ? decodeURIComponent(category) : '';

  // Form state with multi-select arrays
  const [formData, setFormData] = useState({
    businessName: '',
    serviceCategory: serviceCategory,
    carCompanies: [],
    carModels: [],
    serviceTypes: [],
    state: '',
    city: '',
    openingTime: '09:00',
    closingTime: '18:00',
    contactPhone: '',
    price: '',
    description: '',
    images: []
  });

  // State for image upload
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Get available car models based on selected companies
  const getAvailableModels = () => {
    if (formData.carCompanies.length === 0) {
      return [];
    }
    const models = [];
    formData.carCompanies.forEach(company => {
      if (carCompanies[company]) {
        models.push(...carCompanies[company]);
      }
    });
    return [...new Set(models)].sort();
  };

  // Handle image selection
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Please select only image files (JPEG, PNG, GIF, WEBP)');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validate file sizes (5MB max per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      setError('Each image must be less than 5MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check total number of images (max 10)
    if (imagePreviews.length + files.length > 10) {
      setError('You can upload a maximum of 10 images');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setUploadingImages(true);

      // Upload images to server
      const formDataToSend = new FormData();
      files.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await serviceAPI.uploadServiceImages(formDataToSend);
      
      if (response.success) {
        // Add uploaded image paths to form data
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...response.images]
        }));

        // Create preview URLs for display
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
        setImageFiles(prev => [...prev, ...files]);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload images');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = async (index) => {
    try {
      const imageToRemove = formData.images[index];
      
      // Delete image from server
      await serviceAPI.deleteServiceImage(imageToRemove);

      // Remove from previews
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(newPreviews);

      // Remove from files
      const newFiles = imageFiles.filter((_, i) => i !== index);
      setImageFiles(newFiles);

      // Remove from form data
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));

      // Revoke the object URL to free memory
      URL.revokeObjectURL(imagePreviews[index]);
    } catch (err) {
      setError(err.message || 'Failed to delete image');
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      navigate('/');
      return;
    }

    // If editing, fetch service data
    if (serviceId) {
      setIsEditMode(true);
      fetchServiceData();
    } else if (!serviceTypeOptions[serviceCategory]) {
      // Validate if the category is valid only for new services
      navigate('/dealer-dashboard');
    }
  }, [navigate, serviceCategory, serviceId]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getServiceById(serviceId);
      const service = response.service;
      
      // Parse serviceType back into arrays
      const serviceTypeValues = service.serviceType ? service.serviceType.split(', ').map(s => s.trim()) : [];
      const companies = serviceTypeValues.filter(v => Object.keys(carCompanies).includes(v));
      const models = serviceTypeValues.filter(v => !Object.keys(carCompanies).includes(v) && !serviceTypeOptions[service.serviceCategory]?.includes(v));
      const types = serviceTypeValues.filter(v => serviceTypeOptions[service.serviceCategory]?.includes(v));

      setFormData({
        businessName: service.businessName || '',
        serviceCategory: service.serviceCategory || '',
        carCompanies: companies,
        carModels: models,
        serviceTypes: types,
        state: service.state || '',
        city: service.city || '',
        openingTime: service.openingTime || '09:00',
        closingTime: service.closingTime || '18:00',
        contactPhone: service.contactPhone || '',
        price: service.price || '',
        description: service.description || '',
        images: service.images || []
      });

      // Set image previews for existing images
      if (service.images && service.images.length > 0) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
        const previews = service.images.map(img => `${apiBaseUrl}${img}`);
        setImagePreviews(previews);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch service data');
      setTimeout(() => navigate('/dealer/my-services'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (name, values) => {
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));

    // Clear car models if companies change
    if (name === 'carCompanies') {
      setFormData(prev => ({
        ...prev,
        carModels: []
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        businessName: formData.businessName,
        serviceCategory: formData.serviceCategory,
        serviceType: [...formData.serviceTypes, ...formData.carCompanies, ...formData.carModels].join(', '),
        state: formData.state,
        city: formData.city,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        contactPhone: formData.contactPhone,
        price: formData.price,
        description: formData.description,
        images: JSON.stringify(formData.images)
      };

      if (isEditMode) {
        await serviceAPI.updateService(serviceId, submitData);
        setSuccess('Service updated successfully!');
      } else {
        await serviceAPI.createService(submitData);
        setSuccess('Service registered successfully!');
      }
      
      // Redirect to my services after 2 seconds
      setTimeout(() => {
        navigate('/dealer/my-services');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to register service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dealer-dashboard');
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
              ← Back to Dashboard
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center border border-yellow-400/30">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {isEditMode ? 'Edit' : 'Service'} <span className="text-yellow-400">{isEditMode ? 'Service' : 'Configuration'}</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {isEditMode ? 'Update your service details' : `Configure your ${serviceCategory} service details`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-xl text-green-400 flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </motion.div>
        )}

        {/* Error Message */}
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Configuration */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Dealer Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Dealer Information</h2>
                    <p className="text-sm text-gray-400">Your business details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-semibold text-gray-300 mb-2">
                      Business Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceCategory" className="block text-sm font-semibold text-gray-300 mb-2">
                      Service Category <span className="text-red-400">*</span>
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-800/30 border-2 border-gray-700 rounded-xl text-gray-300 flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">⚙️</span>
                      </div>
                      <span className="font-medium">{formData.serviceCategory}</span>
                      <span className="ml-auto px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-md">Selected</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Service Configuration Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Service Configuration</h2>
                    <p className="text-sm text-gray-400">Select your service offerings</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Car Companies Multi-Select */}
                  <MultiSelectDropdown
                    label="Car Companies / Brands"
                    values={formData.carCompanies}
                    options={Object.keys(carCompanies)}
                    onChange={(values) => handleMultiSelectChange('carCompanies', values)}
                    placeholder="Select car brands you service"
                    icon="🚗"
                    required={true}
                    allowCustom={true}
                  />

                  {/* Car Models Multi-Select */}
                  <MultiSelectDropdown
                    label="Car Models"
                    values={formData.carModels}
                    options={getAvailableModels()}
                    onChange={(values) => handleMultiSelectChange('carModels', values)}
                    placeholder={formData.carCompanies.length > 0 ? "Select car models" : "First select car brands"}
                    icon="🏎️"
                    allowCustom={true}
                  />

                  {/* Service Types Multi-Select */}
                  <MultiSelectDropdown
                    label="Service Types"
                    values={formData.serviceTypes}
                    options={serviceTypeOptions[serviceCategory] || []}
                    onChange={(values) => handleMultiSelectChange('serviceTypes', values)}
                    placeholder="Select service types you offer"
                    icon="🔧"
                    required={true}
                  />

                  {/* Image Upload Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Service Images
                      <span className="text-gray-500 font-normal ml-2">(Optional, max 10 images)</span>
                    </label>
                    
                    {/* Upload Button */}
                    <div className="mb-4">
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500/50 hover:border-blue-500 rounded-xl text-blue-400 font-semibold cursor-pointer transition-all duration-200"
                      >
                        {uploadingImages ? (
                          <>
                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Upload Images
                          </>
                        )}
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        disabled={uploadingImages || imagePreviews.length >= 10}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Upload photos of your work, workshop, services, etc. (JPEG, PNG, GIF, WEBP - Max 5MB each)
                      </p>
                    </div>

                    {/* Image Previews Grid */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors duration-200"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Remove button overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors duration-200"
                                title="Remove image"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            {/* Image number badge */}
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                              {index + 1}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {imagePreviews.length === 0 && (
                      <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
                        <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm">No images uploaded yet</p>
                        <p className="text-gray-600 text-xs mt-1">Add images to showcase your services</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Location & Availability Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Location & Availability</h2>
                    <p className="text-sm text-gray-400">Where and when you operate</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* State and City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-sm font-semibold text-gray-300 mb-2">
                        State <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                      >
                        <option value="">Select state</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-300 mb-2">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                        placeholder="Enter city name"
                      />
                    </div>
                  </div>

                  {/* Opening and Closing Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="openingTime" className="block text-sm font-semibold text-gray-300 mb-2">
                        Opening Time <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="time"
                        id="openingTime"
                        name="openingTime"
                        value={formData.openingTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="closingTime" className="block text-sm font-semibold text-gray-300 mb-2">
                        Closing Time <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="time"
                        id="closingTime"
                        name="closingTime"
                        value={formData.closingTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                      />
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-300 mb-2">
                      Contact Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                      placeholder="Enter 10-digit phone number"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                  </div>

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-300 mb-2">
                      Price Range
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                      placeholder="e.g., ₹500 - ₹5000 or Call for pricing"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional: Specify your pricing or leave blank</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Additional Info & Actions */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Description Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Description</h2>
                    <p className="text-xs text-gray-400">Optional details</p>
                  </div>
                </div>

                <div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    maxLength="500"
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors duration-200 resize-none"
                    placeholder="Describe your service offerings, specialties, or any additional information..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-yellow-400/30 rounded-2xl p-6 shadow-xl"
              >
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-400/50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        {isEditMode ? 'Updating...' : 'Publishing...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isEditMode ? 'Update Service' : 'Publish Service'}
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 border border-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-2xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h3 className="text-sm font-bold mb-2 text-yellow-400">Tips</h3>
                    <ul className="text-xs text-gray-300 space-y-1.5">
                      <li>• Select multiple brands and models to reach more customers</li>
                      <li>• Accurate timing helps customers plan visits</li>
                      <li>• Add a detailed description to stand out</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRegistration;
