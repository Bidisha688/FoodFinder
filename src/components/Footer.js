// components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        Developed by <span className="footer-name">Arpon Roy</span>
      </p>
      <div className="footer-links">
        <a
          href="https://www.linkedin.com/in/arpon-roy-b461321a8/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/ArponRoy7"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
