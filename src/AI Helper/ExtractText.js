import Groq from "groq-sdk";
import mammoth from "mammoth";

const { VITE_GROQ_API_KEY, VITE_PUTER_API_KEY } = import.meta.env;

const groq = new Groq({
  apiKey: VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// ========== MAIN ENTRY ==========
const getTextfromFile = async (file) => {
  if (!file) return;

  const ext = file.name.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
    return await handleImageFile(file);
  } else if (ext === "docx") {
    return await handleDOCXFile(file);
  } else if (ext === "txt") {
    return await handleTXTFile(file);
  } else {
    throw new Error("Unsupported file type");
  }
};

// ========== 🖼️ IMAGE HANDLER (Puter OCR) ==========
const handleImageFile = async (file) => {
  try {
    const text = await callPuterOCR(file);
    return await analyzeResumeWithGroq(text);
  } catch (err) {
    console.error("Error extracting text from image:", err);
    throw err;
  }
};

// ========== 📑 DOCX HANDLER ==========
const handleDOCXFile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    // console.log(value);
    return await analyzeResumeWithGroq(value);
  } catch (err) {
    console.error("Error extracting text from DOCX:", err);
    throw err;
  }
};

// ========== 📝 TXT HANDLER ==========
const handleTXTFile = async (file) => {
  try {
    const text = await file.text();
    // console.log(text);
    return await analyzeResumeWithGroq(text);
  } catch (err) {
    console.error("Error extracting text from TXT:", err);
    throw err;
  }
};

// ========== 📌 Puter OCR Call ==========
const callPuterOCR = async (file) => {
  try {
    // Convert File → Data URL
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Pass Data URL to Puter OCR
    const text = await puter.ai.img2txt(dataUrl);

    // Send extracted text to Groq for analysis
    return await analyzeResumeWithGroq(text);
  } catch (err) {
    console.error("Error calling Puter OCR:", err);
    throw err;
  }
};

// ========== 🤖 Groq LLaMA-70B Analyzer ==========
const analyzeResumeWithGroq = async (rawText) => {
  const query = `
You are an expert Resume Analyzer. Extract structured JSON:

personalInfo: {
  name: "Name of the person whose resume is being analyzed",
  skills: [ "skill1", "skill2" ],
  projects: [
    { title: "Project", details: "Tech + contributions" }
  ],
  experience: [
    { company: "Company", role: "Title", duration: "Start-End", details: "Work done" }
  ],
  education: [
    { institution: "University", degree: "Degree", year: "YYYY" }
  ],
  links: [ "URL" ],
  additionalInfo: "Summary/certs/awards"
}

⚠️ Rules:
- Strict JSON only
- Use empty arrays if missing
`;
  const inputText =
    typeof rawText === "string" ? rawText : JSON.stringify(rawText);

  const resp = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a JSON resume extractor." },
      { role: "user", content: inputText },
      { role: "user", content: query },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 1,
  });

  try {
    // console.log("Data from Extract", resp.choices[0]?.message?.content || "");
    return resp.choices[0]?.message?.content || "{}";
  } catch {
    return {};
  }
};

export default getTextfromFile;
