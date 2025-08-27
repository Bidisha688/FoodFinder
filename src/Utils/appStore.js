// src/Utils/appStore.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

const appStore = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

export default appStore;
