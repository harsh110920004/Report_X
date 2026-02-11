import React from 'react';
import '../styles/Help.css';

const Help = () => {
  return (
    <div className="container help-container">
      <h2>Help & Support</h2>
      <p className="help-intro">
        Find answers to common questions and learn how to use the Incident Report System effectively.
      </p>

      {/* How to Submit a Report */}
      <section className="help-section">
        <h3>How to Submit a Report</h3>
        <ol className="help-steps">
          <li>
            <strong>Login to your account</strong>
            <p>Use your registered email and password to access the system.</p>
          </li>
          <li>
            <strong>Navigate to the Home page</strong>
            <p>Click on "Home" in the navigation menu to access the report submission form.</p>
          </li>
          <li>
            <strong>Fill in incident details</strong>
            <p>Provide a clear title and description of the incident. Select whether it's an emergency or non-emergency.</p>
          </li>
          <li>
            <strong>Upload evidence (optional)</strong>
            <p>Attach a photo or image related to the incident. Our AI will help generate a detailed description.</p>
          </li>
          <li>
            <strong>Verify location</strong>
            <p>Allow location access or manually enter the incident location coordinates.</p>
          </li>
          <li>
            <strong>Submit your report</strong>
            <p>Click the submit button. You'll receive a unique tracking ID to monitor your report status.</p>
          </li>
        </ol>
      </section>

      {/* How to Track a Report */}
      <section className="help-section">
        <h3>How to Track a Report</h3>
        <ol className="help-steps">
          <li>
            <strong>Go to Track Report page</strong>
            <p>Click "Track Report" in the navigation menu.</p>
          </li>
          <li>
            <strong>Enter your tracking ID</strong>
            <p>Input the unique tracking ID (format: CR-XXXXXXXXXX) you received when submitting your report.</p>
          </li>
          <li>
            <strong>View report status</strong>
            <p>See your report details, current status (Pending, In Progress, Completed, or Rejected), and any admin feedback.</p>
          </li>
        </ol>
      </section>

      {/* Understanding Report Status */}
      <section className="help-section">
        <h3>Understanding Report Status</h3>
        <div className="status-grid">
          <div className="status-item">
            <h4>Pending</h4>
            <p>Your report has been submitted and is awaiting review by authorities.</p>
          </div>
          <div className="status-item">
            <h4>In Progress</h4>
            <p>Authorities are actively investigating or taking action on your report.</p>
          </div>
          <div className="status-item">
            <h4>Completed</h4>
            <p>Your report has been resolved. Check admin feedback for details.</p>
          </div>
          <div className="status-item">
            <h4>Rejected</h4>
            <p>Your report could not be processed. Admin feedback will explain the reason.</p>
          </div>
        </div>
      </section>

      {/* Incident Types */}
      <section className="help-section">
        <h3>Incident Types</h3>
        <div className="incident-types">
          <div className="incident-item">
            <h4>Emergency</h4>
            <p>Life-threatening situations requiring immediate attention (assault, robbery, serious accidents, medical emergencies).</p>
          </div>
          <div className="incident-item">
            <h4>Non-Emergency</h4>
            <p>Situations that require documentation but not immediate response (vandalism, noise complaints, suspicious activity, minor theft).</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="help-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-list">
          <div className="faq-item">
            <h4>What information do I need to submit a report?</h4>
            <p>You need incident details (title and description), incident type (emergency/non-emergency), and optionally an image and location.</p>
          </div>

          <div className="faq-item">
            <h4>How long does it take to get a response?</h4>
            <p>Emergency reports are prioritized and reviewed immediately. Non-emergency reports are typically reviewed within 24-48 hours.</p>
          </div>

          <div className="faq-item">
            <h4>Can I update my report after submission?</h4>
            <p>Currently, reports cannot be edited after submission. If you need to add information, please submit a new report referencing the original tracking ID.</p>
          </div>

          <div className="faq-item">
            <h4>What if I lost my tracking ID?</h4>
            <p>Login to your account and go to "My Reports" to view all your submitted reports and their tracking IDs.</p>
          </div>

          <div className="faq-item">
            <h4>Is my information kept confidential?</h4>
            <p>Yes, all information is stored securely and only accessible to authorized authorities. Your personal details are protected.</p>
          </div>

          <div className="faq-item">
            <h4>Can I submit anonymous reports?</h4>
            <p>No, you must be logged in to submit a report. This ensures accountability and allows authorities to contact you if needed.</p>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="help-section contact-section">
        <h3>Still Need Help?</h3>
        <p>If you couldn't find the answer to your question, please contact our support team:</p>
        <div className="contact-info">
          <p><strong>Email:</strong> support@incidentreport.com</p>
          <p><strong>Phone:</strong> +91-XXX-XXX-XXXX</p>
          <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
        </div>
      </section>
    </div>
  );
};

export default Help;


