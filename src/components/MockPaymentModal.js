import React, { useState } from "react";

export default function MockPaymentModal({ open, onClose, onSuccess }) {
  const [method, setMethod] = useState("card");
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [upi, setUpi] = useState("");

  if (!open) return null;

  const validCard = /^\d{16}$/.test(card.replace(/\s/g, ""));
  const validUpi = /^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upi);

  const nameOk = name.trim().length >= 3;

  const canPay =
    (method === "cod" && nameOk) ||
    (method === "card" && nameOk && validCard) ||
    (method === "upi" && nameOk && validUpi);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="bg-indigo-600 px-5 py-4 text-white">
          <h3 className="text-base font-semibold">Payment (Demo)</h3>
          <p className="text-xs opacity-80">No real payment is processed.</p>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <label className="mb-2 block text-sm font-medium">Payer Name</label>
          <input
            className="mb-4 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Arpon Roy"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="mb-3 flex gap-2">
            {["card", "upi", "cod"].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition
                  ${method === m
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {method === "card" && (
            <>
              <label className="mb-2 mt-2 block text-sm font-medium">Card Number</label>
              <input
                className="mb-2 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="1234 5678 9012 3456"
                value={card}
                onChange={(e) => setCard(e.target.value)}
              />
              <p className="text-xs text-zinc-500">Format check only; no real charge.</p>
            </>
          )}

          {method === "upi" && (
            <>
              <label className="mb-2 mt-2 block text-sm font-medium">UPI ID</label>
              <input
                className="mb-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="arpon@upi"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 bg-zinc-50 px-5 py-4 dark:bg-zinc-950">
          <button
            disabled={!canPay}
            onClick={() =>
              onSuccess({
                method,
                name,
                card: method === "card" ? card : null,
                upi: method === "upi" ? upi : null,
              })
            }
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm
                       transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Pay (Demo)
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition
                       hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
