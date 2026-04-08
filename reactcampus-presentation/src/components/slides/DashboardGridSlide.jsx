import React from 'react';
import './DashboardGridSlide.css';

const DashboardGridSlide = ({ title, metrics }) => {
  return (
    <div className="slide dashboard-grid-slide">
      <div className="slide-header">
        <h2 className="content-title">{title}</h2>
      </div>
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
            {metric.change && (
              <div className={`metric-change ${metric.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {metric.change}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardGridSlide;

// Made with Bob
