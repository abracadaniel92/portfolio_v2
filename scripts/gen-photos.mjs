// Regenerate a photo set (hero or footer) from a full-size source image.
// Run: node scripts/gen-photos.mjs <path-to-source> --set=hero|footer [options]
//
// Desktop gets a "landscape" set: the source as-is, or turned 90° clockwise
// with --rotate (for a portrait source such as an aerial). Phones get a
// "portrait" set: the source as-is when it is already portrait, otherwise a
// 4:5 crop centred on --phone-focus (default 0.6, the focus Hero.css uses).
//
// Current sets:
//   hero:   the Macedonian Opera and Ballet, 2048px square
//           node scripts/gen-photos.mjs MOB.jpg --set=hero --phone-focus=0.38 --keep-left=0.8
//   footer: aerial of Studentski dom Pelagonija, 1824x2304 portrait
//           node scripts/gen-photos.mjs Gemini_Generated_Image_3z8tma3z8tma3z8t.jpg --set=footer --rotate --desktop-only
//           (desktop only: the footer hides the photo on phones)
// Grayscale is baked in so the files carry one channel and compress smaller.
// Outputs land in src/assets/<set>/ and are committed; the sources are not.
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith("--"));
const rotate = args.includes("--rotate");
// Skip the phone series for a set that is hidden on phones.
const desktopOnly = args.includes("--desktop-only");
// Horizontal centre (0–1) of the phone crop: put it on the subject.
const focusArg = args.find((a) => a.startsWith("--phone-focus="));
// Keep only the left fraction (0–1) of the desktop image: trimming the right
// side moves a left-of-centre subject out of the fade under the headline.
const keepArg = args.find((a) => a.startsWith("--keep-left="));
const KEEP = keepArg ? Number(keepArg.split("=")[1]) : 1;
const set = args.find((a) => a.startsWith("--set="))?.split("=")[1];
if (!src || !["hero", "footer"].includes(set)) {
  console.error("usage: node scripts/gen-photos.mjs <source-image> --set=hero|footer [--rotate] [--phone-focus=0.6] [--keep-left=1] [--desktop-only]");
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "src/assets", set);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const meta = await sharp(src).metadata();
const W = meta.width;
const H = meta.height;
const FOCUS_X = focusArg ? Number(focusArg.split("=")[1]) : 0.6;

// Landscape: optional rotation, then an optional trim of the right side.
const LW = rotate ? H : W;
const LH = rotate ? W : H;
const keepW = Math.round(LW * KEEP);
const landscape = {
  name: "landscape",
  width: keepW,
  prep: (img) => {
    const r = rotate ? img.rotate(90) : img;
    // sharp runs an extract called after rotate on the rotated frame.
    return KEEP < 1 ? r.extract({ left: 0, top: 0, width: keepW, height: LH }) : r;
  },
  targets: [1280, 1920, 2560],
};

// Portrait: the source itself if it is portrait, else a 4:5 crop.
const crop = (() => {
  if (H > W) return null;
  const w = Math.round((H * 4) / 5);
  const left = Math.round(Math.min(W - w, Math.max(0, W * FOCUS_X - w / 2)));
  return { left, top: 0, width: w, height: H };
})();
const portrait = {
  name: "portrait",
  width: crop ? crop.width : W,
  prep: (img) => (crop ? img.extract(crop) : img),
  targets: [720, 1080, 1440],
};

for (const v of desktopOnly ? [landscape] : [landscape, portrait]) {
  // Never upscale: drop targets above the real width and add the real width
  // as the largest size, so every file name matches its true pixel width.
  const widths = [...new Set([...v.targets.filter((t) => t < v.width), Math.min(v.width, Math.max(...v.targets))])];
  for (const w of widths) {
    const base = () => v.prep(sharp(src)).resize({ width: w }).grayscale();
    const a = await base().avif({ quality: 52, effort: 6 }).toFile(`${out}/${v.name}-${w}.avif`);
    const b = await base().webp({ quality: 74 }).toFile(`${out}/${v.name}-${w}.webp`);
    console.log(`${v.name}-${w}: ${a.width}x${a.height}  avif ${(a.size / 1024).toFixed(0)} kB  webp ${(b.size / 1024).toFixed(0)} kB`);
  }
}
