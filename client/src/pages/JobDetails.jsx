import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiMapPin, FiBriefcase, FiCalendar, FiMail, FiPhone, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import { format } from 'date-fns';
import { jobAPI } from '../utils/api';
import SEO from '../components/SEO';
import { generateJobSchema, generateBreadcrumbSchema } from '../utils/seo';

const JobDetails = () => {
  const { id, slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const response = await jobAPI.getJob(id, slug);
      return response.data.data;
    },
  });

  const handleApplyClick = () => {
    if (data?.applyLink) {
      window.open(data.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="error-container">
        <h2>Job Not Found</h2>
        <p>The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="back-link">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  const jobSchema = generateJobSchema(data);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: window.location.origin },
    { name: 'Jobs', url: `${window.location.origin}/` },
    { name: data.title, url: window.location.href }
  ]);

  return (
    <div className="job-details-page">
      <SEO
        title={`${data.title} at ${data.company}`}
        description={data.description || `Apply for ${data.title} position at ${data.company} in ${data.location}. ${data.jobType} opportunity.`}
        keywords={`${data.title}, ${data.company}, ${data.location}, ${data.jobType}, job opening`}
        canonical={window.location.href}
        ogImage={data.imageUrl}
        schema={[jobSchema, breadcrumbSchema]}
      />

      <div className="container">
        <Link to="/" className="back-link">
          <FiArrowLeft /> Back to Jobs
        </Link>

        <div className="job-details-card">
          <div className="job-details-header">
            <div className="job-image-large">
              <img 
                src={data.imageUrl} 
                alt={`${data.title} at ${data.company}`}
              />
            </div>

            <div className="job-details-info">
              <h1 className="job-details-title">{data.title}</h1>
              <h2 className="job-details-company">{data.company}</h2>

              <div className="job-meta">
                <div className="meta-item">
                  <FiMapPin className="icon" />
                  <span>{data.location}</span>
                </div>

                <div className="meta-item">
                  <FiBriefcase className="icon" />
                  <span>{data.jobType}</span>
                </div>

                <div className="meta-item">
                  <FiCalendar className="icon" />
                  <span>Posted on {format(new Date(data.postedDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              {data.applyLink && (
                <button 
                  className="apply-btn-large"
                  onClick={handleApplyClick}
                >
                  <span>Apply Now</span>
                  <FiExternalLink className="icon" />
                </button>
              )}
            </div>
          </div>

          {/* AdSense Placeholder */}
          <div className="ad-placeholder ad-banner">
            <p>Advertisement Space (728x90)</p>
          </div>

          <div className="job-details-content">
            {data.description && (
              <div className="job-section">
                <h3>Job Description</h3>
                <p>{data.description}</p>
              </div>
            )}

            <div className="job-section">
              <h3>Contact Information</h3>
              <div className="contact-details">
                {data.email && (
                  <div className="contact-item">
                    <FiMail className="icon" />
                    <div>
                      <span className="label">Email</span>
                      <a href={`mailto:${data.email}`}>{data.email}</a>
                    </div>
                  </div>
                )}

                {data.contactNumber && (
                  <div className="contact-item">
                    <FiPhone className="icon" />
                    <div>
                      <span className="label">Phone</span>
                      <a href={`tel:${data.contactNumber}`}>{data.contactNumber}</a>
                    </div>
                  </div>
                )}

                {data.applyLink && (
                  <div className="contact-item">
                    <FiExternalLink className="icon" />
                    <div>
                      <span className="label">Apply Link</span>
                      <a 
                        href={data.applyLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Visit Application Page
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {data.applyLink && (
              <div className="apply-section">
                <button 
                  className="apply-btn-large"
                  onClick={handleApplyClick}
                >
                  <span>Apply for this Position</span>
                  <FiExternalLink className="icon" />
                </button>
              </div>
            )}
          </div>

          {/* AdSense Placeholder */}
          <div className="ad-placeholder ad-rectangle">
            <p>Advertisement Space (300x600)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;