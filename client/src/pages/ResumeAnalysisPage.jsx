// pages/ResumeAnalysisPage.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AnalysisPanel from '../components/AnalysisPanel';

function ResumeAnalysisPage() {
  // ✅ Pull from each slice correctly
  const profile = useSelector(state => state.profileDetails);
  const education = useSelector(state => state.educationDetails);
  const experience = useSelector(state => state.experienceDetails);
  const projects = useSelector(state => state.projectDetails);
  const extraDetails = useSelector(state => state.extraDetails);

  // ✅ Combine into the shape AnalysisPanel expects
  const formData = {
    profile,
    education,
    experience,
    projects,
    extraDetails
  };

  return (
    <div className="resume-analysis-page">
      <div className="analysis-header">
        <h1>📊 Resume Analysis</h1>
        <p>Get AI-powered feedback to improve your resume and match job descriptions</p>
      </div>
      
      <div className="analysis-content">
        <AnalysisPanel formData={formData} />  {/* ✅ Now passes real data */}
      </div>

      <div className="analysis-navigation">
  <button className="btn btn-secondary" onClick={() => window.history.back()}>
    <span>←</span>
    Back to Resume
  </button>

  <button className="btn btn-primary" onClick={() => window.location.href = '/templates'}>
    Choose Template
    <span>→</span>
  </button>
</div>
    </div>
  );
  
}
const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 20px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
};

const iconStyle = {
  fontSize: '1.5rem',
};
export default ResumeAnalysisPage;