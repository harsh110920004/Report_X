import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import { reportAPI } from '../utils/api';
import ReportCard from '../components/ReportCard';

const Home = () => {
  const navigate = useNavigate();
  const [myReports, setMyReports] = useState([]);
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchMyReports();
    }
  }, [isLoggedIn, navigate]);

  const fetchMyReports = async () => {
    try {
      const response = await reportAPI.getMyReports();
      setMyReports(response.data.slice(0, 3)); // Show only last 3 reports
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="container">
      <ReportForm />

      {myReports.length > 0 && (
        <div className="card">
          <h2>Your Recent Reports</h2>
          <div className="report-list">
            {myReports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
