import React from 'react';
import { Box, Paper, Button, Alert, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Analytics, CheckCircle } from '@mui/icons-material';

// ✅ Import the Resume Analyzer
import ResumeAnalyzer from './analysis/ResumeAnalyzer';

export default function ResumeLayout() {
    const customStyle = {
        margin: "10px",
        height: "auto",
        width: "80%",
        padding: "20px",
        backgroundColor: "#fff",
    };
    
    const containerStyle = {
        marginTop: "30",
        display: "flex",
        justifyContent: "center",
    };

    const location = useLocation();
    const navigate = useNavigate();
    
    // ✅ Get all resume data from Redux store
    // Try these alternative state paths
    const resumeData = useSelector((state) => ({
        profile: state.profileDetails || state.profile || state.personalInfo,
        education: state.educationDetails || state.education || state.educations,
        projects: state.projectDetails || state.projects,
        experience: state.experienceDetails || state.experience || state.workExperience,
        extraDetails: state.extraDetails || state.skills || state.additionalInfo,
    }));

    // ✅ Check if resume is complete enough for analysis
    const isResumeComplete = () => {
        const hasProfile = resumeData.profile?.firstName && resumeData.profile?.email;
        const hasEducation = resumeData.education?.length > 0;
        const hasExperience = resumeData.experience?.length > 0;
        const hasSkills = Object.values(resumeData.extraDetails?.skills || {}).flat().length > 0;
        const hasProjects = resumeData.projects?.length > 0;
        const completedSections = [hasEducation, hasExperience, hasSkills, hasProjects].filter(Boolean).length;
        console.log('📊 Section Completion:', {
            hasProfile,
            hasEducation,
            hasExperience, 
            hasSkills,
            hasProjects,
            completedSections,
            isComplete: hasProfile && completedSections >= 2
        });
        return hasProfile && completedSections >= 2;
    };

    // ✅ Check if we're on the resume analysis page
    const isAnalysisPage = () => {
        return location.pathname === '/resume-analysis';
    };

    // ✅ Get completion percentage
    const getCompletionPercentage = () => {
        let completed = 0;
        const totalSections = 4; // profile, education, experience, skills
        
        if (resumeData.profile?.firstName && resumeData.profile?.email) completed++;
        if (resumeData.education?.length > 0) completed++;
        if (resumeData.experience?.length > 0) completed++;
        if (Object.values(resumeData.extraDetails?.skills || {}).flat().length > 0) completed++;
        
        return Math.round((completed / totalSections) * 100);
    };

    // ✅ Get the next incomplete section
    const getNextIncompleteSection = () => {
        if (!resumeData.profile?.firstName) return '/profile';
        if (resumeData.education?.length === 0) return '/education';
        if (resumeData.experience?.length === 0) return '/experience';
        if (Object.values(resumeData.extraDetails?.skills || {}).flat().length === 0) return '/extraDetails';
        return null;
    };

    return (
        <div className="main-content">
            <Box style={containerStyle}>
                <Paper elevation={3} style={customStyle}>
                    {/* Current form component (Profile, Education, etc.) */}
                    <Outlet />
                    
                    {/* ✅ Resume Analysis Section - ONLY show on /resume-analysis route */}
                    {isAnalysisPage() && (
                        <Box sx={{ mt: 6, pt: 4, borderTop: '2px solid #e0e0e0' }}>
                            
                            {/* Header - CENTERED */}
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography 
                                    variant="h5" 
                                    gutterBottom 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        gap: 1,
                                        color: 'primary.main'
                                    }}
                                >
                                    <Analytics />
                                    Professional Resume Analysis
                                </Typography>
                            </Box>
                            
                            {/* Completion Status */}
                            {!isResumeComplete() ? (
                                <Box>
                                    <Alert 
                                        severity="info" 
                                        sx={{ mb: 3 }}
                                        icon={<CheckCircle />}
                                    >
                                        <Typography variant="body1" fontWeight="bold">
                                            Complete your resume to enable professional analysis
                                        </Typography>
                                        <Typography variant="body2">
                                            Progress: {getCompletionPercentage()}% complete
                                        </Typography>
                                    </Alert>
                                    
                                    <Box sx={{ 
                                        display: 'flex', 
                                        gap: 2, 
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        mb: 2
                                    }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Missing sections:
                                        </Typography>
                                        
                                        {!resumeData.profile?.firstName && (
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                onClick={() => navigate('/profile')}
                                            >
                                                Profile
                                            </Button>
                                        )}
                                        {resumeData.education?.length === 0 && (
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                onClick={() => navigate('/education')}
                                            >
                                                Education
                                            </Button>
                                        )}
                                        {resumeData.experience?.length === 0 && (
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                onClick={() => navigate('/experience')}
                                            >
                                                Experience
                                            </Button>
                                        )}
                                        {Object.values(resumeData.extraDetails?.skills || {}).flat().length === 0 && (
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                onClick={() => navigate('/extraDetails')}
                                            >
                                                Skills
                                            </Button>
                                        )}
                                    </Box>
                                    
                                    {getNextIncompleteSection() && (
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate(getNextIncompleteSection())}
                                        >
                                            Complete Next Section
                                        </Button>
                                    )}
                                </Box>
                            ) : (
                                /* ✅ Show Resume Analyzer when resume is complete */
                                <Box>
                                    {/* Centered Success Alert */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                        <Alert 
                                            severity="success" 
                                            icon={<CheckCircle />}
                                            sx={{ 
                                                maxWidth: 600,
                                                width: '100%',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography variant="body1" fontWeight="bold" sx={{ textAlign: 'center' }}>
                                                🎉 Your resume is complete and ready for analysis!
                                            </Typography>
                                            <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                                Get professional feedback to improve your resume's impact
                                            </Typography>
                                        </Alert>
                                    </Box>
                                    
                                    <ResumeAnalyzer resumeData={resumeData} />
                                </Box>
                            )}
                        </Box>
                    )}
                    
                    {/* ✅ Navigation helper for other pages - Show button to go to analysis */}
                    {!isAnalysisPage() && isResumeComplete() && (
                        <Box sx={{ 
                            mt: 4, 
                            p: 3, 
                            bgcolor: 'success.light', 
                            borderRadius: 2,
                            textAlign: 'center',
                            border: '1px solid',
                            borderColor: 'success.main'
                        }}>
                            <Typography variant="h6" gutterBottom color="success.dark">
                                ✅ Your resume is complete!
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Ready to get professional feedback on your resume?
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Analytics />}
                                onClick={() => navigate('/resume-analysis')}
                                sx={{ 
                                    bgcolor: 'success.main',
                                    '&:hover': { bgcolor: 'success.dark' }
                                }}
                            >
                                Analyze My Resume
                            </Button>
                        </Box>
                    )}
                    
                    {/* ✅ Incomplete resume message for other pages */}
                    {!isAnalysisPage() && !isResumeComplete() && (
                        <Box sx={{ 
                            mt: 4, 
                            p: 2, 
                            bgcolor: 'info.light', 
                            borderRadius: 1,
                            textAlign: 'center'
                        }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Complete all sections to unlock professional resume analysis
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Analytics />}
                                onClick={() => navigate('/resume-analysis')}
                                disabled
                            >
                                Analysis Available When Complete
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </div>
    );
}