import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Learn about how we protect your data
          </p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Collection</h2>
          <p className="text-gray-700 mb-4">
            We collect information to provide better services to all of our users.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Usage</h2>
          <p className="text-gray-700 mb-4">
            We use the information collected to improve our services and personalize your experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
