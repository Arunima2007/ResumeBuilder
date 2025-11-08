import React from "react";
import {
  Container,
  Typography,
  IconButton,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { Call, MailOutline, LinkedIn } from "@mui/icons-material";

const Contact = () => {
  const handleSocialMediaClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "80vh",
        marginTop: "60px",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          margin: "auto",
          borderRadius: 4,
          padding: 4,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: "bold",
              marginBottom: 3 
            }}
          >
            Contact Us
          </Typography>
          
          <Typography 
            paragraph 
            sx={{ 
              marginBottom: 4,
              color: "text.secondary"
            }}
          >
            If you have any feedback or questions about our application, feel
            free to contact us.
          </Typography>

          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              marginBottom: 3,
              fontWeight: "bold"
            }}
          >
            Contact Information
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Phone */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 3,
                justifyContent: "flex-start"
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#FFECD6",
                  borderRadius: "50%",
                  padding: "12px",
                  flexShrink: 0,
                }}
              >
                <Call />
              </IconButton>
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                Phone: 8130988113
              </Typography>
            </Box>

            {/* Email */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 3,
                justifyContent: "flex-start"
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#FFECD6",
                  borderRadius: "50%",
                  padding: "12px",
                  flexShrink: 0,
                }}
              >
                <MailOutline />
              </IconButton>
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                Email: arunimamohan018@gmail.com
              </Typography>
            </Box>

            {/* LinkedIn */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 3,
                justifyContent: "flex-start"
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: "#FFECD6",
                  borderRadius: "50%",
                  padding: "12px",
                  flexShrink: 0,
                }}
                onClick={() =>
                  handleSocialMediaClick(
                    "https://www.linkedin.com/in/arunima-mohan-9aa54b324"
                  )
                }
              >
                <LinkedIn />
              </IconButton>
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                LinkedIn
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Contact;