import React from 'react';
import './BulletSlide.css';

const BulletSlide = ({ title, items, variant = 'default' }) => {
  return (
    <div className={`slide bullet-slide variant-${variant}`}>
      <div className="slide-header">
        <h2 className="content-title">{title}</h2>
      </div>
      <ul className="bullet-list">
        {items.map((item, index) => (
          <li key={index} className="bullet-item">
            {typeof item === 'string' ? item : (
              <>
                <strong>{item.title}</strong>
                {item.description && <span className="item-description"> — {item.description}</span>}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BulletSlide;

// Made with Bob
