import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';

const AnalysisDashboard = ({ analysis }) => {
  const getContentQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'success';
      case 'good': return 'success';
      case 'fair': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Detailed Analysis
        </Typography>

        {/* Content Quality */}
        {analysis.contentQuality && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              CONTENT QUALITY
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={analysis.contentQuality.clarity}
                    color={getContentQualityColor(analysis.contentQuality.clarity)}
                    variant="outlined"
                  />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    Clarity
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={analysis.contentQuality.impact}
                    color={getImpactColor(analysis.contentQuality.impact)}
                    variant="outlined"
                  />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    Impact
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={analysis.contentQuality.readability}
                    color={getContentQualityColor(analysis.contentQuality.readability)}
                    variant="outlined"
                  />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    Readability
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Strengths */}
        {analysis.strengths && analysis.strengths.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              STRENGTHS
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {analysis.strengths.map((strength, index) => (
                <Chip
                  key={index}
                  icon={<CheckCircle />}
                  label={strength}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* ATS Issues */}
        {analysis.atsOptimization?.issues && analysis.atsOptimization.issues.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              ATS ISSUES
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {analysis.atsOptimization.issues.map((issue, index) => (
                <Chip
                  key={index}
                  icon={<Warning />}
                  label={issue}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Resume Statistics */}
        {analysis.resumeStats && (
          <Box>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              RESUME STATISTICS
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Projects: {analysis.resumeStats.projects || 0}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((analysis.resumeStats.projects || 0) * 25, 100)} 
                    color="primary"
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Experience: {analysis.resumeStats.experience || 0}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((analysis.resumeStats.experience || 0) * 33, 100)} 
                    color="secondary"
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Skills: {analysis.resumeStats.skills || 0}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((analysis.resumeStats.skills || 0) * 10, 100)} 
                    color="success"
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Sections: {analysis.resumeStats.sections || 0}/5
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((analysis.resumeStats.sections || 0) * 20, 100)} 
                    color="info"
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisDashboard;