# Adding server-side rendering to a React portfolio without a framework migration

`scripts/prerender.mjs` looks for a literal string in `dist/index.html`:
`<div id="root"></div>`. Before this commit, that string was the entire
page. Everything else, the work history, the stats, the roles, arrived
after a JS bundle finished executing. A crawler that didn't run
JavaScript, or a user on a slow connection, got an empty div and nothing
else.

I wanted server-side rendering (SSR): real markup baked into that file
at build time, without adding a framework migration or a server of my
own to run. The site runs on react and react-dom, full stop, so
whatever fixed this had to use what was already there.

## The four-step build

`npm run build` now runs:

```
tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir dist/server && node scripts/prerender.mjs
```

Three of those steps are Vite doing what Vite already does: type-check,
build the client bundle, build a second bundle from an SSR entry point.
The fourth step is a 28-line script. It imports the compiled
`entry-server.js`, calls `renderToString` on the app, and does a string
replace of the root div's contents in `dist/index.html`. Then it
deletes `dist/server` entirely: that bundle only ever runs once,
during the build, to produce that string. It never runs in a browser,
so there's nothing to ship it for.

That part was the easy 40 lines: an `entry-server.tsx` that renders
`<App />` inside `renderToString`, and the prerender script that wires it
into the existing HTML template. The actual work was somewhere else.

## Finding every place content was hiding

Four components had to change, and none of them for the SSR plumbing
itself. They changed because each one used a pattern that works fine for
click-driven UI and is quietly wrong for anything that needs to exist in
the initial HTML.

`SelectedWork.tsx` rendered a work row's project list as `isOpen &&
<div className="work-projects">...</div>`. Collapsed by default, so the
projects simply weren't in the DOM until a click set `isOpen` to true.
Prerendering that state gives you a real `renderToString` call that faithfully
reproduces an HTML document with the project details missing, because
the state really was `false` at render time. The fix was to always
render the div and toggle a CSS class,
`work-projects--collapsed`, instead of toggling the JSX. Same move in
`Experience.tsx`: `ROLES.slice(0, 4)` became rendering the full array
with a `exp--collapsed` class on anything past `INITIAL_COUNT`. Content
now exists in the markup either way; visibility is CSS's job, not
React's.

`Scramble.tsx` and `Capacity.tsx` had a different problem. Both had a
`typeof window !== "undefined"` check written back when the only render
environment was a browser, used to decide whether to skip the animation
and show the final value right away for `prefers-reduced-motion` users.
On the server, `window` is always undefined, so that check evaluated to
`false` and both components rendered their pre-animation placeholder
state into the static HTML: `Scramble` emitted a string of middle-dots
instead of the resolved text, `Capacity` emitted zeroes instead of the
real stats. Prerendering had faithfully baked a placeholder into the one
file meant to carry real content. The fix in both was to invert the
condition to `typeof window === "undefined" || prefersReduced()`, so the
server and reduced-motion users get the same treatment: real values,
immediately. Both also needed `suppressHydrationWarning`, since the
client's first paint (dots, zeroes, mid-scramble) now legitimately
differs from what the server sent, right up until each component's
effect runs and takes over.

## Hydrating instead of always mounting fresh

`main.tsx` used to call `createRoot(...).render(...)` unconditionally.
Now that production HTML has real markup to reconcile against, that call
needed to become `hydrateRoot`. But the dev server still serves an empty
root, since `vite dev` doesn't run the prerender step, so a straight
swap to `hydrateRoot` would have broken local development. The fix is a
three-line branch: if the container already has child nodes, hydrate;
otherwise, render fresh. One file, two paths, decided at runtime by
checking `container.hasChildNodes()`.

## What was actually hard

Writing `entry-server.tsx` and `prerender.mjs` took an afternoon and
no new dependencies, since `react-dom/server` already ships inside
`react-dom`. Finding the four components that were quietly deleting
real content from the DOM until a click or an effect fired took longer,
because each one looked correct in isolation. `isOpen &&` reads as
normal React. A feature-detection check for `window` reads as
defensive code doing its job. Neither looks like a bug until you ask
what a renderer with no `window` and no click events actually produces,
which is exactly the renderer that now writes the file real users and
crawlers see first.

Four components needed a second look. The build script needed one new
28-line file.
