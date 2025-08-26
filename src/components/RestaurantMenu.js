import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Shimmer from "./Shimmer";
import useRestaurantMenu from "../Utils/hooks/useRestaurantMenu";
import AccordionMenu from "./AccordionMenu";
import { addItem } from "../Utils/cartSlice";

export default function RestaurantMenu() {
  const { id } = useParams();
  const { loading, header, categories, error } = useRestaurantMenu(id);

  const dispatch = useDispatch();

  // parent-controlled open index
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  // Centralized handler used by AccordionMenu for each item Add click
  const handleAddToCart = (item) => {
    if (!item) return;
    const safeId =
      item.id || item.itemId || item.uuid || `${id}_${item.name || "item"}`;
    const price =
      typeof item.price === "number"
        ? item.price
        : typeof item.defaultPrice === "number"
        ? item.defaultPrice
        : typeof item.finalPrice === "number"
        ? item.finalPrice
        : 100; // sensible fallback
    dispatch(
      addItem({
        id: String(safeId),
        name: item.name || "Menu Item",
        price,
        image: item.image || item.img || item.imageId || header?.image || "",
      })
    );
  };

  if (loading) return <Shimmer count={8} />;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4">
        <Link to="/" className="text-sm text-indigo-600 hover:underline">
          ← Back to list
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-xl bg-red-50 text-red-700 ring-1 ring-red-200 px-4 py-2 text-sm"
        >
          {error}
        </div>
      )}

      {header && (
        <div className="flex flex-col sm:flex-row gap-6 rounded-2xl ring-1 ring-black/5 shadow-sm p-5 bg-white dark:bg-zinc-900">
          {header.image && (
            <img
              className="h-40 w-full sm:w-56 object-cover rounded-xl"
              src={header.image}
              alt={header.name}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{header.name}</h2>
            <p className="mt-1 text-sm">
              <strong>Rating:</strong> ⭐ {header.rating}
            </p>
            <p className="mt-1 text-sm">
              <strong>Cuisines:</strong> {header.cuisines}
            </p>
            <p className="mt-1 text-sm">
              <strong>Area:</strong> {header.area}
            </p>
            {header.costForTwoMessage && (
              <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {header.costForTwoMessage}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Controlled Accordion Menu */}
      {Array.isArray(categories) && categories.length ? (
        <AccordionMenu
          categories={categories}
          openIndex={openIndex}
          onToggle={handleToggle}
          onAdd={handleAddToCart}   // <-- pass add-to-cart handler to each item row
        />
      ) : (
        <p className="mt-6 text-sm text-zinc-500">No items found.</p>
      )}
    </div>
  );
}
