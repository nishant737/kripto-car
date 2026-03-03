import { motion } from 'framer-motion';

export default function DealershipCard({ dealership, onBookNow, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 hover:border-yellow-400/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={dealership.image}
          alt={dealership.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Verified Badge */}
        {dealership.verified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-bold text-sm">{dealership.rating}</span>
          <span className="text-xs">({dealership.reviewCount})</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Dealership Name */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-1">
          {dealership.name}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 text-gray-300 mb-4">
          <svg
            className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm">
            {dealership.area}, {dealership.city}
          </p>
        </div>

        {/* Services Offered */}
        <div className="mb-4">
          <h4 className="text-yellow-400 font-semibold text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            Services Offered
          </h4>
          <div className="flex flex-wrap gap-2">
            {dealership.services.slice(0, 3).map((service, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600"
              >
                {service}
              </span>
            ))}
            {dealership.services.length > 3 && (
              <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 text-xs rounded-full border border-yellow-400/30 font-semibold">
                +{dealership.services.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex items-center gap-2 text-gray-300 mb-5 pb-5 border-b border-gray-700">
          <svg
            className="w-5 h-5 text-yellow-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <a
            href={`tel:${dealership.phone}`}
            className="text-sm hover:text-yellow-400 transition-colors"
          >
            {dealership.phone}
          </a>
        </div>

        {/* Book Now Button */}
        <motion.button
          onClick={() => onBookNow(dealership)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 cursor-pointer text-sm sm:text-base"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
}
