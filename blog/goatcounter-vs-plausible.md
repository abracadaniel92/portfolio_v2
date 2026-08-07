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

Full control and privacy were the actual reasons to self-host anything
here at all, not a GoatCounter-specific feature. Once that decision
was made, the choice between the two tools that both respect it came
down to which one asks less of the machine running it.

The snippet dropped off the site during the rebuild into its current
brutalist style and came back once that redesign was live, not because
of any deliberate privacy or CSP concern, just because a full rebuild
didn't carry every non-essential piece over on day one. Ad blockers
still drop the tracking script silently, which is expected and not
worth working around: a privacy-respecting analytics tool that some
privacy tools block anyway is a fair trade, not a bug.
