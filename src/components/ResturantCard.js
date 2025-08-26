import React from "react";
import useFormatINR from "../Utils/hooks/useFormatINR";
import useRatingClass from "../Utils/hooks/useRatingClass";
import useImageFallback from "../Utils/hooks/useImageFallback";

const FALLBACK_IMG = "https://via.placeholder.com/600x400?text=No+Image";

function parseStars(stars) {
  if (stars == null) return null;
  const n = typeof stars === "number" ? stars : Number(String(stars).trim());
  return Number.isFinite(n) ? n : null;
}

export default function RestaurantCard({
  id,             // kept for routing to /restaurant/:id (View menu)
  resName,
  cuisine,
  stars,
  delTime,
  distance,
  costForTwo,
  costForTwoNum,
  location,
  // offers,      // ← offer ribbon removed here; handled by withOfferBadge HOC
  image,
}) {
  const starsNum = parseStars(stars);
  const ratingCls = useRatingClass(starsNum);
  const starsDisplay =
    starsNum == null
      ? null
      : Math.round(starsNum * 10) % 10 === 0
      ? String(Math.round(starsNum))
      : starsNum.toFixed(1);

  const formattedINR = useFormatINR(
    typeof costForTwoNum === "number" ? costForTwoNum : null
  );

  const costLabel =
    (typeof costForTwo === "string" && costForTwo.trim()) ||
    (formattedINR ? `${formattedINR} for two` : null);

  const { imgSrc, handleError } = useImageFallback(image, FALLBACK_IMG);

  const metaItems = [];
  if (delTime) metaItems.push(delTime);
  if (distance) metaItems.push(distance);
  if (costLabel) metaItems.push(costLabel);

  return (
    <article className="rounded-2xl ring-1 ring-black/5 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-[16/9]">
        <img
          className="h-full w-full object-cover"
          src={imgSrc}
          alt={resName ? `${resName} cover` : "Restaurant cover"}
          loading="lazy"
          decoding="async"
          onError={handleError}
        />
        {/* Offer badge removed; use withOfferBadge HOC to overlay */}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Rating chip */}
        {starsDisplay != null && (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset mb-2 ${
              ratingCls === "good"
                ? "bg-green-50 text-green-700 ring-green-200"
                : ratingCls === "ok"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-red-50 text-red-700 ring-red-200"
            }`}
            aria-label={`Rating ${starsDisplay}`}
          >
            ★ {starsDisplay}
          </span>
        )}

        <h3 className="text-lg font-semibold tracking-tight line-clamp-1" title={resName || ""}>
          {resName || "Unnamed Restaurant"}
        </h3>

        <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-1" title={cuisine || ""}>
          {cuisine || "Cuisine N/A"}
        </p>

        <div
          className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-700 dark:text-zinc-200"
          aria-label="Meta info"
        >
          {metaItems.length ? (
            metaItems.map((text, i) => (
              <span key={i} className="inline-flex items-center">
                {text}
                {i < metaItems.length - 1 && (
                  <span
                    className="mx-2 h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))
          ) : (
            <span>—</span>
          )}
        </div>

        <p className="mt-2 text-xs text-zinc-500 line-clamp-1" title={location || ""}>
          {location || "Location N/A"}
        </p>

        <div className="mt-3 text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform" aria-hidden="true">
          View menu →
        </div>
      </div>
    </article>
  );
}
