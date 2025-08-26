// src/components/Shimmer.jsx
import React from "react";

export default function Shimmer({ count = 12 }) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className="rounded-2xl ring-1 ring-black/5 shadow-sm 
                     bg-white dark:bg-zinc-900 overflow-hidden animate-pulse"
          aria-hidden="true"
        >
          {/* Image placeholder */}
          <div className="aspect-[16/9] bg-zinc-200 dark:bg-zinc-800" />

          {/* Text placeholders */}
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-1/2 rounded-md bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex items-center gap-3">
              <div className="h-4 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-4 w-20 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-4 w-24 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
