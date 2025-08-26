import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../Utils/cartSlice";

export default function CartBadge() {
  const count = useSelector(selectCartCount);

  return (
    <Link
      to="/cart"
      aria-label="Cart"
      className="relative inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium
                 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2" aria-hidden="true">
        <path d="M6 6h14l-1.5 9h-12L5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="21" r="1.8" fill="currentColor" />
        <circle cx="18" cy="21" r="1.8" fill="currentColor" />
      </svg>
      Cart
      {count > 0 && (
        <span
          className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1
                     rounded-full text-xs font-semibold bg-indigo-600 text-white"
          aria-label={`${count} items in cart`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
