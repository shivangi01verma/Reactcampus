import React from 'react';
import './IconTextRowsSlide.css';

const IconTextRowsSlide = ({ title, items }) => {
  return (
    <div className="slide icon-text-rows-slide">
      <div className="slide-header">
        <h2 className="content-title">{title}</h2>
      </div>
      <div className="icon-rows-container">
        {items.map((item, index) => (
          <div key={index} className="icon-row">
            <div className="icon-wrapper">
              <span className="icon-text">{item.icon}</span>
            </div>
            <div className="text-content">
              <h3 className="row-title">{item.title}</h3>
              <p className="row-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconTextRowsSlide;

// Made with Bob
