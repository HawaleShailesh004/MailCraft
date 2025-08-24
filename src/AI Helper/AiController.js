import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import { p } from "framer-motion/client";
const { VITE_GROQ_API_KEY, VITE_GEMINI_API_KEY } = import.meta.env;

const groq = new Groq({
  apiKey: VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const googleGenAI = new GoogleGenAI({
  apiKey: VITE_GEMINI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Helper: Enforce word count in JS
const enforceWordCount = (text, lengthSetting) => {
  const words = text.split(/\s+/).length;
  const ranges = { short: [150, 200], medium: [200, 250], long: [250, 300] };
  const [min, max] = ranges[lengthSetting] || ranges.medium;
  if (words < min || words > max) return false;
  return true;
};

// -----------------------
// 1. Job detail extraction (fast structured parsing)
// -----------------------
export const getJobDetailsFromDescription = async (description) => {
  if (!description || description.length < 30) return null;

  const query = `
You are an expert job description analyzer.  
Extract key details from the following job description:

"${description}"

Return ONLY a valid JSON object in this exact format:
{
  "companyName": "Company Name or empty string",
  "recruiterName": "Recruiter Name or empty string (first only)",
  "roleTitle": "Job Title or empty string",
  "jobUrl": "Job Url or empty string"
}
`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: query }],
    model: "llama-3.1-8b-instant", // lightweight, fast
    temperature: 0,
  });

  try {
    return JSON.parse(response.choices[0]?.message?.content || "{}");
  } catch {
    return { companyName: "", recruiterName: "", roleTitle: "", jobUrl: "" };
  }
};

// -----------------------
// 2. Generate full cold email (Gemini 2.5 Flash)
// -----------------------
export const generateEmailByAI = async (data) => {
  const { jobDetails, personalInfo, companyInfo, emailSettings } = data;
  const prompt = `
You are an expert cold email copywriter. Generate a professional recruiter outreach email.

### Job
Company: ${jobDetails.companyName || ""}
Role: ${jobDetails.roleTitle || ""}
Recruiter: ${jobDetails.recruiterName || ""}
Description: ${jobDetails.jobDescription || ""}

### Candidate
Name: ${personalInfo.name || ""}
Education: ${
    personalInfo.education
      ?.map((e) => `${e.degree} from ${e.institution} (${e.year})`)
      .join(", ") || ""
  }
Skills: ${personalInfo.skills?.join(", ") || ""}
Projects: ${
    personalInfo.projects?.map((p) => `${p.title}: ${p.details}`).join("; ") ||
    ""
  }
Additional Info: ${personalInfo.additionalInfo || ""}
Links: ${personalInfo.links?.join(", ") || ""}

### Company (Optional)
Mission: ${companyInfo.mission || ""}
Values: ${companyInfo.values || ""}
Recent News: ${companyInfo.recentNews || ""}

Tone: ${emailSettings.tone || "professional"}
Length: ${
    emailSettings.length || "medium"
  } (short:150-200, medium:200-250, long:250-300)
Subject Line: ${
    emailSettings.subjectLine || ""
  } (generate if empty, max 8 words)

Instructions:
- Generate concise, engaging subject and body.
- Highlight 2-3 relevant skills/projects.
- Include personalized greeting & motivation.
- End with CTA, thank you, candidate name, and links.
- Use <br/> for line breaks.
- Output ONLY valid JSON: { "subject": "...", "body": "..." }
`;

  const response = await googleGenAI.models.generateContent({
    model: "gemini-2.5-flash",
    temperature: 0.6,
    contents: prompt,
  });

  let content = response.text
    .replace(/^```(?:json)?\s*/, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(content);
    // enforce word count in JS
    if (!enforceWordCount(parsed.body, emailSettings.length)) {
      console.warn("Word count outside range, consider regenerating");
    }
    return { subject: parsed.subject || "", body: parsed.body || "" };
  } catch {
    return { subject: "", body: content };
  }
};

// -----------------------
// 3. Regenerate full email with feedback (Gemini 2.5 Flash)
// -----------------------
export const regenerateEmailByAI = async (data, userComment) => {
  const {
    jobDetails,
    personalInfo,
    companyInfo,
    emailSettings,
    generatedEmail,
  } = data;

  const prompt = `
You are an expert AI assistant for revising professional emails.
CURRENT EMAIL:
Subject: "${generatedEmail.subject}"
Body: ${generatedEmail.body}

Candidate Info: Name: ${personalInfo.name}, Skills: ${
    personalInfo.skills?.join(", ") || ""
  }, Projects: ${
    personalInfo.projects?.map((p) => p.title + ": " + p.details).join("; ") ||
    ""
  }
Job Info: Company: ${jobDetails.companyName}, Role: ${
    jobDetails.roleTitle
  }, Recruiter: ${jobDetails.recruiterName}, Description: ${
    jobDetails.jobDescription
  }
Company Info: Mission: ${companyInfo.mission}, Values: ${
    companyInfo.values
  }, Recent News: ${companyInfo.recentNews}

USER FEEDBACK:
${userComment || "No feedback provided."}

Instructions:
- Apply feedback, maintain tone, skills/projects highlights.
- Preserve HTML <br/> breaks.
- Output ONLY JSON: { "subject": "string", "body": "string" }
`;

  const response = await googleGenAI.models.generateContent({
    model: "gemini-2.5-flash",
    temperature: 0.6,
    contents: prompt,
  });

  let content = response.text
    .replace(/^```(?:json)?\s*/, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(content);
    if (!enforceWordCount(parsed.body, emailSettings.length)) {
      console.warn("Word count outside range after feedback");
    }
    return { subject: parsed.subject || "", body: parsed.body || "" };
  } catch {
    return { subject: generatedEmail.subject || "", body: response.text };
  }
};

