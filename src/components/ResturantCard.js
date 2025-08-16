// src/components/RestaurantCard.js
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
  resName,
  cuisine,
  stars,
  delTime,        // e.g. "20–25 mins"
  distance,       // ← NEW: e.g. "3.2 km" (pass from parser)
  costForTwo,     // string like "₹300 for two" (from parser)
  costForTwoNum,  // number in rupees (from parser) – optional
  location,
  offers,
  image,
}) {
  // rating
  const starsNum = parseStars(stars);
  const ratingCls = useRatingClass(starsNum);
  const starsDisplay =
    starsNum == null
      ? null
      : Math.round(starsNum * 10) % 10 === 0
      ? String(Math.round(starsNum))
      : starsNum.toFixed(1);

  // currency (called unconditionally)
  const formattedINR = useFormatINR(
    typeof costForTwoNum === "number" ? costForTwoNum : null
  );

  // final cost label: prefer ready string, else build from number
  const costLabel =
    (typeof costForTwo === "string" && costForTwo.trim()) ||
    (formattedINR ? `${formattedINR} for two` : null);

  const { imgSrc, handleError } = useImageFallback(image, FALLBACK_IMG);

  // Build meta items with clean dot separators
  const metaItems = [];
  if (delTime) metaItems.push(delTime);
  if (distance) metaItems.push(distance);
  if (costLabel) metaItems.push(costLabel);

  return (
    <article className="res-card" role="article" aria-label={resName || "Restaurant"}>
      {/* Image */}
      <div className="res-media">
        <img
          className="res-img"
          src={imgSrc}
          alt={resName ? `${resName} cover` : "Restaurant cover"}
          loading="lazy"
          decoding="async"
          onError={handleError}
        />
      </div>

      {/* Body */}
      <div className="res-body">
        {/* Rating & offer chips BELOW the image */}
        <div className="res-meta-top">
          {starsDisplay != null && (
            <span className={`res-rating ${ratingCls}`} aria-label={`Rating ${starsDisplay}`}>
              ★ {starsDisplay}
            </span>
          )}
          {offers ? <span className="res-offer">{offers}</span> : null}
        </div>

        <h3 className="res-title" title={resName || ""}>
          {resName || "Unnamed Restaurant"}
        </h3>

        <p className="res-cuisine" title={cuisine || ""}>
          {cuisine || "Cuisine N/A"}
        </p>

        <div className="res-meta" aria-label="Meta info">
          {metaItems.length ? (
            metaItems.map((text, i) => (
              <span key={i} className="meta-item">
                {text}
                {i < metaItems.length - 1 && (
                  <span className="dot" aria-hidden="true" />
                )}
              </span>
            ))
          ) : (
            <span>—</span>
          )}
        </div>

        <p className="res-loc" title={location || ""}>
          {location || "Location N/A"}
        </p>

        <div className="res-cta" aria-hidden="true">
          View menu →
        </div>
      </div>
    </article>
  );
}
