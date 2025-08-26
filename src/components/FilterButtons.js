// src/components/FilterButtons.js
import React from "react";

export default function FilterButtons({ onTopRated, onReset, disabled }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onTopRated}
        disabled={disabled}
        className="inline-flex items-center rounded-xl bg-white dark:bg-zinc-900 px-4 py-2 text-sm 
                   font-medium text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-200 dark:ring-zinc-700 
                   shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
      >
        ⭐ Top Rated
      </button>
      <button
        onClick={onReset}
        disabled={disabled}
        className="inline-flex items-center rounded-xl bg-white dark:bg-zinc-900 px-4 py-2 text-sm 
                   font-medium text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-200 dark:ring-zinc-700 
                   shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
      >
        🔄 Reset
      </button>
    </div>
  );
}
