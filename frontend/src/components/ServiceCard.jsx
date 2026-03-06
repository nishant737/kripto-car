import React from 'react';
import { motion } from 'framer-motion';
import { useNavigateWithTransition } from '../hooks/useNavigate';

const ServiceCard = ({ service, index }) => {
  const { title, subServices, highlight, image } = service;
  const navigate = useNavigateWithTransition();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
      className={`
        relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 h-full
          ${
            highlight
              ? 'border-2 border-yellow-400'
              : 'border-2 border-gray-800 hover:border-yellow-400'
          }
        `}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      {/* Animated Edge Line - Top */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none"
        style={{ zIndex: 35 }}
      >
        <div 
          className="absolute h-full w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          style={{
            animation: 'moveBorderLine 3s linear infinite',
            filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))'
          }}
        />
      </div>
      
      {/* Animated Edge Line - Bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none"
        style={{ zIndex: 35 }}
      >
        <div 
          className="absolute h-full w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          style={{
            animation: 'moveBorderLine 3s linear infinite 1.5s',
            filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))'
          }}
        />
      </div>
      
      {/* Animated Edge Line - Left */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-[2px] overflow-hidden pointer-events-none"
        style={{ zIndex: 35 }}
      >
        <div 
          className="absolute w-full h-24 bg-gradient-to-b from-transparent via-yellow-400 to-transparent"
          style={{
            animation: 'moveBorderLineVertical 3s linear infinite 0.75s',
            filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))'
          }}
        />
      </div>
      
      {/* Animated Edge Line - Right */}
      <div 
        className="absolute top-0 bottom-0 right-0 w-[2px] overflow-hidden pointer-events-none"
        style={{ zIndex: 35 }}
      >
        <div 
          className="absolute w-full h-24 bg-gradient-to-b from-transparent via-yellow-400 to-transparent"
          style={{
            animation: 'moveBorderLineVertical 3s linear infinite 2.25s',
            filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))'
          }}
        />
      </div>

      {/* Dark Overlay for Text Readability */}
      <div 
        className={`absolute inset-0 ${
          highlight 
            ? 'bg-gradient-to-br from-yellow-400/95 to-yellow-500/95' 
            : 'bg-gradient-to-br from-black/85 via-black/80 to-gray-900/85'
        }`}
      />

      {/* Animated Glow Effect */}
      <motion.div
        className={`absolute inset-0 ${highlight ? 'bg-yellow-400' : 'bg-yellow-400'} opacity-0`}
        whileHover={{ opacity: 0.05 }}
        transition={{ duration: 0.3 }}
      />

      {highlight && (
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-0 right-0 bg-black text-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg z-30 shadow-lg"
        >
          ⭐ PREMIUM
        </motion.div>
      )}
      
      {/* Racing Stripe Animation for Highlighted Card */}
      {highlight && (
        <motion.div
          className="absolute top-0 left-0 w-1 h-full bg-black z-30"
          animate={{
            scaleY: [0, 1, 0],
            y: ['0%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
      
      <div className="p-5 sm:p-6 relative z-20 flex flex-col h-full">
        <h3
          className={`
            text-xl sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4
            ${highlight ? 'text-black' : 'text-white'}
          `}
          style={{
            textShadow: highlight ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.9)'
          }}
        >
          {title}
        </h3>
        
        <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 flex-grow">
          {subServices.map((subService, idx) => (
            <li
              key={idx}
              className={`
                flex items-start text-sm sm:text-sm
                ${highlight ? 'text-black/90' : 'text-white'}
              `}
              style={{
                textShadow: highlight ? 'none' : '0 1px 3px rgba(0,0,0,0.8)'
              }}
            >
              <span
                className={`
                  mr-2 mt-0.5 sm:mt-1 flex-shrink-0 text-sm sm:text-base
                  ${highlight ? 'text-black' : 'text-yellow-400'}
                `}
              >
                •
              </span>
              <span className="leading-relaxed">{subService}</span>
            </li>
          ))}
        </ul>
        
        <motion.button
          whileHover={{ 
            scale: 1.02
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // For "New Cars", redirect to the category selection page
            if (title === 'New Cars') {
              navigate('/cars/categories');
            } else {
              navigate(`/service/${encodeURIComponent(title)}`);
            }
          }}
          className={`
            mt-auto w-full py-3 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-sm transition-all duration-200 transform cursor-pointer shadow-lg
            ${
              highlight
                ? 'bg-black text-yellow-400 hover:bg-gray-900'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
            }
          `}
        >
          {title === 'New Cars' ? 'Choose Category →' : 'View Dealerships →'}
        </motion.button>
      </div>
      
      {/* Animated Background Effect */}
      {highlight && (
        <motion.div 
          className="absolute -bottom-2 -right-2 w-24 h-24 bg-black opacity-20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default ServiceCard;
