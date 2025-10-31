  const calculateBasicScore = (resumeData) => {
  let score = 0;
  const weights = {
    personal: 15,
    education: 20,
    projects: 25,
    experience: 25,
    skills: 15
  };

  // Personal info (15 points)
  if (resumeData.profile?.firstName && resumeData.profile?.lastName) score += weights.personal * 0.6;
  if (resumeData.profile?.email) score += weights.personal * 0.2;
  if (resumeData.profile?.mobile) score += weights.personal * 0.2;

  // Education (20 points)
  if (resumeData.education?.length > 0) score += weights.education;

  // Projects (25 points)
  if (resumeData.projects?.length >= 2) score += weights.projects;
  else if (resumeData.projects?.length === 1) score += weights.projects * 0.6;

  // Experience (25 points)
  if (resumeData.experience?.length >= 2) score += weights.experience;
  else if (resumeData.experience?.length === 1) score += weights.experience * 0.7;

  // Skills (15 points)
  const totalSkills = Object.values(resumeData.extraDetails?.skills || {}).flat().length;
  if (totalSkills >= 8) score += weights.skills;
  else if (totalSkills >= 5) score += weights.skills * 0.8;
  else if (totalSkills >= 3) score += weights.skills * 0.5;

  return Math.min(Math.round(score), 100);
};

 const validateResumeData = (resumeData) => {
  const errors = [];

  if (!resumeData || typeof resumeData !== 'object') {
    errors.push('Invalid resume data format');
    return errors;
  }

  // Check required sections
  if (!resumeData.profile) errors.push('Missing profile section');
  if (!resumeData.education) errors.push('Missing education section');

  // Validate profile data
  if (resumeData.profile) {
    if (!resumeData.profile.firstName) errors.push('Missing first name');
    if (!resumeData.profile.lastName) errors.push('Missing last name');
    if (!resumeData.profile.email) errors.push('Missing email');
  }

  return errors;
};

module.exports={
    calculateBasicScore,
    validateResumeData,
};
