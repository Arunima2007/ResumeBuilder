// server/controllers/analysis.controller.js
const natural = require('natural');
const compromise = require('compromise');
const stopword = require('stopword');
const stringSimilarity = require('string-similarity');
const { getGeminiService } = require('../services/geminiService');

// Predefined skill database
const SKILLS_DATABASE = {
  programming: ['javascript', 'python', 'java','c\\+\\+', 'c#', 'ruby', 'php', 'swift', 'go', 'rust'],
  frontend: ['react', 'angular', 'vue', 'typescript', 'html', 'css', 'sass', 'bootstrap'],
  backend: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', '.net'],
  databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'firebase'],
  cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'],
  tools: ['git', 'github', 'gitlab', 'jira', 'figma', 'photoshop', 'vs code'],
  soft: ['leadership', 'communication', 'teamwork', 'problem-solving', 'creativity', 'adaptability']
};

// ─── Original rule-based analysis (kept as fallback) ───
exports.analyzeResume = async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    console.log('📨 Received resume:', JSON.stringify(resume, null, 2));
    console.log('📨 Resume keys:', Object.keys(resume || {}));

    // 1. Extract all text from resume
    const resumeText = extractResumeText(resume);
    
    // 2. Extract skills
    const extractedSkills = extractSkills(resumeText);
    const userSkills = extractUserSkills(resume.extraDetails);
    const allSkills = [...new Set([...userSkills, ...extractedSkills])];
    
    // 3. Calculate ATS score if JD provided
    let atsResult = {};
    if (jobDescription && jobDescription.trim()) {
      atsResult = calculateATS(allSkills, resumeText, jobDescription);
    }
    
    // 4. Generate suggestions
    const suggestions = generateSuggestions(resumeText, jobDescription);

    // 5. Calculate completeness
    const completeness = calculateCompleteness(resume);
    
    res.status(200).json({
      success: true,
      data: {
        skills: {
          userProvided: userSkills,
          extracted: extractedSkills,
          all: allSkills,
          count: allSkills.length
        },
        ats: atsResult,
        suggestions: suggestions,
        completeness: completeness,
        stats: {
          wordCount: resumeText.split(/\s+/).length,
          sectionCount: countSections(resume)
        }
      }
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Analysis failed',
      error: error.message
    });
  }
};

// ─── NEW: Gemini AI-powered analysis ───
exports.analyzeWithGemini = async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume data is required"
      });
    }

    console.log("🤖 Starting Gemini full analysis...");

    const gemini = getGeminiService();

    const result = await gemini.analyzeResume(
      resume,
      jobDescription || ""
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
        source: "gemini-ai"
      });
    }

    return res.status(500).json({
      success: false,
      message: result.error,
      source: "gemini-ai"
    });

  } catch (error) {
    console.error("❌ Gemini full analysis error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      source: "gemini-ai"
    });
  }
};

// ─── NEW: Gemini quick analysis ───
exports.quickGeminiAnalysis = async (req, res) => {
  try {
    const { resume } = req.body;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    console.log('⚡ Starting Gemini quick analysis...');
    
    const gemini = getGeminiService();
    const result = await gemini.quickAnalysis(resume);

    if (result.success) {
      console.log('✅ Quick analysis completed');
      res.status(200).json({
        success: true,
        data: result.data,
        source: 'gemini-ai'
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error,
        source: 'gemini-ai'
      });
    }

  } catch (error) {
    console.error('❌ Quick Gemini analysis error:', error);
    res.status(500).json({
      success: false,
      message: `Quick AI analysis failed: ${error.message}`,
      source: 'gemini-ai'
    });
  }
};

// ─── Helper functions (unchanged) ───

function extractResumeText(resume) {
  let text = '';
  
  if (resume.profile) {
    text += ` ${resume.profile.summary || ''}`;
    text += ` ${resume.profile.objective || ''}`;
  }
  
  if (resume.education && Array.isArray(resume.education)) {
    resume.education.forEach(edu => {
      text += ` ${edu.degree || ''} ${edu.school || ''} ${edu.description || ''}`;
    });
  }
  
  if (resume.experience && Array.isArray(resume.experience)) {
    resume.experience.forEach(exp => {
      text += ` ${exp.title || ''} ${exp.company || ''} ${exp.description || ''}`;
    });
  }
  
  if (resume.projects && Array.isArray(resume.projects)) {
    resume.projects.forEach(proj => {
      text += ` ${proj.title || ''} ${proj.description || ''}`;
    });
  }
  
  return text.toLowerCase();
}

function extractSkills(text) {
  const foundSkills = [];
  
  // Check against skills database
  Object.values(SKILLS_DATABASE).forEach(category => {
    category.forEach(skill => {
      // Use regex for whole word matching
      const regex = new RegExp(`\\b${skill}\\b`, 'i');
      if (regex.test(text)) {
        foundSkills.push(skill);
      }
    });
  });
  
  // Use NLP to find additional skills (noun phrases)
  try {
    const doc = compromise(text);
    const nouns = doc.nouns().out('array');
    
    nouns.forEach(noun => {
      if (noun.length > 3 && !foundSkills.includes(noun.toLowerCase())) {
        // Check if noun sounds like a skill/technology
        const techIndicators = ['js', 'api', 'sql', 'db', 'os', 'ui', 'ux', 'dev'];
        if (techIndicators.some(ind => noun.toLowerCase().includes(ind))) {
          foundSkills.push(noun.toLowerCase());
        }
      }
    });
  } catch (error) {
    console.log('NLP extraction failed, using basic matching');
  }
  
  return [...new Set(foundSkills)];
}

