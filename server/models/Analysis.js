const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  analysisResult: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  analysisType: {
    type: String,
    enum: ['comprehensive', 'quick', 'ats'],
    default: 'comprehensive'
  },
  aiProvider: {
    type: String,
    enum: ['openai', 'gemini'],
    default: 'openai'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  metadata: {
    processingTime: Number,
    resumeSections: Number,
    totalProjects: Number,
    totalExperience: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Auto-delete after 30 days

module.exports = mongoose.model('Analysis', analysisSchema);