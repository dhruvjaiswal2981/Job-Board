import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Jobs from './components/Jobs';
import Bookmarks from './components/Bookmarks';
import JobDetails from './components/JobDetails';
import './styles/App.css';

function App() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  // Retrieve bookmarks from localStorage when the app loads
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
    setBookmarkedJobs(storedBookmarks);
  }, []);

  // Update localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
  }, [bookmarkedJobs]);

  return (
    <Router>
      <div className="app-container">
        <nav className="bottom-nav">
          <Link to="/jobs" className="nav-link">Jobs</Link>
          <Link to="/bookmarks" className="nav-link">Bookmarks</Link>
        </nav>

        <Routes>
        <Route path="/" element={<Jobs bookmarkedJobs={bookmarkedJobs} setBookmarkedJobs={setBookmarkedJobs} />} />
          <Route path="/jobs" element={<Jobs bookmarkedJobs={bookmarkedJobs} setBookmarkedJobs={setBookmarkedJobs} />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/job/:id" element={<JobDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
