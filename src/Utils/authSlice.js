import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔒 Demo helpers (NOT for production)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hash = (s) => btoa(unescape(encodeURIComponent(s))); // demo-only

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("users") || "[]");
  } catch {
    return [];
  }
};
const writeUsers = (arr) => localStorage.setItem("users", JSON.stringify(arr));

export const registerAsync = createAsyncThunk(
  "auth/registerAsync",
  async ({ name, email, password }) => {
    await sleep(500);
    const users = readUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("An account with this email already exists.");
    const newUser = { name, email, passwordHash: hash(password) };
    users.push(newUser);
    writeUsers(users);
    return { token: "demo-token", user: { name, email } };
  }
);

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }) => {
    await sleep(500);
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.passwordHash !== hash(password)) {
      throw new Error("Invalid email or password.");
    }
    return { token: "demo-token", user: { name: found.name, email: found.email } };
  }
);

export const logoutAsync = createAsyncThunk("auth/logoutAsync", async () => {
  await sleep(250);
  return true;
});

const initialState = {
  isAuthenticated: !!localStorage.getItem("auth_token"),
  user: JSON.parse(localStorage.getItem("auth_user") || "null"),
  status: "idle",
  error: null,
  // UI state for modal
  modalOpen: false,
  mode: "signin", // 'signin' | 'signup'
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openAuthModal(state, action) {
      const users = readUsers();
      state.mode = users.length ? "signin" : "signup";
      if (action?.payload?.mode) state.mode = action.payload.mode;
      state.modalOpen = true;
      state.error = null;
    },
    closeAuthModal(state) {
      state.modalOpen = false;
      state.error = null;
    },
    switchMode(state, action) {
      state.mode = action.payload; // 'signin' or 'signup'
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerAsync.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(registerAsync.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.isAuthenticated = true;
        s.user = payload.user;
        s.modalOpen = false;
        localStorage.setItem("auth_token", payload.token);
        localStorage.setItem("auth_user", JSON.stringify(payload.user));
      })
      .addCase(registerAsync.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })
      // login
      .addCase(loginAsync.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(loginAsync.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.isAuthenticated = true;
        s.user = payload.user;
        s.modalOpen = false;
        localStorage.setItem("auth_token", payload.token);
        localStorage.setItem("auth_user", JSON.stringify(payload.user));
      })
      .addCase(loginAsync.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })
      // logout
      .addCase(logoutAsync.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(logoutAsync.fulfilled, (s) => {
        s.status = "succeeded";
        s.isAuthenticated = false;
        s.user = null;
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      })
      .addCase(logoutAsync.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; });
  },
});

export const { openAuthModal, closeAuthModal, switchMode } = authSlice.actions;
export default authSlice.reducer;
