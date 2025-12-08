export const generateJobSchema = (job) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || `${job.title} position at ${job.company}`,
    identifier: {
      '@type': 'PropertyValue',
      name: job.company,
      value: job._id
    },
    datePosted: job.postedDate,
    validThrough: new Date(new Date(job.postedDate).setMonth(new Date(job.postedDate).getMonth() + 3)).toISOString(),
    employmentType: job.jobType.toUpperCase().replace('-', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      sameAs: job.applyLink || '',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      }
    },
    ...(job.email && {
      applicantLocationRequirements: {
        '@type': 'Country',
        name: 'Worldwide'
      }
    })
  };
};

export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};