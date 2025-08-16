// App.jsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from "react-router-dom";
import Shimmer from "./components/Shimmer";

// Lazy-load all components
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const Body = lazy(() => import("./components/Body"));
const Error = lazy(() => import("./components/Error"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const RestaurantMenu = lazy(() => import("./components/RestaurantMenu"));

const AppLayout = () => (
  <div className="app">
    <Suspense fallback={<Shimmer />}>
      <Header />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </Suspense>
  </div>
);

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <Suspense fallback={<Shimmer />}>
        <Error />
      </Suspense>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Shimmer />}><Body /></Suspense> },
      { path: "about", element: <Suspense fallback={<Shimmer />}><About /></Suspense> },
      { path: "contact", element: <Suspense fallback={<Shimmer />}><Contact /></Suspense> },
      { path: "restaurant/:id", element: <Suspense fallback={<Shimmer />}><RestaurantMenu /></Suspense> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
