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
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import { useDispatch, useSelector } from "react-redux";
import { addExperience, updateExperience, deleteExperience } from "../redux/experienceSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Experience = () => {
  const dispatch = useDispatch();
  const experiences = useSelector((state) => state.experienceDetails);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    dispatch(updateExperience({ index, field: name, value }));
  };

  const handleAddExperience = () => {
    dispatch(addExperience());
  };

  const handleDeleteExperience = (index) => {
    dispatch(deleteExperience(index));
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

  const contentExpr = (
    <div>
      <p>1. Provide description of your experience.</p>
      <p>eg.</p>
      <p>Streamlined project management process using MERN stack.</p>
      <p>Integrated Material-UI and React for intuitive user interface.</p>
      <p>Implemented Redux for centralized state management and seamless data flow.</p>
    </div>
  );

  return (
    <div style={containerStyle}>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold" color="primary">
              Experience Details
            </Typography>
          }
        />
      </Card>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          {experiences?.map((experience, index) => (
            <Box key={index} sx={{ mb: 4, pb: 3, borderBottom: index < experiences.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
              {/* Experience Header with Delete Button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Experience {index + 1}
                </Typography>
                <IconButton 
                  onClick={() => handleDeleteExperience(index)}
                  sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>

              <Grid container spacing={3}>
                {/* Role */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Role
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="role"
                    label="Role"
                    value={experience.role || ''}
                    onChange={(event) => handleInputChange(index, event)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <WorkIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Institute/Organisation */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Institute/Organisation
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="institute"
                    label="Institute/Organisation"
                    value={experience.institute || ''}
                    onChange={(event) => handleInputChange(index, event)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <CorporateFareIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Date Fields */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Start Date
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="start_date"
                    type="date"
                    value={experience.start_date || ''}
                    onChange={(event) => handleInputChange(index, event)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    End Date
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="end_date"
                    type="date"
                    value={experience.end_date || ''}
                    onChange={(event) => handleInputChange(index, event)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Description
                    </Typography>
                    <Tooltip
                      title={<Box sx={{ p: 1, fontSize: '0.9rem' }}>{contentExpr}</Box>}
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
                    name="desc"
                    multiline
                    rows={2}  
                    label="Description"
                    value={experience.desc || ''}
                    onChange={(event) => handleInputChange(index, event)}
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
              </Grid>
            </Box>
          ))}

          {/* Add Experience Button */}
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
              onClick={handleAddExperience}
            >
              Add Experience
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 2 }}>
        <Link to="/projects" style={linkStyle}>
          <ArrowBackIcon sx={iconStyle} />
          <Typography variant="h6">Project Section</Typography>
        </Link>
        <Link to="/extraDetails" style={linkStyle}>
          <Typography variant="h6">ExtraDetails Section</Typography>
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

export default Experience;