import React from 'react';
import './SectionDividerSlide.css';

const SectionDividerSlide = ({ number, title, subtitle }) => {
  return (
    <div className="slide section-divider-slide">
      <div className="section-content">
        {number && <div className="section-number">{number}</div>}
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SectionDividerSlide;

// Made with Bob
