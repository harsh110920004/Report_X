const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    console.log('Checking admin access for user:', req.user._id);
    console.log('User role:', req.user.role);
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Authorization error', error: error.message });
  }
};

// GET all reports (with filters)
router.get('/reports', auth, isAdmin, async (req, res) => {
  try {
    const { status, incidentType } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (incidentType) filter.incidentType = incidentType;

    console.log('Admin fetching reports with filter:', filter);

    const reports = await Report.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    console.log(`Found ${reports.length} reports`);
    res.json(reports);
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

// GET statistics
router.get('/statistics', auth, isAdmin, async (req, res) => {
  try {
    console.log('Fetching statistics...');
    
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const inProgressReports = await Report.countDocuments({ status: 'in-progress' });
    const completedReports = await Report.countDocuments({ status: 'completed' });
    const rejectedReports = await Report.countDocuments({ status: 'rejected' });
    
    const emergencyReports = await Report.countDocuments({ incidentType: 'emergency' });
    const nonEmergencyReports = await Report.countDocuments({ incidentType: 'non-emergency' });

    const stats = {
      total: totalReports,
      byStatus: {
        pending: pendingReports,
        inProgress: inProgressReports,
        completed: completedReports,
        rejected: rejectedReports
      },
      byIncidentType: {
        emergency: emergencyReports,
        nonEmergency: nonEmergencyReports
      }
    };

    console.log('Statistics:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// PUT update report status and feedback
router.put('/reports/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status, adminFeedback } = req.body;

    console.log(`Admin updating report ${req.params.id}`);
    console.log('New status:', status);
    console.log('Admin feedback:', adminFeedback);

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'in-progress', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        adminFeedback: adminFeedback || '',
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    console.log(`✅ Report ${report.trackId} updated to ${status}`);

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Error updating report', error: error.message });
  }
});

// DELETE report (optional - for removing spam/invalid reports)
router.delete('/reports/:id', auth, isAdmin, async (req, res) => {
  try {
    console.log(`Admin deleting report ${req.params.id}`);
    
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Delete associated image file
    const imagePath = path.join(__dirname, '..', 'uploads', report.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log('Deleted image file:', report.image);
    }

    console.log(`✅ Report ${report.trackId} deleted by admin`);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
});

// GET single report details
router.get('/reports/:id', auth, isAdmin, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report details:', error);
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
});

module.exports = router;

