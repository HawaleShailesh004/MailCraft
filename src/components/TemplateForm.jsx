import { X, Plus } from "lucide-react";
import { useState } from "react";

const TemplateForm = ({ onSave, onClose, existingTemplate }) => {
  const [title, setTitle] = useState(existingTemplate?.title || "");
  const [subject, setSubject] = useState(existingTemplate?.subject || "");
  const [body, setBody] = useState(existingTemplate?.body || "");
  const [tags, setTags] = useState(existingTemplate?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = () => {
    const newTemplate = {
      id: existingTemplate?.id || Date.now().toString(),
      title,
      subject,
      body,
      preview: body.substring(0, 100),
      usageCount: existingTemplate?.usageCount || 0,
      lastUsed: existingTemplate?.lastUsed || new Date().toISOString(),
      aiResponseScore: existingTemplate?.aiResponseScore || 0,
      tags,
      createdAt: existingTemplate?.createdAt || new Date().toISOString(),
    };
    onSave(newTemplate);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {existingTemplate ? "Update Template" : "Create New Template"}
        </h2>

        {/* Title */}
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="e.g. Recruiter Cold Email"
        />

        {/* Subject */}
        <label className="block text-sm font-medium mb-1">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="e.g. Application for {{job_title}} at {{company_name}}"
        />

        {/* Body */}
        <label className="block text-sm font-medium mb-1">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 h-40 mb-4"
          placeholder="Write your email body with placeholders..."
        />

        {/* Tags */}
        <label className="block text-sm font-medium mb-1">Tags</label>
        <div className="flex items-center gap-2 mb-3">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Type a tag and press Enter"
          />
          <button
            onClick={handleAddTag}
            className="btn-secondary text-white flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          className="w-full btn-primary"
        >
          {existingTemplate ? "Update Template" : "Save Template"}
        </button>
      </div>
    </div>
  );
};

export default TemplateForm;
