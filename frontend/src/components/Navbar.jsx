import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigateWithTransition } from '../hooks/useNavigate';
import DealerAuthModal from './DealerAuthModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dealerModalOpen, setDealerModalOpen] = useState(false);
  const navigate = useNavigateWithTransition();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/95 border-b border-yellow-400/30 sticky top-0 z-50 backdrop-blur-md transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white transition-colors duration-300">
                <span className="text-yellow-400">Kripto</span> Car
              </h1>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-2 xl:space-x-4">
              <motion.a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                whileHover={{ scale: 1.05, color: "#fbbf24" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                Home
              </motion.a>
              <motion.a
                href="#services"
                whileHover={{ scale: 1.05, color: "#fbbf24" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Services
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05, color: "#fbbf24" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </motion.a>
              <motion.a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/contact');
                }}
                whileHover={{ scale: 1.05, color: "#fbbf24" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                Contact
              </motion.a>
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  setDealerModalOpen(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-black hover:bg-yellow-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-200 shadow-lg cursor-pointer"
              >
                Login as Dealer
              </motion.button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-yellow-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black/98 border-t border-yellow-400/20 transition-colors duration-300"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              <motion.a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                whileTap={{ scale: 0.95 }}
                className="block text-white hover:text-yellow-400 hover:bg-gray-800 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
              >
                Home
              </motion.a>
              <motion.a
                href="#services"
                whileTap={{ scale: 0.95 }}
                className="block text-white hover:text-yellow-400 hover:bg-gray-800 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </motion.a>
              <motion.a
                href="#"
                whileTap={{ scale: 0.95 }}
                className="block text-white hover:text-yellow-400 hover:bg-gray-800 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </motion.a>
              <motion.a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate('/contact');
                }}
                whileTap={{ scale: 0.95 }}
                className="block text-white hover:text-yellow-400 hover:bg-gray-800 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
              >
                Contact
              </motion.a>
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  setDealerModalOpen(true);
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 px-4 py-3 rounded-lg text-base font-bold transition-colors duration-200 shadow-lg cursor-pointer text-center"
              >
                Login as Dealer
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dealer Auth Modal */}
      <DealerAuthModal 
        isOpen={dealerModalOpen} 
        onClose={() => setDealerModalOpen(false)} 
      />
    </motion.nav>
  );
};

export default Navbar;
