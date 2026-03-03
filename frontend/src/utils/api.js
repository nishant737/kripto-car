// API Configuration and Utilities

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if it exists
  const token = localStorage.getItem('dealerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Dealer Authentication API
export const dealerAPI = {
  // Register a new dealer
  register: async (dealerData) => {
    return apiRequest('/api/dealer/register', {
      method: 'POST',
      body: JSON.stringify(dealerData),
    });
  },

  // Login dealer
  login: async (credentials) => {
    return apiRequest('/api/dealer/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get dealer profile (protected)
  getProfile: async () => {
    return apiRequest('/api/dealer/profile', {
      method: 'GET',
    });
  },
};

// Service API
export const serviceAPI = {
  // Create a new service
  createService: async (serviceData) => {
    return apiRequest('/api/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  // Get all services for the authenticated dealer
  getMyServices: async () => {
    return apiRequest('/api/services/my-services', {
      method: 'GET',
    });
  },

  // Get a single service by ID
  getServiceById: async (id) => {
    return apiRequest(`/api/services/${id}`, {
      method: 'GET',
    });
  },

  // Update a service
  updateService: async (id, serviceData) => {
    return apiRequest(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  },

  // Delete a service
  deleteService: async (id) => {
    return apiRequest(`/api/services/${id}`, {
      method: 'DELETE',
    });
  },

  // Browse all services (public)
  browseServices: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/api/services/browse?${queryParams}` : '/api/services/browse';
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Upload service images
  uploadServiceImages: async (formData) => {
    const token = localStorage.getItem('dealerToken');
    const url = `${API_URL}/api/services/upload-images`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Don't set Content-Type, browser will set it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload images');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a service image
  deleteServiceImage: async (imagePath) => {
    return apiRequest('/api/services/delete-image', {
      method: 'DELETE',
      body: JSON.stringify({ imagePath }),
    });
  },
};

// Booking API
export const bookingAPI = {
  // Create a new booking (public)
  createBooking: async (bookingData) => {
    return apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get all bookings for the authenticated dealer
  getDealerBookings: async () => {
    return apiRequest('/api/bookings/dealer', {
      method: 'GET',
    });
  },

  // Get a single booking by ID
  getBookingById: async (id) => {
    return apiRequest(`/api/bookings/${id}`, {
      method: 'GET',
    });
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    return apiRequest(`/api/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Delete a booking
  deleteBooking: async (id) => {
    return apiRequest(`/api/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Super Admin API
export const superAdminAPI = {
  // Get all dealerships
  getAllDealerships: async () => {
    return apiRequest('/api/superadmin/dealerships', {
      method: 'GET',
    });
  },

  // Add a new dealership
  addDealership: async (dealerData) => {
    return apiRequest('/api/superadmin/dealerships', {
      method: 'POST',
      body: JSON.stringify(dealerData),
    });
  },

  // Update dealership
  updateDealership: async (id, dealerData) => {
    return apiRequest(`/api/superadmin/dealerships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dealerData),
    });
  },

  // Delete dealership
  deleteDealership: async (id) => {
    return apiRequest(`/api/superadmin/dealerships/${id}`, {
      method: 'DELETE',
    });
  },

  // Get services for a specific dealer
  getDealerServices: async (dealerId) => {
    return apiRequest(`/api/superadmin/dealerships/${dealerId}/services`, {
      method: 'GET',
    });
  },

  // Get all services
  getAllServices: async () => {
    return apiRequest('/api/superadmin/services', {
      method: 'GET',
    });
  },

  // Get all bookings
  getAllBookings: async () => {
    return apiRequest('/api/superadmin/bookings', {
      method: 'GET',
    });
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    return apiRequest(`/api/superadmin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get platform statistics
  getStatistics: async () => {
    return apiRequest('/api/superadmin/statistics', {
      method: 'GET',
    });
  },
};

// Auth utility functions
export const authUtils = {
  // Store token in localStorage
  setToken: (token) => {
    localStorage.setItem('dealerToken', token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('dealerToken');
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('dealerToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('dealerToken');
  },

  // Store dealer info
  setDealerInfo: (dealer) => {
    localStorage.setItem('dealerInfo', JSON.stringify(dealer));
  },

  // Get dealer info
  getDealerInfo: () => {
    const info = localStorage.getItem('dealerInfo');
    return info ? JSON.parse(info) : null;
  },

  // Remove dealer info
  removeDealerInfo: () => {
    localStorage.removeItem('dealerInfo');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('dealerToken');
    localStorage.removeItem('dealerInfo');
  },
};

export default apiRequest;
