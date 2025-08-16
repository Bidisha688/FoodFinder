// File: src/components/Shimmer.js
import React from "react";
import "../style/Shimmer.css";

/**
 * Skeleton loader that occupies the exact footprint of RestaurantCard cards.
 * Renders directly inside .res-container without adding extra layout wrappers.
 */
export default function Shimmer({ count = 12 }) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div className="res-card shimmer-card" aria-hidden="true" key={i}>
          {/* Top media block (16:9) */}
          <div className="shimmer-media" />

          {/* Body mirrors .res-body sections */}
          <div className="shimmer-body">
            {/* chips row: rating + offer */}
            <div className="shimmer-meta-top">
              <div className="shimmer-pill" />
              <div className="shimmer-pill alt" />
            </div>

            {/* title */}
            <div className="shimmer-line lg" style={{ width: "75%" }} />

            {/* cuisine */}
            <div className="shimmer-line md" style={{ width: "55%" }} />

            {/* meta row (3 bits with dots between like Delivery • Distance • Cost) */}
            <div className="shimmer-meta-row">
              <div className="shimmer-bit" />
              <span className="shimmer-dot" />
              <div className="shimmer-bit" style={{ width: 64 }} />
              <span className="shimmer-dot" />
              <div className="shimmer-bit" style={{ width: 84 }} />
            </div>

            {/* location */}
            <div className="shimmer-line sm" style={{ width: "60%" }} />

            {/* CTA */}
            <div className="shimmer-cta" />
          </div>
        </div>
      ))}
    </>
  );
}
