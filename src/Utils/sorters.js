// src/Utils/sorters.js

// Helpers to parse different fields safely -----------------
function parseDeliveryMins(delTime) {
    // Examples: "20–25 mins", "25 mins", "20-30 min"
    if (!delTime) return Infinity;
    const m = String(delTime).match(/\d+/g);
    if (!m || !m.length) return Infinity;
    // use the first number as the optimistic delivery time
    return parseInt(m[0], 10);
  }
  
  function parseKm(distance) {
    // Examples: "3.2 km", "0.9 km"
    if (typeof distance === "number" && isFinite(distance)) return distance;
    if (!distance) return Infinity;
    const n = Number(String(distance).replace(/[^\d.]/g, ""));
    return isFinite(n) ? n : Infinity;
  }
  
  function parseCost(costForTwoNum, costForTwoText) {
    // Prefer the numeric (rupees) your parser provides
    if (typeof costForTwoNum === "number" && isFinite(costForTwoNum)) {
      return costForTwoNum;
    }
    if (!costForTwoText) return Infinity;
    // Fallback: extract number from "₹300 for two"
    const n = Number(String(costForTwoText).replace(/[^\d]/g, ""));
    return isFinite(n) ? n : Infinity;
  }
  
  function parseRating(stars) {
    const n = Number(stars);
    return isFinite(n) ? n : -Infinity; // so missing ratings sink to bottom on desc
  }
  
  // Sorters (do not mutate original array) -------------------
  export function sortByRating(list, desc = true) {
    const copy = [...list];
    copy.sort((a, b) => {
      const ra = parseRating(a.stars);
      const rb = parseRating(b.stars);
      return desc ? rb - ra : ra - rb;
    });
    return copy;
  }
  
  export function sortByDelivery(list) {
    const copy = [...list];
    copy.sort((a, b) => {
      const da = parseDeliveryMins(a.delTime);
      const db = parseDeliveryMins(b.delTime);
      return da - db; // ascending (fastest first)
    });
    return copy;
  }
  
  export function sortByDistance(list) {
    const copy = [...list];
    copy.sort((a, b) => {
      const da = parseKm(a.distance);
      const db = parseKm(b.distance);
      return da - db; // ascending (nearest first)
    });
    return copy;
  }
  
  export function sortByCost(list, asc = true) {
    const copy = [...list];
    copy.sort((a, b) => {
      const ca = parseCost(a.costForTwoNum, a.costForTwo);
      const cb = parseCost(b.costForTwoNum, b.costForTwo);
      return asc ? ca - cb : cb - ca;
    });
    return copy;
  }
  
  // One-stop API if you prefer keys
  export function getSorted(list, key) {
    switch (key) {
      case "rating_desc": return sortByRating(list, true);
      case "rating_asc":  return sortByRating(list, false);
      case "delivery":    return sortByDelivery(list);
      case "distance":    return sortByDistance(list);
      case "cost_asc":    return sortByCost(list, true);
      case "cost_desc":   return sortByCost(list, false);
      default:            return [...list]; // relevance (original order)
    }
  }
  