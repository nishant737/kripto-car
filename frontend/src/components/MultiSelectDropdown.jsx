import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MultiSelectDropdown({ 
  label, 
  values = [], 
  options, 
  onChange, 
  placeholder = "Select options",
  icon,
  required = false,
  allowCustom = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const customInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
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
        setShowCustomInput(false);
        setCustomValue('');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Focus custom input when it appears
  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  // Check if all options are selected
  const areAllSelected = () => {
    if (options.length === 0) return false;
    return options.every(option => values.includes(option));
  };

  // Handle "Select All" toggle
  const handleSelectAll = () => {
    if (areAllSelected()) {
      // If all are selected, deselect all
      onChange([]);
    } else {
      // If not all selected, select all options
      onChange([...options]);
    }
  };

  const handleSelect = (option) => {
    if (option === 'Other') {
      setShowCustomInput(true);
      return;
    }

    if (values.includes(option)) {
      // Remove if already selected
      onChange(values.filter(v => v !== option));
    } else {
      // Add to selection
      onChange([...values, option]);
    }
  };

  const handleAddCustom = () => {
    const trimmedValue = customValue.trim();
    if (trimmedValue && !values.includes(trimmedValue)) {
      onChange([...values, trimmedValue]);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const handleCustomInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  const handleCancelCustom = () => {
    setShowCustomInput(false);
    setCustomValue('');
  };

  const handleRemove = (e, option) => {
    e.stopPropagation();
    onChange(values.filter(v => v !== option));
  };

  const isSelected = (option) => values.includes(option);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
          {icon && <span className="text-yellow-400 text-lg">{icon}</span>}
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Dropdown Button */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative
          w-full min-h-[52px] px-4 py-2 pr-12
          bg-gray-800/50 
          border-2 
          ${isOpen ? 'border-yellow-400 ring-2 ring-yellow-400/20' : 'border-gray-700'}
          rounded-xl 
          cursor-pointer
          transition-all duration-200
          hover:border-gray-600
        `}
      >
        {/* Selected Tags */}
        {values.length > 0 ? (
          <div className="flex flex-wrap gap-2 pr-2">
            {values.map((value, index) => (
              <motion.div
                key={value}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-lg text-yellow-400 text-sm font-medium"
              >
                <span>{value}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, value)}
                  className="hover:bg-yellow-400/30 rounded-full p-0.5 transition-colors duration-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 py-1.5">{placeholder}</div>
        )}

        {/* Dropdown Arrow - Fixed Position */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-gray-900 border-2 border-gray-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm">No options available</div>
            ) : (
              <div className="py-2">
                {/* Select All Option */}
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleSelectAll}
                  className={`
                    w-full px-4 py-3 text-left
                    transition-all duration-200
                    flex items-center justify-between
                    border-b-2 border-gray-800
                    ${areAllSelected()
                      ? 'bg-yellow-400/20 text-yellow-400 font-bold'
                      : 'text-white hover:bg-gray-800 font-semibold'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Select All
                  </span>
                  {areAllSelected() && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </motion.button>

                {/* Regular Options */}
                {options.map((option, index) => (
                  <motion.button
                    key={option}
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full px-4 py-3 text-left
                      transition-all duration-200
                      flex items-center justify-between
                      ${isSelected(option)
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'text-white hover:bg-gray-800'
                      }
                    `}
                  >
                    <span className="font-medium">{option}</span>
                    {isSelected(option) && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </motion.button>
                ))}

                {/* Custom Input Section */}
                {allowCustom && (
                  <>
                    {/* Divider */}
                    <div className="border-t border-gray-700 my-2" />
                    
                    {!showCustomInput ? (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => handleSelect('Other')}
                        className="w-full px-4 py-3 text-left transition-all duration-200 text-yellow-400 hover:bg-gray-800 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium">Add Custom Option</span>
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 py-3"
                      >
                        <div className="space-y-2">
                          <input
                            ref={customInputRef}
                            type="text"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                            onKeyDown={handleCustomInputKeyDown}
                            placeholder="Enter custom value..."
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleAddCustom}
                              className="flex-1 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg text-sm transition-colors duration-200"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelCustom}
                              className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg text-sm transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
