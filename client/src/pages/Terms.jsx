import React from 'react';
import SEO from '../components/SEO';

const Terms = () => {
  return (
    <div className="terms-page container">
      <SEO title="Terms & Conditions - Offcampus Jobs" description="Terms and conditions for Offcampus Jobs" />

      <h1>Terms & Conditions</h1>

      <p>By using Offcampus Jobs, you agree to the following:</p>
      <ol>
        <li>Use the website for lawful purposes only.</li>
        <li>Verify job details before applying; we do not guarantee job accuracy or placement.</li>
        <li>We never ask for money for job applications; avoid third-parties who do.</li>
        <li>We redirect users to third-party company sites to apply; we are not responsible for their content or policies.</li>
        <li>Do not scrape, copy, spread fake job information, or attempt to harm the website.</li>
        <li>Content is owned by the platform; do not reproduce without permission.</li>
        <li>We are not liable for job-related losses or decisions based on third-party pages.</li>
      </ol>

      <p>We may update these terms anytime; check this page periodically.</p>
    </div>
  );
};

export default Terms;
