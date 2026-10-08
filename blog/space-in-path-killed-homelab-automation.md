---
title: "A space in a folder name killed my homelab's backups and health checks for eight months"
date: 2026-10-08
company: "Homelab"
summary: "From January to September, the health check, the backups and the auto-recovery on my homelab were all dead, and nothing told me. The cause was one space in a path. The reason nobody noticed was a design mistake I had made on purpose."
---

# A space in a folder name killed my homelab's backups and health checks for eight months

From 28 January to 25 September 2026, the hourly health check on my
homelab failed every time it ran, the nightly backups never ran at all,
and the auto-recovery that restarts Caddy when it falls over was switched
off with them. Nothing alerted. I found out because I went to
check a Vaultwarden backup for an unrelated reason and the newest one
was dated 28 January.

The cause was a space. The repo that holds all of these scripts lives
under `~/Desktop/Cursor projects/`, and every cron line and systemd unit
that pointed at it did so without quotes.

## What I had built, and why it looked fine

The setup was reasonable, and I'd defend most of it. A systemd timer ran
a health-check engine every hour. The engine sourced a folder of small
check modules (Caddy, the tunnel, disk, memory, backups) and posted to a
Mattermost webhook when something was wrong. Backups ran from cron at
02:00 and synced to Backblaze at 03:00. Watchtower updated containers
overnight.

Every one of those had a green signal I could look at.
`systemctl list-timers` showed the health check with a recent `LAST`
time. `docker ps` showed Watchtower as `Up 2 weeks (healthy)`. The
Mattermost channel was quiet, which is what a quiet channel is supposed
to mean.

## What actually happened

systemd split `ExecStart` on the space and tried to run a file called
`/home/goce/Desktop/Cursor`, which does not exist. Exit status
`203/EXEC`, every hour, for eight months. The timer still fired on
schedule, which is why `LAST` looked fresh: the timer was healthy, the
thing it started was not.

Cron did something stranger. It split the backup line on the same space,
so the `>>` log redirect ended up pointed at the bare word
`/home/goce/Desktop/Cursor`, and cron created it. The smoking gun was a
zero-byte file of that name on my desktop, dated 17 January. It had been
sitting there in plain sight the whole time.

Once I started looking, it wasn't one failure:

| System | State | Dead since |
|---|---|---|
| Health check + auto-recovery | `203/EXEC` every hour | 28 Jan |
| Backups, all 5 services | never executed | 17 Jan |
| Watchtower | panicking nightly, still "healthy" | 27 Mar |
| Container start-on-boot unit | `203/EXEC` | 7 Sep |

Watchtower was a separate bug that only looked like the same one. Its
scheduled job panicked inside a goroutine that the cron library
recovers, so the container stayed up and green while doing nothing. Its
last completed run was 27 March. It also held a root Docker socket on
the box running my password manager, for an updater that hadn't updated
anything in six months. I deleted it.

I don't have a clean record of when the path changed. The zero-byte
file is the earliest evidence I have, and I'm not going to pretend I
know more than that.

## The actual mistake

The space was the trigger. The reason it went unnoticed for eight
months was a design choice: every alert in the homelab was sent *by*
the health-check engine. When that engine stopped running, the thing
responsible for reporting outages was itself the outage. A monitor that
can only report failures it survives isn't a monitor, and I had built
exactly one of those and pointed everything at it.

The fix for that is systemd's `OnFailure=`. It fires a second unit when
a service fails, and it fires even when `ExecStart` never gets off the
ground, which is precisely the case that had been invisible. I added a
small `notify-failure@.service` and attached it to every scheduled job.
The Backblaze sync moved from cron onto a systemd timer to get the same
cover. The backups still run from cron, so they got a different guard: a
check that alarms when any service's newest backup is older than it
should be.

For the space itself there were two options. Quote every path in every
caller, or give the repo a path with no space in it. Quoting is the
correct fix, and it's also a fix you have to get right forever, in every
new script, including the ones I write tired. I made `/opt/homelab` a
symlink to the repo and pointed everything through it. That closes the
whole class of bug instead of the instances I happened to find.

The symlink had a cost I didn't see coming, and it showed up in the
same session. Because the live scripts now run straight out of the git
working tree, `git checkout` on the server is a deploy. I checked out
an old branch to look at something and silently reverted the backup
script I had just repaired, with the hourly timer armed. It's in the
repo's `CLAUDE.md` now in capital letters.

## What the revived health check found about itself

Bringing the health check back to life meant reading it properly for the
first time in months, and two of its checks turned out to be incapable
of reporting anything.

The HTTP probe was `curl -s --connect-timeout "$timeout" "$url"`, and it
treated exit 0 as healthy. curl exits 0 for any response that arrives, so a 404
or a 502 from Caddy counted as up. Caddy's documented failure mode on
this box is serving 502s. The auto-restart could never fire for the one
outage it was written for.

The worst alert in the system, external access down, which pages
`@all`, was going out with an empty title and an empty body. The
module set them with `local` at the top level of a sourced file, and
bash refuses `local` outside a function: it prints an error and assigns
nothing.

Neither bug was new. Both had been switched off along with everything
else, and my repair switched them back on.

## What I'd do differently

Test the failure, not the pass. Every check I had was tested by the
check passing, which proves nothing about what happens when it fails.
The health checks have a small test script now, and every assertion in
it was run against the broken code first and had to fail before it
counted. The alert path got the same treatment: one deliberate test
alert, sent through the engine's own function, not a separate test
script that only proves itself.

And log something on the healthy path. A check that's silent when
everything is fine looks exactly like a check that never ran. For eight
months that's what my logs looked like, and I read them as good news.
