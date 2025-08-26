// src/Utils/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // each item: { id, name, price, image, qty }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const incoming = action.payload; // {id, name, price, image}
      const found = state.items.find((it) => it.id === incoming.id);
      if (found) {
        found.qty += 1;
      } else {
        state.items.push({ ...incoming, qty: 1 });
      }
    },
    // Original removeItem kept (pops last) in case you use it elsewhere
    removeItem: (state) => {
      state.items.pop();
    },
    // NEW: remove by id
    removeItemById: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((it) => it.id !== id);
    },
    // NEW: decrement qty (removes when qty hits 0)
    decrementQty: (state, action) => {
      const id = action.payload;
      const found = state.items.find((it) => it.id === id);
      if (found) {
        found.qty -= 1;
        if (found.qty <= 0) {
          state.items = state.items.filter((it) => it.id !== id);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  removeItemById,
  decrementQty,
  clearCart,
} = cartSlice.actions;

// Handy selector for header badge
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, it) => sum + (it.qty || 0), 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 0), 0);

export default cartSlice.reducer;
