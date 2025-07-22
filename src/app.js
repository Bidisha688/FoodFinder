import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./Header";
import Body from "./Body";






const AppLayout = () => (
  <div className="applayout">
    <Header />
    <Body />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayout />);
