import React from "react";
import PropTypes from "prop-types";
import useFormatINR from "../Utils/hooks/useFormatINR";
import useRatingClass from "../Utils/hooks/useRatingClass";
import useImageFallback from "../Utils/hooks/useImageFallback";

const FALLBACK_IMG = "https://via.placeholder.com/400x250?text=No+Image";

function parseStars(stars) {
  if (stars == null) return null;
  const n = typeof stars === "number" ? stars : Number(String(stars).trim());
  return Number.isFinite(n) ? n : null;
}

export default function RestaurantCard({
  id,
  resName,
  cuisine,
  stars,
  delTime,
  distance,
  costForTwo,
  costForTwoNum,
  location,
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
    <article
      id={`restaurant-${id}`} // ✅ id is now used
      className="mx-2 my-2 rounded-xl ring-1 ring-black/5 shadow bg-white dark:bg-zinc-900 overflow-hidden group text-sm"
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          className="w-full h-28 object-cover block"
          src={imgSrc || FALLBACK_IMG}
          alt={resName ? `${resName} cover` : "Restaurant cover"}
          loading="lazy"
          decoding="async"
          onError={handleError}
          draggable={false}
        />
      </div>

      {/* Body */}
      <div className="p-3">
        {starsDisplay != null && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset mb-1.5 ${
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

        <h3
          className="text-base font-semibold tracking-tight line-clamp-1"
          title={resName || ""}
        >
          {resName || "Unnamed Restaurant"}
        </h3>

        <p
          className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-1"
          title={cuisine || ""}
        >
          {cuisine || "Cuisine N/A"}
        </p>

        <div
          className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-700 dark:text-zinc-200"
          aria-label="Meta info"
        >
          {metaItems.length ? (
            metaItems.map((text, i) => (
              <span key={i} className="inline-flex items-center">
                {text}
                {i < metaItems.length - 1 && (
                  <span
                    className="mx-1 h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))
          ) : (
            <span>—</span>
          )}
        </div>

        <p
          className="mt-1 text-xs text-zinc-500 line-clamp-1"
          title={location || ""}
        >
          {location || "Location N/A"}
        </p>

        <div
          className="mt-2 text-xs font-medium text-indigo-600 group-hover:translate-x-0.5 transition-transform"
          aria-hidden="true"
        >
          View menu →
        </div>
      </div>
    </article>
  );
}

// ✅ PropTypes validation
RestaurantCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  resName: PropTypes.string,
  cuisine: PropTypes.string,
  stars: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  delTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  costForTwo: PropTypes.string,
  costForTwoNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  location: PropTypes.string,
  image: PropTypes.string,
};
