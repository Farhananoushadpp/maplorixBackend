import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/JobStyles.css";
import "./styles/AdminPostsStyles.css";
import "./styles/ApplicationStyles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
