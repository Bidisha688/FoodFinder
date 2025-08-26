// src/components/SearchBar.js
import React, { useRef } from "react";

export default function SearchBar({ onSearch, disabled }) {
  const inputRef = useRef();

  const handleSearch = () => {
    const query = (inputRef.current?.value || "").trim().toLowerCase();
    onSearch(query);
  };

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search restaurants..."
        className="block w-full sm:w-80 rounded-xl border border-zinc-200 dark:border-zinc-700 
                   bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm 
                   placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        disabled={disabled}
        data-testid="searchInput"
      />
      <button
        onClick={handleSearch}
        disabled={disabled}
        className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium 
                   text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
      >
        Search
      </button>
    </div>
  );
}
