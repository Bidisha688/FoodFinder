import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  decrementQty,
  removeItemById,
  clearCart,
  selectCartTotal,
} from "../Utils/cartSlice";
import { Link } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);

  const hasItems = items.length > 0;

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
        {hasItems && (
          <button
            onClick={() => dispatch(clearCart())}
            className="inline-flex items-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 active:scale-[0.98]"
          >
            Clear Cart
          </button>
        )}
      </div>

      {!hasItems ? (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            Your cart is empty.
          </p>
          <Link
            to="/"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Browse restaurants
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4"
            >
              <img
                src={it.image}
                alt={it.name}
                className="h-16 w-16 rounded-xl object-cover ring-1 ring-black/5"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{it.name}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  ₹{Number(it.price || 0).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="h-8 w-8 grid place-items-center rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => dispatch(decrementQty(it.id))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2ch] text-center">{it.qty || 1}</span>
                <button
                  className="h-8 w-8 grid place-items-center rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() =>
                    dispatch(
                      addItem({
                        id: it.id,
                        name: it.name,
                        price: it.price,
                        image: it.image,
                      })
                    )
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className="ml-2 inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium
                           bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                onClick={() => dispatch(removeItemById(it.id))}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold">₹{total.toFixed(2)}</span>
          </div>

          <div className="flex justify-end">
            <button
              className="inline-flex items-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5
                         text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500"
              onClick={() => alert("Checkout coming soon!")}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
