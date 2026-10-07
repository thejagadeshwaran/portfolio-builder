async function processPortfolioAI(userId, filePath) {
  try {
    const prompt = `Extract all personal and professional information from the resume file at: ${filePath}
You are a professional resume writer. Output ONLY valid JSON with this exact structure:

{
  "portfolioTitle": "string",
  "fullName": "string",
  "username": "string",
  "theme": "modern-classic / minimal / creative / professional",
  "bio": "short professional summary (3-4 lines)",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "period": "2020 - Present",
      "description": "2-3 bullet points"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University",
      "period": "2018 - 2022"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "What it does + tech used",
      "link": "optional github link"
    }
  ],
  "contact": {
    "email": "email@example.com",
    "github": "username",
    "linkedin": "optional"
  }
}`;

    // === Using the CURRENT official SDK (2026) ===
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const jsonText = response.text;
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}') + 1;
    const cleanJson = jsonText.substring(jsonStart, jsonEnd);

    const parsed = JSON.parse(cleanJson);

    // Save to MongoDB
    const Portfolio = require('../models/Portfolio');
    const newPortfolio = new Portfolio({
      userId,
      ...parsed,
      lastUpdated: new Date(),
      views: 0,
      resumeDownloads: 0,
      githubClicks: 0,
      contactMessages: 0
    });

    await newPortfolio.save();
    console.log('✅ AI portfolio created for user:', userId);
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('AI processing failed: ' + error.message);
  }
}

module.exports = { processPortfolioAI };