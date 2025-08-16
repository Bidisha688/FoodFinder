// src/hooks/useRatingClass.js
export default function useRatingClass(stars) {
    const n = parseFloat(stars);
    if (Number.isNaN(n)) return "rating-unknown";
    if (n >= 4.5) return "rating-great";
    if (n >= 4.0) return "rating-good";
    if (n >= 3.0) return "rating-ok";
    return "rating-low";
  }
  