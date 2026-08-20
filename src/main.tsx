import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles/tokens.css";
import "./styles/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Localtify could not find the React root element.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
