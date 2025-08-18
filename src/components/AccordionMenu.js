import React from "react";

export default function AccordionMenu({
  categories,
  openIndex,
  onToggle,
}) {
  return (
    <div className="mt-6 space-y-4">
      {(categories || []).map((cat, idx) => {
        const isOpen = openIndex === idx;
        const items = Array.isArray(cat.items) ? cat.items : [];

        return (
          <div
            key={cat.title || idx}
            className="rounded-2xl ring-1 ring-black/5 shadow-sm bg-white dark:bg-zinc-900"
          >
            {/* Accordion Header */}
            <button
              onClick={() => onToggle?.(idx)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-t-2xl"
            >
              <span>
                {cat.title}
                {items.length > 0 && (
                  <span className="ml-2 text-sm text-zinc-500">
                    ({items.length})
                  </span>
                )}
              </span>
              <span>{isOpen ? "▲" : "▼"}</span>
            </button>

            {/* Accordion Content */}
            {isOpen && items.length > 0 && (
              <div className="p-4 space-y-4">
                {items.map((it, i) => (
                  <div
                    key={it.id || i}
                    className="flex gap-4 items-start rounded-xl ring-1 ring-black/5 shadow-sm p-4 bg-white dark:bg-zinc-900 relative"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {it.name || "Unnamed Item"} {it.veg ? "🟢" : "🔴"}
                      </h4>
                      {(it.desc || it.description) && (
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                          {it.desc || it.description}
                        </p>
                      )}
                      <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                        <span className="font-medium">
                          {it.price > 0 ? `₹${it.price}` : "—"}
                        </span>
                        {it.cat && (
                          <span className="text-zinc-400"> · {it.cat}</span>
                        )}
                      </div>
                    </div>

                    {/* Image + Add button */}
                    {it.img && (
                      <div className="relative">
                        <img
                          className="h-24 w-24 rounded-xl object-cover"
                          src={it.img}
                          alt={it.name}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <button className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-lg shadow hover:bg-indigo-500">
                          + Add
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty state when open but no items */}
            {isOpen && items.length === 0 && (
              <div className="p-4 text-sm text-zinc-500">No items in this category.</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
