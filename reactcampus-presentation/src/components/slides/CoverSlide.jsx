import React from 'react';
import './CoverSlide.css';

const CoverSlide = ({ title, subtitle, author, date }) => {
  return (
    <div className="slide cover-slide">
      <div className="cover-content">
        <div className="cover-label">DATA ANALYSIS PRESENTATION</div>
        <h1 className="cover-title">{title}</h1>
        <p className="cover-subtitle">{subtitle}</p>
        <div className="cover-meta">
          <span>{author}</span>
          <span className="separator">•</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default CoverSlide;

// Made with Bob
