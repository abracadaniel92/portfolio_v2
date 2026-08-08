---
title: "Replacing a VPN with a Cloudflare Tunnel secured by 2FA on every service"
date: 2026-03-16
company: "Homelab"
summary: "Every internal service on my homelab sits behind a Cloudflare Tunnel with 2FA on each one, not a VPN. Reliability, not an exotic attack scenario, was the real design constraint."
---

# Replacing a VPN with a Cloudflare Tunnel secured by 2FA on every service

My router restarts once a day, and where I live loses power or
connectivity often enough that reliability, not some exotic attack
scenario, was the real design constraint on how the homelab gets
accessed from outside. Every internal service sits behind a
Cloudflare Tunnel instead of a VPN, with two-factor authentication
required on every single one.

## Why not a VPN

A VPN was the obvious way to reach a homelab from another machine, and
I turned it down for one reason: I hated having to turn it on. A VPN
client is a switch you have to remember to flip before every session,
on every device, and forget it once and you're staring at a service
that just won't load with no clue why. A Cloudflare Tunnel makes every
internal service reachable through its own address with no client to
launch first. Access control moved from "are you on the VPN" to "can
you pass 2FA for this specific service", which is both less friction
day to day and a tighter check per service instead of one blanket
tunnel into the whole network.

## What "identity-based" actually means here

Every service behind the tunnel has its own access policy, and every
one of those policies requires two-factor authentication. There's no
single login that then grants access to everything, the way a VPN
would. Getting into one service proves nothing about any other one.
That's a meaningfully smaller blast radius than a VPN gives you: a
compromised VPN credential is a compromised network, a compromised
login for one service is a compromised login for one service.

## The redundancy that doesn't cover the thing I built it for

I added a second tunnel replica specifically to chase 100% uptime,
because a single `cloudflared` process is a single point of failure if
it crashes. That reasoning is sound as far as it goes, but it doesn't
actually reach the failure I have every single day: the router
restarts once every 24 hours, and both replicas run behind that same
router. When the router goes down, so does the one uplink both
replicas depend on, and no number of tunnel processes changes that.
The redundancy I built only protects against `cloudflared` dying on
its own, which has nothing to do with the router-level outage that
happens daily.

And yet I haven't noticed downtime from it. My actual guess is that a
router restart is fast, seconds rather than minutes, and the odds of
someone hitting one of these services in that exact window are low
enough that it just hasn't registered as an outage yet. "No downtime
noticed" is not the same claim as "no downtime happened." I've been
treating them as the same thing, and they aren't.

## What I'd change

Actually measure it instead of trusting that nothing's broken because
nothing's been reported. A simple uptime check hitting one of these
services every minute would turn "I haven't noticed anything" into a
real number, and it would tell me directly whether the daily restart
is actually invisible or just unwitnessed. If those seconds turn out
to cost real availability, a third tunnel replica won't fix it.
Redundancy at the uplink itself, a second connection the router can
fail over to, is the only layer that was ever going to cover a
router-level outage in the first place.
