import "./global.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./context/AppContext.tsx";
import App from "./App.tsx";
import { HashNavProvider } from "./context/HashNavContext.tsx";
import { ParserV2 } from "./core/ParserV2.ts";
// import { ParserV1 } from "./core/ParserV1.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider parserClass={ParserV2}>
      <HashNavProvider>
        <App />
      </HashNavProvider>
    </AppProvider>
  </StrictMode>,
);
