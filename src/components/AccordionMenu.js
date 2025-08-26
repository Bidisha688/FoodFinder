import React from "react";

// Simple INR formatter (avoids extra deps)
function formatINR(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

// Normalize a single raw item into a consistent shape
function normalizeItem(raw, fallbackCat) {
  const n = raw?.card?.info || raw?.info || raw || {};
  const price =
    typeof n.price === "number"
      ? n.price
      : typeof n.finalPrice === "number"
      ? n.finalPrice
      : typeof n.defaultPrice === "number"
      ? n.defaultPrice
      : (typeof raw?.price === "number" ? raw.price : undefined);

  return {
    id: n.id || n.uuid || raw?.id || raw?.uuid || undefined,
    name: n.name || raw?.name || "Unnamed Item",
    desc: n.description || raw?.desc || raw?.description || "",
    price,
    img: n.image || n.img || n.imageId || raw?.img || "",
    veg: typeof n.isVeg !== "undefined" ? !!n.isVeg : (typeof raw?.veg !== "undefined" ? !!raw.veg : undefined),
    cat: n.category || raw?.cat || fallbackCat || "",
    // Keep original so parent can access raw fields if needed
    _raw: raw
  };
}

// Normalize a category
function normalizeCategory(cat) {
  const title = cat.title || cat.name || cat.card?.title || "Menu";
  let items = cat.items || cat.itemCards || cat.card?.itemCards || cat.menuItems || [];
  if (!Array.isArray(items)) items = [];
  items = items.map((it) => normalizeItem(it, title));
  return { title, items };
}

export default function AccordionMenu({
  categories,
  openIndex,
  onToggle,
  onAdd,         // <-- NEW: parent handler to add to cart
}) {
  const list = Array.isArray(categories) ? categories : [];

  return (
    <div className="mt-6 space-y-4">
      {list.map((cat, idx) => {
        const { title, items } = normalizeCategory(cat);
        const isOpen = openIndex === idx;

        return (
          <div
            key={title || idx}
            className="rounded-2xl ring-1 ring-black/5 shadow-sm bg-white dark:bg-zinc-900"
          >
            {/* Accordion Header */}
            <button
              onClick={() => onToggle?.(idx)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-t-2xl"
              aria-expanded={isOpen}
            >
              <span>
                {title}
                {items.length > 0 && (
                  <span className="ml-2 text-sm text-zinc-500">
                    ({items.length})
                  </span>
                )}
              </span>
              <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
            </button>

            {/* Accordion Content */}
            {isOpen && items.length > 0 && (
              <div className="p-4 space-y-4">
                {items.map((it, i) => (
                  <div
                    key={it.id || i}
                    className="flex gap-4 items-start rounded-xl ring-1 ring-black/5 shadow-sm p-4 bg-white dark:bg-zinc-900 relative"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold truncate">
                          {it.name}
                        </h4>
                        {typeof it.veg === "boolean" && (
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] ring-1 ring-inset ${
                              it.veg
                                ? "text-green-700 ring-green-200 bg-green-50"
                                : "text-red-700 ring-red-200 bg-red-50"
                            }`}
                            title={it.veg ? "Vegetarian" : "Non-Vegetarian"}
                          >
                            {it.veg ? "VEG" : "NON-VEG"}
                          </span>
                        )}
                      </div>

                      {it.desc && (
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                          {it.desc}
                        </p>
                      )}

                      <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                        <span className="font-medium">{formatINR(it.price)}</span>
                        {it.cat && <span className="text-zinc-400"> · {it.cat}</span>}
                      </div>
                    </div>

                    {/* Right column (image if any + Add button) */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      {it.img ? (
                        <img
                          className="h-24 w-24 rounded-xl object-cover ring-1 ring-black/5"
                          src={
                            // If image id, prepend CDN path, else assume full URL
                            it.img.startsWith("http")
                              ? it.img
                              : `https://media-assets.swiggy.com/swiggy/image/upload/${it.img}`
                          }
                          alt={it.name}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ) : null}

                      <button
                        className="inline-flex items-center rounded-lg bg-indigo-600 text-white text-xs px-3 py-1.5 shadow hover:bg-indigo-500 active:scale-[0.98]"
                        onClick={() => onAdd?.(it)}
                        aria-label={`Add ${it.name} to cart`}
                      >
                        + Add
                      </button>
                    </div>
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
