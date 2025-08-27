import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ThankYou() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const order = state; // could also read from localStorage by id as a fallback

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Thank you! 🎉</h1>
      <p className="mb-4 text-sm text-zinc-500">Order ID: {id}</p>

      {order && (
        <div className="mb-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="mb-2 font-semibold">Summary</h2>
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span>
                {it.name} × {it.qty || 1}
              </span>
              <span>₹{(it.price * (it.qty || 1)).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-3 font-semibold">
            <span>Total</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => window.print()}
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Print / Save PDF
        </button>

        <button
          onClick={() => navigator.clipboard.writeText(id)}
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Copy Order ID
        </button>

        {"share" in navigator && (
          <button
            className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={() =>
              navigator.share({
                title: "FoodFinder Order",
                text: `Order ${id} placed!`,
                url: location.href,
              })
            }
          >
            Share
          </button>
        )}

        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
