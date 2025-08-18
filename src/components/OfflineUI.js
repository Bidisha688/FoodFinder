import React from "react";

export default function OfflineUI({ onRetry }) {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 className="text-2xl font-semibold">⚠️ You are Offline</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Please check your internet connection and try again.</p>
      <button onClick={onRetry} className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900">
        Retry
      </button>
    </div>
  );
}