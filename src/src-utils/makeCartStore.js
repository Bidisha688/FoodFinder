import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../Utils/cartSlice";

export default function makeCartStore(preloadedCart = { items: [] }) {
  return configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: preloadedCart },
  });
}
