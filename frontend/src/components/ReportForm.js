import React, { useState, useEffect } from 'react';
import { reportAPI } from '../utils/api';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    incidentType: 'non-emergency',
    title: '',
    image: null
  });
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [trackId, setTrackId] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [aiDescription, setAiDescription] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setMessage({ type: 'error', text: 'Unable to get location. Please enable location services.' });
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: `Only JPG, PNG, GIF images allowed. Your file: ${file.type}` });
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setAiDescription('');

    if (!formData.image) {
      setMessage({ type: 'error', text: 'Please upload an image. Image is required.' });
      setLoading(false);
      return;
    }

    if (!location.latitude || !location.longitude) {
      setMessage({ type: 'error', text: 'Location is required. Please enable location services.' });
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('incidentType', formData.incidentType);
    submitData.append('title', formData.title);
    submitData.append('latitude', location.latitude);
    submitData.append('longitude', location.longitude);
    submitData.append('image', formData.image);

    try {
      setMessage({ type: 'info', text: '🤖 Analyzing image with AI... This may take 10-20 seconds.' });
      
      const response = await reportAPI.create(submitData);
      
      setTrackId(response.data.trackId);
      setAiDescription(response.data.aiDescription || response.data.report.description);
      setMessage({ type: 'success', text: 'Report submitted successfully!' });
      
      // Reset form
      setFormData({
        incidentType: 'non-emergency',
        title: '',
        image: null
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Error submitting report'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Report a Crime</h2>
      
      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'error' : message.type === 'info' ? 'info' : 'success'}`}>
          {message.text}
        </div>
      )}

      {trackId && (
        <div className="track-id-display">
          <h3>Track ID: {trackId}</h3>
          <p>Save this ID to track your report status</p>
          {aiDescription && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#e7f3ff', borderRadius: '5px' }}>
              <strong>🤖 AI Analysis:</strong>
              <p style={{ marginTop: '0.5rem', color: '#333' }}>{aiDescription}</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Incident Type *</label>
          <select name="incidentType" value={formData.incidentType} onChange={handleChange} required>
            <option value="non-emergency">Non-Emergency</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div className="form-group">
          <label>Upload Image * (Required - AI will analyze)</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            required
          />
          <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
            📸 AI will analyze this image and generate a description automatically
          </small>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Title (Optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Leave blank to auto-generate from AI"
          />
        </div>

        <div className="form-group">
          <label>Location (Auto-captured)</label>
          <input
            type="text"
            value={
              location.latitude
                ? `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`
                : 'Getting location...'
            }
            disabled
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Analyzing Image & Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;


