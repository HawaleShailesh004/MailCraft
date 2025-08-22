import { Copy, Save, Download, Mail, Sparkles, X } from "lucide-react";
import RichTextEditor from "../../../components/RichTextEditor";
import { useState } from "react";
import {
  generateEmailByAI,
  regenerateEmailByAI,
  regenerateEmailSubjectByAI,
  generateTemplatedEmailByAI,
} from "../../../AI Helper/AiController";

const PreviewEditStep = ({
  data,
  allData,
  setWizardData,
  isTemplateMode = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userComment, setUserComment] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // ---- Actions ----
  const handleCopy = () => {
    navigator.clipboard.writeText(data.body || "");
    alert("📋 Email copied to clipboard!");
  };

  const handleSave = async () => {
    try {
      // Step 1: Ask AI to convert actual email into template
      console.log(data);
      const templated = await generateTemplatedEmailByAI({
        subject: data.subject,
        body: data.body,
      });

      // Step 2: Build template object
      const newTemplateWithData = {
        id: Date.now().toString(),
        title: templated.title || "Custom Template",
        subject: templated.subject, // AI returned subject with placeholders
        preview: templated.body.substring(0, 100),
        usageCount: 0,
        lastUsed: new Date().toISOString(),
        aiResponseScore: templated.score || 0,
        tags: templated.tags || [],
        createdAt: new Date().toISOString(),
        body: templated.body, // AI returned body with placeholders
      };

      // Step 3: Save into localStorage
      const savedTemplates =
        JSON.parse(localStorage.getItem("emailTemplates")) || [];
      savedTemplates.push(newTemplateWithData);
      localStorage.setItem("emailTemplates", JSON.stringify(savedTemplates));

      alert("✅ Template saved with placeholders!");
    } catch (err) {
      console.error("Error saving template:", err);
      alert("❌ Failed to save template");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([`${data.subject}\n\n${data.body}`], {
      type: "text/plain",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "email-template.txt";
    link.click();
  };

  // ---- Mailto Modal Handling ----
  const openSendModal = () => setShowSendModal(true);
  const closeSendModal = () => {
    setRecipientEmail("");
    setEmailError("");
    setShowSendModal(false);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendViaGmail = () => {
    if (!validateEmail(recipientEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(data.body);
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}&body=${body}`;
    window.open(url, "_blank");
    closeSendModal();
  };

  // ---- Email Body / Full Regeneration ----
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generatedEmail = await regenerateEmailByAI(
        {
          ...allData,
        },
        userComment
      );
      console.log("Generated EmailData", generatedEmail);
      setWizardData((prev) => ({ ...prev, generatedEmail }));
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to generate email.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ---- Subject Regeneration ----
  const handleRegenerateSubject = async () => {
    setIsGenerating(true);
    try {
      const newSubject = await regenerateEmailSubjectByAI({
        ...allData,
        currentSubject: data.subject,
        userComment,
      });
      setWizardData((prev) => ({
        ...prev,
        generatedEmail: { ...prev.generatedEmail, subject: newSubject },
      }));
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to regenerate subject.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ---- State Updates ----
  const handleEmailContentChange = (content) => {
    setWizardData((prev) => ({
      ...prev,
      generatedEmail: { ...prev.generatedEmail, body: content },
    }));
  };

  const handleSubjectChange = (e) => {
    setWizardData((prev) => ({
      ...prev,
      generatedEmail: { ...prev.generatedEmail, subject: e.target.value },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Preview & Edit</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" /> <span>Copy</span>
          </button>

          {!isTemplateMode && (
            <button
              onClick={handleSave}
              className="btn-secondary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" /> <span>Save</span>
            </button>
          )}
          <button
            onClick={handleDownload}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" /> <span>Download</span>
          </button>
          <button
            onClick={openSendModal}
            className="btn-primary flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" /> <span>Send</span>
          </button>
        </div>
      </div>

      {/* Subject */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Line
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={data.subject}
            onChange={handleSubjectChange}
            placeholder="Enter your subject line..."
          />
        </div>

        {/* ❌ Hide regenerate subject if in template mode */}
        {!isTemplateMode && (
          <button
            type="button"
            onClick={handleRegenerateSubject}
            disabled={isGenerating}
            className="btn-secondary flex items-center space-x-2 self-end"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>
              {isGenerating ? "Regenerating..." : "Regenerate Subject"}
            </span>
          </button>
        )}
      </div>

      {/* Email Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Body
        </label>
        <RichTextEditor
          content={data.body}
          onChange={handleEmailContentChange}
          placeholder="Your generated email will appear here..."
        />
      </div>

      {/* ❌ Hide comment + regenerate if in template mode */}
      {!isTemplateMode && (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment / Feedback for AI (optional)
            </label>
            <textarea
              className="input-field w-full"
              placeholder="e.g., make it more enthusiastic or highlight project X"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />
          </div>

          {/* Full Regenerate Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-secondary flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>
                {isGenerating ? "Generating..." : "Regenerate Full Email"}
              </span>
            </button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 leading-relaxed">
              💡 Use the text area above to provide comments or feedback to
              improve the AI-generated email. You can regenerate the full email
              or only the subject. Edit freely, then copy, save, download, or
              send.
            </p>
          </div>
        </>
      )}

      {/* --- Gmail Modal --- */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <button onClick={closeSendModal} className="absolute top-3 right-3">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Send Email via Gmail</h3>
            <input
              type="email"
              className="input-field w-full mb-3"
              placeholder="Enter recipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            {emailError && (
              <p className="text-red-600 text-sm mb-2">{emailError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={closeSendModal} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSendViaGmail} className="btn-primary">
                Open Gmail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewEditStep;
