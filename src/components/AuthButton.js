import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openAuthModal, logoutAsync } from "../Utils/authSlice";

export default function AuthButton() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, status } = useSelector((s) => s.auth);
  const loading = status === "loading";

  const handleClick = () => {
    if (isAuthenticated) {
      dispatch(logoutAsync());
    } else {
      dispatch(openAuthModal());
    }
  };

  return (
    <button
      className="inline-flex items-center rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
      onClick={handleClick}
      disabled={loading}
      data-testid="auth-button"
    >
      {loading
        ? (isAuthenticated ? "Logging out…" : "Loading…")
        : (isAuthenticated ? `Log out (${user?.name || "Account"})` : "Log in")}
    </button>
  );
}
