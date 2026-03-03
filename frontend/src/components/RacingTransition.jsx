import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RacingTransition = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          {/* Racing Track Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated Road Lines */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 bg-yellow-400"
                style={{
                  top: `${50 + (i - 3) * 8}%`,
                  width: '120px',
                  left: '-120px'
                }}
                animate={{
                  x: ['0vw', '120vw']
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.2
                }}
              />
            ))}

            {/* Horizontal Road Lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`h-${i}`}
                  className="absolute h-0.5 w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"
                  style={{ 
                    top: `${40 + i * 10}%`,
                    opacity: 0.3
                  }}
                />
              ))}
            </div>
          </div>

          {/* Racing Car Animation */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              initial={{ x: 0, scale: 1, opacity: 0 }}
              animate={{ 
                x: ['0vw', '60vw', '120vw'],
                scale: [1, 1.3, 1.1],
                opacity: [0, 1, 1, 1, 0]
              }}
              transition={{
                duration: 2.5,
                times: [0, 0.3, 0.6, 0.85, 1],
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="relative"
            >
              {/* Car SVG - Larger Size */}
              <svg 
                width="240" 
                height="120" 
                viewBox="0 0 120 60" 
                className="drop-shadow-2xl"
              >
                {/* Car Body */}
                <path
                  d="M 20 35 L 30 20 L 70 20 L 80 35 L 100 35 L 100 45 L 95 50 L 25 50 L 20 45 Z"
                  fill="#fbbf24"
                  stroke="#000"
                  strokeWidth="2"
                />
                {/* Car Windows */}
                <path
                  d="M 35 25 L 42 25 L 45 35 L 35 35 Z"
                  fill="#000"
                  opacity="0.3"
                />
                <path
                  d="M 50 25 L 65 25 L 68 35 L 50 35 Z"
                  fill="#000"
                  opacity="0.3"
                />
                {/* Wheels */}
                <circle cx="35" cy="48" r="8" fill="#1f2937" stroke="#000" strokeWidth="2" />
                <circle cx="35" cy="48" r="4" fill="#4b5563" />
                <circle cx="85" cy="48" r="8" fill="#1f2937" stroke="#000" strokeWidth="2" />
                <circle cx="85" cy="48" r="4" fill="#4b5563" />
                {/* Headlight */}
                <circle cx="98" cy="38" r="3" fill="#fff" opacity="0.9" />
                {/* Racing Stripe */}
                <path
                  d="M 30 27 L 75 27 L 78 33 L 30 33 Z"
                  fill="#000"
                  opacity="0.2"
                />
              </svg>

              {/* Speed Lines */}
              <motion.div
                className="absolute -left-24 sm:-left-32 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 2.5,
                  times: [0, 0.2, 0.8, 1],
                  ease: 'linear'
                }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 sm:h-1.5 bg-yellow-400 rounded-full mb-3"
                    style={{
                      width: `${60 - i * 12}px`,
                      opacity: 0.8 - i * 0.15
                    }}
                    animate={{
                      scaleX: [0.5, 1, 0.5],
                      x: [-30, 0, 30]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 1, 0], y: 0 }}
            transition={{
              duration: 2.5,
              times: [0, 0.15, 0.5, 0.85, 1]
            }}
            className="absolute bottom-16 sm:bottom-20 text-yellow-400 text-lg sm:text-xl md:text-2xl font-bold"
          >
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              Loading...
            </motion.span>
          </motion.div>

          {/* Speedometer Effect */}
          <motion.div
            className="absolute bottom-10 right-6 sm:right-10 hidden md:block"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
            transition={{ 
              duration: 2.5,
              times: [0, 0.2, 0.85, 1]
            }}
          >
            <div className="relative w-24 h-24 lg:w-28 lg:h-28">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '283', strokeDashoffset: '283' }}
                  animate={{ strokeDashoffset: ['283', '50', '283'] }}
                  transition={{
                    duration: 2.5,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-yellow-400 text-sm font-bold"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity
                  }}
                >
                  GO!
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RacingTransition;
