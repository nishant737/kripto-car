import React from 'react';
import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';
import { services } from '../data/services';
import { useNavigateWithTransition } from '../hooks/useNavigate';

const ServiceSection = () => {
  const navigate = useNavigateWithTransition();
  return (
    <section id="services" className="relative bg-gradient-to-b from-black via-gray-900 to-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Background Animation */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24 0px, #fbbf24 2px, transparent 2px, transparent 10px)',
          backgroundSize: '200% 200%',
          animation: 'bgMove 20s linear infinite'
        }}
      />

      <style jsx>{`
        @keyframes bgMove {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] px-4"
          >
            Our Pr<span className="text-yellow-400">emi</span>um Services
          </h2>
          <p 
            className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 leading-relaxed"
          >
            Comprehensive automotive solutions tailored to meet all your car needs in Bangalore
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-8 sm:mt-12 px-4"
        >
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
            Can't find what you're looking for?
          </p>
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#fbbf24",
              color: "#000"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('#contact')}
            className="w-full sm:w-auto bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 transform text-sm sm:text-base cursor-pointer shadow-lg"
          >
            Contact Our Team
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceSection;
