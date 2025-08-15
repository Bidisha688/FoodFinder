// RestaurantCard.jsx
import React from "react";

function formatINR(value) {
  if (!value && value !== 0) return null;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value}`;
  }
}

function ratingClass(stars) {
  const n = parseFloat(stars);
  if (Number.isNaN(n)) return "rating-unknown";
  if (n >= 4.5) return "rating-great";
  if (n >= 4.0) return "rating-good";
  if (n >= 3.0) return "rating-ok";
  return "rating-low";
}

const RestaurantCard = ({
  resName,
  cuisine,
  stars,
  delTime,
  costForTwo,
  location,
  offers,
  image,
}) => {
  const costText = typeof costForTwo === "number" ? formatINR(costForTwo) : (costForTwo ? `₹${costForTwo}` : null);
  const ratingCls = ratingClass(stars);

  return (
    <article className="res-card" role="article" aria-label={resName || "Restaurant"}>
      {/* Media */}
      <div className="res-media">
        <img
          className="res-img"
          src={image}
          alt={resName ? `${resName} cover` : "Restaurant cover"}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image";
          }}
        />
        {offers ? (
          <span className="res-offer" aria-label={`Offer: ${offers}`}>
            {offers}
          </span>
        ) : null}
        <span className={`res-rating ${ratingCls}`} aria-label={`Rating ${stars || "not available"}`}>
          {stars ? `★ ${stars}` : "★ N/A"}
        </span>
      </div>

      {/* Info */}
      <div className="res-body">
        <h3 className="res-title" title={resName || ""}>
          {resName || "Unnamed Restaurant"}
        </h3>

        <p className="res-cuisine" title={cuisine || ""}>
          {cuisine || "Cuisine N/A"}
        </p>

        {/* Meta row */}
        <div className="res-meta" aria-label="Meta info">
          <span>{delTime || "—"}</span>
          <span className="dot" aria-hidden="true" />
          <span>{costText ? `${costText} for two` : "Cost N/A"}</span>
        </div>

        <p className="res-loc" title={location || ""}>
          {location || "Location N/A"}
        </p>

        {/* CTA hint (the whole card is wrapped by a Link in parent) */}
        <div className="res-cta" aria-hidden="true">
          View menu →
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;
