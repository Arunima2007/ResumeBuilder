import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { Button, Avatar, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from "../assets/profile.png";
import { logoutUser } from "../redux/userSlice";
import { clearEducation } from "../redux/educationSlice";
import { clearProjects } from "../redux/projectSlice";
import { clearExperience } from "../redux/experienceSlice";
import { clearExtraDetails } from "../redux/extraDetailsSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Navbar.css';
import { clearProfile } from "../redux/profileSlice";

const Navbar = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [sectionsAnchorEl, setSectionsAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleSectionsClick = (event) => setSectionsAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setSectionsAnchorEl(null);
    setIsDrawerOpen(false);
  };

  const handleLogout = () => {
    toast.success("Logout Successful!", { position: "top-left", autoClose: 1500 });
    dispatch(logoutUser());
    dispatch(clearProfile());
    dispatch(clearEducation());
    dispatch(clearProjects());
    dispatch(clearExperience());
    dispatch(clearExtraDetails());
  };

  return (
    <AppBar
      position="fixed" // Changed from "static" to "fixed"
      sx={{
        backgroundColor: "var(--bgColor, #0d47a1)",
        color: "white",
        width: "100vw",
        left: 0,
        right: 0,
        top: 0,
        margin: 0,
        padding: 0,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure navbar stays above other content
      }}
    >
      <Toolbar 
        disableGutters 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          width: "100%", 
          minHeight: "64px",
          px: 2
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconButton
            edge="start"
            sx={{
              color: "black",
              '&:hover': { color: '#222' }
            }}
            aria-label="menu"
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            {currentUser ? (
              <List>
                <ListItem button component={Link} to="/" onClick={handleClose}>
                  <ListItemIcon><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/profile" onClick={handleClose}>
                  <ListItemIcon><EditIcon /></ListItemIcon>
                  <ListItemText primary="Edit Resume" />
                </ListItem>
                <ListItem button component={Link} to="/templates" onClick={handleClose}>
                  <ListItemIcon><DescriptionIcon /></ListItemIcon>
                  <ListItemText primary="Templates" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            ) : (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <h3>Login Please!</h3>
              </div>
            )}
          </Drawer>

          <img src={logo} alt="resume" width="40" height="40" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            <Link to="/" style={{ color: "black", textDecoration: "none" }}>
              RESUME BUILDER
            </Link>
          </Typography>
        </div>

        {/* RIGHT SIDE */}
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Button 
              onClick={handleSectionsClick}
              sx={{
                color: "black",
                fontWeight: 600,
                '&:hover': { color: '#222' }
              }}
            >
              Sections
            </Button>

            <Menu
              anchorEl={sectionsAnchorEl}
              open={Boolean(sectionsAnchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>Profile</MenuItem>
              <MenuItem onClick={() => { navigate('/education'); handleClose(); }}>Education</MenuItem>
              <MenuItem onClick={() => { navigate('/projects'); handleClose(); }}>Projects</MenuItem>
              <MenuItem onClick={() => { navigate('/experience'); handleClose(); }}>Experience</MenuItem>
              <MenuItem onClick={() => { navigate('/extraDetails'); handleClose(); }}>Extra Details</MenuItem>
            </Menu>

            <Avatar
              src={currentUser?.avatar}
              alt="user"
              onClick={handleClick}
              sx={{ cursor: "pointer" }}
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => navigate('/user-profile')}>My Profile</MenuItem>
              <MenuItem onClick={() => navigate('/templates')}>Templates</MenuItem>
              <MenuItem onClick={() => navigate('/contact-us')}>Contact Us</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <Link to="/sign-in" style={{ textDecoration: "none", color: "inherit" }}>
            <Button color="inherit">Login</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;