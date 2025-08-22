import React from 'react';
import { motion } from 'framer-motion';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pricing</h1>
          <p className="text-lg text-gray-600">
            Choose the plan that's right for you
          </p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Subscription Plans</h2>
          <p className="text-gray-700 mb-4">
            Explore our different subscription plans to find the best fit for your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
