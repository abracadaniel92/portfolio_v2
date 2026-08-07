# This site's deploy pipeline has no CI provider

Pushing to `main` on my portfolio's repo is a production
deploy. There's no GitHub Actions workflow, no Vercel hook, no build
artifact stored anywhere but the server itself. A box called `lemongrab`,
a Lenovo ThinkCentre sitting on a shelf, pulls `main`, runs `npm run
build`, and syncs the resulting `dist/` into Caddy's document root. It
does that either because I typed `make portfolio-update` or because a
systemd timer did it for me on a schedule.

I wanted this site off a SaaS host, and I wanted that to be true for
more than just this site. The same box also serves `cloud.gmojsoski.com`
(Nextcloud) and `analytics.gmojsoski.com` (a self-hosted GoatCounter
instance), all behind one Caddy config. The portfolio isn't a special
case with its own pipeline; it's one more thing the homelab already
knows how to deploy.

## What the "no CI" tradeoff actually costs

Building on the server instead of in a disposable CI container means
the server needs the right Node and npm versions installed, permanently,
just to build a static site with two runtime dependencies. That's not
free. Commit `a4cd573`, "Regenerate package-lock.json for npm 10 on
Node 20", exists because the lockfile has to match whatever is actually
installed on `lemongrab` right now. A GitHub Actions runner starts from
a clean image every run and forgets what version anything was last
week; this box remembers, because it's the same box next week too.

What that buys back: no deploy keys handed to a third-party CI service,
no artifact storage bill, no separate system to keep patched. The
failure modes move from "a CI provider had an outage" to "I need to
remember what's installed on my own hardware," which is a trade I'd
make again, but it is a trade, not a strict improvement.

## Where the pipeline and the app disagree if you're not careful

The site's Content-Security-Policy header isn't in the app at all. It
lives in the Caddyfile, on `lemongrab`, entirely separate from
`portfolio_v2`. When GoatCounter's `count.js` snippet went back into
`index.html`, the CSP had to widen to allow
`https://analytics.gmojsoski.com` in `script-src`, `connect-src`, and
`img-src`, three separate directives for one script tag. `DEPLOY.md`
spells out the failure mode directly: if the new build ships before the
Caddy header widens, the browser blocks `count.js` and every hit in
that window is simply gone. No queue, no retry, no way to recover it
later.

That's the actual shape of deploying app code and server config from two
different places: most of the time it doesn't matter, and the one time
it does, the two systems don't know about each other at all. There's no
automated check that what `index.html` actually requests matches what
the Caddyfile actually allows. The only safeguard is a paragraph in
`DEPLOY.md` telling a future me to widen the header before, or
alongside, the deploy that needs it, and a paragraph is easy to skip
under pressure.

## Why the recovery path is a Makefile target

The homelab's own description of itself, in this site's "lab" section, is
blunter than I'd put it in conversation: "recovery is a single command
instead of a runbook." That line is the design goal behind the systemd
timer and the `make portfolio-update` target, and behind the layered
health checks and restart policies running alongside it: fixing a
failure should take one command I can run half-asleep. Remembering
seven steps correctly at 2am is a worse plan. A Makefile target either
exists and works or it doesn't. A half-remembered runbook can be
confidently wrong, which is worse than having none.

The Caddy config and the app repo still don't talk to each other. That
gap is closed by a paragraph in a markdown file, and paragraphs get
skipped under pressure in a way that `make` targets don't.
