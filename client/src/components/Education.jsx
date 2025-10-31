import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GradeIcon from "@mui/icons-material/Grade";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useDispatch, useSelector } from "react-redux";
import { updateEducation } from "../redux/educationSlice";
import { Link } from 'react-router-dom';

const Education = () => {
  const dispatch = useDispatch();
  const education = useSelector((state) => state.educationDetails);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateEducation({ ...education, [name]: value }));
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

  const years = Array.from({ length: 30 }, (_, index) => 2030 - index);

  const engineeringFields = [
    "CS",
    "IT",
    "EnTC",
    "Electrical",
    "Mechanical",
    "Civil",
    "Chemical",
  ];
  const otherFields = ["B.E.", "B.Tech", "BCA", "Bsc", "MBA", "M.Tech"];

  const higherCollegeBoard = ["Maharashtra State Board", "CBSE", "ICSE", "Diploma"];
  const schoolBoard = ["Maharashtra State Board", "CBSE", "ICSE"];

  return (
    <div style={containerStyle}>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold" color="primary">
              Educational Details
            </Typography>
          }
        />
      </Card>
      
      {/* College Details */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" align="left" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            College/University Details
          </Typography>
          
          <Grid container spacing={3}>
            {/* Row 1 */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                name="college"
                label="College Name"
                required
                value={education.college || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <SchoolIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="year"
                label="Year"
                value={education.year || ''}
                onChange={handleChange}
              >
                <MenuItem value="F.E">F.E</MenuItem>
                <MenuItem value="S.E">S.E</MenuItem>
                <MenuItem value="T.E">T.E</MenuItem>
                <MenuItem value="B.E">B.E</MenuItem>
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="field"
                label="Field of Study"
                required
                value={education.field || ''}
                onChange={handleChange}
              >
                <MenuItem value="" disabled>Select Field</MenuItem>
                {otherFields.map((field) => (
                  <MenuItem key={field} value={field}>{field}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="branch"
                label="Select Branch"
                required
                value={education.branch || ''}
                onChange={handleChange}
              >
                <MenuItem value="" disabled>Select Branch</MenuItem>
                {engineeringFields.map((field) => (
                  <MenuItem key={field} value={field}>{field}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="startYear"
                label="Start Year"
                value={education.startYear || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EventIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>Select Year</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="endYear"
                label="End Year"
                value={education.endYear || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EventIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>Select Year</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                name="city"
                label="City"
                value={education.city || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <LocationCityIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                name="grades"
                label="CGPA"
                value={education.grades || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <GradeIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 12th Details */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" align="left" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Higher secondary education (12th) Details
          </Typography>
          
          <Grid container spacing={3}>
            {/* Row 1 */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                name="higherCollege"
                label="College Name"
                required
                value={education.higherCollege || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <SchoolIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="startYear2"
                label="Start Year"
                value={education.startYear2 || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EventIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>Select Year</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="endYear2"
                label="End Year"
                value={education.endYear2 || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EventIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>Select Year</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                name="city2"
                label="City"
                value={education.city2 || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <LocationCityIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                name="percentage"
                label="Percentage"
                value={education.percentage || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <GradeIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="board1"
                label="Select Board"
                required
                value={education.board1 || ''}
                onChange={handleChange}
              >
                <MenuItem value="" disabled>Select Board</MenuItem>
                {higherCollegeBoard.map((field) => (
                  <MenuItem key={field} value={field}>{field}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 10th Details */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" align="left" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Secondary education (10th) Details
          </Typography>
          
          <Grid container spacing={3}>
            {/* Row 1 */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                name="school"
                label="School Name"
                required
                value={education.school || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <SchoolIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="startYear3"
                label="Start Year"
                value={education.startYear3 || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EventIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>Select Year</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="endYear3"
                label="End Year"
                value={education.endYear3 || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EventIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>Select Year</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                name="city3"
                label="City"
                value={education.city3 || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <LocationCityIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                name="percentage2"
                label="Percentage"
                value={education.percentage2 || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <GradeIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                name="board2"
                label="Select Board"
                required
                value={education.board2 || ''}
                onChange={handleChange}
              >
                <MenuItem value="" disabled>Select Board</MenuItem>
                {schoolBoard.map((field) => (
                  <MenuItem key={field} value={field}>{field}</MenuItem>
                ))}
                <MenuItem value="">Clear Selection</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 2 }}>
        <Link to="/profile" style={linkStyle}>
          <ArrowBackIcon sx={iconStyle} />
          <Typography variant="h6">Profile Section</Typography>
        </Link>
        <Link to="/projects" style={linkStyle}>
          <Typography variant="h6">Project Section</Typography>
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

export default Education;