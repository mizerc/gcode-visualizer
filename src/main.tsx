import "./global.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./context/AppContext.tsx";
import App from "./App.tsx";
import { HashNavProvider } from "./context/HashNavContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <HashNavProvider>
        <App />
      </HashNavProvider>
    </AppProvider>
  </StrictMode>,
);
