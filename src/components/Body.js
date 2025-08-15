// Body.jsx (compact + search + top-rated) — fixed costForTwo parsing
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RestaurantCard from "./ResturantCard";
import Shimmer from "./Shimmer";

const DEFAULT_CENTER = { lat: 20.1541, lng: 85.7087 };

export default function Body() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [list, setList] = useState([]);            // displayed list (can be filtered)
  const [allList, setAllList] = useState([]);      // master list (all fetched so far)
  const [searchText, setSearchText] = useState("");
  const [nextOffset, setNextOffset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const seenIds = useRef(new Set());
  const ring = useRef(0);  // expand radius step
  const dir = useRef(0);   // 0:+x,1:-x,2:+y,3:-y

  useEffect(() => {
    const getLoc = () =>
      new Promise((ok) => {
        if (!navigator.geolocation) return ok(DEFAULT_CENTER);
        navigator.geolocation.getCurrentPosition(
          (p) => ok({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => ok(DEFAULT_CENTER),
          { timeout: 4000 }
        );
      });

    (async () => {
      const loc = await getLoc();
      setCenter(loc);
      seenIds.current.clear();
      await load(loc.lat, loc.lng, null, false);
    })();
  }, []);

  const parseList = (json) => {
    const cards = json?.data?.cards || [];
    const grid = cards.find(
      (c) =>
        c?.card?.card?.id === "restaurant_grid_listing" ||
        c?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    const arr = grid?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];
    return arr
      .map((r) => {
        const i = r.info || {};
        if (!i?.id) return null;

        // --- Robust Cost Parser ---
        const rawCost =
          i.costForTwoMessage ??
          i.costForTwo ??
          i.costForTwoString ??
          "";
        const digits = String(rawCost).replace(/\D/g, "");
        const costForTwo =
          digits && Number.isFinite(parseInt(digits, 10))
            ? parseInt(digits, 10)
            : null;

        return {
          id: String(i.id),
          resName: i.name,
          cuisine: (i.cuisines || []).join(", "),
          stars: i.avgRatingString || i.avgRating || "N/A",
          delTime:
            i.sla?.slaString ||
            (i.sla?.deliveryTime ? `${i.sla.deliveryTime} mins` : "—"),
          costForTwo, // number or null
          location: i.locality || i.areaName || "",
          image: i.cloudinaryImageId
            ? `https://media-assets.swiggy.com/swiggy/image/upload/${i.cloudinaryImageId}`
            : "https://via.placeholder.com/300x200?text=No+Image",
        };
      })
      .filter(Boolean);
  };

  const load = async (lat, lng, offset, more) => {
    more ? setLoadingMore(true) : setLoading(true);
    try {
      let url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
      if (offset)
        url += `&page_offset=${encodeURIComponent(offset)}&pageOffset=${encodeURIComponent(offset)}`;

      const res = await fetch(url);
      const json = await res.json();

      const batch = parseList(json).filter((x) => {
        if (seenIds.current.has(x.id)) return false;
        seenIds.current.add(x.id);
        return true;
      });

      if (more) {
        setAllList((prev) => [...prev, ...batch]);
        setList((prev) => [...prev, ...batch]);
      } else {
        setAllList(batch);
        setList(batch);
      }

      const next =
        json?.data?.pageOffset?.nextOffset ??
        json?.data?.pageOffsetWidget?.nextOffset ??
        null;
      setNextOffset(next);

      // if we didn’t get anything new or no next page → expand area and try again
      if ((batch.length === 0 || !next) && more !== false) {
        await expandAndLoad();
      }
    } catch (e) {
      console.error("fetch failed", e);
      if (more !== false) await expandAndLoad();
    } finally {
      more ? setLoadingMore(false) : setLoading(false);
    }
  };

  const expandAndLoad = async () => {
    // spiral-ish: grow ring, rotate direction
    if (++dir.current > 3) { dir.current = 0; ring.current += 1; }
    const step = 0.06 * ring.current; // ~6–7 km per step
    const d = [
      { dx: +step, dy: 0 },
      { dx: -step, dy: 0 },
      { dx: 0, dy: +step },
      { dx: 0, dy: -step },
    ][dir.current];
    const lat = +(center.lat + d.dy).toFixed(6);
    const lng = +(center.lng + d.dx).toFixed(6);
    await load(lat, lng, null, true);
  };

  // ---------- Filters ----------
  const handleSearch = () => {
    const q = searchText.trim().toLowerCase();
    if (!q) return setList(allList);
    setList(allList.filter((r) => (r.resName || "").toLowerCase().includes(q)));
  };

  const handleTopRated = () => {
    setList(allList.filter((r) => parseFloat(r.stars) > 4.5));
  };

  if (loading && list.length === 0) return <Shimmer />;

  return (
    <div className="body">
      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="search-box"
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
        <button className="filter-btn" onClick={handleTopRated}>Top Rated</button>
        <button className="filter-btn" onClick={() => setList(allList)}>Reset</button>
      </div>

      {/* Cards */}
      <div className="res-container">
        {list.length ? (
          list.map((r) => (
            <Link key={r.id} to={`/restaurant/${r.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <RestaurantCard {...r} />
            </Link>
          ))
        ) : (
          <p>No restaurants found</p>
        )}
      </div>

      {/* Load more / Expand */}
      <div style={{ textAlign: "center", margin: "24px 0 48px" }}>
        {nextOffset ? (
          <button className="load-more-btn" onClick={() => load(center.lat, center.lng, nextOffset, true)} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load more nearby"}
          </button>
        ) : (
          <button className="load-more-btn" onClick={expandAndLoad} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Explore farther"}
          </button>
        )}
      </div>
    </div>
  );
}
