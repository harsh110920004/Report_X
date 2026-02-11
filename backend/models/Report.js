const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const reportSchema = new mongoose.Schema({
  trackId: {
    type: String,
    unique: true,
    default: () => `CR-${nanoid(10).toUpperCase()}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  incidentType: {
    type: String,
    enum: ['emergency', 'non-emergency'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleGeneratedBy: {
    type: String,
    enum: ['ai', 'manual'],
    default: 'manual'
  },
  description: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      default: ''
    }
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'rejected'],
    default: 'pending'
  },
  adminFeedback: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// FIX: Check if model exists before creating
module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
