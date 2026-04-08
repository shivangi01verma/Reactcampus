import React from 'react';
import './TimelineSlide.css';

const TimelineSlide = ({ title, events }) => {
  return (
    <div className="slide timeline-slide">
      <div className="slide-header">
        <h2 className="content-title">{title}</h2>
      </div>
      <div className="timeline-container">
        {events.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker">
              <div className="timeline-number">{index + 1}</div>
            </div>
            <div className="timeline-content">
              <h3 className="timeline-title">{event.title}</h3>
              <p className="timeline-description">{event.description}</p>
            </div>
            {index < events.length - 1 && <div className="timeline-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineSlide;

// Made with Bob
