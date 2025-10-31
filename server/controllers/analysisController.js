const AIService = require('../services/aiService.js');
const Analysis = require('../models/Analysis.js');
const { validateResumeData } = require('../utils/analysisHelpers.js');

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeData, analysisType = 'comprehensive', provider = 'openai' } = req.body;
    const userId = req.user?.id || 'anonymous';

    // Validate input
    const validationErrors = validateResumeData(resumeData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Invalid resume data',
        details: validationErrors
      });
    }

    // Perform AI analysis
    const aiService = new AIService();
    const analysisResult = await aiService.analyzeResume(resumeData, {
      analysisType,
      provider
    });

    // Save to database (if user is authenticated)
    if (userId !== 'anonymous') {
      await Analysis.create({
        userId,
        resumeData,
        analysisResult,
        analysisType,
        aiProvider: provider,
        score: analysisResult.overallScore,
        metadata: {
          processingTime: analysisResult.metadata?.processingTime || 0,
          resumeSections: analysisResult.resumeStats?.sections || 0,
          totalProjects: analysisResult.resumeStats?.projects || 0,
          totalExperience: analysisResult.resumeStats?.experience || 0
        }
      });
    }

    res.json({
      success: true,
      data: analysisResult,
      metadata: {
        analysisId: userId !== 'anonymous' ? (await Analysis.findOne({ userId }).sort({ createdAt: -1 }))._id : null,
        analyzedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analysis controller error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      fallbackUsed: error.message.includes('fallback')
    });
  }
};
exports.saveAnalysis = async (req, res) => {
  try {
    const { analysisResult, timestamp } = req.body;
    
    // For now, just log the save (you can add database saving later)
    console.log('💾 Analysis result received for saving:', {
      overallScore: analysisResult?.overallScore,
      timestamp: timestamp || new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Analysis saved successfully',
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save analysis'
    });
  }
};

exports.getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('analysisType score createdAt metadata');

    const total = await Analysis.countDocuments({ userId });

    res.json({
      success: true,
      data: analyses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis history'
    });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await Analysis.findOne({ _id: id, userId });

    if (!analysis) {
      return res.status(404).json({
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis'
    });
  }
};