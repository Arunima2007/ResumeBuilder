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
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { updateProject, addProject, deleteProject } from "../redux/projectSlice";
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projectDetails);
  const [showInputFields, setShowInputFields] = useState(false);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    dispatch(updateProject({ index, field: name, value }));
  };

  const handleAddProject = () => {
    dispatch(addProject());
    setShowInputFields(true);
  };

  const handleDeleteProject = (index) => {
    dispatch(deleteProject(index));
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

  const content = (
    <div>
      <p>1. Provide description of the project.</p>
      <p>eg.</p>
      <p>Streamlined resume creation process using MERN stack.</p>
      <p>Integrated Material-UI and React for intuitive user interface.</p>
      <p>Implemented Redux for centralized state management and seamless data flow.</p>
    </div>
  );

  const TechStack = (
    <div>
      <p>1. Provide the tech stack used in the project.</p>
      <p>eg.</p>
      <p>React, Redux, Material-UI, Node.js, Express.js, MongoDB</p>
    </div>
  );

  return (
    <div style={containerStyle}>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold" color="primary">
              Projects Details
            </Typography>
          }
        />
      </Card>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          {projects?.map((project, index) => (
            <Box key={index} sx={{ mb: 4, pb: 3, borderBottom: index < projects.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
              {/* Project Header with Delete Button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Project {index + 1}
                </Typography>
                <IconButton 
                  onClick={() => handleDeleteProject(index)}
                  sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>

              <Grid container spacing={3}>
                {/* Project Title */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', fontSize: '1.1rem' }}>
                      Project Title
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="title"
                    label="Project Title"
                    value={project.title || ''}
                    onChange={(event) => handleInputChange(index, event)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <TitleIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Project Description */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', fontSize: '1.1rem' }}>
                      Project Description
                    </Typography>
                    <Tooltip
                      title={<Box sx={{ p: 1, fontSize: '0.9rem' }}>{content}</Box>}
                      placement="top"
                      arrow
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                        <i className="fa-solid fa-circle-info"></i>
                      </Typography>
                    </Tooltip>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="description"
                    label="Project Description"
                    value={project.description || ''}
                    onChange={(event) => handleInputChange(index, event)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <DescriptionIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Project Link */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', fontSize: '1.1rem' }}>
                      Project Link (Hosted)
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="link"
                    label="Project Link"
                    value={project.link || ''}
                    onChange={(event) => handleInputChange(index, event)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <LinkIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Tech Stack */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', fontSize: '1.1rem' }}>
                      Project Tech Stack
                    </Typography>
                    <Tooltip
                      title={<Box sx={{ p: 1, fontSize: '0.9rem' }}>{TechStack}</Box>}
                      placement="top"
                      arrow
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                        <i className="fa-solid fa-circle-info"></i>
                      </Typography>
                    </Tooltip>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="techStack"
                    label="Tech Stack"
                    value={project.techStack || ''}
                    onChange={(event) => handleInputChange(index, event)}
                    placeholder="e.g., React, Node.js, MongoDB, Express"
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* Add Project Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
              onClick={handleAddProject}
            >
              Add Project
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 2 }}>
        <Link to="/education" style={linkStyle}>
          <ArrowBackIcon sx={iconStyle} />
          <Typography variant="h6">Education Section</Typography>
        </Link>
        <Link to="/experience" style={linkStyle}>
          <Typography variant="h6">Experience Section</Typography>
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

export default Projects;