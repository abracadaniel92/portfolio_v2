import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.tsx";

/** Rendered at build time by scripts/prerender.mjs to bake static markup
 *  into dist/index.html. The client then hydrates it (see main.tsx). */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
