const GeminiService = require('./geminiService.js');
const { calculateBasicScore } = require('../utils/analysisHelpers.js');

class AIService {
  constructor() {
    this.gemini = new GeminiService();
  }

  async analyzeResume(resumeData, options = {}) {
    const {
      analysisType = 'comprehensive',
      provider = 'gemini',
      fallback = true
    } = options;

    try {
      let result;
      
      switch (provider) {
        case 'gemini':
          result = await this.gemini.analyzeResume(resumeData, analysisType);
          break;
        case 'basic':
          result = this.basicAnalysis(resumeData);
          break;
        default:
          // Default to gemini
          result = await this.gemini.analyzeResume(resumeData, analysisType);
          break;
      }

      // Enhance with additional metrics
      return this.enhanceAnalysisResult(result, resumeData, provider);
      
    } catch (error) {
      console.error(`AI analysis failed with ${provider}:`, error);
      
      // Fallback to basic analysis
      if (fallback) {
        console.log('Falling back to basic analysis');
        return this.basicAnalysis(resumeData);
      }
      
      throw error;
    }
  }

  enhanceAnalysisResult(analysisResult, resumeData, provider) {
    const basicMetrics = this.calculateBasicMetrics(resumeData);
    
    return {
      ...analysisResult,
      basicMetrics,
      provider,
      analyzedAt: new Date().toISOString(),
      resumeStats: {
        sections: Object.keys(resumeData).length,
        projects: resumeData.projects?.length || 0,
        experience: resumeData.experience?.length || 0,
        skills: Object.values(resumeData.extraDetails?.skills || {}).flat().length
      }
    };
  }

  calculateBasicMetrics(resumeData) {
    return {
      completenessScore: this.calculateCompleteness(resumeData),
      atsScore: this.calculateATSScore(resumeData),
      skillDiversity: this.calculateSkillDiversity(resumeData),
      projectImpact: this.calculateProjectImpact(resumeData)
    };
  }

  calculateCompleteness(resumeData) {
    const sections = ['profile', 'education', 'projects', 'skills'];
    const filledSections = sections.filter(section => {
      if (section === 'skills') {
        return Object.values(resumeData.extraDetails?.skills || {}).flat().length > 0;
      }
      return resumeData[section] && Object.keys(resumeData[section]).length > 0;
    });
    
    return (filledSections.length / sections.length) * 100;
  }

  calculateATSScore(resumeData) {
    let score = 0;
    
    // Contact info (25 points)
    if (resumeData.profile?.email && resumeData.profile?.mobile) score += 25;
    
    // Education (20 points)
    if (resumeData.education?.length > 0) score += 20;
    
    // Experience (25 points)
    if (resumeData.experience?.length > 0) score += 25;
    
    // Skills (20 points)
    if (Object.values(resumeData.extraDetails?.skills || {}).flat().length > 0) score += 20;
    
    // Projects (10 points)
    if (resumeData.projects?.length > 0) score += 10;
    
    return score;
  }

  calculateSkillDiversity(resumeData) {
    const skills = Object.values(resumeData.extraDetails?.skills || {}).flat();
    const uniqueCategories = Object.keys(resumeData.extraDetails?.skills || {}).length;
    return Math.min((uniqueCategories / 5) * 100, 100);
  }

  calculateProjectImpact(resumeData) {
    if (!resumeData.projects?.length) return 0;
    
    let impactScore = 0;
    resumeData.projects.forEach(project => {
      if (project.description && project.description.length > 100) impactScore += 20;
      if (project.techStack) impactScore += 15;
      if (project.link) impactScore += 10;
    });
    
    return Math.min(impactScore, 100);
  }

  basicAnalysis(resumeData) {
    const score = calculateBasicScore(resumeData);
    
    return {
      overallScore: score,
      sectionScores: {
        personal: resumeData.profile ? 100 : 0,
        education: resumeData.education?.length > 0 ? 100 : 0,
        projects: Math.min((resumeData.projects?.length || 0) * 50, 100),
        experience: resumeData.experience?.length > 0 ? 100 : 0,
        skills: Math.min((Object.values(resumeData.extraDetails?.skills || {}).flat().length || 0) * 20, 100)
      },
      strengths: this.identifyStrengths(resumeData),
      improvements: this.suggestImprovements(resumeData),
      atsScore: this.calculateATSScore(resumeData),
      aiSuggestions: {
        immediateImprovements: this.suggestImprovements(resumeData),
        longTermSuggestions: [
          "Add quantifiable achievements to your experience",
          "Include specific technologies and tools used",
          "Add links to your projects and GitHub profile",
          "Use action verbs to start each bullet point",
          "Tailor your resume with keywords from job descriptions"
        ]
      },
      isFallback: true,
      provider: 'basic',
      analyzedAt: new Date().toISOString()
    };
  }

  identifyStrengths(resumeData) {
    const strengths = [];
    
    if (resumeData.projects?.length >= 2) {
      strengths.push("Strong project portfolio demonstrating practical experience");
    }
    if (resumeData.experience?.length > 0) {
      strengths.push("Relevant work experience in the field");
    }
    if (Object.values(resumeData.extraDetails?.skills || {}).flat().length >= 5) {
      strengths.push("Diverse technical skill set across multiple areas");
    }
    if (resumeData.profile?.linkedIn || resumeData.profile?.github) {
      strengths.push("Professional online presence with portfolio links");
    }
    if (resumeData.profile?.email && resumeData.profile?.mobile) {
      strengths.push("Complete contact information for employers");
    }

    return strengths.length > 0 ? strengths : ["Good foundation - continue building your experience and skills"];
  }

  suggestImprovements(resumeData) {
    const improvements = [];
    
    if (!resumeData.profile?.firstName) improvements.push("Add your first name for personalization");
    if (!resumeData.profile?.lastName) improvements.push("Include your last name for professional identification");
    if (!resumeData.profile?.email) improvements.push("Add email address for employer contact");
    if (!resumeData.profile?.mobile) improvements.push("Include mobile number for direct communication");
    if (!resumeData.education?.length) improvements.push("Add educational background and qualifications");
    if (!resumeData.projects?.length) improvements.push("Include at least one project to demonstrate practical skills");
    if (!resumeData.experience?.length) improvements.push("Add work experience, internships, or relevant activities");
    
    const skillCount = Object.values(resumeData.extraDetails?.skills || {}).flat().length;
    if (skillCount < 3) improvements.push("Expand your technical skills section with more relevant technologies");
    
    // Check for project details
    if (resumeData.projects?.length > 0) {
      const hasDetailedProjects = resumeData.projects.some(project => 
        project.description && project.description.length > 50
      );
      if (!hasDetailedProjects) improvements.push("Add detailed descriptions to your projects highlighting your contributions");
    }

    return improvements;
  }

  // New method to get available providers
  getAvailableProviders() {
    return [
      {
        id: 'gemini',
        name: 'Google Gemini AI',
        description: 'Advanced AI analysis using Google\'s Gemini model',
        isAvailable: true
      },
      {
        id: 'basic',
        name: 'Basic Analysis',
        description: 'Rule-based analysis with instant results',
        isAvailable: true
      }
    ];
  }
}

module.exports = AIService;