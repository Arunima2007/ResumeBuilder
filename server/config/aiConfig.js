// AI Configuration and Constants

export const AI_CONFIG = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    maxTokens: 2000,
    temperature: 0.7,
    timeout: 30000
  },
  
  // Gemini Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-pro',
    maxTokens: 2000,
    temperature: 0.7,
    timeout: 30000
  },
  
  // Analysis Settings
  analysis: {
    maxRetries: 3,
    timeout: 30000,
    enableFallback: true,
    cacheDuration: 3600000 // 1 hour in milliseconds
  }
};

export const ANALYSIS_PROMPTS = {
  comprehensive: `
    Analyze this resume data comprehensively and provide detailed, actionable feedback in JSON format.
    
    RESUME DATA:
    {resumeData}
    
    IMPORTANT: Return ONLY valid JSON with this exact structure:
    {
      "overallScore": number (0-100),
      "sectionScores": {
        "personal": number (0-100),
        "education": number (0-100),
        "projects": number (0-100),
        "experience": number (0-100),
        "skills": number (0-100)
      },
      "keywordAnalysis": {
        "strengths": string[],
        "missingKeywords": string[],
        "industryRelevance": string
      },
      "atsOptimization": {
        "score": number (0-100),
        "issues": string[],
        "suggestions": string[]
      },
      "contentQuality": {
        "clarity": "excellent|good|fair|poor",
        "impact": "high|medium|low",
        "readability": "excellent|good|fair|poor"
      },
      "aiSuggestions": {
        "immediateImprovements": string[],
        "longTermSuggestions": string[],
        "industryTips": string[]
      }
    }
    
    Scoring Guidelines:
    - 90-100: Excellent - Well-structured, comprehensive, strong content
    - 80-89: Very Good - Minor improvements needed
    - 70-79: Good - Several areas need enhancement
    - 60-69: Fair - Major improvements needed
    - Below 60: Poor - Fundamental issues present
    
    Be specific, constructive, and provide actionable advice. Focus on resume best practices and ATS optimization.
  `,

  quick: `
    Provide a quick resume analysis in JSON format. Be concise but helpful.
    
    RESUME DATA:
    {resumeData}
    
    Return ONLY valid JSON with this structure:
    {
      "overallScore": number,
      "topStrengths": string[],
      "criticalImprovements": string[],
      "atsReady": boolean,
      "quickTips": string[]
    }
  `,

  ats: `
    Analyze this resume specifically for Applicant Tracking System (ATS) optimization.
    
    RESUME DATA:
    {resumeData}
    
    Return ONLY valid JSON with this structure:
    {
      "atsScore": number (0-100),
      "keywordOptimization": {
        "score": number,
        "foundKeywords": string[],
        "missingKeywords": string[]
      },
      "formattingIssues": string[],
      "contentStructure": {
        "score": number,
        "issues": string[],
        "suggestions": string[]
      },
      "atsSuggestions": string[]
    }
    
    Focus on: keyword density, standard section headers, formatting compatibility, and content structure.
  `
};

export const INDUSTRY_KEYWORDS = {
  software: {
    primary: ['javascript', 'python', 'java', 'react', 'node.js', 'html', 'css'],
    secondary: ['mongodb', 'mysql', 'aws', 'docker', 'git', 'api', 'rest', 'agile'],
    frameworks: ['express', 'django', 'spring', 'angular', 'vue', 'bootstrap']
  },
  dataScience: {
    primary: ['python', 'r', 'sql', 'machine learning', 'data analysis', 'statistics'],
    secondary: ['pandas', 'numpy', 'tableau', 'power bi', 'big data', 'visualization'],
    tools: ['jupyter', 'tensorflow', 'pytorch', 'scikit-learn', 'spark']
  },
  webDevelopment: {
    primary: ['html', 'css', 'javascript', 'react', 'angular', 'vue'],
    secondary: ['responsive design', 'cross-browser', 'web performance', 'seo'],
    backend: ['node.js', 'express', 'django', 'flask', 'php', 'laravel']
  },
  mobile: {
    primary: ['android', 'ios', 'react native', 'flutter', 'kotlin', 'swift'],
    secondary: ['mobile ui/ux', 'api integration', 'app store', 'google play']
  }
};

export const ACTION_VERBS = [
  'developed', 'implemented', 'managed', 'optimized', 'created', 'led', 
  'improved', 'built', 'designed', 'engineered', 'launched', 'spearheaded',
  'transformed', 'streamlined', 'automated', 'coordinated', 'directed',
  'established', 'expanded', 'generated', 'initiated', 'integrated',
  'orchestrated', 'pioneered', 'revolutionized', 'strengthened'
];

export const ATS_CHECKLIST = {
  requiredSections: ['contact', 'education', 'experience', 'skills'],
  preferredFormat: ['reverse chronological', 'combination'],
  avoid: ['tables', 'columns', 'images', 'graphics'],
  keywords: {
    minCount: 10,
    optimalDensity: 2.5
  }
};

export const SCORE_WEIGHTS = {
  personal: 0.15,
  education: 0.20,
  experience: 0.25,
  projects: 0.25,
  skills: 0.15
};

export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'AI API key is missing',
  API_TIMEOUT: 'AI service timeout',
  INVALID_RESPONSE: 'Invalid response from AI service',
  RATE_LIMITED: 'Rate limit exceeded',
  SERVICE_UNAVAILABLE: 'AI service unavailable'
};