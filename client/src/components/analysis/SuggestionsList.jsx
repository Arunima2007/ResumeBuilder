import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  PriorityHigh,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Warning,
  AutoAwesome
} from '@mui/icons-material';

const SuggestionsList = ({ analysis }) => {
  // Extract suggestions from different possible response formats
  const getSuggestionsData = () => {
    if (analysis.improvements && analysis.strengths) {
      return {
        critical: analysis.improvements,
        strengths: analysis.strengths,
        enhancements: [
          "Add quantifiable achievements with metrics",
          "Include specific technologies and tools",
          "Add project links and GitHub profile"
        ]
      };
    } else if (analysis.aiSuggestions) {
      return {
        critical: analysis.aiSuggestions.immediateImprovements || [],
        strengths: [],
        enhancements: analysis.aiSuggestions.longTermSuggestions || []
      };
    } else {
      return {
        critical: [],
        strengths: ["Good foundation - continue building your resume"],
        enhancements: []
      };
    }
  };

  const suggestions = getSuggestionsData();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome color="primary" />
          Actionable Suggestions
        </Typography>

        {/* Critical Improvements */}
        {suggestions.critical.length > 0 && (
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="error" />
                <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                  Critical Improvements ({suggestions.critical.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {suggestions.critical.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <PriorityHigh color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Strengths */}
        {suggestions.strengths.length > 0 && (
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" />
                <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                  Your Strengths ({suggestions.strengths.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {suggestions.strengths.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Enhancement Suggestions */}
        {suggestions.enhancements.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="info" />
                <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                  Enhancement Tips ({suggestions.enhancements.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {suggestions.enhancements.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Lightbulb color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Quick Tips */}
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            💡 Quick Tips
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Use action verbs" size="small" variant="outlined" />
            <Chip label="Add metrics & numbers" size="small" variant="outlined" />
            <Chip label="Include keywords" size="small" variant="outlined" />
            <Chip label="Keep it concise" size="small" variant="outlined" />
          </Box>
        </Box>

        {analysis.isFallback && (
          <Box sx={{ mt: 2 }}>
            <Divider />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              *Using basic analysis. Connect to AI backend for personalized, detailed suggestions.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionsList;