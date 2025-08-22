import { desc } from "framer-motion/client";
import Groq from "groq-sdk";
const { VITE_GROQ_API_URL, VITE_GROQ_API_KEY } = import.meta.env;

const groq = new Groq({
  apiKey: VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const getJobDetailsFromDescription = async (description) => {
  if (!description || description.length < 30) return null;

  const jobDetails = {
    companyName: "",
    recruiterName: "",
    jobTitle: "",
  };

  // Groq query to extract job details from the description
  const query = `
You are an expert job description analyzer.  
Extract key details from the following job description:

"${description}"

Return the result as a valid JSON object in this exact format:
{
  "companyName": "Company Name or empty string",
  "recruiterName": "Recruiter Name or empty string (get the first recruiter only)",
  "roleTitle": "Job Title or empty string",
  "jobUrl": "Job Url or empty string"
}

Do not include explanations or extra text. Return only the JSON.
`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 1,
  });

  console.log(response.choices[0]?.message?.content || "");
  return JSON.parse(response.choices[0]?.message?.content || "{}");
};

/**
 * Generate a high-converting cold email using Groq AI
 * @param {Object} data - The wizard data containing jobDetails, personalInfo, companyInfo, emailSettings
 * @returns {Object} - { subject: string, body: string }
 */
export const generateEmailByAI = async (data) => {
  try {
    const { jobDetails, personalInfo, companyInfo, emailSettings } = data;

    // -----------------------
    // 1. Build structured prompt
    // -----------------------
    const prompt = `
You are an expert cold email copywriter specializing in recruiter outreach. 
Your task is to craft a recruiter outreach email for a candidate applying to a job.

### Word Count Requirement
The email body MUST fall within the selected range:
- short: 150–200 words
- medium: 200–250 words
- long: 250–300 words
⚠️ If your draft does not fit, you must rewrite until it does.

### Job Information
- Company: ${jobDetails.companyName || ""}
- Role: ${jobDetails.roleTitle || ""}
- Recruiter: ${jobDetails.recruiterName || ""}
- Job Description: ${jobDetails.jobDescription || ""}
- Job URL: ${jobDetails.jobUrl || ""}

### Candidate Information
- Name: ${personalInfo.name || ""}
- Education: ${
      personalInfo.education
        ?.map((e) => `${e.degree} from ${e.institution} (${e.year})`)
        .join(", ") || ""
    }
- Skills: ${personalInfo.skills?.join(", ") || ""}
- Projects: ${
      personalInfo.projects
        ?.map((p) => `${p.title}: ${p.details}`)
        .join("; ") || ""
    }
- Additional Info: ${personalInfo.additionalInfo || ""}
- Links (portfolio, GitHub, LinkedIn, etc.): ${
      personalInfo.links?.join(", ") || ""
    }

### Company Information (optional, use only if relevant)
- Mission: ${companyInfo.mission || ""}
- Values: ${companyInfo.values || ""}
- Recent News: ${companyInfo.recentNews || ""}

### Email Settings
- Tone: ${emailSettings.tone || "professional"}
- Length: ${emailSettings.length || "medium"}
- Subject Line: ${
      emailSettings.subjectLine || ""
    } (if empty, generate one under 8 words)

### Rules
1. Subject line should be concise, engaging, and tailored to the role.
2. Greet recruiter by name if available; else use "Hi Hiring Manager".
3. Start with a personalized opening referencing the role or company.
4. Highlight 2–3 strongest skills/projects most relevant to the job.
5. Clearly state motivation for applying (why candidate values this company/role).
6. Keep tone consistent with ${emailSettings.tone || "professional"}.
7. End with:
   - a polite CTA (e.g., "Would you be open to a quick call?")
   - a thank you
   - candidate name + role/identity
   - relevant links (GitHub, LinkedIn, Portfolio, etc.)
8. Avoid buzzwords, clichés, or robotic phrasing.
9. Strictly follow the word count rules:
   - Short: 150–200 words
   - Medium: 200–250 words
   - Long: 250–300 words
10. Use <br/> tags for line breaks in the body. Do not return plain text paragraphs.
11. Output JSON ONLY with keys: "subject", "body". Do not add comments.
12. Respond strictly in valid JSON. If you include extra characters, your response will be rejected.

⚠️ Final Instructions:
- Count words in the body text before returning.
- If word count is outside the required range (${
      emailSettings.length
    }), rewrite until it fits.
- Ensure all new lines in the body are represented with <br/> tags.
- Only output valid JSON in this format:
{ "subject": "...", "body": "..." }

### Example Output
{
  "subject": "Excited to Apply for Frontend Developer",
  "body": "Hi [Recruiter Name],<br/><br/>I am excited to apply..."
}
`;

    // -----------------------
    // 2. Call Groq API
    // -----------------------
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.6, // more natural but not too random
      messages: [{ role: "user", content: prompt }],
    });

    let content = response.choices[0]?.message?.content?.trim() || "{}";

    // -----------------------
    // 3. Clean + Parse JSON
    // -----------------------
    try {
      let newContent = content
        .replace(/^```(?:json)?\s*/, "")
        .replace(/```$/, "")
        .trim();

      const parsed = JSON.parse(newContent);

      // Always return valid subject & body
      return {
        subject: parsed.subject || "",
        body: parsed.body || "",
      };
    } catch (err) {
      console.error("Failed to parse AI JSON:", err, content);
      return { subject: "", body: content }; // fallback
    }
  } catch (err) {
    console.error("Error generating email:", err);
    return { subject: "", body: "" };
  }
};

