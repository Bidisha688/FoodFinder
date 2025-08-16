// src/Utils/parseRestaurantMenu.js
export default function parseRestaurants(json) {
  const cards = json?.data?.cards || [];

  const infos = cards
    .map((c) => c?.card?.card?.gridElements?.infoWithStyle?.restaurants || [])
    .flat()
    .map((r) => r?.info)
    .filter(Boolean);

  return infos.map((info, idx) => {
    const msg1 = (info?.cfo?.text || "").trim();
    const msg2 = (info?.costForTwoMessage || "").trim();

    const rawNumParsed =
      typeof info?.costForTwo === "number"
        ? info.costForTwo
        : typeof info?.costForTwo === "string"
        ? parseInt(info.costForTwo.replace(/[^\d]/g, ""), 10)
        : null;

    let costForTwoNum = Number.isFinite(rawNumParsed)
      ? rawNumParsed >= 1000
        ? Math.round(rawNumParsed / 100)
        : rawNumParsed
      : null;

    const costForTwoText =
      msg1 ||
      msg2 ||
      (typeof costForTwoNum === "number" ? `₹${costForTwoNum} for two` : null);

    const distanceText =
      info?.sla?.lastMileTravelString ||
      (Number.isFinite(info?.sla?.lastMileTravel)
        ? `${Number(info.sla.lastMileTravel).toFixed(1)} km`
        : null);

    return {
      id: info.id || `res-${idx}`, // ✅ fallback to ensure uniqueness
      resName: info.name,
      cuisine: Array.isArray(info.cuisines)
        ? info.cuisines.join(", ")
        : info.cuisines || "",
      stars: info.avgRatingString ?? info.avgRating ?? "",
      delTime: info.sla?.slaString || "",
      distance: distanceText,
      distanceNum: Number.isFinite(info?.sla?.lastMileTravel)
        ? Number(info.sla.lastMileTravel)
        : null,
      costForTwo: costForTwoText,
      costForTwoNum,
      location: info.areaName || info.locality || "",
      offers: info.aggregatedDiscountInfoV3?.header
        ? `${info.aggregatedDiscountInfoV3.header} ${
            info.aggregatedDiscountInfoV3.subHeader ?? ""
          }`.trim()
        : null,
      image: info.cloudinaryImageId
        ? `https://media-assets.swiggy.com/swiggy/image/upload/${info.cloudinaryImageId}`
        : null,
    };
  });
}
