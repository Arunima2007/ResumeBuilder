import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const KeywordAnalysis = ({ analysis }) => {
  if (!analysis.keywordAnalysis) return null;

  const { strengths, missingKeywords, industryRelevance } = analysis.keywordAnalysis;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔍 Keyword Analysis
        </Typography>

        {/* Industry Relevance */}
        {industryRelevance && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {industryRelevance}
          </Alert>
        )}

        {/* Found Keywords */}
        {strengths && strengths.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              ✅ Keywords Found
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {strengths.map((keyword, index) => (
                <Chip
                  key={index}
                  icon={<CheckCircle />}
                  label={keyword}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Missing Keywords */}
        {missingKeywords && missingKeywords.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom color="error.main">
              ❌ Suggested Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {missingKeywords.map((keyword, index) => (
                <Chip
                  key={index}
                  icon={<Cancel />}
                  label={keyword}
                  color="error"
                  variant="outlined"
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

export default KeywordAnalysis;
         