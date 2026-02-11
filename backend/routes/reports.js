const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');


// Configure multer for secure image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Validate uploads: allow only images with common extensions
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const fileFilter = (req, file, cb) => {
  const mimeOk = allowedMimeTypes.includes(file.mimetype);
  const extOk = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());
  
  console.log(`File upload attempt: ${file.originalname} (${file.mimetype})`);
  
  if (mimeOk && extOk) {
    console.log('✅ File validation passed');
    cb(null, true);
  } else {
    console.log('❌ File validation failed');
    cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate image description using Gemini Vision
async function generateImageDescription(imagePath) {
  try {
    console.log('Analyzing image with Gemini Vision...');
    
    // Use gemini-2.0-flash-exp for vision capabilities
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    // Read image file as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Get file extension for mime type
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };
    
    const prompt = 'Describe what you see in this image in 2-3 sentences. Focus on the main subject, objects, people, activities, or scene visible.';
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const description = response.text();
    
    console.log('✅ Image description:', description);
    return description.trim();
    
  } catch (error) {
    console.error('❌ Gemini Vision Error:', error.message);
    return null;
  }
}

// Updated POST route
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Report submission received from user:', req.user._id);
    
    const { incidentType, title, latitude, longitude, address } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image upload is required.' });
    }

    if (!incidentType || !latitude || !longitude) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    console.log('Uploaded file:', req.file);

    // Generate description from the actual image
    let imageDescription = await generateImageDescription(req.file.path);
    
    if (!imageDescription) {
      imageDescription = `${incidentType} incident reported at location ${latitude}, ${longitude}.`;
      console.warn('Using fallback description');
    }

    // Generate title from image description
    const finalTitle = title && title.trim() !== '' 
      ? title 
      : imageDescription.split('.')[0].substring(0, 80) || `${incidentType.charAt(0).toUpperCase() + incidentType.slice(1)} Incident`;

    const newReport = new Report({
      userId: req.user._id,
      incidentType,
      title: finalTitle,
      titleGeneratedBy: title && title.trim() !== '' ? 'manual' : 'ai',
      description: imageDescription,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || ''
      },
      image: req.file.filename
    });

    await newReport.save();

    console.log(`✅ Report saved with trackId: ${newReport.trackId}`);

    res.status(201).json({
      message: 'Report submitted successfully',
      trackId: newReport.trackId,
      aiDescription: imageDescription,
      report: {
        trackId: newReport.trackId,
        title: newReport.title,
        description: imageDescription,
        incidentType: newReport.incidentType,
        status: newReport.status,
        createdAt: newReport.createdAt
      }
    });

  } catch (err) {
    console.error('Error in report submission:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Failed to submit report', error: err.message });
  }
});

// GET /api/reports/track/:trackId - get report by track ID
router.get('/track/:trackId', async (req, res) => {
  try {
    console.log('Tracking request for ID:', req.params.trackId);
    
    const report = await Report.findOne({ trackId: req.params.trackId })
      .populate('userId', 'name email phone');
    
    if (!report) {
      console.log('Report not found for tracking ID:', req.params.trackId);
      return res.status(404).json({ message: 'Report not found' });
    }
    
    console.log('Report found:', report.trackId);
    res.json(report);
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ message: 'Failed to fetch report', error: err.message });
  }
});


// GET /api/reports/my - get all reports by user
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Error fetching user reports:', err);
    res.status(500).json({ message: 'Failed to fetch user reports', error: err.message });
  }
});

module.exports = router;

