import React, { useState } from 'react';
import { reportAPI } from '../utils/api';
import '../styles/TrackReport.css';

const TrackReport = () => {
  const [trackId, setTrackId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    try {
      console.log('Tracking report with ID:', trackId);
      const response = await reportAPI.trackByTrackId(trackId.trim());
      console.log('Report found:', response.data);
      setReport(response.data);
    } catch (err) {
      console.error('Tracking error:', err);
      if (err.response?.status === 404) {
        setError('Report not found. Please check your tracking ID.');
      } else {
        setError('Failed to fetch report. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <div className="track-report-page">
      <div className="track-header">
        <h2>Track Your Report</h2>
        <p>Enter your tracking ID to view the current status of your report</p>
      </div>

      <div className="track-form-container">
        <form onSubmit={handleTrack} className="track-form">
          <div className="form-group">
            <input
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="Enter Tracking ID (e.g., CR-1234567890)"
              className="track-input"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Track Report'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {report && (
        <div className="report-result">
          <div className="report-card">
            <div className="report-header">
              <div className="tracking-id-display">
                <span className="label">Tracking ID</span>
                <span className="value">{report.trackId}</span>
              </div>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(report.status) }}>
                {getStatusText(report.status)}
              </div>
            </div>

            <div className="report-body">
              <div className="info-row">
                <span className="info-label">Title:</span>
                <span className="info-value">{report.title}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Description:</span>
                <span className="info-value">{report.description}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Incident Type:</span>
                <span className={`incident-badge ${report.incidentType}`}>
                  {report.incidentType === 'emergency' ? 'Emergency' : 'Non-Emergency'}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Submitted On:</span>
                <span className="info-value">
                  {new Date(report.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">
                  {new Date(report.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {report.adminFeedback && (
                <div className="admin-feedback-section">
                  <span className="info-label">Admin Feedback:</span>
                  <div className="feedback-box">
                    {report.adminFeedback}
                  </div>
                </div>
              )}

              {report.image && (
                <div className="evidence-section">
                  <span className="info-label">Evidence Image:</span>
                  <img 
                    src={`http://localhost:5000/uploads/${report.image}`}
                    alt="Evidence"
                    className="evidence-image"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackReport;

