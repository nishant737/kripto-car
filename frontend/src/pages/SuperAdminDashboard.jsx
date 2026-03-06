import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { superAdminAPI, authUtils } from '../utils/api';
import ImageCarousel from '../components/ImageCarousel';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  
  // Data states
  const [statistics, setStatistics] = useState(null);
  const [dealerships, setDealerships] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // Modal states
  const [showAddDealerModal, setShowAddDealerModal] = useState(false);
  const [showEditDealerModal, setShowEditDealerModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerServices, setDealerServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [dealerFormData, setDealerFormData] = useState({ 
    dealershipName: '',
    email: '', 
    phone: '', 
    password: '',
    state: '',
    city: '',
    assignedServices: [] 
  });
  
  // Filters
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Check authentication on mount
  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      window.location.href = '/';
      return;
    }

    const dealerInfo = authUtils.getDealerInfo();
    if (!dealerInfo || dealerInfo.role !== 'superadmin') {
      window.location.href = '/';
      return;
    }

    setAdminInfo(dealerInfo);
    loadStatistics();
  }, []);

  // Load data based on active section
  useEffect(() => {
    if (activeSection === 'dealerships') {
      loadDealerships();
    } else if (activeSection === 'bookings') {
      loadBookings();
    } else if (activeSection === 'dashboard') {
      loadStatistics();
    }
  }, [activeSection]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await superAdminAPI.getStatistics();
      setStatistics(response.statistics);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadDealerships = async () => {
    try {
      setLoading(true);
      const response = await superAdminAPI.getAllDealerships();
      setDealerships(response.dealerships);
    } catch (err) {
      setError(err.message || 'Failed to load dealerships');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await superAdminAPI.getAllBookings();
      setBookings(response.bookings);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDealership = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await superAdminAPI.addDealership(dealerFormData);
      
      setShowAddDealerModal(false);
      
      // Navigate to service category selection for the newly created dealer
      if (response.dealer && response.dealer.id) {
        navigate(`/superadmin/dealer/${response.dealer.id}/services/select-category`);
      }
    } catch (err) {
      setError(err.message || 'Failed to add dealership');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDealership = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await superAdminAPI.updateDealership(selectedDealer._id, dealerFormData);
      setSuccessMessage('Dealership updated successfully!');
      setShowEditDealerModal(false);
      setSelectedDealer(null);
      setDealerFormData({ dealershipName: '', email: '', phone: '', password: '', state: '', city: '', assignedServices: [] });
      loadDealerships();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update dealership');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDealership = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dealership? This will also delete all associated services and bookings.')) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await superAdminAPI.deleteDealership(id);
      setSuccessMessage('Dealership deleted successfully!');
      loadDealerships();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete dealership');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    // Super Admin cannot update booking status - read-only access
    setError('Super Admin cannot modify booking status. Only dealers can update bookings.');
    setTimeout(() => setError(''), 3000);
  };

  const handleLogout = () => {
    authUtils.logout();
    window.location.href = '/';
  };

  const openEditModal = (dealer) => {
    setSelectedDealer(dealer);
    setDealerFormData({ 
      dealershipName: dealer.dealershipName || '',
      email: dealer.email, 
      phone: dealer.phone, 
      password: '', 
      state: dealer.state || '',
      city: dealer.city || '',
      assignedServices: dealer.assignedServices || [] 
    });
    setShowEditDealerModal(true);
  };

  const loadDealerServices = async (dealer) => {
    try {
      setLoadingServices(true);
      setSelectedDealer(dealer);
      setShowServicesModal(true);
      const response = await superAdminAPI.getDealerServices(dealer._id);
      setDealerServices(response.services || []);
    } catch (err) {
      setError(err.message || 'Failed to load dealer services');
      setDealerServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = bookingStatusFilter === 'all' || booking.status === bookingStatusFilter;
    const matchesSearch = !searchQuery || 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerPhone.includes(searchQuery) ||
      booking.dealerServiceId?.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter dealerships
  const filteredDealerships = dealerships.filter(dealer => {
    return !searchQuery || 
      dealer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.phone.includes(searchQuery);
  });

  // Sidebar menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'dealerships', label: 'Dealerships', icon: '🏢' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
  ];

  return (
    <div className="flex flex-row-reverse h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? '80px' : '280px' }}
        className="bg-gradient-to-b from-gray-900 to-black border-l border-yellow-400/20 flex flex-col relative z-20"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-yellow-400/20">
          <motion.div
            initial={false}
            animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
            className="flex items-center gap-3"
          >
            {!sidebarCollapsed && (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-yellow-400/50">
                  K
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Kripto Car
                  </h1>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </>
            )}
          </motion.div>
          {sidebarCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-black font-bold text-xl mx-auto shadow-lg shadow-yellow-400/50">
              K
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/50 text-yellow-400 shadow-lg shadow-yellow-400/10'
                  : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="font-semibold text-sm">{item.label}</span>
              )}
              {!sidebarCollapsed && activeSection === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 bg-yellow-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-yellow-400/20">
          {!sidebarCollapsed && adminInfo && (
            <div className="mb-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">{adminInfo.email}</p>
            </div>
          )}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-xl text-red-400 hover:text-red-300 transition-all duration-300 shadow-lg shadow-red-600/10"
          >
            <span className="text-xl">🚪</span>
            {!sidebarCollapsed && <span className="font-semibold text-sm">Logout</span>}
          </motion.button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -left-3 top-20 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xs hover:bg-yellow-500 transition-colors shadow-lg"
        >
          {sidebarCollapsed ? '‹' : '›'}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-black/50 backdrop-blur-xl border-b border-yellow-400/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {activeSection === 'dashboard' && 'Dashboard Overview'}
                {activeSection === 'dealerships' && 'Dealership Management'}
                {activeSection === 'bookings' && 'Booking Management'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {activeSection === 'dashboard' && 'Welcome back! Here\'s your platform overview'}
                {activeSection === 'dealerships' && 'Manage all dealerships and their information'}
                {activeSection === 'bookings' && 'Track and manage all platform bookings'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Current Time</p>
                <p className="text-sm font-semibold">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3"
            >
              <span className="text-2xl">✓</span>
              <span className="font-semibold">{successMessage}</span>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3"
            >
              <span className="text-2xl">⚠</span>
              <div className="flex-1">
                <span className="font-semibold">{error}</span>
              </div>
              <button onClick={() => setError('')} className="text-white hover:text-gray-200 font-bold text-xl">×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ) : statistics ? (
                  <>
                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard
                        title="Total Dealerships"
                        value={statistics.totalDealerships}
                        icon="🏢"
                        color="blue"
                        delay={0}
                      />
                      <StatCard
                        title="Total Bookings"
                        value={statistics.totalBookings}
                        icon="📅"
                        color="purple"
                        delay={0.1}
                      />
                      <StatCard
                        title="Active Services"
                        value={statistics.activeServices}
                        icon="✅"
                        color="green"
                        delay={0.2}
                      />
                      <StatCard
                        title="Total Services"
                        value={statistics.totalServices}
                        icon="🔧"
                        color="yellow"
                        delay={0.3}
                      />
                    </div>

                    {/* Booking Status Cards */}
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-yellow-400">📊</span>
                        Booking Status Overview
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatusCard
                          title="Pending"
                          value={statistics.bookingsByStatus.pending}
                          color="yellow"
                          icon="⏳"
                          delay={0.4}
                        />
                        <StatusCard
                          title="Confirmed"
                          value={statistics.bookingsByStatus.confirmed}
                          color="blue"
                          icon="✓"
                          delay={0.5}
                        />
                        <StatusCard
                          title="Completed"
                          value={statistics.bookingsByStatus.completed}
                          color="green"
                          icon="✔"
                          delay={0.6}
                        />
                        <StatusCard
                          title="Cancelled"
                          value={statistics.bookingsByStatus.cancelled}
                          color="red"
                          icon="✗"
                          delay={0.7}
                        />
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-yellow-400">⚡</span>
                        Recent Activity
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ActivityCard
                          title="Recent Dealerships"
                          subtitle="Last 30 Days"
                          value={statistics.recentDealerships}
                          icon="🆕"
                          color="blue"
                        />
                        <ActivityCard
                          title="Recent Bookings"
                          subtitle="Last 30 Days"
                          value={statistics.recentBookings}
                          icon="📈"
                          color="purple"
                        />
                      </div>
                    </div>
                  </>
                ) : null}
              </motion.div>
            )}

            {/* Dealerships Section */}
            {activeSection === 'dealerships' && (
              <motion.div
                key="dealerships"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                    <input
                      type="text"
                      placeholder="Search by email or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    />
                  </div>
                  <motion.button
                    onClick={() => setShowAddDealerModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-lg shadow-yellow-400/20 flex items-center gap-2"
                  >
                    <span className="text-xl">+</span>
                    <span>Add Dealership</span>
                  </motion.button>
                </div>

                {/* Dealerships Table */}
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-900/80">
                          <tr className="border-b border-gray-800">
                            <th className="text-left p-4 font-semibold text-gray-300 text-sm">Dealership</th>
                            <th className="text-left p-4 font-semibold text-gray-300 text-sm">Phone</th>
                            <th className="text-left p-4 font-semibold text-gray-300 text-sm">Joined Date</th>
                            <th className="text-right p-4 font-semibold text-gray-300 text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDealerships.map((dealer, index) => (
                            <motion.tr
                              key={dealer._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold shadow-lg shadow-yellow-400/30">
                                    {dealer.email.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium">{dealer.email}</span>
                                </div>
                              </td>
                              <td className="p-4 text-gray-300">
                                <span className="flex items-center gap-2">
                                  📞 {dealer.phone}
                                </span>
                              </td>
                              <td className="p-4 text-gray-300">
                                {new Date(dealer.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="p-4">
                                <div className="flex justify-end gap-2">
                                  <motion.button
                                    onClick={() => navigate(`/superadmin/dealer/${dealer._id}/services/select-category`)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/50 rounded-lg text-yellow-400 text-sm font-semibold transition-all shadow-md shadow-yellow-600/10"
                                  >
                                    Add Service
                                  </motion.button>
                                  <motion.button
                                    onClick={() => loadDealerServices(dealer)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 rounded-lg text-purple-400 text-sm font-semibold transition-all shadow-md shadow-purple-600/10"
                                  >
                                    View Services
                                  </motion.button>
                                  <motion.button
                                    onClick={() => openEditModal(dealer)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-blue-400 text-sm font-semibold transition-all shadow-md shadow-blue-600/10"
                                  >
                                    Edit
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleDeleteDealership(dealer._id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 text-sm font-semibold transition-all shadow-md shadow-red-600/10"
                                  >
                                    Delete
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredDealerships.length === 0 && (
                      <div className="text-center py-12 text-gray-400">
                        <p className="text-4xl mb-2">🔍</p>
                        <p className="text-lg font-semibold">No dealerships found</p>
                        <p className="text-sm">Try adjusting your search</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Bookings Section */}
            {activeSection === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Page Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">All Bookings</h2>
                    <p className="text-gray-400 text-sm">View bookings from all dealerships (Read-Only)</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                    <input
                      type="text"
                      placeholder="Search bookings by customer, phone, or dealer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    />
                  </div>
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="px-6 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Bookings Table */}
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-gray-900/30 rounded-2xl border border-gray-800">
                    <p className="text-4xl mb-2">📅</p>
                    <p className="text-lg font-semibold">No bookings found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border-b-2 border-yellow-400/30">
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Booking ID
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Dealer Name
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Customer Name
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Phone Number
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Address
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Car Company
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Car Model
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Service Requested
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Booking Date
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {filteredBookings.map((booking, index) => (
                            <motion.tr
                              key={booking._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.02 }}
                              className="hover:bg-gray-800/30 transition-colors duration-200"
                            >
                              {/* Booking ID */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs">📋</span>
                                  </div>
                                  <span className="text-xs font-mono text-gray-300">
                                    {booking._id.slice(-8).toUpperCase()}
                                  </span>
                                </div>
                              </td>

                              {/* Dealer Name */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs">🏢</span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold text-white block">
                                      {booking.dealerServiceId?.businessName || 'N/A'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {booking.dealerServiceId?.city}, {booking.dealerServiceId?.state}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Customer Name */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs">👤</span>
                                  </div>
                                  <span className="text-sm font-semibold text-white">
                                    {booking.customerName}
                                  </span>
                                </div>
                              </td>

                              {/* Phone Number */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <span className="text-sm text-gray-300">
                                    {booking.customerPhone}
                                  </span>
                                </div>
                              </td>

                              {/* Address */}
                              <td className="px-4 py-4">
                                <div className="flex items-start gap-2 max-w-xs">
                                  <svg className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="text-sm text-gray-300 line-clamp-2">
                                    {booking.customerAddress}
                                  </span>
                                </div>
                              </td>

                              {/* Car Company */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-200">
                                  {booking.carBrand || 'N/A'}
                                </span>
                              </td>

                              {/* Car Model */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-200">
                                  {booking.carModel}
                                </span>
                              </td>

                              {/* Service Requested */}
                              <td className="px-4 py-4">
                                <div className="flex items-start gap-2 max-w-xs">
                                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="text-sm text-gray-300 line-clamp-2">
                                    {booking.serviceRequirement}
                                  </span>
                                </div>
                              </td>

                              {/* Booking Date */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-sm text-gray-300">
                                    {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </td>

                              {/* Status (Read-Only Badge) */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span 
                                  className={`px-3 py-2 rounded-lg font-semibold text-xs border-2 inline-block ${
                                    booking.status === 'pending'
                                      ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                                      : booking.status === 'confirmed'
                                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                        : booking.status === 'completed'
                                          ? 'bg-green-500/20 border-green-500/40 text-green-400'
                                          : 'bg-red-500/20 border-red-500/40 text-red-400'
                                  }`}
                                >
                                  {booking.status === 'pending' && '⏳ Pending'}
                                  {booking.status === 'confirmed' && '✓ Confirmed'}
                                  {booking.status === 'completed' && '✅ Completed'}
                                  {booking.status === 'cancelled' && '❌ Cancelled'}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Info Note */}
                    <div className="px-6 py-4 bg-yellow-400/5 border-t border-gray-800">
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <strong>Read-Only Access:</strong> Super Admin can view all bookings but cannot modify their status. Only dealers can update booking statuses.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddDealerModal && (
          <DealerModal
            title="Add New Dealership"
            formData={dealerFormData}
            setFormData={setDealerFormData}
            onSubmit={handleAddDealership}
            onClose={() => {
              setShowAddDealerModal(false);
              setDealerFormData({ dealershipName: '', email: '', phone: '', password: '', state: '', city: '', assignedServices: [] });
            }}
            loading={loading}
          />
        )}

        {showEditDealerModal && (
          <DealerModal
            title="Edit Dealership"
            formData={dealerFormData}
            setFormData={setDealerFormData}
            onSubmit={handleUpdateDealership}
            onClose={() => {
              setShowEditDealerModal(false);
              setSelectedDealer(null);
              setDealerFormData({ dealershipName: '', email: '', phone: '', password: '', state: '', city: '', assignedServices: [] });
            }}
            loading={loading}
            isEdit={true}
          />
        )}

        {showServicesModal && selectedDealer && (
          <DealerServicesModal
            dealer={selectedDealer}
            services={dealerServices}
            loading={loadingServices}
            onClose={() => {
              setShowServicesModal(false);
              setSelectedDealer(null);
              setDealerServices([]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Animated Stat Card Component with Counter
const StatCard = ({ title, value, icon, color, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl hover:shadow-${color}-500/20 transition-all duration-300 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
            className="p-2 bg-gray-900/50 rounded-lg"
          >
            <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
          </motion.div>
        </div>
        <motion.h3
          key={count}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold mb-2"
        >
          {count}
        </motion.h3>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
      </div>
    </motion.div>
  );
};

// Status Card Component
const StatusCard = ({ title, value, color, icon, delay }) => {
  const colorClasses = {
    yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/20',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
    green: 'from-green-500/10 to-green-600/10 border-green-500/20',
    red: 'from-red-500/10 to-red-600/10 border-red-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm rounded-xl p-5 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <p className="text-gray-400 text-xs font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Activity Card Component
const ActivityCard = ({ title, subtitle, value, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
          <div className="text-5xl">{icon}</div>
        </div>
        <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          +{value}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Booking Card Component
const BookingCard = ({ booking, onUpdateStatus, index }) => {
  const statusConfig = {
    pending: { 
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', 
      icon: '⏳',
      glow: 'shadow-yellow-500/20'
    },
    confirmed: { 
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', 
      icon: '✓',
      glow: 'shadow-blue-500/20'
    },
    completed: { 
      color: 'bg-green-500/20 text-green-400 border-green-500/50', 
      icon: '✔',
      glow: 'shadow-green-500/20'
    },
    cancelled: { 
      color: 'bg-red-500/20 text-red-400 border-red-500/50', 
      icon: '✗',
      glow: 'shadow-red-500/20'
    },
  };

  const config = statusConfig[booking.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, y: -5 }}
      className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/30 transition-all duration-300 shadow-lg hover:shadow-2xl"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Customer Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-lg flex-shrink-0 shadow-lg shadow-yellow-400/50">
              {booking.customerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{booking.customerName}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">📞 {booking.customerPhone}</span>
                <span className="flex items-center gap-1">📧 {booking.customerEmail}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 rounded-lg p-2">
              <span>🚗</span>
              <span>{booking.carBrand} {booking.carModel}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 rounded-lg p-2">
              <span>🏢</span>
              <span className="truncate">{booking.dealerServiceId?.businessName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 rounded-lg p-2">
              <span>📍</span>
              <span className="truncate">{booking.dealerServiceId?.city}, {booking.dealerServiceId?.state}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 rounded-lg p-2">
              <span>📅</span>
              <span>{booking.preferredDate} at {booking.preferredTime}</span>
            </div>
          </div>

          {booking.serviceRequirement && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1 font-semibold">Service Requirement:</p>
              <p className="text-sm text-gray-200">{booking.serviceRequirement}</p>
            </div>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex flex-col gap-3 lg:w-48">
          <div className={`${config.color} ${config.glow} border px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold capitalize shadow-lg`}>
            <span className="text-lg">{config.icon}</span>
            <span>{booking.status}</span>
          </div>

          <div className="flex flex-col gap-2">
            {booking.status !== 'pending' && (
              <motion.button
                onClick={() => onUpdateStatus(booking._id, 'pending')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/50 rounded-lg text-yellow-400 text-sm font-semibold transition-all shadow-md shadow-yellow-600/10"
              >
                Set Pending
              </motion.button>
            )}
            {booking.status !== 'confirmed' && (
              <motion.button
                onClick={() => onUpdateStatus(booking._id, 'confirmed')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-blue-400 text-sm font-semibold transition-all shadow-md shadow-blue-600/10"
              >
                Confirm
              </motion.button>
            )}
            {booking.status !== 'completed' && (
              <motion.button
                onClick={() => onUpdateStatus(booking._id, 'completed')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-green-400 text-sm font-semibold transition-all shadow-md shadow-green-600/10"
              >
                Complete
              </motion.button>
            )}
            {booking.status !== 'cancelled' && (
              <motion.button
                onClick={() => onUpdateStatus(booking._id, 'cancelled')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 text-sm font-semibold transition-all shadow-md shadow-red-600/10"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Dealer Services Modal Component
const DealerServicesModal = ({ dealer, services, loading, onClose }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleEditService = (service) => {
    // Navigate to service registration page with serviceId for editing
    navigate(`/superadmin/dealer/${dealer._id}/service/${encodeURIComponent(service.serviceCategory)}/register?serviceId=${service._id}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-yellow-400/30 rounded-2xl p-8 max-w-6xl w-full shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
              Dealer Services
            </h2>
            <div className="space-y-1">
              <p className="text-gray-300">
                <span className="font-semibold text-yellow-400">Email:</span> {dealer.email}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-yellow-400">Phone:</span> {dealer.phone}
              </p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white text-3xl transition-colors"
          >
            ×
          </motion.button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Services Content */}
        {!loading && (
          <>
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {services.map((service, index) => {
                  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                  const firstImage = service.images && service.images.length > 0 
                    ? `${apiBaseUrl}${service.images[0]}` 
                    : null;

                  return (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative overflow-hidden rounded-2xl h-80 group cursor-pointer"
                      onClick={() => handleEditService(service)}
                    >
                      {/* Background Image or Fallback */}
                      {firstImage ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: `url(${firstImage})`,
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                      )}
                      
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                      
                      {/* Edit Button - Top Right Corner */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditService(service);
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute top-4 right-4 w-10 h-10 bg-blue-600/30 hover:bg-blue-600/50 backdrop-blur-md border border-blue-400/50 rounded-lg flex items-center justify-center text-blue-300 hover:text-blue-200 transition-all shadow-lg shadow-blue-600/30 z-20"
                        title="Edit Service"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </motion.button>

                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-end p-6 z-10">
                        <div className="space-y-3">
                          {/* Business Name */}
                          <h3 className="font-bold text-2xl text-white drop-shadow-lg">
                            {service.businessName}
                          </h3>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-yellow-400/30 backdrop-blur-sm border border-yellow-400/50 rounded-lg text-yellow-300 text-xs font-semibold">
                              {service.serviceCategory}
                            </span>
                            {service.isActive ? (
                              <span className="px-3 py-1 bg-green-400/30 backdrop-blur-sm border border-green-400/50 rounded-lg text-green-300 text-xs font-semibold">
                                🟢 Active
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-red-400/30 backdrop-blur-sm border border-red-400/50 rounded-lg text-red-300 text-xs font-semibold">
                                🔴 Inactive
                              </span>
                            )}
                          </div>

                          {/* Quick Info */}
                          <div className="space-y-1 text-sm text-gray-200 drop-shadow">
                            <p className="flex items-center gap-2">
                              <span>📍</span>
                              <span>{service.city}, {service.state}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span>📞</span>
                              <span>{service.contactPhone}</span>
                            </p>
                            {service.price && (
                              <p className="flex items-center gap-2">
                                <span>💰</span>
                                <span>{service.price}</span>
                              </p>
                            )}
                          </div>

                          {/* Hover Indicator */}
                          <div className="pt-2">
                            <span className="text-yellow-400 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                              Click to edit
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Border Glow on Hover */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-2xl transition-all duration-300" />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  📦
                </motion.div>
                <p className="text-xl font-semibold mb-2">No services configured yet</p>
                <p className="text-sm text-gray-500">This dealer has not added any services to the platform.</p>
              </div>
            )}
          </>
        )}

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-lg shadow-yellow-400/20"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Dealer Modal Component
const DealerModal = ({ title, formData, setFormData, onSubmit, onClose, loading, isEdit = false }) => {
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-yellow-400/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ×
          </motion.button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Dealership Name</label>
            <input
              type="text"
              value={formData.dealershipName || ''}
              onChange={(e) => setFormData({ ...formData, dealershipName: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              placeholder="Enter dealership name"
              required={!isEdit}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">State</label>
              <select
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all text-white"
                required={!isEdit}
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">City</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                placeholder="Enter city"
                required={!isEdit}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              placeholder="dealer@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              placeholder="10-digit number"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Password {isEdit && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              placeholder="Minimum 6 characters"
              minLength="6"
              required={!isEdit}
            />
          </div>

          {!isEdit && (
            <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-300">
                <strong>Note:</strong> After creating the dealership, you will be redirected to configure services for this dealer.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50 shadow-lg shadow-yellow-400/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all font-semibold"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SuperAdminDashboard;
