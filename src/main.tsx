import { createRoot } from "react-dom/client";
import { enableVisualEditing } from "@sanity/visual-editing";
import App from "./App.tsx";
import "./index.css";

enableVisualEditing();

createRoot(document.getElementById("root")!).render(<App />);
