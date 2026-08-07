---
name: brutalist-style
description: Keep gmojsoski.com visually and structurally consistent with its brutalist design system whenever you add or change UI. Use when creating a new section or component, writing or editing any .tsx/.css under src/, adjusting layout, type, spacing, or color, adding copy or data, or wiring a new animation or scroll reveal. Triggers on "add a section", "new component", "style this", "match the design", "change the layout/type/spacing/color", "add a card/row/chip", "tweak the hero/footer", or any visual change to the portfolio. Enforces the token palette, the section scaffolding, the mono-label system, motion-opt-in, and the file/data conventions. Load reference/tokens.md and reference/new-component.md for the concrete specs.
---

# Brutalist Style Guardian

This is the live gmojsoski.com. Every UI change must read as the same object: a
near-black concrete canvas, oversized machined display type, monospace technical
labels, and a single industrial-orange signal accent. Your job is to make new
work indistinguishable in style from what is already there. When in doubt, copy
an existing pattern rather than invent one.

Read `CLAUDE.md` first for the hard rules and the deploy pipeline. This skill is
the how-to that keeps changes on-system. Pull the concrete numbers from:

- `reference/tokens.md` — the full palette, type, and spacing reference
- `reference/new-component.md` — step-by-step for adding a section or component

## The non-negotiables (memorize these five)

1. **One accent, ever.** `--signal` (`#d2402e`) is the only color that is not on
   the bone/concrete neutral ramp. Never add a second accent, never "brighten"
   or theme the palette. Squares, section numbers, one group label per pillar,
   and CTAs are the only things that carry it.
2. **Tokens, not literals.** Every color is a `var(--token)` from
   `src/index.css`. Never write a raw hex. Spacing and type scale use `clamp()`,
   not fixed pixels, for anything that should breathe across viewports.
3. **Motion is opt-in.** Any animation sits behind
   `@media (prefers-reduced-motion: no-preference)` in CSS, or checks
   `matchMedia("(prefers-reduced-motion: reduce)")` in JS. Reduced-motion users
   must see the final, resolved state immediately, never a hidden or mid-animation
   frame. Copy the guard from `Scramble.tsx` / `App.tsx`.
4. **No em-dashes in copy.** Periods, colons, or en-dashes for ranges. This was a
   deliberate de-AI pass. Do not reintroduce them when writing or rewording.
5. **Build and lint stay green.** `npm run build` (runs `tsc -b`) and
   `npm run lint` must both pass before the change is done. Pushing `main` is a
   production deploy.

## Visual system in one screen

- **Color:** canvas `#0b0b0a`, surface `#131311`, bone ink `#e8e4dc`, dimmed and
  faint ink for secondary/tertiary text, hairlines for borders, `--signal` for
  the accent. Full table in `reference/tokens.md`.
- **Type has three voices, each with a fixed job:**
  - `--display` (Archivo): headings and body. Big sizes use tight negative
    letter-spacing (`-0.02em`) and line-height near 1.05.
  - `--mono` (IBM Plex Mono): technical labels only. Always UPPERCASE, positive
    letter-spacing (1 to 1.8px), small (10 to 13px), usually `--ink-faint` or
    `--signal`. This is the "machined label" texture. Section meta, tags, eyebrows,
    group labels, spine numbers are all mono.
  - `--serif` (Instrument Serif): reserved for the occasional italic accent word
    inside a display line. Not for blocks of text.
- **Spacing:** horizontal padding is always `var(--pad)` (it widens at breakpoints
  so the fixed side rails never overlap content). Vertical rhythm uses `clamp()`.
- **Borders:** 1px solid `--hairline` (or `--hairline-faint` for the quieter
  internal rules). No shadows, no radii on structural elements. Brutalist means
  hard edges and hairlines, not soft cards.
- **Buttons are bracketed mono labels, not icons.** The site's button vocabulary
  is a bordered rectangle with a mono UPPERCASE label in square brackets:
  `[ menu ]` (hero, `.topbar__menu`), `[ top ]` (scroll-to-top). Prefer this over
  an icon-only or arrow button. The loud CTA variant fills `--signal` on hover
  (`.topbar__menu`, `.topbar__resume`); a quiet utility variant stays hairline and
  lifts to `--signal` border/text on hover (`.to-top`). Match one of these two,
  do not invent a third button style.
