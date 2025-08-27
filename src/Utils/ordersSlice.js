// src/Utils/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { list: [] };

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    hydrateOrders: (state, action) => { state.list = action.payload || []; },
    addOrder: (state, action) => { state.list.unshift(action.payload); }
  }
});

export const { hydrateOrders, addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
