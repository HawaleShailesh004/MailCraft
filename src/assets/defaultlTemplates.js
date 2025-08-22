const defaultTemplates = [
  {
    category: "Job Application",
    templates: [
      {
        id: "job_app_1",
        title: "Direct Application",
        subject: "Application for [Job Title] at [Company Name]",
        body: "Hi [Hiring Manager's Name],\n\nMy name is [Your Name], and I’m excited to apply for the [Job Title] role at [Company Name]. With my background in [Your Skills/Experience], I believe I can contribute to [Company Value/Project].\n\nI’ve attached my résumé for your review and would be glad to discuss how I can add value to your team.\n\nBest regards,\n[Your Name]",
        preview:
          "Hi [Hiring Manager's Name], My name is [Your Name], and I’m excited to apply...",
        usageCount: 0,
        lastUsed: null,
        aiResponseScore: 0,
        tags: ["application", "job", "professional"],
        createdAt: "2025-08-23T00:00:00.000Z",
      },
      {
        id: "job_app_2",
        title: "Value-Focused Application",
        subject: "Interested in [Job Title] role at [Company Name]",
        body: "Dear [Hiring Manager's Name],\n\nI’m writing to express my interest in the [Job Title] position at [Company Name]. In my previous work, I’ve [Key Achievement/Experience], and I believe these skills would help support [Company Goal/Project].\n\nI’d love the opportunity to connect and share more about how I can contribute.\n\nBest,\n[Your Name]",
        preview:
          "Dear [Hiring Manager's Name], I’m writing to express my interest in the [Job Title]...",
        usageCount: 0,
        lastUsed: null,
        aiResponseScore: 0,
        tags: ["application", "value", "skills"],
        createdAt: "2025-08-23T00:00:00.000Z",
      },
    ],
  },
  {
    category: "Networking",
    templates: [
      {
        id: "networking_1",
        title: "Connection Request",
        subject: "Exploring opportunities at [Company Name]",
        body: "Hi [Recipient's Name],\n\nI admire the work being done at [Company Name], especially in [Relevant Area]. As someone with experience in [Your Skill/Industry], I’d love to learn more about your journey at [Company Name] and explore ways I might contribute.\n\nWould you be open to a brief chat?\n\nThanks,\n[Your Name]",
        preview:
          "Hi [Recipient's Name], I admire the work being done at [Company Name]...",
        usageCount: 0,
        lastUsed: null,
        aiResponseScore: 0,
        tags: ["networking", "connection", "chat"],
        createdAt: "2025-08-23T00:00:00.000Z",
      },
      {
        id: "networking_2",
        title: "Informational Chat",
        subject: "Seeking advice on [Industry/Role] at [Company Name]",
        body: "Dear [Recipient's Name],\n\nI’m [Your Name], currently working in [Your Field]. I’m very interested in opportunities at [Company Name] and would appreciate your insights on [Role/Industry Trend].\n\nIf you’re available for a short call or message exchange, it would mean a lot.\n\nWarm regards,\n[Your Name]",
        preview:
          "Dear [Recipient's Name], I’m [Your Name], currently working in [Your Field]...",
        usageCount: 0,
        lastUsed: null,
        aiResponseScore: 0,
        tags: ["networking", "advice", "industry"],
        createdAt: "2025-08-23T00:00:00.000Z",
      },
    ],
  },
  {
    category: "Referral Request",
    templates: [
      {
        id: "referral_1",
        title: "Referral for Job Role",
        subject: "Referral Request for [Job Title] at [Company Name]",
        body: "Hi [Recipient's Name],\n\nI noticed that [Company Name] is hiring for a [Job Title] role, and I’m very interested in applying. Given your experience at [Company Name], I was wondering if you’d be open to referring me for this position.\n\nI’ve attached my résumé and would be happy to provide more details. Thank you for considering!\n\nBest,\n[Your Name]",
        preview:
          "Hi [Recipient's Name], I noticed that [Company Name] is hiring for a [Job Title]...",
        usageCount: 0,
        lastUsed: null,
        aiResponseScore: 0,
        tags: ["referral", "job", "ask"],
        createdAt: "2025-08-23T00:00:00.000Z",
      },
      {
        id: "referral_2",
        title: "Friendly Referral Ask",
        subject: "Could you kindly refer me for [Job Title] at [Company Name]?",
        body: "Dear [Recipient's Name],\n\nI hope you’re doing well! I came across the [Job Title] opening at [Company Name] and thought of reaching out to you. With my background in [Your Skills], I believe I’d be a strong fit.\n\nIf you feel comfortable, I’d be truly grateful if you could refer me. Happy to share my résumé or any other details you might need.\n\nThank you so much,\n[Your Name]",
        preview:
          "Dear [Recipient's Name], I hope you’re doing well! I came across the [Job Title]...",
        usageCount: 0,
        lastUsed: null,
        aiResponseScore: 0,
        tags: ["referral", "friendly", "request"],
        createdAt: "2025-08-23T00:00:00.000Z",
      },
    ],
  },
];

export default defaultTemplates;