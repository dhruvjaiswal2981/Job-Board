import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Bookmarks = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch bookmarks from localStorage
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
    setBookmarkedJobs(storedBookmarks);
  }, []);

  // Remove bookmark function
  const handleRemoveBookmark = (jobId) => {
    const updatedBookmarks = bookmarkedJobs.filter(job => job.id !== jobId);
    setBookmarkedJobs(updatedBookmarks);
    localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
  };

  // View job details
  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Bookmarked Jobs</h1>
      {bookmarkedJobs.length === 0 ? (
        <p style={styles.noJobsText}>No jobs bookmarked yet.</p>
      ) : (
        bookmarkedJobs.map(job => (
          <div key={job.id} style={styles.jobCard}>
            <h3 style={styles.jobTitle}>{job.title || 'No title'}</h3>
            <p style={styles.jobDetail}><strong>Location:</strong> {job.primary_details?.Place || 'No location provided'}</p>
            <p style={styles.jobDetail}><strong>Salary:</strong> {job.primary_details?.Salary || 'No salary info'}</p>
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={() => handleViewDetails(job.id)}>View Details</button>
              <button style={styles.removeButton} onClick={() => handleRemoveBookmark(job.id)}>Remove Bookmark</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// CSS styles object
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  noJobsText: {
    textAlign: 'center',
    color: '#888',
  },
  jobCard: {
    border: '1px solid #ccc',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
  },
  jobCardHover: {
    transform: 'scale(1.02)',
  },
  jobTitle: {
    fontSize: '1.2em',
    color: '#333',
  },
  jobDetail: {
    color: '#555',
  },
  buttonGroup: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  removeButton: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  removeButtonHover: {
    backgroundColor: '#c82333',
  },
};

export default Bookmarks;
