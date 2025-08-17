import React from "react";
import "../../index.css"; 
function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About Us</h1>
        <p className="about-text">
          Welcome to <span className="highlight">Our Company</span> — 
          where passion meets innovation. We are a team of dedicated professionals 
          committed to delivering exceptional products and services that make a real 
          difference in people's lives.
        </p>
        <p className="about-text">
          Our mission is to combine creativity, technology, and user-focused design 
          to create solutions that are impactful, reliable, and future-ready.
        </p>
        <button className="about-btn">Learn More</button>
      </div>
    </div>
  );
}

export default About;
