import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/profileSlice";
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Profile = () => {
  const dispatch = useDispatch();
  const currentProfile = useSelector((state) => state.profileDetails);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateProfile({ [name]: value }));
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

  return (
    <div style={containerStyle}>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold" color="primary">
              Personal Details
            </Typography>
          }
        />
      </Card>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* First Name & Last Name */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                First Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="firstName"
                label="First Name"
                required
                value={currentProfile?.firstName || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <PersonIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="lastName"
                label="Last Name"
                required
                value={currentProfile?.lastName || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <PersonIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Email & Mobile */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Email
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="email"
                name="email"
                label="Email"
                required
                value={currentProfile?.email || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <EmailIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Mobile Number
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="mobile"
                label="Mobile Number"
                required
                value={currentProfile?.mobile || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <PhoneIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Address
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="address"
                label="Address"
                multiline
                rows={1}
                value={currentProfile?.address || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <HomeIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* LinkedIn & GitHub */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                LinkedIn
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="linkedIn"
                label="LinkedIn Profile"
                value={currentProfile?.linkedIn || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <LinkedInIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                GitHub
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="github"
                label="GitHub Profile"
                value={currentProfile?.github || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <GitHubIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* CodeChef & LeetCode */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                CodeChef
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="codechef"
                label="CodeChef Profile"
                value={currentProfile?.codechef || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <CodeIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                LeetCode
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="leetcode"
                label="LeetCode Profile"
                value={currentProfile?.leetcode || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <CodeIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Codeforces */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Codeforces
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="codeforces"
                label="Codeforces Profile"
                value={currentProfile?.codeforces || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <CodeIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Navigation Link */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 3, px: 2 }}>
        <Link to="/education" style={linkStyle}>
          <Typography variant="h6">Education Section</Typography>
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

export default Profile;