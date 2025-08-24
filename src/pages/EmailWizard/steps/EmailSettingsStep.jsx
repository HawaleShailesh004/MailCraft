import { Sparkles } from "lucide-react";

const EmailSettingsStep = ({ data, update, generateEmail, isGenerating }) => {
  // console.log("From Email Settings", data);
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Email Settings</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Tone
          </label>
          <select
            className="input-field"
            value={data.emailSettings.tone}
            onChange={(e) => update("emailSettings", { tone: e.target.value })}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="value-driven">Value-Driven</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Length
          </label>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full">
            <select
              className="
      input-field 
      w-full sm:w-auto 
      min-w-0 sm:min-w-[200px] 
      flex-shrink
    "
              value={data.emailSettings.length}
              onChange={(e) =>
                update("emailSettings", { length: e.target.value })
              }
            >
              <option value="all">All Templates</option>
              <option value="high-performance">High Performance (85%+)</option>
              <option value="recent">Recently Used</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Subject Line (Optional)
        </label>
        <input
          type="text"
          className="input-field"
          value={data.emailSettings.subjectLine}
          onChange={(e) =>
            update("emailSettings", { subjectLine: e.target.value })
          }
          placeholder="Leave blank for AI to generate"
        />
        <p className="text-sm text-gray-500 mt-2">
          💡 AI will suggest an optimized subject line if left blank
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-green-800 mb-3">
          Ready to Generate!
        </h4>
        <p className="text-green-700 text-sm mb-4">
          Click the button below to generate your personalized cold email using
          AI.
        </p>
        <button
          onClick={generateEmail}
          disabled={isGenerating}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              <span>Generating Email...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate My Email</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailSettingsStep;
