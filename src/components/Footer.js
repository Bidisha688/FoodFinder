import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-zinc-600 dark:text-zinc-300">
          Developed by <span className="font-semibold text-zinc-900 dark:text-white">Arpon Roy</span>
        </p>
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/arpon-roy-b461321a8/" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white underline-offset-4 hover:underline">LinkedIn</a>
          <a href="https://github.com/ArponRoy7" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white underline-offset-4 hover:underline">GitHub</a>
        </div>
      </div>
    </footer>
  );
}