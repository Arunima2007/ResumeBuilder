import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown,
  Remove,
  Warning
} from '@mui/icons-material';

const ScoreCard = ({ analysis }) => {
  // Check if analysis data is valid
  if (!analysis) {
    return (
      <Card sx={{ height: '100%', minWidth: 350 }}>
        <CardContent>
          <Alert severity="warning" icon={<Warning />}>
            No analysis data available
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Safe data extraction with comprehensive fallbacks
  const getSafeData = () => {
    return {
      overallScore: analysis?.overallScore || 0,
      atsScore: analysis?.atsOptimization?.score || analysis?.atsScore || 0,
      keywordCount: analysis?.keywordAnalysis?.strengths?.length || 0,
      sectionScores: analysis?.sectionScores || {
        personal: analysis?.profile ? 75 : 0,
        education: analysis?.education?.length ? 70 : 0,
        experience: analysis?.experience?.length ? 65 : 0,
        projects: analysis?.projects?.length ? 60 : 0,
        skills: analysis?.skills?.length ? 80 : 0
      },
      isFallback: analysis?.isFallback || false
    };
  };

  const {
    overallScore,
    atsScore,
    keywordCount,
    sectionScores,
    isFallback
  } = getSafeData();

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getTrendIcon = (score) => {
    if (score >= 80) return <TrendingUp color="success" />;
    if (score >= 60) return <Remove color="warning" />;
    return <TrendingDown color="error" />;
  };

  return (
    <Card sx={{ 
      height: '100%', 
      minWidth: 400,  // Increased minimum width
      width: '100%',  // Take full available width
      maxWidth: 500   // Set maximum width
    }}>
      <CardContent sx={{ p: 3 }}>  {/* Increased padding */}
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Overall Score
        </Typography>
        
        {/* Main Score */}
        <Box sx={{ textAlign: 'center', mb: 4, py: 2 }}>  {/* Increased margin and padding */}
          <Typography variant="h1" color={getScoreColor(overallScore)} sx={{ fontSize: '4rem', fontWeight: 'bold' }}>
            {overallScore}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            out of 100
          </Typography>
          <Box sx={{ mt: 2 }}>
            {getTrendIcon(overallScore)}
          </Box>
        </Box>

        {/* Section Scores */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Section Breakdown
          </Typography>
          {Object.entries(sectionScores).map(([section, score]) => (
            <Box key={section} sx={{ mb: 2.5 }}>  {/* Increased spacing between sections */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1" textTransform="capitalize" sx={{ fontWeight: 'medium' }}>
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {score}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={score} 
                color={getScoreColor(score)}
                sx={{ 
                  height: 10,  // Thicker progress bar
                  borderRadius: 5,
                  backgroundColor: 'grey.200'
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Quick Stats */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          flexWrap: 'wrap',
          justifyContent: 'center',
          mt: 3 
        }}>
          <Chip 
            label={`ATS: ${atsScore}%`}
            color={getScoreColor(atsScore)}
            variant="filled"
            sx={{ fontSize: '0.9rem', px: 1 }}
          />
          <Chip 
            label={`Keywords: ${keywordCount}`}
            color="primary"
            variant="filled"
            sx={{ fontSize: '0.9rem', px: 1 }}
          />
          {isFallback && (
            <Chip 
              label="Basic Analysis"
              color="info"
              variant="outlined"
              sx={{ fontSize: '0.9rem', px: 1 }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;