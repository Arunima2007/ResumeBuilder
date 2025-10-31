import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Box,
  Tooltip
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InterestsIcon from "@mui/icons-material/Interests";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import StorageIcon from '@mui/icons-material/Storage';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  addSkills,
  addAchievements,
  updateSkills,
  updateAchievements,
  updateExtraCoCurricular,
  addExtraCoCurricular,
  deleteSkills,
  deleteAchievements,
  deleteExtraCoCurricular,
} from "../redux/extraDetailsSlice";

import { Link } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import { API_BASE_URL } from "../api";

const ExtraDetails = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const extraDetails = useSelector((state) => state.extraDetails);
  const profileData = useSelector((state) => state.profileDetails);
  const educationalData = useSelector((state) => state.educationDetails);
  const projectData = useSelector((state) => state.projectDetails);
  const experienceData = useSelector((state) => state.experienceDetails);
  const extraDetailsData = useSelector((state) => state.extraDetails);
  const [loading, setLoading] = useState(false);

  const handleAddItem = (type) => {
    if (type === "achievements") {
      dispatch(addAchievements());
    } else if (type === "extraCoCurricular") {
      dispatch(addExtraCoCurricular());
    } else if (type === "languages") {
      dispatch(addSkills({ type: "languages" }));
    } else if (type === "web") {
      dispatch(addSkills({ type: "web" }));
    } else if (type === "webFrameworks") {
      dispatch(addSkills({ type: "webFrameworks" }));
    } else if (type === "databases") {
      dispatch(addSkills({ type: "databases" }));
    } else if (type === "other") {
      dispatch(addSkills({ type: "other" }));
    }
  };

  const handleInputChange = (index, type, value) => {
    if (type === "languages" || type === "web" || type === "webFrameworks" || type === "databases" || type === "other") {
      dispatch(updateSkills({ type, index, value }));
    } else if (type === "achievements") {
      dispatch(updateAchievements({ index, value }));
    } else if (type === "extraCoCurricular") {
      dispatch(updateExtraCoCurricular({ index, value }));
    }
  };

  const handleDeleteItem = (index, type) => {
    if (type === "achievements") {
      dispatch(deleteAchievements(index));
    } else if (type === "extraCoCurricular") {
      dispatch(deleteExtraCoCurricular(index));
    } else if (type === "languages" || type === "web" || type === "webFrameworks" || type === "databases" || type === "other") {
      dispatch(deleteSkills({ type, index }));
    }
  };

  const containerStyle = {
    paddingTop: "80px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const handleSave = async () => {
    setLoading(true);
    const resumeData = {
      profile: profileData,
      education: educationalData,
      projects: projectData,
      experience: experienceData,
      extraDetails: extraDetailsData,
    };
    
    try {
      const response = await axios.post(`${API_BASE_URL}/data/resume-data?id=${currentUser._id}`, { resumeData }, {
        headers: {
          authorization: currentUser.token,
        },
      });
      console.log("response: ", response.data);
      toast.success("Data Saved Successfully!", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error in addResumeData:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold" color="primary">
              Extra Details
            </Typography>
          }
        />
      </Card>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          {/* Skills Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'black', fontSize: '1.4rem' }}>
              Skills
            </Typography>

            {/* Languages */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'black', fontSize: '1.1rem' }}>
                  <LanguageIcon sx={{ color: 'black' }} />
                  Languages
                </Typography>
                <Tooltip title="eg: C, C++, Java, Python" placement="top" arrow>
                  <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                    <i className="fa-solid fa-circle-info"></i>
                  </Typography>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                {extraDetails?.skills?.languages?.map((language, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={`Language ${index + 1}`}
                        value={language || ''}
                        onChange={(e) => handleInputChange(index, "languages", e.target.value)}
                      />
                      <IconButton 
                        onClick={() => handleDeleteItem(index, "languages")}
                        sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "var(--btn)",
                  color: 'black',
                  '&:hover': { backgroundColor: "var(--btnHover)" },
                }}
                onClick={() => handleAddItem("languages")}
              >
                Add Language
              </Button>
            </Box>

            {/* Web Development Skills */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'black', fontSize: '1.1rem' }}>
                  <CodeIcon sx={{ color: 'black' }} />
                  Web Development Skills
                </Typography>
                <Tooltip title="eg: HTML, CSS, JavaScript" placement="top" arrow>
                  <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                    <i className="fa-solid fa-circle-info"></i>
                  </Typography>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                {extraDetails?.skills?.web?.map((webSkill, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={`Web Skill ${index + 1}`}
                        value={webSkill || ''}
                        onChange={(e) => handleInputChange(index, "web", e.target.value)}
                      />
                      <IconButton 
                        onClick={() => handleDeleteItem(index, "web")}
                        sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "var(--btn)",
                  color: 'black',
                  '&:hover': { backgroundColor: "var(--btnHover)" },
                }}
                onClick={() => handleAddItem("web")}
              >
                Add Web Skill
              </Button>
            </Box>

            {/* Web Frameworks/Libraries */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'black', fontSize: '1.1rem' }}>
                  <LibraryBooksIcon sx={{ color: 'black' }} />
                  Web Frameworks/Libraries
                </Typography>
                <Tooltip title="eg: React, Angular, Next.js, Bootstrap" placement="top" arrow>
                  <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                    <i className="fa-solid fa-circle-info"></i>
                  </Typography>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                {extraDetails?.skills?.webFrameworks?.map((webFrame, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={`Web Framework ${index + 1}`}
                        value={webFrame || ''}
                        onChange={(e) => handleInputChange(index, "webFrameworks", e.target.value)}
                      />
                      <IconButton 
                        onClick={() => handleDeleteItem(index, "webFrameworks")}
                        sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "var(--btn)",
                  color: 'black',
                  '&:hover': { backgroundColor: "var(--btnHover)" },
                }}
                onClick={() => handleAddItem("webFrameworks")}
              >
                Add Web Framework Skill
              </Button>
            </Box>

            {/* Databases */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'black', fontSize: '1.1rem' }}>
                  <StorageIcon sx={{ color: 'black' }} />
                  Databases
                </Typography>
                <Tooltip title="eg: MySQL, MongoDB" placement="top" arrow>
                  <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                    <i className="fa-solid fa-circle-info"></i>
                  </Typography>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                {extraDetails?.skills?.databases?.map((data, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={`Database ${index + 1}`}
                        value={data || ''}
                        onChange={(e) => handleInputChange(index, "databases", e.target.value)}
                      />
                      <IconButton 
                        onClick={() => handleDeleteItem(index, "databases")}
                        sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "var(--btn)",
                  color: 'black',
                  '&:hover': { backgroundColor: "var(--btnHover)" },
                }}
                onClick={() => handleAddItem("databases")}
              >
                Add Database Skill
              </Button>
            </Box>

            {/* Other Skills */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'black', fontSize: '1.1rem' }}>
                  <PsychologyIcon sx={{ color: 'black' }} />
                  Other Skills
                </Typography>
                <Tooltip title="eg: Leadership, Management, Teamwork" placement="top" arrow>
                  <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                    <i className="fa-solid fa-circle-info"></i>
                  </Typography>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                {extraDetails?.skills?.other?.map((or, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={`Other Skill ${index + 1}`}
                        value={or || ''}
                        onChange={(e) => handleInputChange(index, "other", e.target.value)}
                      />
                      <IconButton 
                        onClick={() => handleDeleteItem(index, "other")}
                        sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "var(--btn)",
                  color: 'black',
                  '&:hover': { backgroundColor: "var(--btnHover)" },
                }}
                onClick={() => handleAddItem("other")}
              >
                Add Other Skill
              </Button>
            </Box>
          </Box>

          {/* Achievements Section - LEFT ALIGNED */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'black', fontSize: '1.1rem' }}>
                <EmojiEventsIcon sx={{ color: 'black' }} />
                Achievements
              </Typography>
              <Tooltip title="Add your achievements, awards, and recognitions" placement="top" arrow>
                <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                  <i className="fa-solid fa-circle-info"></i>
                </Typography>
              </Tooltip>
            </Box>
            <Grid container spacing={2}>
              {extraDetails?.achievements?.map((achievement, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Achievement ${index + 1}`}
                      value={achievement || ''}
                      onChange={(e) => handleInputChange(index, "achievements", e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end">
                              <EmojiEventsIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <IconButton 
                      onClick={() => handleDeleteItem(index, "achievements")}
                      sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "var(--btn)",
                color: 'black',
                '&:hover': { backgroundColor: "var(--btnHover)" },
              }}
              onClick={() => handleAddItem("achievements")}
            >
              Add Achievement
            </Button>
          </Box>

          {/* Extra Curricular Activities - LEFT ALIGNED */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'black', fontSize: '1.1rem' }}>
                <AutoAwesomeIcon sx={{ color: 'black' }} />
                Extra Curricular Activities
              </Typography>
              <Tooltip title="Add your extracurricular activities, hobbies, and interests" placement="top" arrow>
                <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                  <i className="fa-solid fa-circle-info"></i>
                </Typography>
              </Tooltip>
            </Box>
            <Grid container spacing={2}>
              {extraDetails?.extraCoCurricular?.map((extraCurricular, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Extra-Curricular ${index + 1}`}
                      value={extraCurricular || ''}
                      onChange={(e) => handleInputChange(index, "extraCoCurricular", e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end">
                              <AutoAwesomeIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <IconButton 
                      onClick={() => handleDeleteItem(index, "extraCoCurricular")}
                      sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "var(--btn)",
                color: 'black',
                '&:hover': { backgroundColor: "var(--btnHover)" },
              }}
              onClick={() => handleAddItem("extraCoCurricular")}
            >
              Add Activity
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Save Data Section */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
            *Please save your data to access it next time
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--btn)",
                color: 'black',
                '&:hover': { 
                  backgroundColor: "var(--btnHover)",
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                },
                padding: '10px 24px',
                fontWeight: 'bold',
                borderRadius: '8px'
              }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Your Data'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 2 }}>
        <Link to="/experience" style={linkStyle}>
          <ArrowBackIcon sx={iconStyle} />
          <Typography variant="h6">Experience Section</Typography>
        </Link>
        <Link to="/templates" style={linkStyle}>
          <Typography variant="h6">Resume Templates</Typography>
          <ArrowForwardIcon sx={iconStyle} />
        </Link>
      </Box>
    </div>
  );
};

const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 20px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
};

const iconStyle = {
  fontSize: '1.5rem',
};

export default ExtraDetails;