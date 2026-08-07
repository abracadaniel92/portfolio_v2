# Self-hosting a homelab made every gap in my own resilience impossible to ignore

Running my own infrastructure hasn't made me better at handling failure
in general. What it's done is make every place I'm not resilient
impossible to ignore, because there's no one else's team standing
between me and the failure. That turns out to be the more useful thing
to learn, and it's a smaller claim than "self-hosting builds character,"
which is the version of this argument people usually reach for.

## Why the sensible move is not to do this

The strongest version of the counterargument is compelling, and I
don't think it's wrong: paying a
managed platform to run your infrastructure is specialization, the
same trade as buying insurance instead of self-insuring. AWS has
teams of people paging each other at 3am so a single engineer at a
150-person company doesn't have to be the one person who knows why the
database is slow. A five-person startup buying reliability from a cloud
provider is making the correct trade every time. I'd tell a client to
do exactly that, and have.

The honest version of the objection is even sharper: a homelab on a
Lenovo ThinkCentre on a shelf has exactly one on-call engineer, and it's
me. There is no second person who understands the Caddy config if I'm
on a plane. No amount of tooling changes who picks up the phone.

## Where that shows up, specifically

The clearest case is one I wrote up on its own: this site's
Content-Security-Policy header lives in a Caddyfile on the server, the
script tag that needs it lives in the app repo, and nothing connects
them except a paragraph in `DEPLOY.md` telling me to update both at
once. On a managed platform that coupling either doesn't exist or is
enforced by the platform's own config surface. A team with a platform
engineer would have caught it in a PR review. I catch it by having
written myself a reminder, which is the entire difference in one
sentence.

[TODO: a second example from a service other than the portfolio.
Nextcloud on `cloud.gmojsoski.com` is the obvious candidate, and the
sharpest version of the question is whether you have ever actually
restored from that backup rather than assuming it works. An untested
restore is the canonical form of this argument, and unlike the tunnel
replicas and the lockfile commit, it isn't already carrying two other
posts.]

[TODO: a third example where the gap went unclosed, or got found late.
Every case in this section is currently "I noticed the seam", which
quietly flatters the argument. One instance where being the only
on-call engineer meant something broke and stayed broken for a while
would make the claim honest rather than tidy, and it is the strongest
thing this post could contain.]

## What I'd actually narrow this to

The useful version of "self-host your own infrastructure" is narrower
than the slogan: self-host the things where understanding every
failure mode beats someone else's five nines (99.999% uptime), and
skip anything where
the blast radius reaches past you. A client's production traffic,
another team's data, anything with a support obligation to a third
party: none of that belongs on a shelf with one on-call engineer, and I
wouldn't put it there.

What belongs there is exactly what's there now: a portfolio site, a
personal cloud, and a handful of services where the cost of me being
the single point of failure is that I'm inconvenienced, not that
someone else is. The seams I keep finding are not homelab problems.
They exist on every platform. Managed infrastructure just pays someone
else to notice them first. Running my own means I notice them, or
nobody does.
