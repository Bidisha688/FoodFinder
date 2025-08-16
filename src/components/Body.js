// Body.jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import RestaurantCard from "./ResturantCard"; // ✅ fixed spelling/case
import Shimmer from "./Shimmer";
import useRestaurants from "../Utils/hooks/useRestaurants";
import useOnlineStatus from "../Utils/hooks/useOnlineStatus";
import OfflineUI from "./OfflineUI";

import SortControl from "./SortControl";
import { getSorted } from "../Utils/sorters";

export default function Body() {
  const isOnline = useOnlineStatus();
  const {
    list,
    allList,
    loading,
    loadingMore,
    nextOffset,
    loadMoreNearby,
    setList,
    error,
  } = useRestaurants();

  const searchRef = useRef();

  const handleSearch = () => {
    const query = (searchRef.current?.value || "").trim().toLowerCase();
    if (!query) return setList(allList);
    setList(
      allList.filter((r) => (r.resName || "").toLowerCase().includes(query))
    );
  };

  const handleTopRated = () => setList(getSorted(allList, "rating_desc"));

  const handleSort = (key) => {
    if (key === "relevance") setList(allList);
    else setList(getSorted(allList, key));
  };

  // Offline → show retry UI (refresh only)
  if (!isOnline) return <OfflineUI onRetry={() => window.location.reload()} />;

  return (
    <div className="body">
      {error && (
        <div className="inline-error" role="alert" style={{ marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* ===== Controls ===== */}
      <div className="controls" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          ref={searchRef}
          type="text"
          placeholder="Search restaurants..."
          className="search-box"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          disabled={loading}
        />
        <button onClick={handleSearch} className="search-btn" disabled={loading}>
          Search
        </button>
        <button onClick={handleTopRated} className="filter-btn" disabled={loading}>
          ⭐ Top Rated
        </button>
        <button onClick={() => setList(allList)} className="filter-btn" disabled={loading}>
          🔄 Reset
        </button>

        <SortControl disabled={loading} onSort={handleSort} />
      </div>

      {/* ===== Restaurant Cards / Shimmer ===== */}
      <div className="res-container">
        {loading && allList.length === 0 ? (
          // Inline shimmer (NOT fullscreen) only in the cards space
          <Shimmer />
        ) : list.length ? (
          list.map((r) => (
            <Link
              key={r.id}
              to={`/restaurant/${r.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <RestaurantCard {...r} />
            </Link>
          ))
        ) : (
          <p className="empty-state">
            🚫 No restaurants found. Try adjusting filters or search again.
          </p>
        )}
      </div>

      {/* ===== Load More / Explore ===== */}
      {allList.length > 0 && !loading && (
        <div style={{ textAlign: "center", margin: "24px 0 48px" }}>
          {nextOffset ? (
            <button
              className="load-more-btn"
              onClick={loadMoreNearby}
              disabled={loadingMore || !isOnline}
              aria-disabled={loadingMore || !isOnline}
            >
              {loadingMore ? "⏳ Loading..." : "Load more nearby"}
            </button>
          ) : (
            <>
              <button
                className="load-more-btn"
                onClick={loadMoreNearby}
                disabled={loadingMore || !isOnline}
                aria-disabled={loadingMore || !isOnline}
              >
                {loadingMore ? "⏳ Loading..." : "Explore farther"}
              </button>
              {!loadingMore && (
                <p style={{ marginTop: 8, color: "#888" }}>
                  Tip: click once to explore a wider area.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
