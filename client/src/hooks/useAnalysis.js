import { useState, useCallback } from 'react';
import { analysisService } from '../services/analysisService';

export const useAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeResume = useCallback(async (resumeData, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analysisService.analyzeResume(resumeData, options);
      setAnalysis(result);
      
      // Save to backend if not fallback
      if (!result.isFallback) {
        await analysisService.saveAnalysisResult(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = `Analysis failed: ${err.message}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getHistory = useCallback(async () => {
    return await analysisService.getAnalysisHistory();
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    analyzeResume,
    getHistory,
    clearAnalysis
  };
};