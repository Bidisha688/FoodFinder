// src/Utils/constants.js

// App Logo
export const logoLink =
  "https://i.ibb.co/GffngZLF/Chat-GPT-Image-Aug-15-2025-07-25-19-PM.png";

// Default Map Center
export const DEFAULT_CENTER =  { lat: 22.643667, lng: 88.454556 };

// Base URL for Swiggy API
// 👉 If you use a proxy (like in dev with Vite/CRA), swap SWIGGY_BASE to "/api/swiggy"
export const SWIGGY_BASE = "https://www.swiggy.com";

// API Endpoints
export const SWIGGY_RESTAURANTS_API =
  SWIGGY_BASE +
  "/dapi/restaurants/list/v5?lat=" +
  DEFAULT_CENTER.lat +
  "&lng=" +
  DEFAULT_CENTER.lng +
  "&page_type=DESKTOP_WEB_LISTING";

export const SWIGGY_MENU_API =
  SWIGGY_BASE +
  "/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=" +
  DEFAULT_CENTER.lat +
  "&lng=" +
  DEFAULT_CENTER.lng +
  "&restaurantId=";
