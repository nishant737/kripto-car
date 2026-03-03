import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactPage from './pages/ContactPage';
import DealerDashboard from './pages/DealerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ServiceRegistration from './pages/ServiceRegistration';
import MyServices from './pages/MyServices';
import DealerBookings from './pages/DealerBookings';
import { TransitionProvider } from './context/TransitionContext';
import { useTransition } from './context/TransitionContext';
import RacingTransition from './components/RacingTransition';

function AppContent() {
  const { isTransitioning } = useTransition();
  
  return (
    <>
      <RacingTransition isActive={isTransitioning} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service/:serviceName" element={<ServiceDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dealer-dashboard" element={<DealerDashboard />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/dealer/register-service/:category" element={<ServiceRegistration />} />
        <Route path="/dealer/edit-service/:serviceId" element={<ServiceRegistration />} />
        <Route path="/dealer/my-services" element={<MyServices />} />
        <Route path="/dealer/my-bookings" element={<DealerBookings />} />
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
