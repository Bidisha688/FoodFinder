// src/components/RestaurantMenu.js
import { useParams, Link } from "react-router-dom";
import Shimmer from "./Shimmer";
import useRestaurantMenu from "../Utils/hooks/useRestaurantMenu";

export default function RestaurantMenu() {
  const { id } = useParams();
  const { loading, header, items, error } = useRestaurantMenu(id);

  if (loading) return <Shimmer />;

  return (
    <div className="menu-page">
      <div style={{ marginBottom: 16 }}>
        <Link to="/">← Back to list</Link>
      </div>

      {error && (
        <div className="inline-error" role="alert" style={{ marginBottom: 12 }}>
          {error}
        </div>
      )}

      {header && (
        <div className="menu-header">
          {header.image && (
            <img
              className="menu-header-img"
              src={header.image}
              alt={header.name}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <div className="menu-header-info">
            <h2>{header.name}</h2>
            <p>
              <strong>Rating:</strong> ⭐ {header.rating}
            </p>
            <p>
              <strong>Cuisines:</strong> {header.cuisines}
            </p>
            <p>
              <strong>Area:</strong> {header.area}
            </p>
            {header.costForTwoMessage && (
              <p>
                <strong>{header.costForTwoMessage}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {Array.isArray(items) && items.length ? (
        <div className="menu-items">
          {items.map((it, idx) => (
            <div className="menu-item" key={`${it.id}-${idx}`}>
              <div className="menu-item-info">
                <h4>
                  {it.name} {it.veg ? "🟢" : "🔴"}
                </h4>
                {it.desc && <p className="desc">{it.desc}</p>}
                <div className="meta">
                  <span className="price">
                    {it.price > 0 ? `₹${it.price}` : "—"}
                  </span>
                  {it.cat && <span className="category"> · {it.cat}</span>}
                </div>
              </div>
              {it.img && (
                <img
                  className="menu-item-img"
                  src={it.img}
                  alt={it.name}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}
