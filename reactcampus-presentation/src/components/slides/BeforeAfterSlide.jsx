import React from 'react';
import './BeforeAfterSlide.css';

const BeforeAfterSlide = ({ 
  title, 
  subtitle,
  beforeTitle = "Before",
  afterTitle = "After",
  beforeContent,
  afterContent,
  changes = []
}) => {
  return (
    <div className="slide before-after-slide">
      <div className="slide-header">
        <h2 className="content-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
      </div>

      <div className="before-after-container">
        <div className="before-section">
          <div className="section-badge before-badge">
            <span className="badge-icon">❌</span>
            <span className="badge-text">{beforeTitle}</span>
          </div>
          <div className="content-box before-box">
            {beforeContent}
          </div>
        </div>

        <div className="arrow-section">
          <div className="transformation-arrow">
            <div className="arrow-line"></div>
            <div className="arrow-head">→</div>
          </div>
          {changes.length > 0 && (
            <div className="changes-list">
              <h4>What Changed:</h4>
              <ul>
                {changes.map((change, idx) => (
                  <li key={idx}>
                    <span className="change-icon">✓</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="after-section">
          <div className="section-badge after-badge">
            <span className="badge-icon">✅</span>
            <span className="badge-text">{afterTitle}</span>
          </div>
          <div className="content-box after-box">
            {afterContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlide;

// Made with Bob