// src/hooks/useFormatINR.js
export default function useFormatINR(value) {
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
  