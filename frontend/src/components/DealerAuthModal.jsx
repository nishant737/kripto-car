import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dealerAPI, authUtils } from '../utils/api';

const DealerAuthModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await dealerAPI.login({
        email: formData.email,
        password: formData.password,
      });

      authUtils.setToken(response.token);
      authUtils.setDealerInfo(response.dealer);

      handleClose();
      if (response.dealer.role === 'superadmin') {
        window.location.href = '/superadmin/dashboard';
      } else {
        window.location.href = '/dealer-dashboard';
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: ''
    });
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-yellow-400/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="px-6 pt-6 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Dealer <span className="text-yellow-400">Login</span>
              </h2>
              <p className="text-gray-400 text-sm">
                Access your dealership dashboard
              </p>
            </div>

            <div className="px-6 pb-6">
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/50 rounded-lg p-3"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    placeholder="dealer@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg ${
                    loading
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-yellow-500 hover:shadow-yellow-400/50'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    'Login to Dashboard'
                  )}
                </motion.button>
              </motion.form>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-gray-800">
              <p className="text-center text-xs text-gray-400 mb-2">
                <svg className="w-4 h-4 inline-block mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                New dealers must be added by the Super Admin
              </p>
              <p className="text-center text-xs text-gray-500">
                For customer bookings, please use the main booking form
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default DealerAuthModal;
