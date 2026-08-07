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

Bitwarden is the one that would actually hurt. Nobody else uses that
vault, so the blast radius really does stop at me, which is the
condition I set for putting anything on this box at all. The backup
runs automatically onto drives in that same box, and a weekly copy
goes to Backblaze. I have confirmed that any of it actually restores
exactly once.

Both halves of that are worth looking at directly. The copy I would
reach for first lives inside the machine it is protecting, which means
it covers me for deleting something by accident and for nothing else.
The copy that would survive the machine is up to seven days old, so
the real question is not whether I lose the vault but how much of a
week I am willing to lose with it. Neither of those is a mistake
exactly. They are just what I chose, and I only know I chose them
because there was no one else to choose for me.

The restore is the part I would actually defend least. An automated
backup is a process that runs. A tested restore is evidence the
process produces something usable. I have a great deal of the first
and one instance of the second, and the distance between them stays
invisible until the single day it is the only thing that matters. A
hosted password manager makes verifying that somebody else's full-time
job. They do it continuously, whether or not anyone asks, and running
my own is the only reason I have ever had to think about the
difference at all.

Then there is the one that actually broke. A Raspberry Pi running
Pi-hole handled DNS for the entire house. When the Pi died, nobody
living here could reach anything. Not a slow page or a degraded
service: no internet, for everyone, until I got to it. Nobody else in
the house could have fixed it, and more to the point, nobody else
could have diagnosed it. The symptom was "the internet is broken",
which points a reasonable person at their router or their ISP, not at
a dead single-board computer on a shelf doing a job they never knew
was being done.

## What I'd actually narrow this to

The useful version of "self-host your own infrastructure" is narrower
than the slogan: self-host the things where understanding every
failure mode beats someone else's five nines (99.999% uptime), and
skip anything where
the blast radius reaches past you. A client's production traffic,
another team's data, anything with a support obligation to a third
party: none of that belongs on a shelf with one on-call engineer, and I
wouldn't put it there.

What belongs there is most of what's there now: a portfolio site, a
personal cloud, a password vault whose blast radius genuinely does stop
at me. DNS was the exception, and I had it wrong for as long as it ran
that way. Putting name resolution for a household on one Raspberry Pi
took a service everyone depends on and gave it a single point of
failure only one person could even identify, which is exactly the
arrangement I just spent this whole post arguing against.

It is still one Pi. I have not built a fallback, and the only thing
that has genuinely changed is that I recognize the symptom now: when
the house says the internet is down, I check the Pi before I check
anything else. That is a faster diagnosis, not a fix. The single point
of failure sits exactly where it always sat, and the improvement is
entirely in my head.

That is the part worth keeping. The seams I keep finding are not
homelab problems. They exist on every platform. Managed infrastructure
just pays someone else to notice them first. Running my own means I
notice them, or nobody does, and sometimes it means I notice them from
the other side of a house where nothing loads.
