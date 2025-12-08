import { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { jobAPI } from '../utils/api';

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid', 'Contract'];

const Filters = ({ onFilterChange, filters }) => {
  const [locations, setLocations] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    location: 'All',
    jobType: 'All',
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await jobAPI.getLocations();
      if (response.data.success) {
        setLocations(['All', ...response.data.data]);
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    const newFilters = { ...localFilters, location: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleJobTypeChange = (e) => {
    const value = e.target.value;
    const newFilters = { ...localFilters, jobType: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const resetFilters = {
      search: '',
      location: 'All',
      jobType: 'All',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="filters-container">
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={localFilters.search}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <div className="filter-group">
        <div className="filter-item">
          <label htmlFor="location">
            <FiMapPin className="filter-icon" />
            Location
          </label>
          <select
            id="location"
            value={localFilters.location}
            onChange={handleLocationChange}
            className="filter-select"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="jobType">
            <FiBriefcase className="filter-icon" />
            Job Type
          </label>
          <select
            id="jobType"
            value={localFilters.jobType}
            onChange={handleJobTypeChange}
            className="filter-select"
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="button" 
          onClick={handleClearFilters}
          className="clear-filters-btn"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;