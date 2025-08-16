import React from "react";
import useOnlineStatus from "../Utils/hooks/useOnlineStatus";

const StatusButton = () => {
  const online = useOnlineStatus();

  return (
    <button
      className={`status-btn ${online ? "online" : "offline"}`}
      aria-label={`You are currently ${online ? "online" : "offline"}`}
      title={`Status: ${online ? "Online" : "Offline"}`}
    >
      {online ? "🟢 Online" : "🔴 Offline"}
    </button>
  );
};

export default StatusButton;
