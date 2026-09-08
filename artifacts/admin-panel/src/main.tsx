import { createRoot } from "react-dom/client";
import { setApiErrorHandler } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

let reauthenticationRedirectStarted = false;
setApiErrorHandler(error => {
  const data = error.data as { requiresRecentAuth?: boolean } | null;
  if (
    reauthenticationRedirectStarted ||
    error.status !== 401 ||
    data?.requiresRecentAuth !== true
  ) return;

  const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
  if (window.location.pathname === `${basePath}/login`) return;
  reauthenticationRedirectStarted = true;
  const returnTo = `${window.location.pathname.slice(basePath.length) || "/dashboard"}${window.location.search}`;
  window.location.assign(
    `${basePath}/login?reauth=1&returnTo=${encodeURIComponent(returnTo)}`,
  );
});

createRoot(document.getElementById("root")!).render(<App />);
