import React from "react";

export default function OfflineUI({ onRetry }) {
  return (
    <div className="offline-container">
      <h2 className="offline-title">⚠️ You are Offline</h2>
      <p className="offline-text">Please check your internet connection and try again.</p>
      <button className="offline-retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
