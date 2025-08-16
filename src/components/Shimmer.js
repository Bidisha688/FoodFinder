import React from "react";

const Shimmer = () => {
  return (
    <div className="shimmer-wrapper">
      <div className="shimmer-grid">
        {Array(8).fill("").map((_, index) => (
          <div className="shimmer-card" key={index}>
            <div className="shimmer-img"></div>
            <div className="shimmer-info">
              <div className="shimmer-line short"></div>
              <div className="shimmer-line"></div>
              <div className="shimmer-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shimmer;
