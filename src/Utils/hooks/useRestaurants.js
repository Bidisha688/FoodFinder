// src/Utils/hooks/useRestaurants.js
import { useCallback, useEffect, useRef, useState } from "react";
import useOnlineStatus from "./useOnlineStatus";
import useGeoCenter from "./useGeoCenter";
import parseRestaurants from "../parseRestaurantMenu"; // ✅ FIX: correct parser for list page
import { fetchRestaurants, getNextOffset } from "../swiggyClient";

export default function useRestaurants() {
  const isOnline = useOnlineStatus();
  const center = useGeoCenter(isOnline);

  const [list, setList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);
  const [error, setError] = useState(null);

  const seenIds = useRef(new Set());
  const ring = useRef(1);
  const dir = useRef(0);
  const fetchCtrl = useRef(null);

  // pagination tracking to avoid loops / stale first click
  const prevOffsetRef = useRef(null);
  const nextOffsetRef = useRef(null);
  useEffect(() => { nextOffsetRef.current = nextOffset; }, [nextOffset]);

  const actuallyOnline = () => isOnline && navigator.onLine;
  const abortInFlight = () => { try { fetchCtrl.current?.abort(); } catch {} fetchCtrl.current = null; };

  // returns count of NEW items appended
  const load = useCallback(
    async ({ lat, lng, offset = null, more = false } = {}) => {
      if (!actuallyOnline()) { setError("You are offline"); return 0; }

      const useLat = typeof lat === "number" ? lat : center.lat;
      const useLng = typeof lng === "number" ? lng : center.lng;

      more ? setLoadingMore(true) : setLoading(true);
      setError(null);

      abortInFlight();
      fetchCtrl.current = new AbortController();

      try {
        const json = await fetchRestaurants({
          lat: useLat,
          lng: useLng,
          offset,
          signal: fetchCtrl.current.signal,
        });

        const parsed = Array.isArray(parseRestaurants(json)) ? parseRestaurants(json) : [];
        const batch = parsed.filter((x) => {
          if (!x?.id) return false;
          if (seenIds.current.has(x.id)) return false;
          seenIds.current.add(x.id);
          return true;
        });

        if (more) {
          setAllList((p) => [...p, ...batch]);
          setList((p) => [...p, ...batch]);
        } else {
          setAllList(batch);
          setList(batch);
        }

        // Robust nextOffset handling + sync ref update
        const incoming =
          getNextOffset(json) ??
          json?.data?.pageParams?.nextOffset ??
          json?.data?.pageOffset?.nextOffset ??
          json?.data?.pageOffsetWidget?.nextOffset ??
          null;

        const normalized = incoming ?? null;
        if (normalized && normalized === nextOffsetRef.current) {
          setNextOffset(null);
          nextOffsetRef.current = null;
        } else {
          setNextOffset(normalized);
          nextOffsetRef.current = normalized; // keep ref in sync for immediate next click
        }

        return batch.length;
      } catch (e) {
        if (e?.name !== "AbortError" && navigator.onLine) {
          // Avoid Parcel dev overlay for handled errors
          // eslint-disable-next-line no-console
          console.warn("[restaurants] fetch failed:", e?.message || e);
        }
        if (e?.name !== "AbortError") {
          setError(navigator.onLine ? (e.message || "Failed to load restaurants") : "You are offline");
        }
        return 0;
      } finally {
        more ? setLoadingMore(false) : setLoading(false);
        fetchCtrl.current = null;
      }
    },
    [center.lat, center.lng, isOnline]
  );

  const expandAndLoad = useCallback(async () => {
    if (!actuallyOnline()) { setError("You are offline"); return 0; }
    if (++dir.current > 3) { dir.current = 0; ring.current += 1; }
    const step = 0.06 * ring.current;
    const d = [
      { dx: +step, dy: 0 },
      { dx: -step, dy: 0 },
      { dx: 0, dy: +step },
      { dx: 0, dy: -step },
    ][dir.current];
    return load({ lat: center.lat + d.dy, lng: center.lng + d.dx, more: true });
  }, [center.lat, center.lng, load]);

  // One-click loader with fallback (page → expand), skips while initial load is busy
  const loadMoreNearby = useCallback(async () => {
    if (loading || loadingMore) return;      // don’t race initial load
    if (!actuallyOnline()) { setError("You are offline"); return; }

    let attempts = 0;
    let added = 0;

    while (attempts < 3 && added === 0) {
      attempts += 1;

      if (nextOffsetRef.current) {
        if (prevOffsetRef.current === nextOffsetRef.current) {
          added += (await expandAndLoad()) || 0;
          continue;
        }
        prevOffsetRef.current = nextOffsetRef.current;

        const pageAdded = await load({ offset: nextOffsetRef.current, more: true });
        added += pageAdded || 0;

        if (pageAdded === 0) {
          setNextOffset(null);
          nextOffsetRef.current = null;
          added += (await expandAndLoad()) || 0;
        }
      } else {
        added += (await expandAndLoad()) || 0;
      }
    }
  }, [expandAndLoad, load, loading, loadingMore, isOnline]);

  // Initial / online transition
  useEffect(() => {
    if (!actuallyOnline()) {
      setError("You are offline");
      abortInFlight();
      setLoading(false);
      return;
    }
    seenIds.current.clear();
    load({ lat: center.lat, lng: center.lng, more: false });
    return abortInFlight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, center.lat, center.lng]);

  return {
    list,
    allList,
    loading,
    loadingMore,
    nextOffset,
    load,
    expandAndLoad,
    loadMoreNearby,
    setList,
    error,
    center,
    isOnline,
  };
}
