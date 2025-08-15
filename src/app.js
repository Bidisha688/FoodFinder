// App.jsx (or App.js)
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from "react-router-dom";

import Header from "./components/Header";
import Body from "./components/Body";
import Error from "./components/Error";
import Shimmer from "./components/Shimmer";

// Lazy-load non-critical pages
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const RestaurantMenu = lazy(() => import("./components/RestaurantMenu"));

const AppLayout = () => (
  <div className="app">
    <Header />
    <Suspense fallback={<Shimmer />}>
      <Outlet />
    </Suspense>
    <ScrollRestoration />
  </div>
);

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Body /> },                 // "/"
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "restaurant/:id", element: <RestaurantMenu /> }, // "/restaurant/:id"
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
