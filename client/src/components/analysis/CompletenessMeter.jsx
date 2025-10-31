import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Grid,
  Tooltip,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Info
} from '@mui/icons-material';

const CompletenessMeter = ({ analysis }) => {
  const getSectionScores = () => {
    if (analysis.sectionScores) {
      return analysis.sectionScores;
    }
    
    // Calculate from resume data if not provided
    return {
      personal: analysis.resumeStats?.personal || 0,
      education: analysis.resumeStats?.education || 0,
      projects: analysis.resumeStats?.projects || 0,
      experience: analysis.resumeStats?.experience || 0,
      skills: analysis.resumeStats?.skills || 0
    };
  };

  const sectionScores = getSectionScores();

  const getSectionColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'info';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getSectionIcon = (score) => {
    if (score >= 90) return <CheckCircle color="success" />;
    if (score >= 70) return <Info color="info" />;
    if (score >= 50) return <Warning color="warning" />;
    return <Error color="error" />;
  };

  const getSectionStatus = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Incomplete';
  };

  const getSectionDescription = (section, score) => {
    const descriptions = {
      personal: {
        excellent: 'All personal details provided',
        good: 'Most personal details provided',
        fair: 'Basic personal information provided',
        incomplete: 'Missing essential personal information'
      },
      education: {
        excellent: 'Comprehensive education history',
        good: 'Good educational background shown',
        fair: 'Basic education information provided',
        incomplete: 'Education section needs completion'
      },
      projects: {
        excellent: 'Strong project portfolio with details',
        good: 'Good project examples provided',
        fair: 'Some project information available',
        incomplete: 'Projects section needs more content'
      },
      experience: {
        excellent: 'Detailed professional experience',
        good: 'Good work experience coverage',
        fair: 'Some experience information provided',
        incomplete: 'Experience section needs development'
      },
      skills: {
        excellent: 'Comprehensive skill set displayed',
        good: 'Good range of skills shown',
        fair: 'Basic skills information provided',
        incomplete: 'Skills section needs expansion'
      }
    };

    const status = getSectionStatus(score).toLowerCase();
    return descriptions[section]?.[status] || 'Section analysis';
  };

  const calculateOverallCompleteness = () => {
    const scores = Object.values(sectionScores);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const overallCompleteness = calculateOverallCompleteness();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📊 Section Completeness
        </Typography>

        {/* Overall Completeness */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              Overall Completeness
            </Typography>
            <Chip 
              label={`${overallCompleteness}%`}
              color={getSectionColor(overallCompleteness)}
              size="small"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={overallCompleteness}
            color={getSectionColor(overallCompleteness)}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.100'
            }}
          />
        </Box>

        {/* Individual Sections */}
        <Grid container spacing={2}>
          {Object.entries(sectionScores).map(([section, score]) => (
            <Grid item xs={12} key={section}>
              <Tooltip title={getSectionDescription(section, score)} arrow>
                <Box sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  {/* Section Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSectionIcon(score)}
                      <Typography variant="body2" fontWeight="medium" textTransform="capitalize">
                        {section}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                        {getSectionStatus(score)}
                      </Typography>
                      <Chip 
                        label={`${score}%`}
                        color={getSectionColor(score)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  {/* Progress Bar */}
                  <LinearProgress 
                    variant="determinate" 
                    value={score}
                    color={getSectionColor(score)}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'grey.100'
                    }}
                  />

                  {/* Improvement Hint */}
                  {score < 100 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {score < 50 ? 'Needs major improvement' : 
                       score < 80 ? 'Could be enhanced' : 
                       'Nearly complete'}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        {/* Legend */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            COMPLETENESS GUIDE:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip icon={<CheckCircle />} label="90-100%: Excellent" size="small" color="success" variant="outlined" />
            <Chip icon={<Info />} label="70-89%: Good" size="small" color="info" variant="outlined" />
            <Chip icon={<Warning />} label="50-69%: Fair" size="small" color="warning" variant="outlined" />
            <Chip icon={<Error />} label="0-49%: Needs Work" size="small" color="error" variant="outlined" />
          </Box>
        </Box>

        {analysis.isFallback && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              *Basic completeness analysis. AI analysis provides more detailed section feedback.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletenessMeter;