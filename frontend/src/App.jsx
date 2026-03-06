import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactPage from './pages/ContactPage';
import DealerDashboard from './pages/DealerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminServiceCategorySelection from './pages/SuperAdminServiceCategorySelection';
import ServiceRegistration from './pages/ServiceRegistration';
import DealerBookings from './pages/DealerBookings';
import BrowseCars from './pages/BrowseCars';
import CarCategorySelection from './pages/CarCategorySelection';
import AddCarListing from './pages/AddCarListing';
import MyCars from './pages/MyCars';
import { TransitionProvider } from './context/TransitionContext';
import { useTransition } from './context/TransitionContext';
import RacingTransition from './components/RacingTransition';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const { isTransitioning } = useTransition();
  
  return (
    <>
      <RacingTransition isActive={isTransitioning} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service/:serviceName" element={<ServiceDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Dealer routes - Dealers have access to bookings and car listings */}
        <Route path="/dealer-dashboard" element={<DealerDashboard />} />
        <Route path="/dealer/my-bookings" element={<DealerBookings />} />
        <Route path="/dealer/add-car-listing" element={<AddCarListing />} />
        <Route path="/dealer/my-cars" element={<MyCars />} />
        
        {/* Super Admin routes */}
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/dealer/:dealerId/services/select-category" element={<SuperAdminServiceCategorySelection />} />
        <Route path="/superadmin/dealer/:dealerId/service/:category/register" element={<ServiceRegistration />} />
        
        {/* Public car browsing routes */}
        <Route path="/cars/categories" element={<CarCategorySelection />} />
        <Route path="/cars/browse" element={<BrowseCars />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <TransitionProvider>
      <Router>
        <AppContent />
      </Router>
    </TransitionProvider>
  );
}

export default App;
