import React from 'react';
import './CodeExplanationSlide.css';

const CodeExplanationSlide = ({ 
  title, 
  subtitle,
  codeSnippet,
  language = 'python',
  explanations = [],
  businessImpact
}) => {
  return (
    <div className="slide code-explanation-slide">
      <div className="slide-header">
        <h2 className="content-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
      </div>

      <div className="code-explanation-container">
        <div className="code-section">
          <div className="code-header">
            <span className="code-language">{language}</span>
            <span className="code-label">Technical Implementation</span>
          </div>
          <pre className="code-block">
            <code>{codeSnippet}</code>
          </pre>
        </div>

        <div className="explanation-section">
          <div className="explanation-header">
            <span className="explanation-icon">💡</span>
            <span className="explanation-label">What This Does</span>
          </div>
          <div className="explanations-list">
            {explanations.map((item, idx) => (
              <div key={idx} className="explanation-item">
                <div className="explanation-number">{idx + 1}</div>
                <div className="explanation-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {businessImpact && (
        <div className="business-impact">
          <div className="impact-icon">📊</div>
          <div className="impact-content">
            <h4>Business Impact</h4>
            <p>{businessImpact}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExplanationSlide;

// Made with Bob