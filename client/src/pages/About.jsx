import React from 'react';
import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="about-page container">
      <SEO title="About Offcampus Jobs" description="About Offcampus Jobs - mission and vision" />

      <header style={{ padding: '32px 0' }}>
        <h1>About Offcampus Jobs</h1>
        <p className="lead">A simple and reliable job search platform for students, freshers and professionals.</p>
      </header>

      <section>
        <h2>What We Offer</h2>
        <ul>
          <li>Verified Job Listings from authentic sources</li>
          <li>Direct apply links to official company pages</li>
          <li>Fresh updates across IT, internships and more</li>
          <li>Clean & simple user experience</li>
          <li>Scam-free platform with zero charges</li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Our Mission & Vision</h2>
        <p>To provide a fast, simple and trustworthy job platform focused on students and freshers. We aim to become one of India’s most reliable job resources.</p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Contact</h3>
        <p>Reach us at <a href="mailto:offcampusjobs786@gmail.com">offcampusjobs786@gmail.com</a></p>
      </section>
    </div>
  );
};

export default About;
