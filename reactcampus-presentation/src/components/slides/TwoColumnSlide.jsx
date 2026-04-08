import React from 'react';
import './TwoColumnSlide.css';

const TwoColumnSlide = ({ title, leftContent, rightContent, split = '50/50' }) => {
  return (
    <div className="slide two-column-slide">
      <div className="slide-header">
        <h2 className="content-title">{title}</h2>
      </div>
      <div className={`two-column-container split-${split.replace('/', '-')}`}>
        <div className="column left-column">
          {leftContent}
        </div>
        <div className="column right-column">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnSlide;

// Made with Bob
