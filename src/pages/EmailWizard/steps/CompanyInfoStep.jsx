const CompanyInfoStep = ({ data, update }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Research (Optional)</h3>

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <p className="text-sm text-yellow-800">
        💡 This section is optional but helps create more personalized emails & can increase the conversion rate drastically. AI can add common info automatically.
      </p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Company Mission/Values</label>
      <textarea
        className="input-field textarea-field"
        rows={4}
        value={data.mission}
        onChange={(e) => update("companyInfo", { mission: e.target.value })}
        placeholder="What does the company stand for? Their mission statement..."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Company Values/Culture</label>
      <textarea
        className="input-field textarea-field"
        rows={4}
        value={data.values}
        onChange={(e) => update("companyInfo", { values: e.target.value })}
        placeholder="Innovation, collaboration, customer-first, etc."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Recent News/Achievements</label>
      <textarea
        className="input-field textarea-field"
        rows={4}
        value={data.recentNews}
        onChange={(e) => update("companyInfo", { recentNews: e.target.value })}
        placeholder="Recent funding, product launches, awards, etc."
      />
    </div>
  </div>
);

export default CompanyInfoStep;
