const express = require('express');
const {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  saveAnalysis
} = require('../controllers/analysisController.js');
// const { authenticate } = require('../middleware/auth.js');

const router = express.Router();

// Public route (no authentication required)
router.post('/analyze', analyzeResume);
router.post('/save', saveAnalysis);
// Protected routes (require authentication)
router.get('/history', getAnalysisHistory);
router.get('/:id', getAnalysisById);

module.exports = router;