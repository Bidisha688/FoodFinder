// src/Utils/swiggyClient.js
// PURE UTILS — do not import React or use hooks here
import { SWIGGY_BASE } from "./constants";

// Build URL for list endpoint
export function buildListURL({ lat, lng, offset }) {
  const u = new URL(`${SWIGGY_BASE}/dapi/restaurants/list/v5`);
  u.searchParams.set("lat", String(lat));
  u.searchParams.set("lng", String(lng));
  u.searchParams.set("page_type", "DESKTOP_WEB_LISTING");
  // Some deployments use different param names; we don't *need* both,
  // but keeping both helps with A/B variants:
  if (offset) {
    u.searchParams.set("page_offset", String(offset));
    u.searchParams.set("pageOffset", String(offset));
  }
  return u.toString();
}

export async function fetchRestaurants({ lat, lng, offset = null, signal } = {}) {
  const url = buildListURL({ lat, lng, offset });
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function getNextOffset(json) {
  // Support multiple server variants
  return (
    json?.data?.pageParams?.nextOffset ??
    json?.data?.pageOffset?.nextOffset ??
    json?.data?.pageOffsetWidget?.nextOffset ??
    null
  );
}
