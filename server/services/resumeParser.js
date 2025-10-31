// Resume Data Parser and Validator

/**
 * Parses and validates resume data structure
 */
class ResumeParser {
  /**
   * Parse and validate incoming resume data
   */
  parseResumeData(resumeData) {
    if (!resumeData || typeof resumeData !== 'object') {
      throw new Error('Invalid resume data: must be an object');
    }

    const parsedData = {
      profile: this.parseProfile(resumeData.profile),
      education: this.parseEducation(resumeData.education),
      projects: this.parseProjects(resumeData.projects),
      experience: this.parseExperience(resumeData.experience),
      skills: this.parseSkills(resumeData.extraDetails?.skills),
      achievements: this.parseAchievements(resumeData.extraDetails?.achievements),
      extracurricular: this.parseExtracurricular(resumeData.extraDetails?.extraCoCurricular)
    };

    // Validate required sections
    this.validateRequiredSections(parsedData);

    return parsedData;
  }

  /**
   * Parse profile section
   */
  parseProfile(profileData) {
    if (!profileData) {
      return { isValid: false, missing: 'Complete profile section' };
    }

    const profile = {
      firstName: this.sanitizeText(profileData.firstName),
      lastName: this.sanitizeText(profileData.lastName),
      email: this.sanitizeEmail(profileData.email),
      mobile: this.sanitizePhone(profileData.mobile),
      address: this.sanitizeText(profileData.address),
      linkedIn: this.sanitizeUrl(profileData.linkedIn),
      github: this.sanitizeUrl(profileData.github),
      codechef: this.sanitizeText(profileData.codechef),
      leetcode: this.sanitizeText(profileData.leetcode),
      codeforces: this.sanitizeText(profileData.codeforces)
    };

    // Calculate completeness
    profile.completeness = this.calculateProfileCompleteness(profile);
    profile.isValid = profile.completeness >= 60; // At least 60% complete

    return profile;
  }

  /**
   * Parse education section
   */
  parseEducation(educationData) {
    if (!educationData || !Array.isArray(educationData)) {
      return { entries: [], isValid: false, completeness: 0 };
    }

    const entries = educationData.map((edu, index) => ({
      id: index,
      college: this.sanitizeText(edu.college),
      year: this.sanitizeText(edu.year),
      field: this.sanitizeText(edu.field),
      branch: this.sanitizeText(edu.branch),
      startYear: this.sanitizeYear(edu.startYear),
      endYear: this.sanitizeYear(edu.endYear),
      city: this.sanitizeText(edu.city),
      grades: this.sanitizeText(edu.grades),
      // For 12th/10th education
      board: this.sanitizeText(edu.board1 || edu.board2),
      percentage: this.sanitizeText(edu.percentage || edu.percentage2),
      completeness: this.calculateEducationCompleteness(edu)
    }));

    const overallCompleteness = entries.length > 0 
      ? entries.reduce((sum, edu) => sum + edu.completeness, 0) / entries.length 
      : 0;

    return {
      entries,
      isValid: entries.length > 0 && overallCompleteness >= 50,
      completeness: overallCompleteness,
      count: entries.length
    };
  }

  /**
   * Parse projects section
   */
  parseProjects(projectsData) {
    if (!projectsData || !Array.isArray(projectsData)) {
      return { entries: [], isValid: false, completeness: 0 };
    }

    const entries = projectsData.map((project, index) => ({
      id: index,
      title: this.sanitizeText(project.title),
      description: this.sanitizeText(project.description),
      techStack: this.sanitizeText(project.techStack),
      link: this.sanitizeUrl(project.link),
      completeness: this.calculateProjectCompleteness(project),
      descriptionLength: project.description ? project.description.length : 0,
      hasTechStack: !!project.techStack,
      hasLink: !!project.link
    }));

    const overallCompleteness = entries.length > 0 
      ? entries.reduce((sum, proj) => sum + proj.completeness, 0) / entries.length 
      : 0;

    return {
      entries,
      isValid: entries.length > 0 && overallCompleteness >= 60,
      completeness: overallCompleteness,
      count: entries.length,
      totalDescriptionLength: entries.reduce((sum, proj) => sum + proj.descriptionLength, 0)
    };
  }

