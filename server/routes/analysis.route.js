// server/routes/analysis.route.js
const express = require('express');
const router = express.Router();
const { analyzeResume, analyzeWithGemini, quickGeminiAnalysis } = require('../controllers/analysis.controller');

// POST /api/analysis - Original rule-based analysis (fallback)
router.post('/', analyzeResume);

// POST /api/analysis/gemini - Full Gemini AI-powered analysis
router.post('/gemini', analyzeWithGemini);

// POST /api/analysis/gemini/quick - Quick Gemini AI analysis
router.post('/gemini/quick', quickGeminiAnalysis);

module.exports = router;