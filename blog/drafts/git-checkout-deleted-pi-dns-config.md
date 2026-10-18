---
title: "A git checkout deleted the config file my Pi's DNS resolver was running from"
date: 2026-10-31
company: "Homelab"
summary: "Unbound on my Raspberry Pi reads its config straight out of a git checkout. A branch switch deleted that file while Unbound was still running, and the next restart would have taken DNS down for every device on the network."
---

# A git checkout deleted the config file my Pi's DNS resolver was running from

*Written with AI help, reviewed by the author.*

`git checkout main` on my Raspberry Pi deleted `unbound.conf` while Unbound
was still running from it. Nothing broke, which was the dangerous part.

The Pi runs Pi-hole for the network, and Pi-hole forwards every lookup to
Unbound on `127.0.0.1:5335`. Unbound's compose file bind-mounts its config
straight out of my homelab repo:

```yaml
./unbound.conf:/etc/unbound/unbound.conf:ro
```

My own commit on `main` had moved the Pi's stacks from `docker/unbound/` to
`pihole/docker/unbound/`. The Pi's checkout was still on `develop`, so
switching it to `main` removed the old file. The container kept serving,
because a process that already has a file open keeps reading it after the
file is deleted. The next restart or reboot would have gone differently.
Docker would have created an empty directory at the missing path, Unbound
would have failed to start, and Pi-hole would have stopped resolving for
every device on the network.

The fix took two commands. `git diff -M -w` confirmed the moved files
differed from the old ones only in whitespace, then `docker compose up -d`
recreated Unbound from the new folder. Pi-hole needed nothing: it keeps its
config in named volumes, and its compose folder name hadn't changed.

This wasn't the first time the repo had caught me. Eight days earlier, on
the main server, checking out an old branch silently reverted a backup
script I had just repaired, because the live scripts there also run
straight out of the working tree. That one is part of
[a longer story](/blog/space-in-path-killed-homelab-automation).

So any pull, branch switch or move that touches that folder now gets a
recreate afterwards, and this shows which file the container is reading right now:

```bash
docker inspect unbound --format '{{range .Mounts}}{{.Source}}{{end}}'
```
