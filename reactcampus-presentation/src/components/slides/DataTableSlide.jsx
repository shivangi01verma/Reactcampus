import React from 'react';
import './DataTableSlide.css';

const DataTableSlide = ({ 
  title, 
  subtitle,
  description,
  headers, 
  rows, 
  highlightColumns = [],
  caption,
  variant = 'default' // 'default', 'before', 'after', 'comparison'
}) => {
  return (
    <div className={`slide data-table-slide ${variant}`}>
      <div className="slide-header">
        <h2 className="content-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
      </div>
      
      {description && (
        <div className="table-description">
          <p>{description}</p>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th 
                  key={idx}
                  className={highlightColumns.includes(header) ? 'highlight' : ''}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td 
                    key={cellIdx}
                    className={highlightColumns.includes(headers[cellIdx]) ? 'highlight' : ''}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {caption && (
        <div className="table-caption">
          <p>{caption}</p>
        </div>
      )}
    </div>
  );
};

export default DataTableSlide;

// Made with Bob