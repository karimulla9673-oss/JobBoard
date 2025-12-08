import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobAPI } from '../utils/api';
import SEO from '../components/SEO';
import JobCard from '../components/JobCard';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    location: 'All',
    jobType: 'All',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', currentPage, filters],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.location !== 'All' && { location: filters.location }),
        ...(filters.jobType !== 'All' && { jobType: filters.jobType }),
      };
      const response = await jobAPI.getAllJobs(params);
      return response.data;
    },
    keepPreviousData: true,
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <SEO
        title="Find Your Dream Job"
        description="Browse thousands of job listings from top companies across various industries and locations."
        keywords="jobs, careers, employment, job search, hiring"
      />

      <header className="hero">
        <div className="container">
          <h1 className="hero-title">Find Your Dream Job</h1>
          <p className="hero-subtitle">
            Explore opportunities from top companies worldwide
          </p>
        </div>
      </header>

      <main className="container">
        <Filters onFilterChange={handleFilterChange} filters={filters} />

        {/* AdSense Placeholder - Top Banner */}
        <div className="ad-placeholder ad-banner">
          <p>Advertisement Space (728x90)</p>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Failed to load jobs. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="jobs-info">
              <p>
                {data?.pagination.totalJobs || 0} jobs found
                {filters.search && ` for "${filters.search}"`}
              </p>
            </div>

            {data?.data.length === 0 ? (
              <div className="no-jobs">
                <p>No jobs found matching your criteria.</p>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="jobs-grid">
                  {data?.data.map((job, index) => (
                    <div key={job._id}>
                      <JobCard job={job} />
                      {/* AdSense Placeholder - In-feed ads (every 4 jobs) */}
                      {(index + 1) % 4 === 0 && index !== data.data.length - 1 && (
                        <div className="ad-placeholder ad-infeed">
                          <p>Advertisement Space (300x250)</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={data?.pagination.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}

        {/* AdSense Placeholder - Bottom Banner */}
        <div className="ad-placeholder ad-banner">
          <p>Advertisement Space (728x90)</p>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Job Board. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;