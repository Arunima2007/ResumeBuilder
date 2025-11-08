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
        try {
            const response = await axios.get(`${API_BASE_URL}/data/get-all-resume-data?id=${currentUser._id}`, {
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
        getAllResumeData();
    }, []);

    const handleGetStarted = () => {
        navigate('/profile');
    };

    return (
        <div className="main-content">
            <ThemeProvider theme={theme}>
                <Box className='box-container' sx={{ backgroundColor: 'transparent' }}>
                    <div>
                        
                        <div>
                            <div className="overlay-text">
                                <Container maxWidth="md">
                                    <motion.div
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: '800' }}>
                                            Build. Analyze. Impress. Your Complete Resume Success Platform.
                                        </Typography>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    >
                                        <Typography variant="h5" component="h1" gutterBottom>
                                            Create a resume that stands out with our easy-to-use builder
                                        </Typography>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1, delay: 1 }}
                                    >
                                        <Button onClick={handleGetStarted} variant='outlined' sx={{ borderRadius: '30px', color: 'black', backgroundColor: "var(--btnColor)", "&:hover": { backgroundColor: "var(--landBtnHover)", border: 'none' }, border: 'none', fontWeight: 600 }} size="large">
                                            Get Started
                                        </Button>
                                    </motion.div>
                                </Container>
                            </div>
                        </div>
                    </div>
                </Box>
            </ThemeProvider>
        </div>
    );
}