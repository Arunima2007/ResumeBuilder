// Use environment variable with fallback for frontend
const API_BASE_URL = 'http://localhost:8000/api';

class AnalysisService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async analyzeResume(resumeData, options = {}) {
    try {
      console.log('Sending analysis request to:', `${this.baseURL}/analysis/analyze`);
      
      const response = await fetch(`${this.baseURL}/analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          resumeData,
          analysisType: options.analysisType || 'comprehensive',
          provider: options.provider || 'openai'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
      
    } catch (error) {
      console.error('Backend analysis failed, using fallback:', error);
      // Fallback to local analysis
      return this.localFallbackAnalysis(resumeData);
    }
  }

  // ✅ ADD THIS MISSING METHOD
  async saveAnalysisResult(analysisResult) {
    try {
      console.log('Saving analysis result...');
      
      const response = await fetch(`${this.baseURL}/analysis/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          analysisResult,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('Failed to save analysis result:', errorData.message || response.statusText);
        // Don't throw error - saving is optional
        return null;
      }

      const result = await response.json();
      console.log('Analysis saved successfully:', result);
      return result;
      
    } catch (error) {
      console.warn('Failed to save analysis result:', error.message);
      // Don't throw error - saving is optional
      return null;
    }
  }

  async getAnalysisHistory() {
    try {
      const response = await fetch(`${this.baseURL}/analysis/history`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get analysis history:', error);
      return { data: [], pagination: { total: 0 } };
    }
  }

  getAuthHeaders() {
    // If you have authentication, get token from localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // ... rest of your existing methods remain exactly the same
  localFallbackAnalysis(resumeData) {
    // Comprehensive local analysis as fallback
    const score = this.calculateBasicScore(resumeData);
    const sectionScores = this.calculateSectionScores(resumeData);
    const strengths = this.identifyStrengths(resumeData);
    const improvements = this.suggestImprovements(resumeData);
    const atsScore = this.calculateATSScore(resumeData);

    return {
      overallScore: score,
      sectionScores,
      strengths,
      improvements,
      atsScore,
      atsOptimization: { score: atsScore },
      keywordAnalysis: {
        strengths: this.extractKeywords(resumeData),
        missingKeywords: ['Consider adding more specific technologies'],
        industryRelevance: 'Good foundation - add industry-specific keywords'
      },
      contentQuality: {
        clarity: score >= 70 ? 'good' : score >= 50 ? 'fair' : 'poor',
        impact: score >= 70 ? 'medium' : 'low',
        readability: 'good'
      },
      aiSuggestions: {
        immediateImprovements: improvements,
        longTermSuggestions: [
          "Add quantifiable achievements with numbers and metrics",
          "Include specific technologies and tools used in projects",
          "Add links to live projects and GitHub repository"
        ],
        industryTips: [
          "Tailor your resume for specific job applications",
          "Highlight your most relevant projects and experience",
          "Use action verbs to start each bullet point"
        ]
      },
      isFallback: true,
      analyzedAt: new Date().toISOString()
    };
  }

  calculateBasicScore(resumeData) {
    let score = 0;
    const weights = {
      personal: 15,
      education: 20,
      projects: 25,
      experience: 25,
      skills: 15
    };

    // Personal info
    if (resumeData.profile?.firstName && resumeData.profile?.lastName) score += weights.personal * 0.6;
    if (resumeData.profile?.email) score += weights.personal * 0.2;
    if (resumeData.profile?.mobile) score += weights.personal * 0.2;

    // Education
    if (resumeData.education?.length > 0) score += weights.education;

    // Projects
    if (resumeData.projects?.length >= 2) score += weights.projects;
    else if (resumeData.projects?.length === 1) score += weights.projects * 0.6;

    // Experience
    if (resumeData.experience?.length >= 2) score += weights.experience;
    else if (resumeData.experience?.length === 1) score += weights.experience * 0.7;

    // Skills
    const totalSkills = Object.values(resumeData.extraDetails?.skills || {}).flat().length;
    if (totalSkills >= 8) score += weights.skills;
    else if (totalSkills >= 5) score += weights.skills * 0.8;
    else if (totalSkills >= 3) score += weights.skills * 0.5;

    return Math.min(Math.round(score), 100);
  }

  calculateSectionScores(resumeData) {
    return {
      personal: this.calculatePersonalScore(resumeData.profile),
      education: this.calculateEducationScore(resumeData.education),
      projects: this.calculateProjectsScore(resumeData.projects),
      experience: this.calculateExperienceScore(resumeData.experience),
      skills: this.calculateSkillsScore(resumeData.extraDetails?.skills)
    };
  }

  calculatePersonalScore(profile) {
    let score = 0;
    if (profile?.firstName) score += 25;
    if (profile?.lastName) score += 25;
    if (profile?.email) score += 25;
    if (profile?.mobile) score += 25;
    return score;
  }

  calculateEducationScore(education) {
    if (!education?.length) return 0;
    return Math.min(education.length * 33, 100);
  }

  calculateProjectsScore(projects) {
    if (!projects?.length) return 0;
    let score = projects.length * 20;
    projects.forEach(project => {
      if (project.description?.length > 50) score += 10;
      if (project.techStack) score += 5;
    });
    return Math.min(score, 100);
  }

  calculateExperienceScore(experience) {
    if (!experience?.length) return 0;
    let score = experience.length * 25;
    experience.forEach(exp => {
      if (exp.desc?.length > 30) score += 10;
    });
    return Math.min(score, 100);
  }

  calculateSkillsScore(skills) {
    if (!skills) return 0;
    const totalSkills = Object.values(skills).flat().length;
    return Math.min(totalSkills * 10, 100);
  }

  identifyStrengths(resumeData) {
    const strengths = [];
    
    if (resumeData.projects?.length >= 2) {
      strengths.push("Strong project portfolio with multiple demonstrations");
    }
    if (resumeData.experience?.length > 0) {
      strengths.push("Relevant professional experience in the field");
    }
    if (Object.values(resumeData.extraDetails?.skills || {}).flat().length >= 5) {
      strengths.push("Diverse technical skill set across multiple domains");
    }
    if (resumeData.profile?.linkedIn || resumeData.profile?.github) {
      strengths.push("Professional online presence with portfolio links");
    }
    if (resumeData.education?.length > 0) {
      strengths.push("Solid educational background");
    }

    return strengths.length > 0 ? strengths : ["Good foundation - continue building your experience"];
  }

  suggestImprovements(resumeData) {
    const improvements = [];
    
    if (!resumeData.profile?.firstName) improvements.push("Add your first name");
    if (!resumeData.profile?.lastName) improvements.push("Include your last name");
    if (!resumeData.profile?.email) improvements.push("Add a professional email address");
    if (!resumeData.profile?.mobile) improvements.push("Include your contact number");
    if (!resumeData.education?.length) improvements.push("Add your educational qualifications");
    if (!resumeData.projects?.length) improvements.push("Include at least one project to showcase skills");
    if (!resumeData.experience?.length) improvements.push("Add work experience or internships");
    
    const skillCount = Object.values(resumeData.extraDetails?.skills || {}).flat().length;
    if (skillCount < 3) improvements.push("Expand your technical skills section");

    if (resumeData.projects?.length > 0) {
      const hasDetailedProjects = resumeData.projects.some(p => p.description && p.description.length > 50);
      if (!hasDetailedProjects) improvements.push("Add more detailed project descriptions");
    }

    return improvements;
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

  extractKeywords(resumeData) {
    const keywords = [];
    const content = JSON.stringify(resumeData).toLowerCase();
    
    const techKeywords = ['javascript', 'react', 'node', 'python', 'java', 'html', 'css', 'mongodb', 'sql'];
    techKeywords.forEach(keyword => {
      if (content.includes(keyword)) keywords.push(keyword);
    });
    
    return keywords.length > 0 ? keywords : ['Foundational technical skills'];
  }
}

export const analysisService = new AnalysisService();