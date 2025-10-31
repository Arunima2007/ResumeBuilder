import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Container
} from '@mui/material';
import { useAnalysis } from '../../hooks/useAnalysis';
import ScoreCard from './ScoreCard';
import AnalysisDashboard from './AnalysisDashboard';
import AISuggestions from './AISuggestions';

const ResumeAnalyzer = ({ resumeData }) => {
  const { analysis, loading, error, analyzeResume } = useAnalysis();
  const [analysisType, setAnalysisType] = useState('comprehensive');

  const handleAnalyze = async () => {
    try {
      await analyzeResume(resumeData, { analysisType });
    } catch (err) {
      console.error('Analysis error:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', maxWidth: 800 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          {/* Header Section */}
          <Box sx={{ mb: 4, width: '100%' }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              color="primary" 
              fontWeight="bold"
              sx={{ textAlign: 'center', width: '100%' }}
            >
              RESUME BUILDER
            </Typography>
          </Box>

          {/* Analysis Configuration */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 4,
            width: '100%'
          }}>
            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  textAlign: 'center',
                  width: '100%',
                  display: 'block',
                  mb: 3
                }}
              >
                Analysis Configuration
              </Typography>
            </Box>
            
            <Card variant="outlined" sx={{ 
              p: 4, 
              bgcolor: 'background.default',
              width: '100%',
              maxWidth: 600
            }}>
              {/* Centered Form Controls */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 2,
                width: '100%'
              }}>
                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel>Analysis Type</InputLabel>
                  <Select
                    value={analysisType}
                    label="Analysis Type"
                    onChange={(e) => setAnalysisType(e.target.value)}
                  >
                    <MenuItem value="comprehensive">Comprehensive Analysis</MenuItem>
                    <MenuItem value="quick">Quick Scan</MenuItem>
                    <MenuItem value="ats">ATS Optimization Check</MenuItem>
                  </Select>
                </FormControl>
                
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={loading}
                  sx={{ 
                    minWidth: 200,
                    height: '56px',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'ANALYZING...' : 'ANALYZE RESUME'}
                </Button>
              </Box>
            </Card>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
          )}

          {/* Analysis Results - CENTERED */}
          {analysis && (
            <Box sx={{ mt: 4, width: '100%' }}>
              {/* Analysis Results Header - Centered */}
              <Box sx={{ mb: 4, width: '100%' }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  fontWeight="bold"
                  sx={{ textAlign: 'center', width: '100%' }}
                >
                  Analysis Results
                </Typography>
                
                {/* Score Chips - Centered */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  justifyContent="center" 
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <Chip 
                    label={`Overall Score: ${analysis.overallScore}/100`} 
                    color={analysis.overallScore >= 80 ? "success" : analysis.overallScore >= 60 ? "warning" : "error"}
                    variant="filled"
                    size="medium"
                  />
                  <Chip 
                    label={`ATS Score: ${analysis.atsScore || analysis.atsOptimization?.score || 0}/100`} 
                    color={(analysis.atsScore || analysis.atsOptimization?.score || 0) >= 80 ? "success" : "warning"}
                    variant="filled"
                    size="medium"
                  />
                  {analysis.isFallback && (
                    <Chip 
                      label="Using Basic Analysis" 
                      color="info"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>

              {/* Divider Line */}
              <Box sx={{ 
                width: '100%', 
                height: '1px', 
                bgcolor: 'divider', 
                my: 4,
                mx: 'auto'
              }} />

              {/* Detailed Analysis - Centered */}
              <Box sx={{ mb: 4, width: '100%' }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  fontWeight="bold"
                  sx={{ textAlign: 'center', width: '100%', mb: 3 }}
                >
                  Detailed Analysis
                </Typography>
                
                {/* Centered Components */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  gap: 3,
                  width: '100%'
                }}>
                  {/* Score Card - Centered */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    width: '100%'
                  }}>
                    <ScoreCard analysis={analysis} />
                  </Box>
                  
                  {/* Analysis Dashboard - Centered */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    width: '100%'
                  }}>
                    <AnalysisDashboard analysis={analysis} />
                  </Box>
                </Box>
              </Box>

              {/* Results Section - Centered */}
              <Box sx={{ width: '100%' }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  fontWeight="bold"
                  sx={{ textAlign: 'center', width: '100%', mb: 3 }}
                >
                  RESULTS
                </Typography>
                
                {/* AI Suggestions - Centered */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  width: '100%'
                }}>
                  <AISuggestions analysis={analysis} />
                </Box>
              </Box>
            </Box>
          )}

          {/* Empty State - Centered */}
          {!analysis && !loading && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6,
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.default',
              maxWidth: 800,
              mx: 'auto',
              mt: 4
            }}>
              <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                Ready for Professional Analysis
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Click "ANALYZE RESUME" to get detailed feedback on your resume
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResumeAnalyzer;