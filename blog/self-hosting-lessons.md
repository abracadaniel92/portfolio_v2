# What self-hosting a homelab actually teaches you

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

I added dual tunnel replicas to the Cloudflare Tunnel setup that fronts
the homelab because a single tunnel is a single point of failure and
there's no on-call rotation behind this box to catch it if the process
dies. A managed load balancer gives you that redundancy by default,
and you never have to think about it. Here, someone has to notice the
gap before it gets closed, and that someone is me.

The site's own deploy pipeline is the clearer example. The
Content-Security-Policy header lives in a Caddyfile on the server;
the script tag that needs it lives in the app repo. Nothing connects
them except a paragraph in `DEPLOY.md` telling me to update both at
once. On a managed platform, that coupling either doesn't exist or is
enforced by the platform's own config surface. Here, the seam is real,
and I know it's real specifically because I'm the one who has to
remember it's there. A team with a platform engineer would have caught
this in a PR review. I catch it by having written the reminder to
myself.

Same shape with the build itself: the lockfile has to match whatever
Node and npm versions happen to be installed on that specific machine
right now. A commit exists in the portfolio's history purely to
re-sync `package-lock.json` after the server's Node version moved. The
real point of that commit has nothing to do with Node: when there's no
CI abstraction between the code and the metal, every version mismatch
becomes personally mine to notice.

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
someone else is. The seams I keep finding, the CSP living in a
different repo than the code that needs it, the lockfile tied to one
machine's installed versions, the tunnel with no rotation behind it,
are seams that exist on every platform. Managed infrastructure just
pays someone else to notice them first. Running my own means I notice
them, or nobody does.
