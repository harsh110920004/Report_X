import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', incidentType: '' });
  const [selectedReport, setSelectedReport] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', adminFeedback: '' });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [reportsRes, statsRes] = await Promise.all([
        adminAPI.getAllReports(filter),
        adminAPI.getStatistics()
      ]);
      setReports(reportsRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateReport(selectedReport._id, updateData);
      alert('Report updated successfully');
      setSelectedReport(null);
      setUpdateData({ status: '', adminFeedback: '' });
      fetchData();
    } catch (error) {
      alert('Error updating report');
    }
  };

  const openUpdateModal = (report) => {
    setSelectedReport(report);
    setUpdateData({
      status: report.status,
      adminFeedback: report.adminFeedback || ''
    });
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container">
      <h2 style={{ color: 'white', marginBottom: '2rem' }}>Admin Dashboard</h2>

      {statistics && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{statistics.totalReports}</h3>
            <p>Total Reports</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.pendingReports}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.inProgressReports}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.completedReports}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.emergencyReports}</h3>
            <p>Emergency</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.nonEmergencyReports}</h3>
            <p>Non-Emergency</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Filter Reports</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '2px solid #e0e0e0' }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filter.incidentType}
            onChange={(e) => setFilter({ ...filter, incidentType: e.target.value })}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '2px solid #e0e0e0' }}
          >
            <option value="">All Types</option>
            <option value="emergency">Emergency</option>
            <option value="non-emergency">Non-Emergency</option>
          </select>
        </div>
      </div>

      <div className="report-list">
        {reports.map((report) => (
          <div key={report._id} className="report-card">
            <h3>{report.title}</h3>
            <p><strong>Track ID:</strong> {report.trackId}</p>
            <p>
              <span className={`badge ${report.incidentType === 'emergency' ? 'badge-emergency' : 'badge-non-emergency'}`}>
                {report.incidentType}
              </span>
              <span className={`badge badge-${report.status}`}>
                {report.status}
              </span>
            </p>
            <p><strong>Reporter:</strong> {report.userId?.name}</p>
            <p><strong>Email:</strong> {report.userId?.email}</p>
            <p><strong>Phone:</strong> {report.userId?.phone}</p>
            <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
            {report.image && (
              <div className="image-preview">
                <img 
                  src={`http://localhost:5000/uploads/${report.image}`} 
                  alt="Incident" 
                />
              </div>
            )}
            <button 
              className="btn btn-primary" 
              onClick={() => openUpdateModal(report)}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Update Status
            </button>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h2>Update Report</h2>
            <form onSubmit={handleUpdateReport}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admin Feedback</label>
                <textarea
                  value={updateData.adminFeedback}
                  onChange={(e) => setUpdateData({ ...updateData, adminFeedback: e.target.value })}
                  placeholder="Enter feedback for the user"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">Update</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedReport(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
