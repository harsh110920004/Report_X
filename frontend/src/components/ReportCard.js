import React from 'react';

const ReportCard = ({ report }) => {
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      'in-progress': 'badge-in-progress',
      completed: 'badge-completed',
      rejected: 'badge-rejected'
    };
    return badges[status] || 'badge-secondary';
  };

  return (
    <div className="report-card">
      <h3>{report.title}</h3>
      
      <p><strong>Track ID:</strong> {report.trackId}</p>
      
      <p>
        <span className={`badge ${report.incidentType === 'emergency' ? 'badge-emergency' : 'badge-non-emergency'}`}>
          {report.incidentType.toUpperCase()}
        </span>
        <span className={`badge ${getStatusBadge(report.status)}`}>
          {report.status.toUpperCase()}
        </span>
      </p>

      <p><strong>Description:</strong> {report.description.substring(0, 100)}...</p>
      
      {report.image && (
        <div className="image-preview">
          <img 
            src={`http://localhost:5000/uploads/${report.image}`} 
            alt="Incident" 
          />
        </div>
      )}

      <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>

      {report.adminFeedback && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '0.75rem', 
          borderRadius: '5px', 
          marginTop: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <strong>Feedback:</strong>
          <p style={{ margin: '0.25rem 0 0 0' }}>{report.adminFeedback}</p>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
