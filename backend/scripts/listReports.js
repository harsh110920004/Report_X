// Create backend/scripts/listReports.js
const mongoose = require('mongoose');
const Report = require('../models/Report');
require('dotenv').config();

const listReports = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const reports = await Report.find({}, 'trackId title status');
  console.log('Available reports:');
  reports.forEach(r => console.log(`${r.trackId} - ${r.title} - ${r.status}`));
  await mongoose.connection.close();
};

listReports();
