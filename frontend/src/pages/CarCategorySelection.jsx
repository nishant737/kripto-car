import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CarCategorySelection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Hatchback',
      description: 'Compact and fuel-efficient city cars',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop'
    },
    {
      name: 'Sedan',
      description: 'Elegant and comfortable family cars',
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop'
    },
    {
      name: 'SUV',
      description: 'Powerful and spacious adventure vehicles',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop'
    },
    {
      name: 'MUV',
      description: 'Multi-purpose vehicles for large families',
      image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop'
    },
    {
      name: 'Coupe',
      description: 'Sporty and stylish two-door cars',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'
    },
    {
      name: 'Convertible',
      description: 'Open-top luxury driving experience',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    },
    {
      name: 'Wagon',
      description: 'Versatile cars with extra cargo space',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    },
    {
      name: 'Pickup Truck',
      description: 'Heavy-duty vehicles for work and adventure',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop'
    },
    {
      name: 'EV/Electric',
      description: 'Eco-friendly electric vehicles',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop'
    },
    {
      name: 'Luxury',
      description: 'Premium cars with top-tier features',
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop'
    }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/cars/browse?category=${encodeURIComponent(categoryName)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your
              <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Car Category
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Select from our wide range of vehicle categories to find your perfect match
            </p>
          </motion.div>

          {/* Category Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.name)}
                className="cursor-pointer group"
              >
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:shadow-yellow-400/20 transition-all duration-300 border-2 border-transparent group-hover:border-yellow-400">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{
                      backgroundImage: `url(${category.image})`,
                    }}
                  ></div>
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:from-black/90 group-hover:via-black/70 transition-all duration-300"></div>
                  
                  {/* Yellow Accent Overlay on Hover */}
                  <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-all duration-300"></div>
                  
                  {/* Card Content */}
                  <div className="relative h-full flex flex-col justify-end p-6 text-left">
                    {/* Category Name */}
                    <h3 className="text-3xl font-bold text-white mb-2 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                      {category.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-300 mb-4 opacity-90 group-hover:text-yellow-100 transition-colors duration-300">
                      {category.description}
                    </p>

                    {/* Explore Button - appears on hover */}
                    <div className="flex items-center gap-2 text-yellow-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-sm font-semibold">Explore Category</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>

                  {/* Top Corner Accent */}
                  <div className="absolute top-4 right-4 w-12 h-12 border-2 border-yellow-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Browse All Cars Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => navigate('/cars/browse')}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-700 text-white rounded-2xl hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Button Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <svg className="w-6 h-6 text-yellow-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-lg font-bold relative z-10">Browse All Cars</span>
              <svg className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Not sure? Browse our entire collection without filters
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarCategorySelection;
