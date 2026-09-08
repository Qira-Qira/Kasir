import { createRoot } from "react-dom/client";
import App from "./app/App";
import faviconUrl from "./app/favicon.ico";
import "./styles/index.css";

const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = faviconUrl;
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);