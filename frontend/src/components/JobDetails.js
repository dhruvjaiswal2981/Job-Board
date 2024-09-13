import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './JobDetails.css';  // Import the CSS file

const JobDetails = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs/${id}`);
        console.log('Job Details API Response:', response.data); // Log response structure
        setJob(response.data);
      } catch (err) {
        setError(`Failed to fetch job details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!job) return <p className="no-data">No job details available.</p>;

  // Safely handle job content
  let contentBlocks = { block1: '', block2: '', block3: '' };
  if (job.content) {
    try {
      contentBlocks = JSON.parse(job.content); // Parse job content if present
    } catch (err) {
      console.error('Failed to parse job content:', err);
    }
  }

  return (
    <div className="job-details-container">
      <h2 className="job-title">{job.title || 'No Title'}</h2>
      <p><strong>Location:</strong> {job.primary_details?.Place || 'N/A'}</p>
      <p><strong>Salary:</strong> {job.primary_details?.Salary || 'N/A'}</p>
      <p><strong>Experience:</strong> {job.primary_details?.Experience || 'N/A'}</p>
      <p><strong>Qualification:</strong> {job.primary_details?.Qualification || 'N/A'}</p>
      <p><strong>Fees Charged:</strong> {job.primary_details?.Fees_Charged || 'N/A'}</p>
      <p><strong>Job Type:</strong> {job.primary_details?.Job_Type || 'N/A'}</p>
      
      <div className="content-block">
        <strong>Job Description:</strong>
        <p>{contentBlocks.block1}</p>
        <p>{contentBlocks.block2}</p>
        <p>{contentBlocks.block3}</p>
      </div>

      <p><strong>Contact:</strong> {job.contact_preference?.whatsapp_no || 'N/A'}</p>
      <p><strong>Company Name:</strong> {job.company_name || 'N/A'}</p>
      <p><strong>Amount:</strong> {job.amount || 'N/A'}</p>
      <p><strong>Views:</strong> {job.views || 'N/A'}</p>
      <p><strong>Shares:</strong> {job.shares || 'N/A'}</p>
      <p><strong>Facebook Shares:</strong> {job.fb_shares || 'N/A'}</p>
      <p><strong>Updated On:</strong> {job.updated_on || 'N/A'}</p>

      {job.contact_preference?.whatsapp_link && (
        <a href={job.contact_preference.whatsapp_link} target="_blank" rel="noopener noreferrer" className="contact-link">
          Contact via WhatsApp
        </a>
      )}
      {job.custom_link && (
        <a href={job.custom_link} target="_blank" rel="noopener noreferrer" className="contact-link">
          {job.button_text || 'Contact HR'}
        </a>
      )}
    </div>
  );
};

export default JobDetails;