  /**
   * Parse experience section
   */
  parseExperience(experienceData) {
    if (!experienceData || !Array.isArray(experienceData)) {
      return { entries: [], isValid: false, completeness: 0 };
    }

    const entries = experienceData.map((exp, index) => ({
      id: index,
      role: this.sanitizeText(exp.role),
      institute: this.sanitizeText(exp.institute),
      startDate: this.sanitizeDate(exp.start_date),
      endDate: this.sanitizeDate(exp.end_date),
      description: this.sanitizeText(exp.desc),
      completeness: this.calculateExperienceCompleteness(exp),
      descriptionLength: exp.desc ? exp.desc.length : 0,
      hasDates: !!(exp.start_date && exp.end_date)
    }));

    const overallCompleteness = entries.length > 0 
      ? entries.reduce((sum, exp) => sum + exp.completeness, 0) / entries.length 
      : 0;

    return {
      entries,
      isValid: entries.length > 0 && overallCompleteness >= 60,
      completeness: overallCompleteness,
      count: entries.length,
      totalDescriptionLength: entries.reduce((sum, exp) => sum + exp.descriptionLength, 0)
    };
  }

  /**
   * Parse skills section
   */
  parseSkills(skillsData) {
    if (!skillsData || typeof skillsData !== 'object') {
      return { categories: {}, isValid: false, totalSkills: 0 };
    }

    const categories = {};
    let totalSkills = 0;

    // Parse each skill category
    Object.keys(skillsData).forEach(category => {
      if (Array.isArray(skillsData[category])) {
        categories[category] = skillsData[category]
          .map(skill => this.sanitizeText(skill))
          .filter(skill => skill && skill.length > 0);
        
        totalSkills += categories[category].length;
      }
    });

    return {
      categories,
      isValid: totalSkills >= 3, // At least 3 skills total
      totalSkills,
      categoryCount: Object.keys(categories).length,
      hasTechnicalSkills: !!(categories.web || categories.webFrameworks || categories.databases),
      hasLanguages: !!categories.languages,
      hasOtherSkills: !!categories.other
    };
  }

  /**
   * Parse achievements section
   */
  parseAchievements(achievementsData) {
    if (!achievementsData || !Array.isArray(achievementsData)) {
      return { entries: [], count: 0 };
    }

    const entries = achievementsData
      .map(achievement => this.sanitizeText(achievement))
      .filter(achievement => achievement && achievement.length > 0);

    return {
      entries,
      count: entries.length,
      isValid: entries.length > 0
    };
  }

  /**
   * Parse extracurricular activities
   */
  parseExtracurricular(extracurricularData) {
    if (!extracurricularData || !Array.isArray(extracurricularData)) {
      return { entries: [], count: 0 };
    }

    const entries = extracurricularData
      .map(activity => this.sanitizeText(activity))
      .filter(activity => activity && activity.length > 0);

    return {
      entries,
      count: entries.length,
      isValid: entries.length > 0
    };
  }

  /**
   * Calculate resume statistics
   */
  calculateResumeStats(parsedData) {
    const stats = {
      totalSections: 0,
      filledSections: 0,
      totalEntries: 0,
      wordCount: 0,
      characterCount: 0
    };

    // Count sections and entries
    Object.keys(parsedData).forEach(section => {
      if (parsedData[section] && typeof parsedData[section] === 'object') {
        stats.totalSections++;
        
        if (parsedData[section].isValid !== false && parsedData[section].count !== 0) {
          stats.filledSections++;
        }

        if (parsedData[section].count) {
          stats.totalEntries += parsedData[section].count;
        }
      }
    });

    // Calculate content metrics
    const allText = JSON.stringify(parsedData);
    stats.characterCount = allText.length;
    stats.wordCount = allText.split(/\s+/).filter(word => word.length > 0).length;

    return stats;
  }

