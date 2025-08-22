import React from 'react';
import { motion } from 'framer-motion';

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions and get support
          </p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">How do I generate an email?</h3>
              <p className="text-gray-700">
                To generate an email, navigate to the "Create Email" page and fill out the required information in each step.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Can I save my templates?</h3>
              <p className="text-gray-700">
                Yes, you can save your email templates on the "Templates" page for future use.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">How do I connect my Gmail account?</h3>
              <p className="text-gray-700">
                You can connect your Gmail account in the "Settings" page under "Gmail Integration".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
