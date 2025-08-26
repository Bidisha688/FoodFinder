import { useRef } from "react";
import { Link } from "react-router-dom";
import RestaurantCard from "./ResturantCard";
import Shimmer from "./Shimmer";
import useRestaurants from "../Utils/hooks/useRestaurants";
import useOnlineStatus from "../Utils/hooks/useOnlineStatus";
import OfflineUI from "./OfflineUI";
import SortControl from "./SortControl";
import { getSorted } from "../Utils/sorters";
import withOfferBadge from "./withOfferBadge"; // ✅ only offer HOC

const CardWithOffer = withOfferBadge(RestaurantCard);

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
      allList.filter((r) =>
        (r.resName || "").toLowerCase().includes(query)
      )
    );
  };

  const handleTopRated = () => setList(getSorted(allList, "rating_desc"));
  const handleSort = (key) =>
    setList(key === "relevance" ? allList : getSorted(allList, key));

  if (!isOnline)
    return <OfflineUI onRetry={() => window.location.reload()} />;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div
          role="alert"
          className="mb-3 rounded-xl bg-red-50 text-red-700 ring-1 ring-red-200 px-4 py-2 text-sm"
        >
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search restaurants..."
          className="block w-full sm:w-80 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
        >
          Search
        </button>
        <button
          onClick={handleTopRated}
          disabled={loading}
          className="inline-flex items-center rounded-xl bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-200 dark:ring-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
        >
          ⭐ Top Rated
        </button>
        <button
          onClick={() => setList(allList)}
          disabled={loading}
          className="inline-flex items-center rounded-xl bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-200 dark:ring-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
        >
          🔄 Reset
        </button>

        <SortControl disabled={loading} onSort={handleSort} />
      </div>

      {/* Cards / Shimmer */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <Shimmer count={12} />
        ) : list.length ? (
          list.map((r) => (
            <Link
              key={r.id}
              to={`/restaurant/${r.id}`}
              className="group block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl"
            >
              <CardWithOffer {...r} />
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-sm text-zinc-500">
            🚫 No restaurants found. Try adjusting filters or search again.
          </p>
        )}

        {loadingMore && !loading && <Shimmer count={4} />}
      </div>

      {/* Load More / Explore */}
      {allList.length > 0 && !loading && (
        <div className="text-center my-6">
          {nextOffset ? (
            <button
              className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
              onClick={loadMoreNearby}
              disabled={loadingMore || !isOnline}
              aria-disabled={loadingMore || !isOnline}
            >
              {loadingMore ? "⏳ Loading..." : "Load more nearby"}
            </button>
          ) : (
            <>
              <button
                className="inline-flex items-center rounded-xl bg-white dark:bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-200 dark:ring-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
                onClick={loadMoreNearby}
                disabled={loadingMore || !isOnline}
                aria-disabled={loadingMore || !isOnline}
              >
                {loadingMore ? "⏳ Loading..." : "Explore farther"}
              </button>
              {!loadingMore && (
                <p className="mt-2 text-xs text-zinc-500">
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
