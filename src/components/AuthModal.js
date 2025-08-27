import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeAuthModal, switchMode, loginAsync, registerAsync } from "../Utils/authSlice";

export default function AuthModal() {
  const dispatch = useDispatch();
  const { modalOpen, mode, status, error } = useSelector((s) => s.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    if (!modalOpen) {
      setName(""); setEmail(""); setPwd("");
    }
  }, [modalOpen]);

  if (!modalOpen) return null;

  const loading = status === "loading";
  const isSignup = mode === "signup";

  const onSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(registerAsync({ name, email, password: pwd }));
    } else {
      dispatch(loginAsync({ email, password: pwd }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-xl ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{isSignup ? "Create account" : "Sign in"}</h2>
          <button
            onClick={() => dispatch(closeAuthModal())}
            className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {isSignup && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
                value={name} onChange={(e) => setName(e.target.value)} required
              />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
              value={pwd} onChange={(e) => setPwd(e.target.value)} required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? (isSignup ? "Creating…" : "Signing in…") : (isSignup ? "Create account" : "Sign in")}
          </button>
        </form>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => dispatch(switchMode(isSignup ? "signin" : "signup"))}
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
