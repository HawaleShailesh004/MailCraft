import { Wand2 } from "lucide-react"; // AI magic icon
import getJobDetailsFromDescription from "../../../AI Helper/AiController.js";

const JobDetailsStep = ({ data, update }) => {
  // 🧪 Demo AI Extractor (stubbed, replace with API later)
  const extractFromDescription = async () => {
    if (!data.jobDescription.trim()) {
      alert("Please paste a job description first!");
      return;
    }

    const Extraction = await getJobDetailsFromDescription(data.jobDescription);
    console.log("AI Extraction Result:", Extraction);

    update("jobDetails", Extraction);
    alert("✨ Smart extraction applied! (Demo values filled)");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Job Details</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            className="input-field"
            value={data.companyName}
            onChange={(e) =>
              update("jobDetails", { companyName: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recruiter/Hiring Manager
          </label>
          <input
            type="text"
            className="input-field"
            value={data.recruiterName}
            onChange={(e) =>
              update("jobDetails", { recruiterName: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role/Job Title *
        </label>
        <input
          type="text"
          className="input-field"
          value={data.roleTitle}
          onChange={(e) => update("jobDetails", { roleTitle: e.target.value })}
          placeholder="e.g. Senior Frontend Developer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job URL (optional)
        </label>
        <input
          type="url"
          className="input-field"
          value={data.jobUrl}
          onChange={(e) => update("jobDetails", { jobUrl: e.target.value })}
          placeholder="https://company.com/careers/job-id"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description *
        </label>
        <textarea
          className="input-field textarea-field"
          rows={6}
          value={data.jobDescription}
          onChange={(e) =>
            update("jobDetails", { jobDescription: e.target.value })
          }
          placeholder="Paste the job description here or key requirements..."
        />
        <p className="text-sm text-gray-500 mt-2">
          💡 AI will analyze this to personalize your email
        </p>

        {/* ✨ New Smart Extraction Button */}
        <button
          type="button"
          onClick={extractFromDescription}
          className="btn-secondary flex items-center space-x-2 mt-3"
        >
          <Wand2 className="w-4 h-4" />
          <span>Fill from Job Description</span>
        </button>
      </div>
    </div>
  );
};

export default JobDetailsStep;
