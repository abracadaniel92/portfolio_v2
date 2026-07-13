// Bakes the app's static markup into dist/index.html so crawlers and the
// first paint get real content before any JS runs. The client hydrates this
// markup (see src/main.tsx). Runs after the client + SSR builds in `npm run
// build`; uses only Vite + react-dom/server, no extra dependencies.
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = resolve(root, "dist/index.html");
const serverEntry = resolve(root, "dist/server/entry-server.js");

const { render } = await import(pathToFileURL(serverEntry).href);
const appHtml = render();

const template = await readFile(indexPath, "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`prerender: could not find "${marker}" in dist/index.html`);
}

const html = template.replace(marker, `<div id="root">${appHtml}</div>`);
await writeFile(indexPath, html);

// The SSR bundle is a build artifact only; don't ship it.
await rm(resolve(root, "dist/server"), { recursive: true, force: true });

console.log("prerender: injected static markup into dist/index.html");
