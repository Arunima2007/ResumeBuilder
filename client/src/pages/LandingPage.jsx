import React, { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateEducation } from '../redux/educationSlice';
import { updateProfile } from '../redux/profileSlice';
import { updateProject } from '../redux/projectSlice';
import { updateExperience } from '../redux/experienceSlice';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { updateAchievements, updateExtraCoCurricular, updateSkills } from '../redux/extraDetailsSlice';

const theme = createTheme({
    palette: {
        primary: {
            main: '#c93184ff'
        },
        secondary: {
            main: '#8b6865ff',
        },
        // Remove background default to use transparent
    },
});

export default function LandingPage() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getAllResumeData = async () => {
        if (!currentUser) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/resume/get-all-resume-data?id=${currentUser._id}`, {
                headers: {
                    authorization: currentUser.token,
                },
            });
            const resumeData = response.data.resumeData[0];
            if (resumeData) {
                dispatch(updateProfile(resumeData.profile));
                dispatch(updateEducation(resumeData.education[0]));
                resumeData.projects.forEach((project, index) => {
                    Object.keys(project).forEach(field => {
                        dispatch(updateProject({ index, field, value: project[field] }));
                    });
                });

                resumeData.experience.forEach((experience, index) => {
                    Object.keys(experience).forEach(field => {
                        dispatch(updateExperience({ index, field, value: experience[field] }));
                    });
                });
                const { skills, achievements, extraCoCurricular } = resumeData.extraDetails;
                
                Object.keys(skills).forEach((type) => {
                    skills[type].forEach((skill, index) => {
                        dispatch(updateSkills({ type, index, value: skill }));
                    });
                });

                achievements.forEach((achievement, index) => {
                    dispatch(updateAchievements({ index, value: achievement }));
                });

                extraCoCurricular.forEach((activity, index) => {
                    dispatch(updateExtraCoCurricular({ index, value: activity }));
                });
            }
        } catch (error) {
            console.error("Error in getAllResumeData:", error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            getAllResumeData();
        }
    }, [currentUser]);

    const handleGetStarted = () => {
        navigate('/profile');
    };

    return (
        <div className="main-content" style={{ minHeight: "100vh", paddingTop: "80px", overflow: "hidden" }}>
            <ThemeProvider theme={theme}>
                <Box className='box-container'>
                    {/* Background glow effects */}
                    <div className="glow-blob glow-blob-1"></div>
                    <div className="glow-blob glow-blob-2"></div>

                    <Container maxWidth="lg" sx={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Hero Section */}
                        <Box sx={{ maxWidth: '850px', mb: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography className="hero-gradient-text" variant="h2" gutterBottom sx={{ fontSize: { xs: '2.5rem', sm: '3.75rem' } }}>
                                    Build. Analyze. Impress. Your Complete Resume Success Platform.
                                </Typography>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4, fontWeight: 400, maxWidth: '600px', mx: 'auto' }}>
                                    Create a resume that stands out with our easy-to-use builder and get instant AI-powered feedback.
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Button 
                                    onClick={handleGetStarted} 
                                    variant='contained' 
                                    sx={{ 
                                        borderRadius: '30px', 
                                        color: '#ffffff', 
                                        backgroundColor: '#6366f1', 
                                        "&:hover": { backgroundColor: '#4f46e5', transform: 'scale(1.03)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
                                        fontWeight: 700, 
                                        px: 5, 
                                        py: 1.75,
                                        fontSize: '1.05rem',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
                                    }} 
                                    size="large"
                                >
                                    Get Started Free
                                </Button>
                            </motion.div>
                        </Box>

                        {/* Feature Cards Grid */}
                        <div className="features-grid">
                            <motion.div 
                                className="feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <span className="feature-icon">✍️</span>
                                <Typography variant="h6" className="feature-title">Resume Builder</Typography>
                                <Typography variant="body2" className="feature-desc">
                                    Structured, clean, and intuitive UI to input profile data, projects, experience, and certifications.
                                </Typography>
                            </motion.div>

                            <motion.div 
                                className="feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <span className="feature-icon">🧠</span>
                                <Typography variant="h6" className="feature-title">AI Analysis</Typography>
                                <Typography variant="body2" className="feature-desc">
                                    Deep evaluation powered by Google Gemini AI providing granular feedback on sections, formatting, and content.
                                </Typography>
                            </motion.div>

                            <motion.div 
                                className="feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <span className="feature-icon">🎯</span>
                                <Typography variant="h6" className="feature-title">ATS Checker</Typography>
                                <Typography variant="body2" className="feature-desc">
                                    Compare your resume against target job descriptions and optimize keywords to bypass tracking systems.
                                </Typography>
                            </motion.div>
                        </div>
                    </Container>
                </Box>
            </ThemeProvider>
        </div>
    );
}