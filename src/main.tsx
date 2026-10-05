import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      {/* <App /> */}
      <DashboardPage />
    </AppProvider>
  </StrictMode>,
);
