require("dotenv").config();

const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

// ========================================
// GEMINI CONFIGURATION
// ========================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing from backend .env");
}

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

// ========================================
// GEMINI MODEL
// ========================================

const GEMINI_MODEL = "gemini-3.5-flash-lite";

// ========================================
// PARSE RESUME
// ========================================

const parseResume = async (buffer) => {
  let parser;

  try {
    // ========================================
    // 1. CHECK API KEY
    // ========================================

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is missing from backend .env"
      );
    }

    if (!ai) {
      throw new Error(
        "Gemini AI client could not be initialized."
      );
    }

    // ========================================
    // 2. CHECK PDF BUFFER
    // ========================================

    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error("Invalid PDF file received.");
    }

    console.log("📄 Extracting PDF text...");

    // ========================================
    // 3. PARSE PDF
    // ========================================

    parser = new PDFParse({
      data: buffer,
    });

    const pdfData = await parser.getText();

    const resumeText = pdfData?.text || "";

    if (!resumeText.trim()) {
      throw new Error(
        "Could not extract text from the uploaded PDF."
      );
    }

    console.log(
      "✅ PDF text extracted:",
      resumeText.length,
      "characters"
    );

    // ========================================
    // 4. LIMIT RESUME TEXT
    // ========================================

    const limitedResumeText = resumeText.substring(0, 7000);

    // ========================================
    // 5. GEMINI PROMPT
    // ========================================

    const prompt = `
You are a professional resume parser.

Extract information from the resume and return structured JSON.

Return ONLY valid JSON.

Do not use:
- Markdown
- Code fences
- Explanations
- Extra fields

Return exactly this structure:

{
  "fullName": "",
  "email": "",
  "phone": "",
  "about": "",
  "skills": [],
  "github": "",
  "linkedin": ""
}

Rules:

1. fullName:
Extract the candidate's full name.

2. email:
Extract the candidate's email address.

3. phone:
Extract the candidate's phone number.

4. about:
Create a short professional summary based ONLY
on information available in the resume.

5. skills:
Return technical and professional skills
as an array of strings.

6. github:
Extract the GitHub URL if available.
Otherwise return an empty string.

7. linkedin:
Extract the LinkedIn URL if available.
Otherwise return an empty string.

8. If information is unavailable,
return an empty string.

9. Never invent information.

10. skills must always be an array.

Resume:

${limitedResumeText}
`;

    // ========================================
    // 6. SEND TO GEMINI
    // ========================================

    console.log(
      `🤖 Sending resume to Gemini (${GEMINI_MODEL})...`
    );

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    // ========================================
    // 7. GET GEMINI RESPONSE
    // ========================================

    const generatedText = response?.text || "";

    console.log("✅ Gemini response received");

    if (!generatedText.trim()) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    console.log(
      "🤖 Gemini raw response:",
      generatedText
    );

    // ========================================
    // 8. PARSE JSON
    // ========================================

    let result;

    try {
      result = JSON.parse(generatedText);
    } catch (jsonError) {
      console.error(
        "❌ Gemini returned invalid JSON."
      );

      console.error(
        "Raw Gemini response:",
        generatedText
      );

      throw new Error(
        "Gemini returned invalid JSON. Please try again."
      );
    }

    // ========================================
    // 9. VALIDATE RESULT
    // ========================================

    if (
      !result ||
      typeof result !== "object" ||
      Array.isArray(result)
    ) {
      throw new Error(
        "Gemini returned an invalid resume object."
      );
    }

    // ========================================
    // 10. CLEAN SKILLS
    // ========================================

    let skills = [];

    if (Array.isArray(result.skills)) {
      skills = result.skills
        .filter(
          (skill) => typeof skill === "string"
        )
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // ========================================
    // 11. CLEAN FINAL RESULT
    // ========================================

    const parsedResume = {
      fullName:
        typeof result.fullName === "string"
          ? result.fullName.trim()
          : "",

      email:
        typeof result.email === "string"
          ? result.email.trim()
          : "",

      phone:
        typeof result.phone === "string"
          ? result.phone.trim()
          : "",

      about:
        typeof result.about === "string"
          ? result.about.trim()
          : "",

      skills,

      github:
        typeof result.github === "string"
          ? result.github.trim()
          : "",

      linkedin:
        typeof result.linkedin === "string"
          ? result.linkedin.trim()
          : "",
    };

    // ========================================
    // 12. SUCCESS LOG
    // ========================================

    console.log(
      "========================================"
    );

    console.log(
      "✅ RESUME PARSED SUCCESSFULLY"
    );

    console.log(
      "========================================"
    );

    console.log(
      "👤 Name:",
      parsedResume.fullName
    );

    console.log(
      "📧 Email:",
      parsedResume.email
    );

    console.log(
      "📱 Phone:",
      parsedResume.phone
    );

    console.log(
      "🛠️ Skills:",
      parsedResume.skills
    );

    console.log(
      "🐙 GitHub:",
      parsedResume.github
    );

    console.log(
      "💼 LinkedIn:",
      parsedResume.linkedin
    );

    return parsedResume;

  } catch (error) {

    // ========================================
    // ERROR HANDLING
    // ========================================

    console.error(
      "========================================"
    );

    console.error(
      "❌ AI RESUME PARSING FAILED"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Status:",
      error?.status
    );

    console.error(
      "Full error:",
      error
    );

    throw error;

  } finally {

    // ========================================
    // CLEANUP PDF PARSER
    // ========================================

    if (parser) {
      try {
        await parser.destroy();

        console.log(
          "🧹 PDF parser cleaned up"
        );

      } catch (cleanupError) {

        console.error(
          "⚠️ PDF parser cleanup error:",
          cleanupError
        );
      }
    }
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  parseResume,
};