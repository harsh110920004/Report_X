import React, { useState, useEffect } from 'react';
import { reportAPI } from '../utils/api';
import ReportCard from '../components/ReportCard';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getMyReports();
      setReports(response.data);
    } catch (err) {
      setError('Error loading reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My Reports</h2>
        
        {error && <div className="alert alert-error">{error}</div>}

        {reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              You haven't submitted any reports yet.
            </p>
            <a href="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Create Your First Report
            </a>
          </div>
        ) : (
          <div className="report-list">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
