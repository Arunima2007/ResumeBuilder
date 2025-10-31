// utils/constants.js
const ANALYSIS_PROMPTS = {
  comprehensive: `
  Analyze the following resume data and provide a comprehensive evaluation. 
  You MUST respond with ONLY valid JSON, no other text or markdown.

  RESUME DATA:
  {resumeData}

  Respond with this exact JSON structure:
  {
    "overallScore": 85,
    "sectionScores": {
      "personal": 90,
      "education": 80,
      "experience": 85,
      "projects": 75,
      "skills": 90
    },
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"],
    "atsScore": 80,
    "aiSuggestions": {
      "immediateImprovements": ["suggestion1", "suggestion2"],
      "longTermSuggestions": ["suggestion1", "suggestion2"]
    }
  }

  Evaluation criteria:
  - Content completeness (0-100)
  - ATS optimization (0-100) 
  - Skills relevance (0-100)
  - Project impact (0-100)
  - Professional presentation (0-100)
  `,

  quick: `
  Quick resume analysis. Respond with ONLY JSON, no other text.

  Resume: {resumeData}

  JSON response format:
  {
    "overallScore": 75,
    "strengths": ["..."],
    "improvements": ["..."],
    "atsScore": 70
  }
  `,

  ats: `
  ATS optimization check. Respond with ONLY JSON.

  Resume: {resumeData}

  JSON response:
  {
    "atsScore": 85,
    "keywords": ["keyword1", "keyword2"],
    "missingKeywords": ["keyword1", "keyword2"],
    "formattingIssues": ["issue1", "issue2"]
  }
  `
};

module.exports = { ANALYSIS_PROMPTS };