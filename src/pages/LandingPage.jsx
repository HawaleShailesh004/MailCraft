import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Edit3,
  Mail,
  BarChart,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";


const LandingPage = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Generation",
      description:
        "Advanced AI analyzes job descriptions and generates personalized cold emails in seconds.",
    },
    {
      icon: Edit3,
      title: "Rich Text Editor",
      description:
        "Edit and customize your emails with our intuitive rich text editor with AI section highlighting.",
    },
    {
      icon: Mail,
      title: "Gmail Integration",
      description:
        "Send emails directly through Gmail with OAuth integration and secure token management.",
    },
    {
      icon: BarChart,
      title: "Analytics & Templates",
      description:
        "Track email performance and save successful templates for future use.",
    },
  ];

  const benefits = [
    "Save hours of manual email writing",
    "Increase response rates with personalized content",
    "Professional templates and formatting",
    "Track and improve your outreach performance",
    "Seamless integration with your existing workflow",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:mt-10 mt-15">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div
              className="mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Cold Email Generation
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Generate personalized{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  job outreach emails
                </span>{" "}
                in seconds
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                MailCraft uses advanced AI to create compelling, personalized
                cold emails that get responses. Perfect for job seekers looking
                to stand out from the crowd.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to="/wizard"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white gradient-primary rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Generate My First Email
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>

                <button
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-xl shadow-md hover:bg-blue-50 transition-all duration-300"
                  onClick={() => navigate("/templates")}
                >
                  Browse Templates
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative sm:ml-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -inset-4 gradient-primary opacity-20 rounded-3xl blur"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-gray-500 text-sm">
                      Email Preview
                    </span>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Subject:</div>
                      <div className="font-semibold text-gray-900">
                        Experienced Full-Stack Developer - Interest in Frontend
                        Role
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-2">Body:</div>
                      <div className="text-gray-700 space-y-3 text-sm leading-relaxed">
                        <p>Dear Sarah,</p>
                        <p>
                          I was excited to discover the Frontend Developer
                          position at TechCorp. Your company's commitment to
                          innovation aligns perfectly with my passion for
                          creating exceptional user experiences.
                        </p>
                        <p className="bg-blue-50 border-l-4 border-blue-400 pl-3 py-2">
                          <span className="text-xs text-blue-600 font-semibold">
                            AI Generated
                          </span>
                          <br />
                          With 5 years of React experience and a track record of
                          increasing user engagement by 40%, I believe I can
                          contribute significantly to your team's success.
                        </p>
                        <p>
                          I'd love to discuss how my skills can benefit
                          TechCorp.
                        </p>
                        <p>
                          Best regards,
                          <br />
                          Alex Johnson
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Powerful Features for Better Outreach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create compelling cold emails that get
              responses and land interviews.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="gradient-primary w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">
                Why Choose MailCraft?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Stop wasting time on generic emails that get ignored. Create
                personalized, professional outreach that showcases your value
                and gets results.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-300" />
                    <span className="text-white text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="mt-12 lg:mt-0"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">85%</div>
                  <div className="text-blue-100 mb-6">Higher Response Rate</div>

                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">3x</div>
                      <div className="text-blue-100 text-sm">
                        Faster Writing
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">500+</div>
                      <div className="text-blue-100 text-sm">Emails Sent</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join thousands of job seekers who are already using MailCraft to
              get more interviews and land better positions.
            </p>

            <Link
              to="/wizard"
              className="inline-flex items-center px-12 py-6 text-xl font-semibold text-white gradient-primary rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              Start Writing Better Emails Today
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
