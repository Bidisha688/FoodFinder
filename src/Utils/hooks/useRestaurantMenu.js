import { useEffect, useState } from "react";

export default function useRestaurantMenu(id) {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchMenu() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=20.2961&lng=85.8245&restaurantId=${id}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();

        console.log("Menu JSON:", json);

        // Restaurant header
        const info =
          json?.data?.cards?.find((c) => c.card?.card?.info)?.card?.card?.info ||
          json?.data?.cards?.[0]?.card?.card?.info ||
          null;

        // Extract categories from REGULAR cards
        const regularCards =
          json?.data?.cards?.find((c) => c.groupedCard)?.groupedCard?.cardGroupMap?.REGULAR?.cards ||
          [];

        const menuCategories = regularCards
          .map((c) => c.card?.card)
          .filter((card) => card?.title && (card.itemCards || card.categories))
          .map((cat) => ({
            title: cat.title,
            items: (cat.itemCards || [])
              .map((ic) => ic.card?.info)
              .map((m) => ({
                id: m.id,
                name: m.name,
                price: (m.price ?? m.defaultPrice ?? 0) / 100,
                desc: m.description,
                veg: m.isVeg,
                img: m.imageId
                  ? `https://media-assets.swiggy.com/swiggy/image/upload/${m.imageId}`
                  : null,
                cat: m.category,
              })),
          }));

        // ✅ filter out empty categories
        const validCategories = menuCategories.filter((c) => c.items.length > 0);

        // set header
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

        setCategories(validCategories);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Menu fetch error:", err);
          setError(err.message || "Failed to fetch menu");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();

    return () => controller.abort();
  }, [id]);

  return { loading, header, categories, error };
}