/**
 * Regenerate an existing email based on AI feedback and user comments
 * @param {Object} data - Wizard data including existing email and user comments
 * @returns {Object} - { subject: string, body: string }
 */
export const regenerateEmailByAI = async (data, userComment) => {
  const {
    jobDetails,
    personalInfo,
    companyInfo,
    emailSettings,
    generatedEmail,
  } = data;

  console.log(userComment);

  const prompt = `
You are an expert AI assistant for revising professional job application emails.

Here is the CURRENT EMAIL:

Subject: "${generatedEmail.subject || ""}"

Body:
${generatedEmail.body || ""}

Candidate Information:
- Name: ${personalInfo.name || ""}
- Skills: ${personalInfo.skills?.join(", ") || ""}
- Projects: ${
    personalInfo.projects?.map((p) => p.title + ": " + p.details).join("; ") ||
    ""
  }
- Education: ${
    personalInfo.education
      ?.map((e) => e.degree + " from " + e.institution + " (" + e.year + ")")
      .join(", ") || ""
  }
- Links: ${personalInfo.links?.join(", ") || ""}
- Additional Info: ${personalInfo.additionalInfo || ""}

Job Information:
- Company: ${jobDetails.companyName || ""}
- Role: ${jobDetails.roleTitle || ""}
- Recruiter: ${jobDetails.recruiterName || ""}
- Job Description: ${jobDetails.jobDescription || ""}
- Job URL: ${jobDetails.jobUrl || ""}

Company Information:
- Mission: ${companyInfo.mission || ""}
- Values: ${companyInfo.values || ""}
- Recent News: ${companyInfo.recentNews || ""}

USER FEEDBACK:
${userComment || "No specific feedback provided."}

Instructions for AI:
1. Respect the structure and tone of the original email.
2. Apply the user feedback to improve clarity, enthusiasm, or professionalism.
3. Keep key highlights: skills, projects, achievements.
4. Include links naturally.
5. Maintain the email length as per previous settings.
6. Replace paragraph breaks with HTML <br> tags for formatting.
7. If a section doesn’t need changes, keep it as is.
8. Output ONLY valid JSON in this format:
{
  "subject": "string",
  "body": "string"
}
9. Strictly no comments, explanations, or extra formatting.

⚠️ Priority Rules:
- If user feedback contradicts original tone, structure, or length, always prioritize user feedback.
- Word Count Rule:
   - Match the original email length setting (${
     emailSettings.length || "medium"
   }).
   - Ensure the body word count is strictly within the required range:
      - short: 150–200 words
      - medium: 200–250 words
      - long: 250–300 words
   - Count words BEFORE finalizing. If word count is outside the range, REWRITE until it fits.
   - After applying feedback, the final body must stay within the range.
`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    temperature: 1,
  });

  let content = response.choices[0]?.message?.content?.trim() || "{}";
  try {
    content = content.replace(/^```(?:json)?\s*/, "").replace(/```$/, "");
    return JSON.parse(content);
  } catch {
    return {
      subject: generatedEmail.subject || "",
      body: response.choices[0]?.message?.content || "",
    };
  }
};

export const regenerateEmailSubjectByAI = async (
  { jobDetails, personalInfo, companyInfo, emailSettings, currentSubject },
  userComment
) => {
  console.log(userComment);
  const prompt = `
You are an expert AI assistant specialized in crafting high-converting email subject lines.

Current subject: "${currentSubject || ""}"
Job: ${jobDetails.roleTitle || ""} at ${jobDetails.companyName || ""}
Candidate: ${personalInfo.name || ""}, Skills: ${
    personalInfo.skills?.join(", ") || ""
  }


Instructions:
- Generate a single professional, engaging, and concise subject line for this email.
- Ensure it reflects the job, candidate strengths, and any feedback.
- Return only the subject text.
- strictly no extra comments
`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    temperature: 1,
  });

  return response.choices[0]?.message?.content?.trim() || currentSubject || "";
};

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

  return JSON.parse(response.choices[0].message.content);
};

export default getJobDetailsFromDescription;
