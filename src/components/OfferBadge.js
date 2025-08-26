import React from "react";

export default function OfferBadge({ text }) {
  if (!text) return null;
  return (
    <span
      className="pointer-events-none absolute top-2 left-2 z-20
                 inline-flex items-center rounded-xl bg-indigo-600/90
                 px-2.5 py-1 text-xs font-semibold text-white shadow"
    >
      {text}
    </span>
  );
}
