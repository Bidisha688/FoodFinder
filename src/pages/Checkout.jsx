import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartTotal, clearCart } from "../Utils/cartSlice";
import { addOrder, hydrateOrders } from "../Utils/ordersSlice";
import { saveOrder, loadOrders } from "../Utils/orderStorage";
import MockPaymentModal from "../components/MockPaymentModal";
import { useNavigate } from "react-router-dom";

const makeOrderId = () => `ORD-${Date.now()}`;

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const [openPay, setOpenPay] = useState(false);

  useEffect(() => {
    dispatch(hydrateOrders(loadOrders()));
  }, [dispatch]);

  const [addr, setAddr] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    pin: "",
  });

  // India-friendly phone check: 10 digits, optional 0/+91 prefix
  const phoneOk = /^(?:\+?91[-\s]?)?[0]?\d{10}$/.test(addr.phone.trim());
  const pinOk = /^\d{6}$/.test(addr.pin.trim());
  const valid = useMemo(
    () =>
      addr.name.trim().length >= 3 &&
      phoneOk &&
      addr.line1.trim().length >= 5 &&
      addr.city.trim().length >= 2 &&
      pinOk,
    [addr, phoneOk, pinOk]
  );

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-2 text-xl font-semibold">Checkout</h1>
        <p>Your cart is empty.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleSuccessPayment = (payment) => {
    const order = {
      id: makeOrderId(),
      items,
      total,
      address: addr,
      payment: { ...payment, status: "SUCCESS (demo)" },
      placedAt: new Date().toISOString(),
    };
    saveOrder(order);
    dispatch(addOrder(order));
    dispatch(clearCart());
    navigate(`/thank-you/${order.id}`, { state: order });
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-6 md:grid-cols-2">
      {/* Address */}
      <section className="rounded-2xl border border-zinc-200 p-5 shadow-sm dark:border-zinc-800">
        <h2 className="mb-4 text-lg font-semibold">Delivery Address</h2>

        <div className="grid gap-3">
          <input
            className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Full name"
            value={addr.name}
            onChange={(e) => setAddr({ ...addr, name: e.target.value })}
          />
          <input
            className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Phone (10 digits / +91)"
            value={addr.phone}
            onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
          />
          <input
            className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Address line"
            value={addr.line1}
            onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="City"
              value={addr.city}
              onChange={(e) => setAddr({ ...addr, city: e.target.value })}
            />
            <input
              className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="PIN (6 digits)"
              value={addr.pin}
              onChange={(e) => setAddr({ ...addr, pin: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            disabled={!valid}
            className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setOpenPay(true)}
          >
            Continue to Payment
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-2xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Return Home
          </button>
        </div>

        <p className="mt-2 text-xs text-zinc-500">No real payment—demo only.</p>
      </section>

      {/* Summary */}
      <section className="rounded-2xl border border-zinc-200 p-5 shadow-sm dark:border-zinc-800">
        <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span className="truncate">
                {it.name} × {it.qty || 1}
              </span>
              <span>₹{(it.price * (it.qty || 1)).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-3 font-semibold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <MockPaymentModal
        open={openPay}
        onClose={() => setOpenPay(false)}
        onSuccess={handleSuccessPayment}
      />
    </div>
  );
}
