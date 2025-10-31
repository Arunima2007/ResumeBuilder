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
  Alert
} from '@mui/material';
import {
  PriorityHigh,
  TrendingUp,
  Lightbulb,
  Warning,
  CheckCircle
} from '@mui/icons-material';

const AISuggestions = ({ analysis }) => {
  const getSuggestions = () => {
    if (analysis.improvements && analysis.strengths) {
      // Backend AI response format
      return {
        immediateImprovements: analysis.improvements,
        strengths: analysis.strengths,
        industryTips: analysis.industryTips || []
      };
    } else if (analysis.aiSuggestions) {
      // Alternative backend format
      return analysis.aiSuggestions;
    } else {
      // Fallback format
      return {
        immediateImprovements: analysis.improvements || [],
        strengths: analysis.strengths || ["Good foundation - keep building!"],
        industryTips: []
      };
    }
  };

  const suggestions = getSuggestions();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          💡 Suggestions & Improvements
        </Typography>

        {analysis.isFallback && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Using basic analysis. Connect to AI backend for detailed suggestions.
          </Alert>
        )}

        {/* Strengths */}
        {suggestions.strengths.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom color="success.main">
              ✅ Your Strengths
            </Typography>
            <List dense>
              {suggestions.strengths.map((strength, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary={strength} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Improvements */}
        {suggestions.immediateImprovements.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom color="error.main">
              🎯 Areas for Improvement
            </Typography>
            <List dense>
              {suggestions.immediateImprovements.map((improvement, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <PriorityHigh color="error" />
                  </ListItemIcon>
                  <ListItemText primary={improvement} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Industry Tips */}
        {suggestions.industryTips.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom color="warning.main">
              💼 Industry Insights
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestions.industryTips.map((tip, index) => (
                <Chip
                  key={index}
                  label={tip}
                  variant="outlined"
                  color="warning"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestions;