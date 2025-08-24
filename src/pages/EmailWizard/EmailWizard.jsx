import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import Stepper from "../../components/Stepper";
import JobDetailsStep from "./steps/JobDetailsStep";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import CompanyInfoStep from "./steps/CompanyInfoStep";
import EmailSettingsStep from "./steps/EmailSettingsStep";
import PreviewEditStep from "./steps/PreviewEditStep";
import { generateEmailByAI } from "../../AI Helper/AiController";

const EmailWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wizardData, setWizardData] = useState({
    jobDetails: {
      companyName: "",
      recruiterName: "",
      roleTitle: "",
      jobDescription: "",
      jobUrl: "",
    },
    personalInfo: {
      name: "",
      skills: [],
      projects: [],
      experience: [],
      education: [],
      links: [],
      additionalInfo: "",
      resumeFile: null,
    },
    companyInfo: {
      mission: "",
      values: "",
      recentNews: "",
    },
    emailSettings: {
      tone: "professional",
      length: "medium",
      subjectLine: "",
    },
    generatedEmail: {
      subject: "",
      body: "",
    },
  });

  const steps = [
    "Job Details",
    "Personal Info",
    "Company Info",
    "Email Settings",
    "Preview & Edit",
  ];

  const updateWizardData = (section, data) => {
    setWizardData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const generateEmail = async () => {
    setIsGenerating(true);
    let emailData = await generateEmailByAI(wizardData);
    setWizardData((prev) => ({ ...prev, generatedEmail: emailData }));
    setIsGenerating(false);
    setCurrentStep(4); // go to Preview & Edit step
  };

  const stepComponents = [
    <JobDetailsStep data={wizardData.jobDetails} update={updateWizardData} />,
    <PersonalInfoStep
      data={wizardData.personalInfo}
      update={updateWizardData}
    />,
    <CompanyInfoStep data={wizardData.companyInfo} update={updateWizardData} />,
    <EmailSettingsStep
      data={wizardData}
      update={updateWizardData}
      generateEmail={generateEmail}
      isGenerating={isGenerating}
    />,
    <PreviewEditStep
      data={wizardData.generatedEmail}
      allData={wizardData}
      setWizardData={setWizardData}
    />,
  ];

  // Filter step labels for mobile: only prev, current, next
  const getVisibleSteps = () => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return steps.filter((_, idx) =>
        [currentStep - 1, currentStep, currentStep + 1].includes(idx)
      );
    }
    return steps;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full overflow-x-hidden">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Email Generation Wizard
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Let's create your personalized cold email step by step
          </p>
        </div>

        {/* Stepper - responsive */}
        <div className="overflow-x-auto sm:overflow-visible">
          <Stepper
            steps={getVisibleSteps()}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {stepComponents[currentStep]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200 gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-secondary w-full sm:w-auto flex justify-center items-center space-x-2 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" /> <span>Previous</span>
            </button>

            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className="btn-primary w-full sm:w-auto flex justify-center items-center space-x-2"
              >
                <span>Next</span> <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                onClick={generateEmail}
                disabled={isGenerating}
                className="btn-primary w-full sm:w-auto flex justify-center items-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Email</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailWizard;
