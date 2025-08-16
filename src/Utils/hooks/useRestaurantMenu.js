// src/Utils/hooks/useRestaurantMenu.js
import { useEffect, useState } from "react";

export default function useRestaurantMenu(id) {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=20.2961&lng=85.8245&restaurantId=${id}`
        );
        const json = await res.json();

        console.log("Menu JSON:", json);

        const info =
          json?.data?.cards?.find((c) => c.card?.card?.info)?.card?.card?.info ||
          json?.data?.cards?.[0]?.card?.card?.info ||
          null;

        const regularCards =
          json?.data?.cards?.find((c) => c.groupedCard)?.groupedCard?.cardGroupMap?.REGULAR?.cards ||
          [];

        let menuItems = regularCards.flatMap((c) => {
          if (c.card?.card?.itemCards) {
            return c.card.card.itemCards.map((ic) => ic.card?.info);
          } else if (c.card?.card?.categories) {
            return c.card.card.categories.flatMap(
              (cat) => cat.itemCards?.map((ic) => ic.card?.info) || []
            );
          }
          return [];
        });

        // ✅ Deduplicate menu items by id
        const seen = new Set();
        menuItems = menuItems.filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });

        setHeader({
          name: info?.name,
          rating: info?.avgRating,
          cuisines: info?.cuisines?.join(", "),
          area: info?.areaName,
          costForTwoMessage: info?.costForTwoMessage,
          image: info?.cloudinaryImageId
            ? `https://media-assets.swiggy.com/swiggy/image/upload/${info.cloudinaryImageId}`
            : null,
        });

        setItems(
          menuItems.map((m) => ({
            id: m.id,
            name: m.name,
            price: (m.price ?? m.defaultPrice ?? 0) / 100,
            desc: m.description,
            veg: m.isVeg,
            img: m.imageId
              ? `https://media-assets.swiggy.com/swiggy/image/upload/${m.imageId}`
              : null,
            cat: m.category,
          }))
        );
      } catch (err) {
        setError("Failed to fetch menu");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchMenu();
  }, [id]);

  return { loading, header, items, error };
}
