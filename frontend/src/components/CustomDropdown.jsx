import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomDropdown({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = "Select option",
  icon 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Calculate menu position when dropdown opens or window resizes
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 8, // 8px gap (mt-2)
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the button and the menu
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.dropdown-menu')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
        {icon && <span className="text-yellow-400">{icon}</span>}
        {label}
      </label>

      {/* Dropdown Button */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`
          w-full px-4 py-3 sm:py-4 
          bg-gray-900 
          border-2 
          ${isOpen ? 'border-yellow-400 ring-2 ring-yellow-400/20' : 'border-gray-700'}
          rounded-xl 
          text-white 
          text-left
          focus:outline-none 
          focus:border-yellow-400 
          focus:ring-2 
          focus:ring-yellow-400/20
          transition-all 
          duration-300 
          cursor-pointer
          text-sm sm:text-base
          flex items-center justify-between
          shadow-lg
          hover:border-yellow-400/50
        `}
      >
        <span className={value ? 'text-white' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        
        {/* Custom Arrow Icon */}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5 text-yellow-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown Menu - Rendered via Portal */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="
              dropdown-menu
              fixed
              z-[9999]
              bg-gray-900 
              border-2 
              border-yellow-400/30 
              rounded-xl 
              shadow-2xl 
              shadow-black/50
              max-h-64 
              overflow-y-auto
              backdrop-blur-sm
            "
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: `${menuPosition.width}px`,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(251, 191, 36, 0.1)'
            }}
          >
            {/* Options List */}
            <div className="py-2">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
                  className={`
                    w-full 
                    px-4 
                    py-3 
                    text-left 
                    text-sm sm:text-base
                    transition-colors 
                    duration-150
                    cursor-pointer
                    ${
                      value === option
                        ? 'bg-yellow-400/20 text-yellow-400 font-semibold'
                        : 'text-gray-300 hover:text-yellow-400'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {value === option && (
                      <svg
                        className="w-4 h-4 text-yellow-400 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="truncate">{option}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Scrollbar Styling */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.5);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.5);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.7);
        }
      `}</style>
    </div>
  );
}
