import React from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Analytics, Person, School, Work, Folder, Star } from '@mui/icons-material';

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
    
    // Get resume data for completion check only
    const resumeData = useSelector((state) => ({
        profile: state.profileDetails || state.profile,
        education: state.educationDetails || state.education,
        projects: state.projectDetails || state.projects,
        experience: state.experienceDetails || state.experience,
        extraDetails: state.extraDetails || state.skills,
    }));

    // Navigation items with icons
    const navItems = [
        { path: '/profile', label: 'Profile', icon: <Person />, color: 'primary' },
        { path: '/education', label: 'Education', icon: <School />, color: 'secondary' },
        { path: '/experience', label: 'Experience', icon: <Work />, color: 'success' },
        { path: '/projects', label: 'Projects', icon: <Folder />, color: 'warning' },
        { path: '/extraDetails', label: 'Extra Details', icon: <Star />, color: 'info' },
        { path: '/resume-analysis', label: 'Analysis', icon: <Analytics />, color: 'error' },
    ];

    // Check if resume is complete (simplified)
    const isResumeComplete = () => {
        const hasProfile = resumeData.profile?.firstName && resumeData.profile?.email;
        const hasEducation = resumeData.education?.length > 0;
        const hasExperience = resumeData.experience?.length > 0;
        const hasSkills = Object.values(resumeData.extraDetails?.skills || {}).flat().length > 0;
        const completedSections = [hasEducation, hasExperience, hasSkills].filter(Boolean).length;
        return hasProfile && completedSections >= 2;
    };

    // Calculate completion percentage
    const getCompletionPercentage = () => {
        let completed = 0;
        const totalSections = 4;
        if (resumeData.profile?.firstName && resumeData.profile?.email) completed++;
        if (resumeData.education?.length > 0) completed++;
        if (resumeData.experience?.length > 0) completed++;
        if (Object.values(resumeData.extraDetails?.skills || {}).flat().length > 0) completed++;
        return Math.round((completed / totalSections) * 100);
    };

    return (
        <div className="main-content">
            <Box style={containerStyle}>
                {/* Sidebar Navigation */}
                <Box sx={{ 
                    width: '250px', 
                    mr: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 2,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                        Resume Builder
                    </Typography>
                    
                    {/* Progress Bar */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Progress: {getCompletionPercentage()}%
                        </Typography>
                        <Box sx={{ 
                            height: 8, 
                            bgcolor: 'grey.200', 
                            borderRadius: 4,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ 
                                height: '100%', 
                                bgcolor: 'primary.main',
                                width: `${getCompletionPercentage()}%`,
                                transition: 'width 0.3s'
                            }} />
                        </Box>
                    </Box>
                    
                    {/* Navigation Buttons */}
                    <Box sx={{ flex: 1 }}>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Button
                                    key={item.path}
                                    fullWidth
                                    startIcon={item.icon}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        justifyContent: 'flex-start',
                                        mb: 1,
                                        bgcolor: isActive ? `${item.color}.light` : 'transparent',
                                        color: isActive ? `${item.color}.contrastText` : 'text.primary',
                                        '&:hover': {
                                            bgcolor: isActive ? `${item.color}.main` : 'action.hover',
                                        },
                                        borderRadius: 2,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Box>
                    
                    {/* Analysis Prompt (only show if not on analysis page) */}
                    {location.pathname !== '/resume-analysis' && isResumeComplete() && (
                        <Box sx={{ 
                            mt: 3, 
                            p: 2, 
                            bgcolor: 'success.light', 
                            borderRadius: 2,
                            textAlign: 'center'
                        }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                ✅ Resume Complete!
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<Analytics />}
                                onClick={() => navigate('/resume-analysis')}
                                sx={{ 
                                    bgcolor: 'success.main',
                                    '&:hover': { bgcolor: 'success.dark' }
                                }}
                            >
                                Analyze Now
                            </Button>
                        </Box>
                    )}
                </Box>
                
                {/* Main Content Area */}
                <Paper elevation={3} style={customStyle}>
                    {/* This renders the current page (Profile, Education, OR ResumeAnalysisPage) */}
                    <Outlet />
                </Paper>
            </Box>
        </div>
    );
}