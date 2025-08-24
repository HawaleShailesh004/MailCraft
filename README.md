# MailCraft

**AI-Powered Personalized Cold Email Generator**

MailCraft leverages advanced AI to generate highly personalized cold emails for job applications. It streamlines the process of crafting outreach emails by analyzing job descriptions, company info, and your personal profile, producing professional, ready-to-send emails in seconds.

---

## Live Demo

👉 [MailCraft](https://mail-craftt.vercel.app)

## 🌟 Key Features

- **AI-Powered Email Generation**  
  Generate personalized emails using LLaMA-70b / 3.3Instant. Simply paste a job description or input company & recruiter details; AI fills in the rest.

- **Smart Input Handling**

  - Job details: company name, recruiter name, job description, URL (manual or AI-assisted)
  - Personal info: name, education, experience, skills, projects, additional info (manual or via uploaded txt/docx/image)
  - Optional company info: mission, values

- **Email Customization**

  - Inline rich text editor (mini Gmail-like)
  - Edit, style, or remove content
  - Regenerate full email, subject, or sections based on feedback
  - Copy or download email as text

- **Template Management**

  - Save generated emails as reusable templates with AI placeholders
  - Edit, filter, and sort user-created templates
  - Built-in template library for instant use

- **Analytics & Performance Tracking**
  - Track usage count, last used date, and AI response score for each template

---

## 📸 Screenshots & Demos

| Page         | Screenshot / GIF                        |
| ------------ | --------------------------------------- |
| Landing Page | ![Landing](./screenshots/landing.gif)    |
| Email Wizard | ![Wizard](./screenshots/wizard.gif)       |
| Templates    | ![Templates](./screenshots/templates.gif) |

---

## 🛠 Tech Stack

- **Frontend:** ReactJS, Tailwind CSS, Framer Motion, React Router
- **AI Backend:** GROQ API, Gemini 2.5 / 2.0 Flash, LLaMA 8B Instant
- **Other Libraries:** Rich text editor, Lucide icons
- **Storage:** LocalStorage (future: database integration)

---

## 🚀 How It Works

1. **Input Job & Personal Info**

   - Paste job description or enter manually
   - Upload personal info via file or manual input

2. **Configure Email**

   - Optional company info: mission, values
   - Select tone & length

3. **Generate Email**

   - AI generates highly personalized cold email

4. **Edit & Refine**

   - Use rich text editor to style, edit, or remove content
   - Regenerate entire email or just the subject line
   - Provide feedback or comments for AI refinement

5. **Save & Use**
   - Copy, download, or send email via `mailto:`
   - Save email as a template for future use

---

## ⚡ Getting Started

1. **Clone Repository**

```bash
git clone https://github.com/HawaleShailesh004/MailCraft.git
cd MailCraft
```

2. **Install Dependencies**

```bash
npm install
```

3. **Add Environment Variable**
   Create a .env file in the root directory:

```bash
VITE_GROQ_API_KEY=your_api_key_here
```

4. **Run Development Server**

```bash
npm run dev
```

Open http://localhost:5173 - Run in your browser

## 📈 Future Roadmap

- **Full backend integration** for templates and email sending
- **Advanced analytics dashboard** for performance tracking
- **Multi-language email generation** to support global outreach
- **Enhanced AI feedback & learning system** for smarter email generation

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) for full usage and contribution details.

---

**MailCraft** — Transforming cold email outreach with AI-powered precision.
