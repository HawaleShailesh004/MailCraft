import { useState } from "react";
import { Sparkles, X, Plus, FileText } from "lucide-react";
import getTextfromFile from "../../../AI Helper/ExtractText";

const PersonalInfoStep = ({ data, update }) => {
  const [skillInput, setSkillInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📝 AI Resume Extraction
  const extractFromResume = async () => {
    if (!resumeFile) {
      alert("Please select a resume first!");
      return;
    }

    setLoading(true);
    try {
      let result = await getTextfromFile(resumeFile);
      result = result.replace(/^```(?:json)?\s*/, "").replace(/```$/, "");
      const object = await JSON.parse(result);

      update("personalInfo", {
        skills: object?.personalInfo?.skills || [],
        projects: object?.personalInfo?.projects || [],
        experience: object?.personalInfo?.experience || [],
        education: object?.personalInfo?.education || [],
        links: object?.personalInfo?.links || [],
        additionalInfo: object?.personalInfo?.additionalInfo || "",
      });
      alert("✨ Smart extraction applied! Fields filled from resume.");
    } catch (err) {
      console.error("Error extracting text:", err);
      alert("Failed to extract details from resume.");
    } finally {
      setLoading(false);
    }
  };

  // File handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
  };

  const triggerFileInput = () => {
    document.getElementById("resume-upload").click();
  };

  // Skill helpers
  const addSkill = () => {
    if (!skillInput.trim()) return;
    update("personalInfo", { skills: [...(data.skills || []), skillInput] });
    setSkillInput("");
  };
  const removeSkill = (skill) =>
    update("personalInfo", {
      skills: (data.skills || []).filter((s) => s !== skill),
    });

  // Link helpers
  const addLink = () => {
    if (!linkInput.trim()) return;
    update("personalInfo", { links: [...(data.links || []), linkInput] });
    setLinkInput("");
  };
  const removeLink = (link) =>
    update("personalInfo", {
      links: (data.links || []).filter((l) => l !== link),
    });

  // List helpers
  const addItem = (field, newItem) =>
    update("personalInfo", { [field]: [...(data[field] || []), newItem] });

  const updateItem = (field, idx, key, value) => {
    const updated = [...(data[field] || [])];
    updated[idx][key] = value;
    update("personalInfo", { [field]: updated });
  };

  const removeItem = (field, idx) => {
    const updated = [...(data[field] || [])];
    updated.splice(idx, 1);
    update("personalInfo", { [field]: updated });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Personal Information
      </h3>

      {/* AI Resume Extraction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Text */}
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <span className="font-medium text-blue-800 block">
                AI Resume Extraction
              </span>
              <p className="text-sm text-blue-700">
                Upload your resume and click <b>Smart Extract</b> to auto-fill.
              </p>
              {resumeFile && (
                <div className="mt-2 flex items-center text-sm text-gray-700 bg-white border border-gray-200 rounded px-2 py-1 w-fit">
                  <FileText className="w-4 h-4 mr-1 text-indigo-600" />
                  <span className="truncate max-w-[180px]">
                    {resumeFile.name}
                  </span>
                  <button
                    onClick={() => setResumeFile(null)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={triggerFileInput}
              className="btn-secondary"
              disabled={loading}
            >
              Select File
            </button>
            <button
              type="button"
              onClick={extractFromResume}
              className="btn-primary"
              disabled={!resumeFile || loading}
            >
              {loading ? "Extracting..." : "Smart Extract"}
            </button>
          </div>
          <input
            id="resume-upload"
            type="file"
            accept=".doc,.docx,.txt,image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Key Skills & Technologies *
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="input-field flex-1"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder="Type a skill and press Enter"
          />
          <button type="button" onClick={addSkill} className="btn-secondary">
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {(data.skills || []).map((skill, idx) => (
            <span
              key={idx}
              className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Projects
        </label>
        {(data.projects || []).map((p, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-2 mt-2">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Project Title"
              value={p.title}
              onChange={(e) =>
                updateItem("projects", idx, "title", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Details"
              value={p.details}
              onChange={(e) =>
                updateItem("projects", idx, "details", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeItem("projects", idx)}
              className="text-red-500"
            >
              <X />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem("projects", { title: "", details: "" })}
          className="btn-secondary mt-2 flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" /> <span>Add Project</span>
        </button>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Experience
        </label>
        {(data.experience || []).map((exp, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-2">
            <input
              type="text"
              className="input-field"
              placeholder="Company"
              value={exp.company}
              onChange={(e) =>
                updateItem("experience", idx, "company", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field"
              placeholder="Role"
              value={exp.role}
              onChange={(e) =>
                updateItem("experience", idx, "role", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field"
              placeholder="Duration"
              value={exp.duration}
              onChange={(e) =>
                updateItem("experience", idx, "duration", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field"
              placeholder="Details"
              value={exp.details}
              onChange={(e) =>
                updateItem("experience", idx, "details", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeItem("experience", idx)}
              className="text-red-500"
            >
              <X />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addItem("experience", {
              company: "",
              role: "",
              duration: "",
              details: "",
            })
          }
          className="btn-secondary mt-2 flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" /> <span>Add Experience</span>
        </button>
      </div>

      {/* Education */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Education
        </label>
        {(data.education || []).map((edu, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2">
            <input
              type="text"
              className="input-field"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) =>
                updateItem("education", idx, "institution", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) =>
                updateItem("education", idx, "degree", e.target.value)
              }
            />
            <input
              type="text"
              className="input-field"
              placeholder="Year"
              value={edu.year}
              onChange={(e) =>
                updateItem("education", idx, "year", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeItem("education", idx)}
              className="text-red-500"
            >
              <X />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addItem("education", { institution: "", degree: "", year: "" })
          }
          className="btn-secondary mt-2 flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" /> <span>Add Education</span>
        </button>
      </div>

      {/* Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Portfolio/Links
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="input-field flex-1"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="linkedin.com/in/yourname"
          />
          <button type="button" onClick={addLink} className="btn-secondary">
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {(data.links || []).map((link, idx) => (
            <span
              key={idx}
              className="flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
            >
              {link}
              <button
                type="button"
                onClick={() => removeLink(link)}
                className="ml-2 text-gray-600 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Information
        </label>
        <textarea
          className="input-field textarea-field"
          rows={3}
          value={data.additionalInfo}
          onChange={(e) =>
            update("personalInfo", { additionalInfo: e.target.value })
          }
          placeholder="Awards, certifications, unique achievements..."
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
