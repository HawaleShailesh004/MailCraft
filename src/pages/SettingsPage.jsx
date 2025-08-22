import React, { useState } from 'react';
import { User, Mail, Key, Bell, Shield, Palette, Save, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'https://linkedin.com/in/johndoe',
      portfolio: 'https://johndoe.dev',
      bio: 'Full-stack developer with 5+ years of experience in React and Node.js',
    },
    gmail: {
      connected: false,
      email: '',
      lastSync: null,
    },
    notifications: {
      emailGenerated: true,
      templateUsed: false,
      responseReceived: true,
      weeklyReport: true,
    },
    ai: {
      model: 'groq-llama3',
      creativity: 'balanced',
      autoResearch: true,
    },
    appearance: {
      theme: 'light',
      primaryColor: '#4A90E2',
    }
  });

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'gmail', label: 'Gmail Integration', icon: Mail },
    { id: 'ai', label: 'AI Settings', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const connectGmail = () => {
    // Simulate Gmail OAuth connection
    setTimeout(() => {
      updateSetting('gmail', 'connected', true);
      updateSetting('gmail', 'email', settings.profile.email);
      updateSetting('gmail', 'lastSync', new Date().toISOString());
    }, 1000);
  };

  const disconnectGmail = () => {
    updateSetting('gmail', 'connected', false);
    updateSetting('gmail', 'email', '');
    updateSetting('gmail', 'lastSync', null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.profile.name}
                  onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={settings.profile.email}
                  onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="input-field"
                  value={settings.profile.phone}
                  onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={settings.profile.linkedin}
                  onChange={(e) => updateSetting('profile', 'linkedin', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Website
              </label>
              <input
                type="url"
                className="input-field"
                value={settings.profile.portfolio}
                onChange={(e) => updateSetting('profile', 'portfolio', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                className="input-field textarea-field"
                rows={4}
                value={settings.profile.bio}
                onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                placeholder="Brief professional summary..."
              />
            </div>
          </motion.div>
        );

      case 'gmail':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gmail Integration</h3>
            
            {!settings.gmail.connected ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Connect Gmail Account</h4>
                    <p className="text-gray-600">Send emails directly through Gmail with secure OAuth</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Secure OAuth 2.0 authentication</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Send emails directly from your Gmail account</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Automatic token refresh and management</span>
                  </div>
                </div>
                
                <button
                  onClick={connectGmail}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Connect Gmail Account</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-500 rounded-lg">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Gmail Connected</h4>
                      <p className="text-gray-600">{settings.gmail.email}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={disconnectGmail}
                    className="btn-secondary text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Disconnect
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Last synchronized: {settings.gmail.lastSync ? new Date(settings.gmail.lastSync).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'ai':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Model
                </label>
                <select
                  className="input-field"
                  value={settings.ai.model}
                  onChange={(e) => updateSetting('ai', 'model', e.target.value)}
                >
                  <option value="groq-llama3">Groq Llama 3 (Fast)</option>
                  <option value="groq-llama3-70b">Groq Llama 3 70B (Advanced)</option>
                  <option value="groq-mixtral">Groq Mixtral (Balanced)</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Choose the AI model for email generation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creativity Level
                </label>
                <select
                  className="input-field"
                  value={settings.ai.creativity}
                  onChange={(e) => updateSetting('ai', 'creativity', e.target.value)}
                >
                  <option value="conservative">Conservative (Safe, Professional)</option>
                  <option value="balanced">Balanced (Recommended)</option>
                  <option value="creative">Creative (Unique, Bold)</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Controls how creative and unique the AI generates emails
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.ai.autoResearch}
                    onChange={(e) => updateSetting('ai', 'autoResearch', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Automatic Company Research
                    </span>
                    <p className="text-sm text-gray-500">
                      AI will automatically research companies to personalize emails
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Email Generated</span>
                  <p className="text-sm text-gray-500">Notify when AI generates a new email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailGenerated}
                  onChange={(e) => updateSetting('notifications', 'emailGenerated', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Template Used</span>
                  <p className="text-sm text-gray-500">Notify when a template is used</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.templateUsed}
                  onChange={(e) => updateSetting('notifications', 'templateUsed', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Response Received</span>
                  <p className="text-sm text-gray-500">Notify when you receive email responses</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.responseReceived}
                  onChange={(e) => updateSetting('notifications', 'responseReceived', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">Weekly Report</span>
                  <p className="text-sm text-gray-500">Receive weekly performance reports</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReport}
                  onChange={(e) => updateSetting('notifications', 'weeklyReport', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </label>
            </div>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                className="input-field"
                value={settings.appearance.theme}
                onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Data Protection</h4>
              <p className="text-yellow-700 text-sm mb-4">
                MailCraft takes your privacy seriously. All data is encrypted and stored securely.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-yellow-700">
                  <Shield className="w-4 h-4" />
                  <span>End-to-end encryption for all communications</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-yellow-700">
                  <Shield className="w-4 h-4" />
                  <span>OAuth 2.0 for secure Gmail integration</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-yellow-700">
                  <Shield className="w-4 h-4" />
                  <span>No storage of email credentials</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button className="btn-secondary w-full">
                Export My Data
              </button>
              <button className="btn-secondary w-full text-red-600 border-red-600 hover:bg-red-50">
                Delete My Account
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-lg text-gray-600">
            Manage your account, preferences, and integrations
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:w-1/4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-6 py-4 text-left text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="lg:w-3/4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-md p-8">
              {renderTabContent()}
              
              {/* Save Button */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <motion.button
                  className="btn-primary flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