// -----------------------
// 4. Regenerate subject only (Gemini 2.0 Flash)
// -----------------------
export const regenerateEmailSubjectByAI = async (data, userComment) => {
  const { jobDetails, personalInfo, currentSubject } = data;

  const prompt = `
You are an expert AI assistant for high-converting email subject lines.
Current subject: "${currentSubject || ""}"
Job: ${jobDetails.roleTitle} at ${jobDetails.companyName}
Candidate: ${personalInfo.name}, Skills: ${
    personalInfo.skills?.join(", ") || ""
  }
USER FEEDBACK: ${userComment || "No feedback"}

Instructions: Generate ONE concise, engaging subject line. Output ONLY the subject text.
`;

  const response = await googleGenAI.models.generateContent({
    model: "gemini-2.0-flash",
    temperature: 0.5,
    contents: prompt,
  });

  return response.text.trim() || currentSubject || "";
};

// -----------------------
// 5. Generate templated email (fast, structured parsing with LLaMA)
// -----------------------
export const generateTemplatedEmailByAI = async ({ subject, body }) => {
  const prompt = `
You are an expert cold email template generator.

I will give you a recruiter outreach email (subject + body).  
Your task is to transform it into a **reusable email template** by:

1. Identifying all dynamic values (e.g. recruiter name, company name, job title, applicant name, skills, years of experience, times, locations, role levels, project names, etc.).  
2. Replacing them with meaningful placeholders wrapped in double curly braces, like:  
   - {{recruiter_name}}  
   - {{company_name}}  
   - {{job_title}}  
   - {{your_name}}  
   - {{skills}}  
   - {{years_of_experience}}  
   - {{time}}  
   - {{location}}  
   - {{role_level}}  
   - {{project_name}}  

3. Keep the rest of the text intact. Do not shorten or rephrase unnecessarily.  
4. Ensure the subject is also templated if it contains dynamic values.  
5. Generate a **title**: short, human-readable, max 6 words, describing the purpose of this template.  
6. Suggest 4–5 **related tags** (skills, role type, industry, tone, etc.) as an array of strings.  
7. Return strictly a clean JSON object with this structure (no comments, no extra text):

{
  "title": "<short template title>",
  "subject": "<templated subject>",
  "body": "<templated body>",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}

---

Example Input:
Subject: Application for Frontend Engineer role at Google
Body: Hi John,  
I am excited to apply for the Frontend Engineer position at Google.  
With my 3 years of experience in React and Node.js, I believe I’d be a strong fit.  
I will follow up with you tomorrow regarding next steps.  

Example Output:
{
  "title": "Frontend Engineer Outreach",
  "subject": "Application for {{job_title}} role at {{company_name}}",
  "body": "Hi {{recruiter_name}},\\n\\nI am excited to apply for the {{job_title}} position at {{company_name}}.\\nWith my {{years_of_experience}} years of experience in {{skills}}, I believe I’d be a strong fit.\\nI will follow up with you {{time}} regarding next steps.\\n\\nBest,\\n{{your_name}}",
  "tags": ["frontend", "react", "job application", "outreach", "software engineering"]
}

---

Now, here’s the email to template:
SUBJECT: ${subject}
BODY: ${body}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  let content = response.choices[0]?.message?.content?.trim() || "{}";

  // -----------------------
  // 3. Clean + Parse JSON
  // -----------------------

  let newContent = content
    .replace(/^```(?:json)?\s*/, "")
    .replace(/```$/, "")
    .trim();

  const parsed = JSON.parse(newContent);

  return parsed;
};

export default getJobDetailsFromDescription;
