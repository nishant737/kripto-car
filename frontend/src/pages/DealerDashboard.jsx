import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI, authUtils } from '../utils/api';

const DealerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      window.location.href = '/';
      return;
    }

    // Check user role and redirect accordingly
    const storedDealer = authUtils.getDealerInfo();
    if (storedDealer) {
      // If super admin, redirect to super admin dashboard
      if (storedDealer.role === 'superadmin') {
        navigate('/superadmin/dashboard');
        return;
      }
      
      // If dealer, redirect directly to bookings
      if (storedDealer.role === 'dealer') {
        navigate('/dealer/my-bookings');
        return;
      }
    }

    // Fetch fresh dealer data from API to verify token
    const fetchDealerProfile = async () => {
      try {
        const response = await dealerAPI.getProfile();
        
        // Redirect based on role
        if (response.dealer.role === 'superadmin') {
          navigate('/superadmin/dashboard');
        } else if (response.dealer.role === 'dealer') {
          navigate('/dealer/my-bookings');
        }
      } catch (err) {
        setError('Session expired. Please login again.');
        authUtils.logout();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchDealerProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-white mt-4">Redirecting to dashboard...</p>
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
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
        <p className="text-white mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default DealerDashboard;
