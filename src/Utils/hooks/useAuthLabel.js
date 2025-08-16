// src/hooks/useAuthLabel.js
import { useState } from "react";

export default function useAuthLabel() {
  const [authLabel, setAuthLabel] = useState("Login");

  const toggleAuth = () =>
    setAuthLabel((p) => (p === "Login" ? "Logout" : "Login"));

  return { authLabel, toggleAuth };
}