- **The film grain** (`body::after` in `index.css`) is global. Leave it alone.

## Section scaffolding (every top-level section uses this)

A section is a `<section className="section" id="...">` whose first child is the
shared head. Do not restyle the head per section; use the shared classes from
`App.css`:

```tsx
<section className="section" id="skills">
  <div className="section__head">
    <span className="section__lead">
      <span className="section__no">05</span>
      <span className="section__name">How I work</span>
    </span>
    <span className="section__meta">Lead · Build · Run · Secure</span>
  </div>
  {/* section body */}
</section>
```

- Section numbers are `01`–`07`, zero-padded, and the orange square is drawn by
  `.section__no::before` — do not add your own square.
- The `id` must match an anchor in `NAV` (in `Hero.tsx`). If you add a section,
  add its `NAV` entry and place the component in `App.tsx` in visual order.
- Middot `·` (not a hyphen, not a slash-with-spaces) separates items in a meta line.

## Code and file conventions

- **One component, two files, colocated:** `Foo.tsx` imports `./Foo.css` on line 1.
  Class names are BEM-ish `block__element--modifier`. Keep component-specific CSS
  in its own file; shared primitives (`.section*`, `.reveal*`, `.tag`) live in
  `App.css`; tokens and reset live in `index.css`.
- **Copy and data are typed `const` arrays at the top of the component**
  (`WORK`, `ROLES`, `PILLARS`, `HOMELAB`, `STATS`, `SOCIALS`, `NAV`, …), and the
  JSX maps over them. To change content, edit the array, never hand-write repeated
  JSX blocks. New data arrays follow the same UPPERCASE naming.
- **Scroll reveals** are centralized: add your new revealable selector to
  `REVEAL_SELECTOR` in `App.tsx`. Do not create another IntersectionObserver.
  The `.reveal` / `.reveal--in` transition lives in `App.css`.
- **Fixed overlays** (side rails, scroll-to-top) do NOT use `REVEAL_SELECTOR`.
  They own a `passive` scroll listener, toggle a `--shown` modifier, and share the
  "past the hero" threshold `window.scrollY > window.innerHeight * 0.85` so they
  appear together. Continuous position updates (docking above the footer) are
  written to the DOM through a `useRef`, not React state, so they do not re-render
  every scroll frame; a boolean shown/hidden can stay in state. Full pattern and
  the footer/colophon and z-index gotchas are in `reference/new-component.md`.
- **State:** use lazy initial state (`useState(() => …)`); never call `setState`
  synchronously inside an effect (ESLint blocks it). See `Scramble.tsx`.
- **External links** always carry `target="_blank" rel="noopener noreferrer"`.
- **No new dependencies.** Runtime deps are react + react-dom only. If a change
  seems to need a library, stop and ask.
- **Favicons** are generated: edit `public/favicon.svg`, run
  `node scripts/gen-favicons.mjs`, never hand-edit the PNG/ICO outputs.

## Before you finish (self-check)

Run this every time you touched anything under `src/`:

1. **Palette:** grep your diff for `#` — every hex should only appear in
   `index.css` token definitions. Any other raw color is a bug. Confirm no second
   accent crept in.
2. **Type roles:** every mono-family use is UPPERCASE, letter-spaced, small, and a
   label (not body text). Display headings use `clamp()` + tight tracking. Serif
   only on an italic accent word.
3. **Tokens/clamp:** no fixed pixel color or hardcoded horizontal padding; used
   `var(--pad)` and `clamp()` where things should scale.
4. **Motion:** every new transition/animation has its reduced-motion guard, and the
   reduced-motion path shows the final state instantly.
5. **Structure:** new section uses `.section` + `.section__head`, has a synced
   `NAV` entry and `App.tsx` placement, and any reveal is registered in
   `REVEAL_SELECTOR`.
6. **Copy:** no em-dashes; middots between meta items; links have `rel="noopener
   noreferrer"`.
7. **Green:** `npm run lint` and `npm run build` both clean.

If any check fails, fix it before presenting the change. Do not push `main`
unless the user asked to deploy.
