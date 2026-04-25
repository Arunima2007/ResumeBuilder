// components/AnalysisPanel.jsx
import React, { useState } from 'react';
import './AnalysisPanel.css';

function AnalysisPanel({ formData }) {
  const [jobDescription, setJobDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [quickResult, setQuickResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const resumeData = {
    profile: formData?.profile || {},
    education: formData?.education || [],
    experience: formData?.experience || [],
    projects: formData?.projects || [],
    extraDetails: formData?.extraDetails || {}
  };

  // ── Full Gemini AI Analysis ──
  const runGeminiAnalysis = async () => {
    setLoading(true);
    setError('');
    setAiAnalysis(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analysis/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          resume: resumeData,
          jobDescription: jobDescription
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} — ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        setAiAnalysis(result.data);
        setActiveTab('overview');
      } else {
        throw new Error(result.message || 'AI analysis failed');
      }
    } catch (err) {
      console.error('❌ Gemini analysis failed:', err);
      setError(`AI Analysis failed: ${err.message}`);
    }
    setLoading(false);
  };

  // ── Quick Gemini Analysis ──
  const runQuickAnalysis = async () => {
    setQuickLoading(true);
    setError('');
    setQuickResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analysis/gemini/quick`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ resume: resumeData })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setQuickResult(result.data);
      } else {
        throw new Error(result.message || 'Quick analysis failed');
      }
    } catch (err) {
      console.error('❌ Quick analysis failed:', err);
      setError(`Quick analysis failed: ${err.message}`);
    }
    setQuickLoading(false);
  };

  // Quick stats from local data
  const getQuickStats = () => {
    const skillsCount = resumeData.extraDetails?.skills
      ? (Array.isArray(resumeData.extraDetails.skills)
          ? resumeData.extraDetails.skills.length
          : Object.values(resumeData.extraDetails.skills).flat().length)
      : 0;
    const experienceCount = resumeData.experience?.length || 0;
    const projectCount = resumeData.projects?.length || 0;
    return { skillsCount, experienceCount, projectCount };
  };

  const quickStats = getQuickStats();

  // Score color helper
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'linear-gradient(135deg, #059669, #10b981)';
    if (score >= 60) return 'linear-gradient(135deg, #d97706, #f59e0b)';
    if (score >= 40) return 'linear-gradient(135deg, #ea580c, #f97316)';
    return 'linear-gradient(135deg, #dc2626, #ef4444)';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="analysis-container">

      {/* ── Hero Stats ── */}
      <div className="hero-stats">
        <div className="stat-card">
          <div className="stat-icon">🛠️</div>
          <div className="stat-value">{quickStats.skillsCount}</div>
          <div className="stat-label">Skills</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-value">{quickStats.experienceCount}</div>
          <div className="stat-label">Experiences</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-value">{quickStats.projectCount}</div>
          <div className="stat-label">Projects</div>
        </div>
      </div>

      {/* ── Quick AI Check ── */}
      <div className="ai-section quick-check-section">
        <div className="section-badge">⚡ Quick Check</div>
        <h3>Instant AI Resume Check</h3>
        <p>Get a quick AI-powered assessment of your resume in seconds</p>
        <button
          className="ai-btn ai-btn-secondary"
          onClick={runQuickAnalysis}
          disabled={quickLoading}
        >
          {quickLoading ? (
            <><span className="spinner"></span> Analyzing...</>
          ) : (
            '⚡ Quick AI Check'
          )}
        </button>

        {quickResult && (
          <div className="quick-result-card">
            <div className="quick-score-row">
              <div
                className="quick-score-circle"
                style={{ background: getScoreGradient(quickResult.score) }}
              >
                <span className="quick-score-num">{quickResult.score}</span>
                <span className="quick-score-label">/ 100</span>
              </div>
              <div className="quick-verdict">
                <h4>{quickResult.verdict}</h4>
              </div>
            </div>

            <div className="quick-grid">
              {quickResult.topStrengths?.length > 0 && (
                <div className="quick-col">
                  <h5>💪 Strengths</h5>
                  {quickResult.topStrengths.map((s, i) => (
                    <div key={i} className="quick-item strength">{s}</div>
                  ))}
                </div>
              )}
              {quickResult.topImprovements?.length > 0 && (
                <div className="quick-col">
                  <h5>🎯 Improvements</h5>
                  {quickResult.topImprovements.map((s, i) => (
                    <div key={i} className="quick-item improvement">{s}</div>
                  ))}
                </div>
              )}
            </div>

            {quickResult.quickTips?.length > 0 && (
              <div className="quick-tips">
                <h5>💡 Quick Tips</h5>
                {quickResult.quickTips.map((tip, i) => (
                  <div key={i} className="tip-item">
                    <span className="tip-num">{i + 1}</span>
                    {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Full AI Analysis with JD ── */}
      <div className="ai-section full-analysis-section">
        <div className="section-badge">🤖 Gemini AI</div>
        <h3>Deep AI Resume Analysis</h3>
        <p>Paste a job description for tailored feedback, or analyze your resume generally</p>
        <textarea
          className="jd-textarea"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here for targeted analysis (optional)..."
          rows={5}
        />
        <button
          className="ai-btn ai-btn-primary"
          onClick={runGeminiAnalysis}
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner"></span> AI is analyzing...</>
          ) : (
            '🤖 Run Deep Analysis'
          )}
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="error-section">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Analysis Error</strong>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Analysis Results ── */}
      {aiAnalysis && (
        <div className="ai-results">

          {/* Score Hero */}
          <div className="score-hero" style={{ background: getScoreGradient(aiAnalysis.overallScore) }}>
            <div className="score-hero-left">
              <div className="score-big">{aiAnalysis.overallScore}</div>
              <div className="score-out-of">/ 100</div>
            </div>
            <div className="score-hero-right">
              <div className="score-badge">{aiAnalysis.scoreLabel}</div>
              <p className="score-summary">{aiAnalysis.summary}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="results-tabs">
            {[
              { key: 'overview', label: '📊 Overview', icon: '' },
              { key: 'sections', label: '📋 Sections', icon: '' },
              { key: 'ats', label: '🎯 ATS', icon: '' },
              { key: 'actions', label: '✅ Actions', icon: '' },
              { key: 'rewrite', label: '✍️ Rewrites', icon: '' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">

            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <div className="tab-panel">
                <div className="overview-grid">
                  <div className="overview-card strengths-card">
                    <h4>💪 Strengths</h4>
                    {aiAnalysis.strengths?.map((s, i) => (
                      <div key={i} className="overview-item">
                        <span className="check-icon">✓</span> {s}
                      </div>
                    ))}
                  </div>
                  <div className="overview-card weaknesses-card">
                    <h4>⚡ Areas to Improve</h4>
                    {aiAnalysis.weaknesses?.map((w, i) => (
                      <div key={i} className="overview-item">
                        <span className="warn-icon">!</span> {w}
                      </div>
                    ))}
                  </div>
                </div>

                {aiAnalysis.industryFit && (
                  <div className="industry-fit-card">
                    <h4>🏢 Industry Fit</h4>
                    <p>{aiAnalysis.industryFit}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Sections Tab ── */}
            {activeTab === 'sections' && aiAnalysis.sections && (
              <div className="tab-panel">
                <div className="sections-grid">
                  {Object.entries(aiAnalysis.sections).map(([key, section]) => (
                    <div key={key} className="section-card">
                      <div className="section-card-header">
                        <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                        <div
                          className="section-score-pill"
                          style={{ background: getScoreColor(section.score), color: '#fff' }}
                        >
                          {section.score}%
                        </div>
                      </div>
                      <div className="section-progress-bar">
                        <div
                          className="section-progress-fill"
                          style={{ width: `${section.score}%`, background: getScoreColor(section.score) }}
                        ></div>
                      </div>
                      <p className="section-feedback">{section.feedback}</p>
                      {section.suggestions?.length > 0 && (
                        <div className="section-suggestions">
                          {section.suggestions.map((sug, i) => (
                            <div key={i} className="suggestion-pill">
                              <span>→</span> {sug}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ATS Tab ── */}
            {activeTab === 'ats' && aiAnalysis.atsOptimization && (
              <div className="tab-panel">
                <div className="ats-hero">
                  <div
                    className="ats-score-ring"
                    style={{
                      background: `conic-gradient(${getScoreColor(aiAnalysis.atsOptimization.score)} ${aiAnalysis.atsOptimization.score * 3.6}deg, #e5e7eb ${aiAnalysis.atsOptimization.score * 3.6}deg)`
                    }}
                  >
                    <div className="ats-score-inner">
                      <span>{aiAnalysis.atsOptimization.score}%</span>
                    </div>
                  </div>
                  <div className="ats-info">
                    <h4>ATS Optimization Score</h4>
                    <p>How well your resume passes Applicant Tracking Systems</p>
                  </div>
                </div>

                {aiAnalysis.atsOptimization.tips?.length > 0 && (
                  <div className="ats-block">
                    <h5>📝 ATS Tips</h5>
                    {aiAnalysis.atsOptimization.tips.map((tip, i) => (
                      <div key={i} className="ats-tip">{tip}</div>
                    ))}
                  </div>
                )}

                {aiAnalysis.atsOptimization.keywordsToAdd?.length > 0 && (
                  <div className="ats-block">
                    <h5>🔑 Keywords to Add</h5>
                    <div className="keyword-tags">
                      {aiAnalysis.atsOptimization.keywordsToAdd.map((kw, i) => (
                        <span key={i} className="keyword-tag">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {aiAnalysis.atsOptimization.formattingIssues?.length > 0 && (
                  <div className="ats-block">
                    <h5>⚠️ Formatting Issues</h5>
                    {aiAnalysis.atsOptimization.formattingIssues.map((issue, i) => (
                      <div key={i} className="ats-issue">{issue}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Actions Tab ── */}
            {activeTab === 'actions' && aiAnalysis.actionItems?.length > 0 && (
              <div className="tab-panel">
                <div className="actions-list">
                  {aiAnalysis.actionItems.map((item, i) => (
                    <div key={i} className="action-card">
                      <div className="action-header">
                        <span
                          className="priority-badge"
                          style={{ background: getPriorityColor(item.priority) }}
                        >
                          {item.priority}
                        </span>
                        <span className="action-number">#{i + 1}</span>
                      </div>
                      <p className="action-text">{item.action}</p>
                      <p className="action-impact">
                        <strong>Impact:</strong> {item.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Rewrite Tab ── */}
            {activeTab === 'rewrite' && aiAnalysis.rewriteSuggestions?.length > 0 && (
              <div className="tab-panel">
                <div className="rewrites-list">
                  {aiAnalysis.rewriteSuggestions.map((rw, i) => (
                    <div key={i} className="rewrite-card">
                      <div className="rewrite-before">
                        <span className="rewrite-label">Before</span>
                        <p>{rw.original}</p>
                      </div>
                      <div className="rewrite-arrow">→</div>
                      <div className="rewrite-after">
                        <span className="rewrite-label">After</span>
                        <p>{rw.improved}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisPanel;