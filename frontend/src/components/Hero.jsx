import React from 'react';
import { motion } from 'framer-motion';
import { useNavigateWithTransition } from '../hooks/useNavigate';

const Hero = () => {
  const navigate = useNavigateWithTransition();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
      {/* Enhanced Continuous Background Motion Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Animated Gradient - More Visible */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.25), rgba(234, 179, 8, 0.15) 40%, transparent 70%)',
            animation: 'gradientShift 18s ease-in-out infinite',
            filter: 'blur(80px)',
            opacity: 0.6
          }}
        />
        
        {/* Secondary Gradient Orb - Moving */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.3), transparent 50%)',
            animation: 'orbMove 25s ease-in-out infinite',
            filter: 'blur(100px)',
            opacity: 0.5
          }}
        />

        {/* Cinematic Light Sweep - More Pronounced */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, transparent 0%, transparent 40%, rgba(251, 191, 36, 0.4) 50%, rgba(234, 179, 8, 0.3) 55%, transparent 65%, transparent 100%)',
            animation: 'lightSweep 12s linear infinite',
            opacity: 0.7
          }}
        />

        {/* Racing Lines - Clearly Visible */}
        <div className="absolute inset-0">
          <div 
            className="absolute h-0.5 w-full top-1/4"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.8), rgba(234, 179, 8, 0.6), transparent)',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
              animation: 'lineMove 6s linear infinite',
              opacity: 0.4
            }}
          />
          <div 
            className="absolute h-0.5 w-full top-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.8), rgba(234, 179, 8, 0.6), transparent)',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
              animation: 'lineMove 7s linear infinite',
              animationDelay: '2s',
              opacity: 0.35
            }}
          />
          <div 
            className="absolute h-0.5 w-full top-3/4"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.8), rgba(234, 179, 8, 0.6), transparent)',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
              animation: 'lineMove 8s linear infinite',
              animationDelay: '4s',
              opacity: 0.3
            }}
          />
        </div>

        {/* Pulsing Ambient Glow - Enhanced */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.25) 0%, rgba(234, 179, 8, 0.15) 30%, transparent 60%)',
            filter: 'blur(80px)',
            animation: 'pulseGlow 6s ease-in-out infinite'
          }}
        />

        {/* Animated Geometric Pattern Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(30deg, rgba(251, 191, 36, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(251, 191, 36, 0.03) 87.5%, rgba(251, 191, 36, 0.03)), linear-gradient(150deg, rgba(251, 191, 36, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(251, 191, 36, 0.03) 87.5%, rgba(251, 191, 36, 0.03))',
            backgroundSize: '80px 140px',
            animation: 'patternMove 40s linear infinite',
            opacity: 0.3
          }}
        />

        {/* Spotlight Effect - Moving */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.2), transparent 40%)',
            animation: 'spotlightMove 20s ease-in-out infinite',
            filter: 'blur(60px)',
            opacity: 0.5
          }}
        />
      </div>

      {/* Dark Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" style={{ zIndex: 1 }} />

      {/* CSS Animations - Enhanced */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.15);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.85);
          }
        }

        @keyframes orbMove {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(100px, -80px);
          }
        }

        @keyframes lightSweep {
          0% {
            transform: translateX(-120%) rotate(-35deg);
          }
          100% {
            transform: translateX(220%) rotate(-35deg);
          }
        }

        @keyframes lineMove {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.3);
          }
        }

        @keyframes patternMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 80px 140px;
          }
        }

        @keyframes spotlightMove {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-50px, 50px) scale(1.2);
          }
          75% {
            transform: translate(50px, -50px) scale(0.9);
          }
        }
      `}</style>

      <motion.div 
        className="max-w-7xl mx-auto text-center relative w-full"
        style={{ zIndex: 10 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
          }}
        >
          <span className="text-yellow-400">
            Kripto Car
          </span>
          <br className="sm:hidden" />
          <span className="text-white"> – Bangalore's Complete Car Market</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-yellow-400 font-semibold mb-6 sm:mb-8 px-4"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
          }}
        >
          Buy | Sell | Service | Wash | Repair | Upgrade | Test | Deliver
        </motion.p>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-200 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-3xl mx-auto px-4 leading-relaxed"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
          }}
        >
          Your one-stop destination for everything automotive in Bangalore. 
          From buying your dream car to maintaining it with premium services, we've got you covered.
        </motion.p>
        
        <motion.div 
          className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4"
          variants={containerVariants}
        >
          {[
            { number: "500+", label: "Happy Customers" },
            { number: "100+", label: "Cars Available" },
            { number: "10+", label: "Service Types" },
            { number: "24/7", label: "Support Available" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={statsVariants}
              whileHover={{ 
                scale: 1.03, 
                borderColor: "#fbbf24"
              }}
              className="bg-black/80 backdrop-blur-md p-4 sm:p-6 rounded-xl border-2 border-gray-700 hover:border-yellow-400 transition-all duration-300 shadow-lg"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2"
              >
                {stat.number}
              </div>
              <div 
                className="text-gray-200 text-xs sm:text-sm leading-tight"
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
