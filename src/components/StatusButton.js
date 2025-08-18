import React from "react";
import useOnlineStatus from "../Utils/hooks/useOnlineStatus";

export default function StatusButton() {
  const online = useOnlineStatus();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
        online
          ? "bg-green-50 text-green-700 ring-green-200"
          : "bg-red-50 text-red-700 ring-red-200"
      }`}
      aria-label={`You are currently ${online ? "online" : "offline"}`}
      title={`Status: ${online ? "Online" : "Offline"}`}
    >
      {online ? "🟢 Online" : "🔴 Offline"}
    </span>
  );
}