import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.tsx";
import { parseRoute } from "./router.ts";

/** Rendered once per route at build time by scripts/prerender.mjs to bake
 *  static markup into each dist page. The client then hydrates it (main.tsx). */
export function render(pathname: string) {
  return renderToString(
    <StrictMode>
      <App route={parseRoute(pathname)} />
    </StrictMode>,
  );
}
