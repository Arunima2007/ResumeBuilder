import React from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Analytics, Person, School, Work, Folder, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function ResumeLayout() {
    const customStyle = {
        margin: "10px",
        height: "auto",
        width: "80%",
        padding: "24px",
        backgroundColor: "rgba(17, 24, 39, 0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
    };
    
    const containerStyle = {
        marginTop: "40px",
        display: "flex",
        justifyContent: "center",
        padding: "0 20px",
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
        { path: '/profile', label: 'Profile', icon: <Person />, color: '#6366f1' },
        { path: '/education', label: 'Education', icon: <School />, color: '#3b82f6' },
        { path: '/experience', label: 'Experience', icon: <Work />, color: '#10b981' },
        { path: '/projects', label: 'Projects', icon: <Folder />, color: '#f59e0b' },
        { path: '/extraDetails', label: 'Extra Details', icon: <Star />, color: '#a855f7' },
        { path: '/resume-analysis', label: 'Analysis', icon: <Analytics />, color: '#ef4444' },
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
        <div className="main-content" style={{ minHeight: "100vh", paddingTop: "80px" }}>
            <Box style={containerStyle}>
                {/* Sidebar Navigation */}
                <Box sx={{ 
                    width: '260px', 
                    mr: 4,
                    bgcolor: 'rgba(17, 24, 39, 0.5)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 4,
                    p: 2.5,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'fit-content'
                }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 700, letterSpacing: '0.02em', color: '#fff' }}>
                        Resume Builder
                    </Typography>
                    
                    {/* Progress Bar */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                                Completion
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                                {getCompletionPercentage()}%
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            height: 6, 
                            bgcolor: 'rgba(255, 255, 255, 0.05)', 
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.03)'
                        }}>
                            <Box sx={{ 
                                height: '100%', 
                                background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                                width: `${getCompletionPercentage()}%`,
                                transition: 'width 0.5s ease-out',
                                boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)'
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
                                        mb: 1.5,
                                        bgcolor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                        color: isActive ? '#818cf8' : 'rgba(255,255,255,0.65)',
                                        borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        borderTopRightRadius: 8,
                                        borderBottomRightRadius: 8,
                                        '&:hover': {
                                            bgcolor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                            color: '#ffffff',
                                        },
                                        py: 1.25,
                                        px: 2,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Box>
                    
                    {/* Analysis Prompt (only show if not on analysis page) */}
                    {location.pathname !== '/resume-analysis' && isResumeComplete() && (
                        <Box 
                            component={motion.div}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            sx={{ 
                                mt: 3, 
                                p: 2, 
                                bgcolor: 'rgba(16, 185, 129, 0.08)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: 2,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: '#10b981' }}>
                                ✨ Resume Ready!
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<Analytics />}
                                onClick={() => navigate('/resume-analysis')}
                                sx={{ 
                                    bgcolor: '#10b981',
                                    color: '#ffffff',
                                    fontSize: '0.8rem',
                                    py: 0.75,
                                    width: '100%',
                                    '&:hover': { bgcolor: '#059669' }
                                }}
                            >
                                Analyze Now
                            </Button>
                        </Box>
                    )}
                </Box>
                
                {/* Main Content Area */}
                <Paper 
                    component={motion.div}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    key={location.pathname}
                    elevation={3} 
                    style={customStyle}
                >
                    <Outlet />
                </Paper>
            </Box>
        </div>
    );
}