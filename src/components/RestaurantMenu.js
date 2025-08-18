import { useParams, Link } from "react-router-dom";
import Shimmer from "./Shimmer";
import useRestaurantMenu from "../Utils/hooks/useRestaurantMenu";

export default function RestaurantMenu() {
  const { id } = useParams();
  const { loading, header, items, error } = useRestaurantMenu(id);

  if (loading) return <Shimmer count={8} />;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4"><Link to="/" className="text-sm text-indigo-600 hover:underline">← Back to list</Link></div>

      {error && (
        <div role="alert" className="mb-3 rounded-xl bg-red-50 text-red-700 ring-1 ring-red-200 px-4 py-2 text-sm">{error}</div>
      )}

      {header && (
        <div className="flex flex-col sm:flex-row gap-6 rounded-2xl ring-1 ring-black/5 shadow-sm p-5 bg-white dark:bg-zinc-900">
          {header.image && (
            <img className="h-40 w-full sm:w-56 object-cover rounded-xl" src={header.image} alt={header.name} onError={(e) => (e.currentTarget.style.display = "none")} />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{header.name}</h2>
            <p className="mt-1 text-sm"><strong>Rating:</strong> ⭐ {header.rating}</p>
            <p className="mt-1 text-sm"><strong>Cuisines:</strong> {header.cuisines}</p>
            <p className="mt-1 text-sm"><strong>Area:</strong> {header.area}</p>
            {header.costForTwoMessage && (
              <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{header.costForTwoMessage}</p>
            )}
          </div>
        </div>
      )}

      {Array.isArray(items) && items.length ? (
        <div className="mt-6 space-y-4">
          {items.map((it, idx) => (
            <div className="flex gap-4 items-start rounded-2xl ring-1 ring-black/5 shadow-sm p-4 bg-white dark:bg-zinc-900" key={`${it.id}-${idx}`}>
              <div className="flex-1">
                <h4 className="font-semibold">
                  {it.name} {it.veg ? "🟢" : "🔴"}
                </h4>
                {it.desc && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{it.desc}</p>}
                <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                  <span className="font-medium">{it.price > 0 ? `₹${it.price}` : "—"}</span>
                  {it.cat && <span className="text-zinc-400"> · {it.cat}</span>}
                </div>
              </div>
              {it.img && (
                <img className="h-24 w-24 rounded-xl object-cover" src={it.img} alt={it.name} onError={(e) => (e.currentTarget.style.display = "none")} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-zinc-500">No items found.</p>
      )}
    </div>
  );
}