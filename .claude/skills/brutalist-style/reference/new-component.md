# Adding a section or component

Follow this so a new piece drops into the system with zero visual drift. The
existing components (`Skills.tsx`, `Experience.tsx`, `SelectedWork.tsx`) are the
templates: read the closest one before writing.

## Adding a new top-level section

1. **Create two colocated files** in `src/components/`: `Foo.tsx` and `Foo.css`.
   Line 1 of the tsx is `import "./Foo.css";`.
2. **Put content in a typed `const` array** at the top of the tsx (UPPERCASE name,
   e.g. `const AWARDS = [...] as const` or a typed array), and map over it in the
   JSX. Do not hand-write repeated blocks.
3. **Use the section shell** exactly:
   ```tsx
   function Foo() {
     return (
       <section className="section" id="foo">
         <div className="section__head">
           <span className="section__lead">
             <span className="section__no">08</span>
             <span className="section__name">Section name</span>
           </span>
           <span className="section__meta">Short · mono · meta</span>
         </div>
         {/* body */}
       </section>
     );
   }
   export default Foo;
   ```
   - Next number in the `01`–`07` run (so a new one is `08`). Zero-pad it.
   - The orange square is automatic (`.section__no::before`). Do not add one.
   - Meta items separated by middot `·`.
4. **Register it in three places:**
   - Import and place `<Foo />` in `App.tsx` in visual (scroll) order.
   - Add `{ label: "Section name", href: "#foo" }` to `NAV` in `Hero.tsx`, so the
     menu anchor works. The `id` and the `href` must match.
   - If any child should scroll-reveal, add its selector to `REVEAL_SELECTOR` in
     `App.tsx`. Do not wire a new observer.
5. **Style in `Foo.css` using tokens only.** Borders are hairline, labels are mono
   uppercase, headings are display with tight tracking, sizes use `clamp()`,
   horizontal padding comes from the section (never re-pad). Collapse internal
   grids at `max-width: 760px` like `.pillar` does.

## Adding a smaller component (card, row, chip)

- Reuse `.tag` for any chip/pill rather than making a new one.
- Match the naming and structure of the nearest existing element: a work row is
  `.work-row`, an experience entry is `.exp`, a pillar is `.pillar`, a lab item is
  `.lab-card`. Follow `block__element--modifier`.
- If it reveals on scroll, its selector goes in `REVEAL_SELECTOR`.

## Adding an animation

1. Guard it. CSS:
   ```css
   @media (prefers-reduced-motion: no-preference) {
     .thing { transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
   }
   ```
   JS: bail early if `matchMedia("(prefers-reduced-motion: reduce)").matches`, and
   initialize state to the final value in that case (lazy initial state), as
   `Scramble.tsx` does.
2. Match the existing easing: `cubic-bezier(0.22, 1, 0.36, 1)`, durations around
   0.6–0.95s. No bounces, no springs. The motion vocabulary is a quiet rise/fade.
3. Reduced-motion users must see the finished state, never a hidden element.

## Adding a fixed overlay (floating button, rail)

Fixed, viewport-anchored UI (the side rails, the scroll-to-top button) follows its
own pattern, separate from the scroll-reveal system. Copy `Rails.tsx` /
`ScrollTop.tsx` rather than starting fresh.

1. **Visibility is a scroll listener, not `REVEAL_SELECTOR`.** Register a
   `passive` scroll listener, compute a boolean in state, and toggle a `--shown`
   modifier class that drives an opacity/visibility/transform fade in CSS.
2. **Reuse the shared "past the hero" threshold:**
   `window.scrollY > window.innerHeight * 0.85`. This is the same value the rails
   use, so overlays appear in sync. Do not pick a new number.
3. **Do not overlap the footer colophon.** The whole contact section is
   `<footer className="footer" id="contact">`, so `.footer` is NOT the bottom bar.
   The bottom bar is `.footer__colophon`. To dock an overlay above the footer,
   measure `document.querySelector(".footer__colophon").getBoundingClientRect().top`
   and lift the element so its bottom edge stays a fixed gap above that, never
   below its resting position. See the `lift` calculation in `ScrollTop.tsx`.
4. **Write continuous position to the DOM via `useRef`, not state.** A value that
   changes every scroll frame (like the dock offset) must be applied as
   `ref.current.style.bottom = ...` so it does not trigger a React re-render per
   frame. Keep only the boolean shown/hidden in state. Do NOT put a fast-changing
   scroll value in `useState`.
5. **Position property must be OUTSIDE the transition list.** The fade transition
   animates opacity/transform/visibility. A docking offset (`bottom`) must not be
   in that transition, or it will lag behind the scroll instead of tracking it 1:1.
6. **z-index ladder** (see `reference/tokens.md`): film grain 9999, hero menu
   overlay 100, side rails 50. New overlays sit at 40 or below so an open menu is
   never covered. The button also shifts inboard (`right: 46px`) at ≥1280px to
   clear the right rail.
7. **Also listen for `resize`** if the position depends on `innerHeight` (docking
   does), since the viewport can change height without a scroll event.

## Editing copy or data

- Change the `const` array, not the JSX.
- No em-dashes. Periods and colons; en-dash only for numeric ranges.
- Keep mono meta lines short (they sit on one line on mobile via `nowrap` guards).

## Finish

Run the SKILL.md self-check, then `npm run lint` and `npm run build`. Both clean
before you present. Do not push `main` unless deploying was requested.
