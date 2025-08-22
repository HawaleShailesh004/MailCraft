import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';


const Stepper = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = onStepClick && index <= currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`relative flex items-center justify-center ${
                  isClickable ? 'cursor-pointer' : ''
                }`}
                onClick={() => isClickable && onStepClick(index)}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </motion.div>

                {isActive && (
                  <motion.div
                    className="absolute -inset-2 bg-blue-200 rounded-full opacity-30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>

              <div className="ml-4 min-w-0 flex-1">
                <motion.p
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isCompleted
                      ? 'text-green-600'
                      : isActive
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {step}
                </motion.p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gray-200 relative overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 absolute top-0 left-0"
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