  /**
   * Validate required sections exist
   */
  validateRequiredSections(parsedData) {
    const required = ['profile', 'education'];
    const missing = required.filter(section => !parsedData[section] || !parsedData[section].isValid);

    if (missing.length > 0) {
      throw new Error(`Missing required sections: ${missing.join(', ')}`);
    }
  }

  // Helper methods

  calculateProfileCompleteness(profile) {
    const fields = ['firstName', 'lastName', 'email', 'mobile'];
    const filled = fields.filter(field => profile[field] && profile[field].length > 0);
    return (filled.length / fields.length) * 100;
  }

  calculateEducationCompleteness(education) {
    const fields = ['college', 'field', 'startYear', 'endYear'];
    const filled = fields.filter(field => education[field] && education[field].length > 0);
    return (filled.length / fields.length) * 100;
  }

  calculateProjectCompleteness(project) {
    const fields = ['title', 'description', 'techStack'];
    const filled = fields.filter(field => project[field] && project[field].length > 0);
    return (filled.length / fields.length) * 100;
  }

  calculateExperienceCompleteness(experience) {
    const fields = ['role', 'institute', 'start_date', 'end_date', 'desc'];
    const filled = fields.filter(field => experience[field] && experience[field].length > 0);
    return (filled.length / fields.length) * 100;
  }

  sanitizeText(text) {
    if (!text) return '';
    return String(text).trim().replace(/[<>]/g, '').substring(0, 1000);
  }

  sanitizeEmail(email) {
    if (!email) return '';
    const sanitized = this.sanitizeText(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  sanitizePhone(phone) {
    if (!phone) return '';
    return String(phone).replace(/[^\d+]/g, '').substring(0, 15);
  }

  sanitizeUrl(url) {
    if (!url) return '';
    const sanitized = this.sanitizeText(url);
    return sanitized.startsWith('http') ? sanitized : `https://${sanitized}`;
  }

  sanitizeYear(year) {
    if (!year) return '';
    const yearNum = parseInt(year);
    return (yearNum >= 1900 && yearNum <= 2100) ? yearNum.toString() : '';
  }

  sanitizeDate(date) {
    if (!date) return '';
    // Basic date validation - you might want to enhance this
    return this.sanitizeText(date);
  }

  /**
   * Extract keywords from resume data for ATS optimization
   */
  extractKeywords(parsedData) {
    const allText = JSON.stringify(parsedData).toLowerCase();
    const keywords = {
      technical: [],
      tools: [],
      softSkills: [],
      actionVerbs: []
    };

    // Check for technical keywords
    const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'html', 'css', 'sql'];
    keywords.technical = techKeywords.filter(keyword => allText.includes(keyword));

    // Check for tools
    const tools = ['git', 'docker', 'aws', 'jenkins', 'mongodb', 'mysql'];
    keywords.tools = tools.filter(tool => allText.includes(tool));

    // Check for action verbs
    const actionVerbs = ['developed', 'implemented', 'managed', 'created', 'led', 'improved'];
    keywords.actionVerbs = actionVerbs.filter(verb => allText.includes(verb));

    return keywords;
  }

  /**
   * Generate resume summary for AI analysis
   */
  generateResumeSummary(parsedData) {
    const summary = {
      profile: parsedData.profile ? `Profile: ${parsedData.profile.firstName} ${parsedData.profile.lastName}` : 'Profile: Incomplete',
      education: parsedData.education ? `Education: ${parsedData.education.count} entries` : 'Education: Missing',
      experience: parsedData.experience ? `Experience: ${parsedData.experience.count} entries` : 'Experience: None',
      projects: parsedData.projects ? `Projects: ${parsedData.projects.count} entries` : 'Projects: None',
      skills: parsedData.skills ? `Skills: ${parsedData.skills.totalSkills} skills across ${parsedData.skills.categoryCount} categories` : 'Skills: None'
    };

    return summary;
  }
}

export default ResumeParser;