function extractUserSkills(extraDetails) {
  if (!extraDetails || !extraDetails.skills) return [];
  
  let skills = [];
  
  // Handle different skill formats
  if (Array.isArray(extraDetails.skills)) {
    skills = extraDetails.skills;
  } else if (typeof extraDetails.skills === 'object') {
    // If skills are categorized {technical: [], soft: []}
    Object.values(extraDetails.skills).forEach(category => {
      if (Array.isArray(category)) {
        skills = skills.concat(category);
      }
    });
  } else if (typeof extraDetails.skills === 'string') {
    // Comma-separated string
    skills = extraDetails.skills.split(',').map(s => s.trim());
  }
  
  return skills.filter(s => s && s.trim()).map(s => s.toLowerCase());
}

function calculateATS(resumeSkills, resumeText, jobDescription) {
  // Extract keywords from job description
  const jdWords = jobDescription.toLowerCase()
    .replace(/[^\w\s\+#\.]/g, ' ') // Added +, #, . to preserve in skills like "c++", "c#", "node.js"
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Remove common stopwords
  const filteredJDWords = stopword.removeStopwords(jdWords, stopword.en);
  const jdKeywordCounts = {};
  
  filteredJDWords.forEach(word => {
    jdKeywordCounts[word] = (jdKeywordCounts[word] || 0) + 1;
  });
  
  // Check matches in resume
  const resumeWords = resumeText.split(/\s+/);
  const matchedKeywords = [];
  const missingKeywords = [];
  
  Object.entries(jdKeywordCounts).forEach(([keyword, frequency]) => {
    // Check in resume text or skills
    const inText = resumeWords.some(word => 
      stringSimilarity.compareTwoStrings(word, keyword) > 0.8
    );
    
    const inSkills = resumeSkills.some(skill => 
      skill.includes(keyword) || keyword.includes(skill)
    );
    
    if (inText || inSkills) {
      matchedKeywords.push({ keyword, frequency });
    } else if (frequency > 1) { // Only show keywords that appear multiple times
      missingKeywords.push({ keyword, frequency });
    }
  });
  
  // Calculate score
  const totalKeywords = Object.keys(jdKeywordCounts).length;
  const matchedCount = matchedKeywords.length;
  const score = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 0;
  
  // Sort missing by frequency
  missingKeywords.sort((a, b) => b.frequency - a.frequency);
  
  return {
    score,
    matchedKeywords: matchedKeywords.map(k => k.keyword).slice(0, 10),
    missingKeywords: missingKeywords.map(k => k.keyword).slice(0, 10),
    details: {
      totalKeywords,
      matchedCount,
      missingCount: missingKeywords.length
    }
  };
}

function generateSuggestions(resumeText, jobDescription) {
  const suggestions = {
    actionVerbs: [],
    quantifiable: [],
    keywords: [],
    structure: {}
  };
  
  // Check for weak action verbs
  const weakVerbs = ['did', 'made', 'worked on', 'helped with', 'used'];
  weakVerbs.forEach(verb => {
    if (resumeText.includes(verb)) {
      suggestions.actionVerbs.push(`Replace "${verb}" with stronger action verbs`);
    }
  });
  
  // Check for quantifiable achievements
  const hasNumbers = /\d+/.test(resumeText);
  if (!hasNumbers) {
    suggestions.quantifiable.push("Add numbers and metrics to quantify achievements");
  }
  
  // Check bullet point structure
  const lines = resumeText.split('\n');
  const bulletPoints = lines.filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
  suggestions.structure = {
    bulletCount: bulletPoints.length,
    avgLength: bulletPoints.reduce((sum, bp) => sum + bp.length, 0) / (bulletPoints.length || 1)
  };
  
  return suggestions;
}

function calculateCompleteness(resume) {
  const sections = [
    { name: 'Profile', completed: !!(resume.profile && (resume.profile.firstName || resume.profile.lastName)) },
    { name: 'Education', completed: !!(resume.education && resume.education.length > 0) },
    { name: 'Experience', completed: !!(resume.experience && resume.experience.length > 0) },
    { name: 'Projects', completed: !!(resume.projects && resume.projects.length > 0) },
    { name: 'Skills', completed: !!(resume.extraDetails && resume.extraDetails.skills) },
  ];

  const completed = sections.filter(s => s.completed).length;
  const percentage = Math.round((completed / sections.length) * 100);

  return { sections, percentage };
}

function countSections(resume) {
  let count = 0;
  if (resume.profile && resume.profile.firstName) count++;
  if (resume.education && resume.education.length > 0) count++;
  if (resume.experience && resume.experience.length > 0) count++;
  if (resume.projects && resume.projects.length > 0) count++;
  if (resume.extraDetails && resume.extraDetails.skills) count++;
  return count;
}
