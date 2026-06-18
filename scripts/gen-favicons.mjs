// Regenerate raster favicons from public/favicon.svg
// Run: node scripts/gen-favicons.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = resolve(root, "public");
const svg = readFileSync(resolve(pub, "favicon.svg"));

const render = (size) =>
  sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

const pngs = {
  "favicon-32.png": 32,
  "favicon-192.png": 192,
  "favicon-512.png": 512,
  "apple-touch-icon.png": 180,
};

for (const [name, size] of Object.entries(pngs)) {
  const buf = await render(size);
  writeFileSync(resolve(pub, name), buf);
  console.log("wrote", name, size);
}

const icoSizes = [16, 32, 48];
const icoBuffers = await Promise.all(icoSizes.map(render));
writeFileSync(resolve(pub, "favicon.ico"), await pngToIco(icoBuffers));
console.log("wrote favicon.ico", icoSizes.join("/"));
