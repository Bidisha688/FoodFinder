import { useCallback, useEffect, useRef, useState } from "react";
import useOnlineStatus from "./useOnlineStatus";
import useGeoCenter from "./useGeoCenter";
import parseRestaurants from "../parseRestaurantMenu";
import { fetchRestaurants, getNextOffset } from "../swiggyClient";

const isNum = (v) => Number.isFinite(v);

export default function useRestaurants() {
  const isOnline = useOnlineStatus();
  const center = useGeoCenter(isOnline); // may be {lat: undefined, lng: undefined} initially

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

  const prevOffsetRef = useRef(null);
  const nextOffsetRef = useRef(null);
  useEffect(() => {
    nextOffsetRef.current = nextOffset;
  }, [nextOffset]);

  const actuallyOnline = () => isOnline && navigator.onLine;

  const abortInFlight = () => {
    try {
      fetchCtrl.current?.abort();
    } catch (err) {
      console.error("Abort failed:", err);
    }
    fetchCtrl.current = null;
  };

  const load = useCallback(
    async ({ lat, lng, offset = null, more = false } = {}) => {
      if (!actuallyOnline()) {
        setError("You are offline");
        return 0;
      }

      let useLat = isNum(lat) ? lat : center.lat;
      let useLng = isNum(lng) ? lng : center.lng;

      // 🔒 Fallback: try navigator.geolocation if center is not ready
      if (!isNum(useLat) || !isNum(useLng)) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          });
          useLat = pos.coords.latitude;
          useLng = pos.coords.longitude;
        } catch (geoErr) {
          console.error("Geolocation error:", geoErr);
          setError("Unable to access location. Please enable location services.");
          return 0;
        }
      }

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

        const parsedArr = Array.isArray(parseRestaurants(json))
          ? parseRestaurants(json)
          : [];

        const batch = parsedArr.filter((x) => {
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
          nextOffsetRef.current = normalized;
        }

        return batch.length;
      } catch (e) {
        if (e?.name !== "AbortError" && navigator.onLine) {
          console.warn("[restaurants] fetch failed:", e?.message || e);
        }
        if (e?.name !== "AbortError") {
          setError(
            navigator.onLine
              ? e.message || "Failed to load restaurants"
              : "You are offline"
          );
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
    if (!actuallyOnline()) {
      setError("You are offline");
      return 0;
    }
    if (!isNum(center.lat) || !isNum(center.lng)) return 0;

    if (++dir.current > 3) {
      dir.current = 0;
      ring.current += 1;
    }
    const step = 0.06 * ring.current;
    const d = [
      { dx: +step, dy: 0 },
      { dx: -step, dy: 0 },
      { dx: 0, dy: +step },
      { dx: 0, dy: -step },
    ][dir.current];

    return load({
      lat: center.lat + d.dy,
      lng: center.lng + d.dx,
      more: true,
    });
  }, [center.lat, center.lng, load]);

  const loadMoreNearby = useCallback(async () => {
    if (loading || loadingMore) return;
    if (!actuallyOnline()) {
      setError("You are offline");
      return;
    }
    if (!isNum(center.lat) || !isNum(center.lng)) return;

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

        const pageAdded = await load({
          offset: nextOffsetRef.current,
          more: true,
        });
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
  }, [
    expandAndLoad,
    load,
    loading,
    loadingMore,
    isOnline,
    center.lat,
    center.lng,
  ]);

  // Initial / on-line transition
  useEffect(() => {
    if (!actuallyOnline()) {
      setError("You are offline");
      abortInFlight();
      setLoading(false);
      return;
    }

    // 🧭 Wait for geo center; keep shimmer on
    if (!isNum(center.lat) || !isNum(center.lng)) {
      setLoading(true);
      return;
    }

    console.log("[restaurants] geo center ready:", center.lat, center.lng);

    seenIds.current.clear();
    load({ lat: center.lat, lng: center.lng, more: false });

    return abortInFlight;
  }, [isOnline, center.lat, center.lng, load]);

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
