import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import PreviewEditStep from "./EmailWizard/steps/PreviewEditStep";

const TemplateEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emailTemplates")) || [];
    const found = saved.find((t) => t.id === id);
    if (found) {
      setTemplate(found);

      // ✅ update usage count in storage
      const updated = saved.map((t) =>
        t.id === id
          ? {
              ...t,
              usageCount: (t.usageCount || 0) + 1,
              lastUsed: new Date().toISOString(),
            }
          : t
      );
      localStorage.setItem("emailTemplates", JSON.stringify(updated));
    }
  }, [id]);

  if (!template)
    return <div className="text-center p-6">Loading template...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Template</h1>
        </div>

        {/* ✅ Reuse Preview & Edit UI */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <PreviewEditStep
            data={{ subject: template.subject, body: template.body }}
            allData={{ generatedEmail: template }}
            setWizardData={(updater) => {
              setTemplate((prev) => {
                const updated =
                  typeof updater === "function"
                    ? updater({ generatedEmail: prev })
                    : updater;
                return { ...prev, ...updated.generatedEmail };
              });
            }}
            isTemplateMode={true} 
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorPage;
