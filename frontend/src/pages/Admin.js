import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../utils/api';
import '../styles/Admin.css';

const Admin = () => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', incidentType: '' });
  const [selectedReport, setSelectedReport] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', adminFeedback: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  

  const fetchStatistics = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStatistics(response.data);
      console.log('Statistics loaded:', response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setMessage({ type: 'error', text: 'Failed to load statistics' });
    }
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getReports(filter);
      setReports(response.data);
      console.log(`Loaded ${response.data.length} reports`);
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (error.response?.status === 403) {
        setMessage({ type: 'error', text: 'Access denied. Admin privileges required.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to load reports' });
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);;

  useEffect(() => {
  fetchStatistics();
  fetchReports();
}, [fetchReports]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const openUpdateModal = (report) => {
    setSelectedReport(report);
    setUpdateForm({
      status: report.status,
      adminFeedback: report.adminFeedback || ''
    });
    setMessage({ type: '', text: '' });
  };

  const closeUpdateModal = () => {
    setSelectedReport(null);
    setUpdateForm({ status: '', adminFeedback: '' });
    setMessage({ type: '', text: '' });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating report:', selectedReport._id, updateForm);
      await adminAPI.updateReport(selectedReport._id, updateForm);
      setMessage({ type: 'success', text: 'Report updated successfully!' });
      fetchReports();
      fetchStatistics();
      setTimeout(() => closeUpdateModal(), 1500);
    } catch (error) {
      console.error('Error updating report:', error);
      setMessage({ type: 'error', text: 'Failed to update report' });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'in-progress': return 'badge-in-progress';
      case 'completed': return 'badge-completed';
      case 'rejected': return 'badge-rejected';
      default: return '';
    }
  };

  if (loading && !statistics) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container admin-container">
      <h2>Admin Dashboard</h2>

      {/* Statistics */}
      {statistics && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{statistics.total}</h3>
            <p>Total Reports</p>
          </div>
          <div className="stat-card stat-pending">
            <h3>{statistics.byStatus.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card stat-progress">
            <h3>{statistics.byStatus.inProgress}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card stat-completed">
            <h3>{statistics.byStatus.completed}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card stat-rejected">
            <h3>{statistics.byStatus.rejected}</h3>
            <p>Rejected</p>
          </div>
          <div className="stat-card stat-emergency">
            <h3>{statistics.byIncidentType.emergency}</h3>
            <p>Emergency</p>
          </div>
        </div>
      )}

      {/* Global Message */}
      {message.text && !selectedReport && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Filter Reports</h3>
        <div className="filter-container">
          <select name="status" value={filter.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <select name="incidentType" value={filter.incidentType} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="emergency">Emergency</option>
            <option value="non-emergency">Non-Emergency</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>All Reports ({reports.length})</h3>
        {loading ? (
          <div className="spinner"></div>
        ) : reports.length === 0 ? (
          <p>No reports found</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Track ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Reporter</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td><strong>{report.trackId}</strong></td>
                    <td>{report.title}</td>
                    <td>
                      <span className={`badge ${report.incidentType === 'emergency' ? 'badge-emergency' : 'badge-non-emergency'}`}>
                        {report.incidentType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{report.userId?.name || 'Unknown'}</td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => openUpdateModal(report)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={closeUpdateModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Update Report: {selectedReport.trackId}</h3>
            
            {message.text && (
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            <div className="report-details">
              <div className="detail-row">
                <strong>Reporter:</strong> 
                <span>{selectedReport.userId?.name} ({selectedReport.userId?.email})</span>
              </div>
              <div className="detail-row">
                <strong>Phone:</strong> 
                <span>{selectedReport.userId?.phone}</span>
              </div>
              <div className="detail-row">
                <strong>Title:</strong> 
                <span>{selectedReport.title}</span>
              </div>
              <div className="detail-row">
                <strong>Description:</strong> 
                <span>{selectedReport.description}</span>
              </div>
              <div className="detail-row">
                <strong>Location:</strong> 
                <span>{selectedReport.location.latitude}, {selectedReport.location.longitude}</span>
              </div>
              <div className="detail-row">
                <strong>Incident Type:</strong> 
                <span className={`badge ${selectedReport.incidentType === 'emergency' ? 'badge-emergency' : 'badge-non-emergency'}`}>
                  {selectedReport.incidentType}
                </span>
              </div>
              {selectedReport.image && (
                <div className="detail-row">
                  <strong>Evidence Image:</strong>
                  <img 
                    src={`https://report-x-k6w3.onrender.com/uploads/${selectedReport.image}`} 
                    alt="Evidence" 
                    className="evidence-image"
                  />
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
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
                  value={updateForm.adminFeedback}
                  onChange={(e) => setUpdateForm({ ...updateForm, adminFeedback: e.target.value })}
                  rows="4"
                  placeholder="Add feedback or notes for the user..."
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Update Report</button>
                <button type="button" className="btn btn-secondary" onClick={closeUpdateModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;


 

