import React, { useState, useEffect } from "react";
import {
  Search,
  Edit3,
  Trash2,
  Copy,
  Mail,
  Plus,
  BarChart3,
  Clock,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import TemplateForm from "../components/TemplateForm";
import { useNavigate } from "react-router-dom";
import defaultTemplates from "../assets/defaultlTemplates";

const TemplatesPage = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userTemplates, setUserTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const navigate = useNavigate();

  const [newTemplate, setNewTemplate] = useState({
    title: "",
    subject: "",
    body: "",
    tags: [],
  });

  // Load user templates from localStorage
  useEffect(() => {
    const storedTemplates = localStorage.getItem("emailTemplates");
    if (storedTemplates) {
      try {
        setUserTemplates(JSON.parse(storedTemplates));
      } catch (error) {
        console.error("Error parsing templates:", error);
        setUserTemplates([]);
      }
    }
    setIsMounted(true);
  }, []);

  // Save user templates to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("emailTemplates", JSON.stringify(userTemplates));
    }
  }, [userTemplates, isMounted]);

  const openModal = (template = null) => {
    setIsModalOpen(true);
    setEditingTemplateId(template ? template.id : null);
    if (template) setNewTemplate(template);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTemplate({ title: "", subject: "", body: "", tags: [] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const saveTemplate = async () => {
    try {
      if (editingTemplateId) {
        // Update existing template
        updateTemplate(editingTemplateId, {
          ...newTemplate,
          preview: newTemplate.body.substring(0, 100),
          lastUsed: new Date().toISOString(),
        });
      } else {
        const newTemplateWithData = {
          id: Date.now().toString(),
          title: newTemplate.title,
          subject: newTemplate.subject,
          body: newTemplate.body,
          preview: newTemplate.body.substring(0, 100),
          usageCount: 0,
          lastUsed: new Date().toISOString(),
          aiResponseScore: 0,
          tags: newTemplate.tags,
          createdAt: new Date().toISOString(),
        };
        setUserTemplates([...userTemplates, newTemplateWithData]);
      }
      closeModal();
    } catch (err) {
      console.error("Error saving template:", err);
      alert("Failed to save template");
    }
  };

  const updateTemplate = (id, updatedTemplate) => {
    const updated = userTemplates.map((t) =>
      t.id === id ? { ...t, ...updatedTemplate } : t
    );
    setUserTemplates(updated);
  };

  const deleteTemplate = (id) => {
    setUserTemplates(userTemplates.filter((t) => t.id !== id));
  };

  // Filter user templates
  const filteredTemplates = userTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "high-performance")
      return matchesSearch && template.aiResponseScore >= 85;
    if (selectedFilter === "recent")
      return (
        matchesSearch && new Date(template.lastUsed) > new Date("2024-01-14")
      );
    return matchesSearch;
  });

  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Email Templates
            </h1>
            <p className="text-lg text-gray-600">
              Manage your saved templates and track their performance
            </p>
          </div>
          <motion.button
            className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openModal}
          >
            <Plus className="w-5 h-5" />
            <span>Create New Template</span>
          </motion.button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="input-field min-w-[200px]"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Templates</option>
                <option value="high-performance">
                  High Performance (85%+)
                </option>
                <option value="recent">Recently Used</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* User-created Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {template.subject}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                      template.aiResponseScore
                    )}`}
                  >
                    {template.aiResponseScore}% Score
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {template.preview}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/template-editor/${template.id}`)}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Use Template</span>
                  </motion.button>

                  <motion.button
                    className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal(template)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setUserTemplates([
                        ...userTemplates,
                        { ...template, id: Date.now().toString() },
                      ])
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Built-in Templates Section */}
        <div className="mt-28">
          <h2 className="text-4xl text-center mb-12">
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <strong>Instant</strong>
            </span>{" "}
            Email Blueprints
          </h2>

          {defaultTemplates.map((group, index) => (
            <motion.div
              key={group.category}
              className="mb-6 bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Category Header */}
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === group.category ? null : group.category
                  )
                }
                className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 hover:bg-gray-200 transition"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {group.category}
                </span>
                <motion.span
                  animate={{
                    rotate: expandedCategory === group.category ? 90 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  ▶
                </motion.span>
              </button>

              {/* Templates List */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedCategory === group.category ? "auto" : 0,
                  opacity: expandedCategory === group.category ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  {group.templates.map((template) => (
                    <motion.div
                      key={template.id}
                      className="bg-white border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                      whileHover={{ y: -3 }}
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {template.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {template.subject}
                        </p>
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {template.preview}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Use Template Button */}
                        <motion.button
                          className="btn-primary w-full flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setUserTemplates([
                              ...userTemplates,
                              { ...template, id: Date.now().toString() },
                            ])
                          }
                        >
                          <Mail className="w-4 h-4" />
                          <span>Use Template</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <TemplateForm
            onSave={(template) => {
              if (editingTemplateId)
                updateTemplate(editingTemplateId, template);
              else setUserTemplates([...userTemplates, template]);
            }}
            onClose={closeModal}
            existingTemplate={
              editingTemplateId
                ? userTemplates.find((t) => t.id === editingTemplateId)
                : null
            }
          />
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
