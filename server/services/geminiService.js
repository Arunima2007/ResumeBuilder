// server/services/geminiService.js
const { GoogleGenAI } = require('@google/genai');

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  /**
   * Build a structured text representation of the resume for the prompt
   */
  buildResumeText(resume) {
    let text = '';

    // Profile
    if (resume.profile) {
      const p = resume.profile;
      text += `## PROFILE\n`;
      text += `Name: ${p.firstName || ''} ${p.lastName || ''}\n`;
      text += `Email: ${p.email || 'Not provided'}\n`;
      text += `Phone: ${p.mobile || 'Not provided'}\n`;
      text += `LinkedIn: ${p.linkedIn || 'Not provided'}\n`;
      text += `GitHub: ${p.github || 'Not provided'}\n`;
      if (p.summary) text += `Summary: ${p.summary}\n`;
      if (p.objective) text += `Objective: ${p.objective}\n`;
      text += '\n';
    }

    // Education
    if (resume.education && Array.isArray(resume.education) && resume.education.length > 0) {
      text += `## EDUCATION\n`;
      resume.education.forEach((edu, i) => {
        text += `${i + 1}. ${edu.college || edu.school || 'Institution'}\n`;
        text += `   Degree/Field: ${edu.field || edu.degree || 'Not specified'}\n`;
        text += `   Branch: ${edu.branch || 'N/A'}\n`;
        text += `   Year: ${edu.startYear || ''} - ${edu.endYear || ''}\n`;
        text += `   Grades: ${edu.grades || 'Not specified'}\n`;
        if (edu.description) text += `   Details: ${edu.description}\n`;
      });
      text += '\n';
    }

    // Experience
    if (resume.experience && Array.isArray(resume.experience) && resume.experience.length > 0) {
      text += `## EXPERIENCE\n`;
      resume.experience.forEach((exp, i) => {
        text += `${i + 1}. ${exp.role || exp.title || 'Role'} at ${exp.institute || exp.company || 'Company'}\n`;
        text += `   Duration: ${exp.start_date || ''} - ${exp.end_date || 'Present'}\n`;
        if (exp.desc || exp.description) text += `   Description: ${exp.desc || exp.description}\n`;
      });
      text += '\n';
    }

    // Projects
    if (resume.projects && Array.isArray(resume.projects) && resume.projects.length > 0) {
      text += `## PROJECTS\n`;
      resume.projects.forEach((proj, i) => {
        text += `${i + 1}. ${proj.title || 'Project'}\n`;
        if (proj.description) text += `   Description: ${proj.description}\n`;
        if (proj.techStack) text += `   Tech Stack: ${proj.techStack}\n`;
        if (proj.link) text += `   Link: ${proj.link}\n`;
      });
      text += '\n';
    }

    // Skills
    if (resume.extraDetails) {
      const extra = resume.extraDetails;
      if (extra.skills) {
        text += `## SKILLS\n`;
        if (typeof extra.skills === 'object' && !Array.isArray(extra.skills)) {
          Object.entries(extra.skills).forEach(([category, skills]) => {
            if (Array.isArray(skills) && skills.length > 0) {
              text += `${category}: ${skills.join(', ')}\n`;
            }
          });
        } else if (Array.isArray(extra.skills)) {
          text += extra.skills.join(', ') + '\n';
        }
        text += '\n';
      }

      if (extra.achievements && Array.isArray(extra.achievements) && extra.achievements.length > 0) {
        text += `## ACHIEVEMENTS\n`;
        extra.achievements.forEach((ach, i) => {
          text += `${i + 1}. ${ach}\n`;
        });
        text += '\n';
      }

      if (extra.extraCoCurricular && Array.isArray(extra.extraCoCurricular) && extra.extraCoCurricular.length > 0) {
        text += `## EXTRACURRICULAR ACTIVITIES\n`;
        extra.extraCoCurricular.forEach((act, i) => {
          text += `${i + 1}. ${act}\n`;
        });
        text += '\n';
      }
    }

    return text;
  }

  /**
   * Full AI-powered resume analysis
   */
  async analyzeResume(resume, jobDescription = '') {
    const resumeText = this.buildResumeText(resume);

    const jdSection = jobDescription.trim()
      ? `\n\n## TARGET JOB DESCRIPTION:\n${jobDescription}\n\nPlease also provide ATS match analysis comparing the resume against this job description.`
      : '\n\nNo specific job description provided. Provide general resume improvement advice.';

    const prompt = `You are an expert resume analyst and career coach. Analyze the following resume and provide detailed, actionable feedback.

${resumeText}
${jdSection}

Respond ONLY with valid JSON in this exact structure (no markdown, no code fences, no extra text):
{
  "overallScore": <number 0-100>,
  "scoreLabel": "<one of: Excellent, Strong, Good, Needs Improvement, Weak>",
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "sections": {
    "profile": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about profile/contact section>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "education": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about education section>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "experience": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about experience section>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "projects": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about projects section>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    },
    "skills": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about skills section>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }
  },
  "atsOptimization": {
    "score": <number 0-100>,
    "tips": ["<ATS tip 1>", "<ATS tip 2>", "<ATS tip 3>"],
    "keywordsToAdd": ["<keyword 1>", "<keyword 2>"],
    "formattingIssues": ["<issue 1>", "<issue 2>"]
  },
  "actionItems": [
    {
      "priority": "<high|medium|low>",
      "action": "<specific action to take>",
      "impact": "<expected impact of this action>"
    }
  ],
  "industryFit": "<paragraph about how well this resume fits common industry expectations>",
  "rewriteSuggestions": [
    {
      "original": "<original bullet point or text from resume>",
      "improved": "<rewritten version with stronger impact>"
    }
  ]
}`;

    try {
  const result = await this.ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ],
    generationConfig: {
      temperature: 0.3,
    },
  });

  let text =
    result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  text = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  console.log("Gemini raw response:", text);

  const parsed = JSON.parse(text);

  return { success: true, data: parsed };

} catch (error) {
  console.error("Gemini analysis error:", error);

  return {
    success: false,
    error: `AI analysis failed: ${error.message}`,
  };
}
  }

  /**
   * Quick targeted analysis (faster, smaller prompt)
   */
  async quickAnalysis(resume) {
    const resumeText = this.buildResumeText(resume);

    const prompt = `You are a resume expert. Give a quick assessment of this resume.

${resumeText}

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "score": <number 0-100>,
  "verdict": "<one short sentence verdict>",
  "topStrengths": ["<strength 1>", "<strength 2>"],
  "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "missingElements": ["<missing element if any>"],
  "quickTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

    try {
      const result = await this.ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});

let text = result.text || "";
text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
console.log("Gemini raw response:", text);
const parsed = JSON.parse(text);
return { success: true, data: parsed };
    } catch (error) {
      console.error('Gemini quick analysis error:', error);
      return {
        success: false,
        error: `Quick analysis failed: ${error.message}`
      };
    }
  }
}

// Singleton instance
let geminiServiceInstance = null;

function getGeminiService() {
  if (!geminiServiceInstance) {
    geminiServiceInstance = new GeminiService();
  }
  return geminiServiceInstance;
}

module.exports = { GeminiService, getGeminiService };