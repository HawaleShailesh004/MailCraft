import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import EmailWizard from "./pages/EmailWizard/EmailWizard";
import TemplatesPage from "./pages/TemplatesPage";
import SettingsPage from "./pages/SettingsPage";
import Footer from "./components/Footer";
import HelpPage from "./pages/HelpPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PricingPage from "./pages/PricingPage";
import TemplateEditorPage from "./pages/TemplateEditor";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/wizard" element={<EmailWizard />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          <Route path="/template-editor/:id" element={<TemplateEditorPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
