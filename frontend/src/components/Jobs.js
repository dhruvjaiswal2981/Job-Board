import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './jobs.css'; // Assuming you create a Jobs.css file for the styles

const Jobs = ({ setBookmarkedJobs, bookmarkedJobs }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [jobType, setJobType] = useState('All'); // Filter for job types
  const [sortOrder, setSortOrder] = useState(''); // Sort jobs by salary
  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://testapi.getlokalapp.com/common/jobs', { params: { page } });
      const data = response.data;
      console.log('Jobs API Response:', response.data); // Log the response structure

      if (Array.isArray(data.jobs)) {
        setJobs(prevJobs => [...prevJobs, ...data.jobs]);
        if (data.jobs.length === 0) setHasMore(false);
      } else if (Array.isArray(data.results)) {
        setJobs(prevJobs => [...prevJobs, ...data.results]);
        if (data.results.length === 0) setHasMore(false);
      } else {
        setError('Invalid response structure');
      }
    } catch (err) {
      setError(`Failed to fetch jobs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Infinite scroll to load more jobs
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  // Bookmark functionality
  const handleBookmark = (job) => {
    if (!bookmarkedJobs.find(bookmark => bookmark.id === job.id)) {
      const updatedBookmarkedJobs = [...bookmarkedJobs, job];
      setBookmarkedJobs(updatedBookmarkedJobs);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarkedJobs));
    }
  };

  // View details functionality
  const handleViewDetails = (job) => {
    navigate(`/job/${job.id}`);
  };

  // Filter jobs by type
  const filteredJobs = jobs.filter(job => {
    if (jobType === 'All') return true;
    return job.primary_details?.Type === jobType;
  });

  // Sort jobs by salary (descending or ascending)
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.primary_details?.Salary - b.primary_details?.Salary;
    } else if (sortOrder === 'desc') {
      return b.primary_details?.Salary - a.primary_details?.Salary;
    }
    return 0;
  });

  return (
    <div className="jobs-container">
      {/* Filters */}
      <div className="jobs-filter">
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="All">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort by Salary</option>
          <option value="asc">Salary: Low to High</option>
          <option value="desc">Salary: High to Low</option>
        </select>
      </div>

      {/* Jobs listing */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {jobs.length === 0 && !loading && !error && <p>No jobs available.</p>}
      <div className="jobs-list">
        {sortedJobs.map(job => (
          <div key={job.id} className="job-card">
            <h3 className="job-title">{job.title || 'No title'}</h3>
            <p className="job-location">{job.primary_details?.Place || 'No location provided'}</p>
            <p className="job-salary">{job.primary_details?.Salary || 'No salary info'}</p>
            <button className="bookmark-btn" onClick={() => handleBookmark(job)}>Bookmark</button>
            <button className="details-btn" onClick={() => handleViewDetails(job)}>View Details</button>
          </div>
        ))}
      </div>

      {!hasMore && <p className="no-more-jobs">No more jobs to load.</p>}
    </div>
  );
};

export default Jobs;
