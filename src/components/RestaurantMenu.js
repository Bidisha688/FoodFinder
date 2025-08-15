// RestaurantMenu.jsx (updated: de-dupe + safe keys)
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Shimmer from "./Shimmer";

const DEFAULT_CENTER = { lat: 20.1541, lng: 85.7087 };

export default function RestaurantMenu() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getLocation = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(DEFAULT_CENTER);
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve(DEFAULT_CENTER),
          { timeout: 3000 }
        );
      });

    (async () => {
      setLoading(true);
      try {
        const loc = await getLocation();
        const url =
          `https://www.swiggy.com/dapi/menu/pl` +
          `?page-type=REGULAR_MENU&complete-menu=true` +
          `&lat=${loc.lat}&lng=${loc.lng}` +
          `&restaurantId=${id}`;

        const res = await fetch(url);
        const json = await res.json();

        // Header info
        const infoCard = json?.data?.cards?.find(
          (c) => c?.card?.card?.name === "Restaurant" && c?.card?.card?.info
        )?.card?.card?.info;

        setHeader(
          infoCard
            ? {
                name: infoCard.name,
                rating: infoCard.avgRatingString || infoCard.avgRating || "N/A",
                cuisines: (infoCard.cuisines || []).join(", "),
                area: infoCard.areaName || infoCard.locality || "",
                costForTwoMessage: infoCard.costForTwoMessage || "",
                image: infoCard.cloudinaryImageId
                  ? `https://media-assets.swiggy.com/swiggy/image/upload/${infoCard.cloudinaryImageId}`
                  : null,
              }
            : null
        );

        // Items (flat list) — de-duped by item.id
        const regCards =
          json?.data?.cards?.find((c) => c.groupedCard)?.groupedCard
            ?.cardGroupMap?.REGULAR?.cards || [];

        const flatItems = [];
        const seenItemIds = new Set();

        for (const c of regCards) {
          const card = c?.card?.card;
          if (!card) continue;

          // primary items
          const itemCards = card?.itemCards || [];
          for (const ic of itemCards) {
            const info = ic?.card?.info;
            if (!info?.id || !info?.name) continue;
            if (seenItemIds.has(info.id)) continue;
            seenItemIds.add(info.id);

            flatItems.push({
              id: info.id,
              name: info.name,
              price:
                info.price != null
                  ? Math.round(info.price / 100)
                  : info.defaultPrice != null
                  ? Math.round(info.defaultPrice / 100)
                  : null,
              desc: info.description || "",
              veg: info.isVeg === 1 || info?.itemAttribute?.vegClassifier === "VEG",
              img: info.imageId
                ? `https://media-assets.swiggy.com/swiggy/image/upload/${info.imageId}`
                : null,
              cat: card?.title || "",
            });
          }

          // some menus put dishes in "carousel" too — include but de-dupe by id
          const carousel = card?.carousel || [];
          for (const ic of carousel) {
            const info = ic?.dish?.info || ic?.card?.info || ic?.info;
            if (!info?.id || !info?.name) continue;
            if (seenItemIds.has(info.id)) continue;
            seenItemIds.add(info.id);

            flatItems.push({
              id: info.id,
              name: info.name,
              price:
                info.price != null
                  ? Math.round(info.price / 100)
                  : info.defaultPrice != null
                  ? Math.round(info.defaultPrice / 100)
                  : null,
              desc: info.description || "",
              veg: info.isVeg === 1 || info?.itemAttribute?.vegClassifier === "VEG",
              img: info.imageId
                ? `https://media-assets.swiggy.com/swiggy/image/upload/${info.imageId}`
                : null,
              cat: card?.title || "",
            });
          }
        }

        setItems(flatItems);
      } catch (e) {
        console.error("Menu fetch failed:", e);
        setHeader(null);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Shimmer />;

  return (
    <div className="menu-page">
      <div style={{ marginBottom: 16 }}>
        <Link to="/">← Back to list</Link>
      </div>

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
            <p><strong>Rating:</strong> ⭐ {header.rating}</p>
            <p><strong>Cuisines:</strong> {header.cuisines}</p>
            <p><strong>Area:</strong> {header.area}</p>
            {header.costForTwoMessage && <p><strong>{header.costForTwoMessage}</strong></p>}
          </div>
        </div>
      )}

      {items.length ? (
        <div className="menu-items">
          {items.map((it, idx) => (
            <div className="menu-item" key={`${it.id}-${idx}`}>
              <div className="menu-item-info">
                <h4>
                  {it.name} {it.veg ? "🟢" : "🔴"}
                </h4>
                {it.desc && <p className="desc">{it.desc}</p>}
                <div className="meta">
                  <span className="price">{it.price != null ? `₹${it.price}` : "—"}</span>
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
