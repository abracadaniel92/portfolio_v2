---
title: "GoatCounter, not Plausible, tracks visits on this site"
date: 2026-02-23
company: "Homelab"
summary: "Plausible was the real alternative, not Google Analytics. The decision came down to what self-hosting each one costs to operate: Postgres plus ClickHouse, or one Go binary."
---

# GoatCounter, not Plausible, tracks visits on this site

GoatCounter runs the analytics on gmojsoski.com, and Plausible was the
real alternative I turned down, not Google Analytics. Both are
privacy-respecting, cookie-banner-free tools built for exactly this
kind of small site. The difference that decided it was what
self-hosting each one actually costs. Plausible's self-hosted stack
needs Postgres and ClickHouse running somewhere. GoatCounter is a
single Go binary with SQLite. For a personal site on a homelab box,
that's the entire decision: one more thing to operate versus one
binary I don't have to think about again.

Ad blockers still drop the tracking script silently, which is expected
and not worth working around: a privacy-respecting analytics tool that
some privacy tools block anyway is a fair trade, not a bug.
