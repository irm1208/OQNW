import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/product-brand.css";
import "./styles/product-layout.css";
import { enableCopyProtection } from "./lib/copyProtection";

enableCopyProtection();
createRoot(document.getElementById("root")!).render(<App />);
