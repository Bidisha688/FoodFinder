// src/Utils/orderStorage.js
const KEY = "ff_orders";

export const loadOrders = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
};

export const saveOrder = (order) => {
  const all = loadOrders();
  all.unshift(order);
  localStorage.setItem(KEY, JSON.stringify(all));
};
