---
title: "My Pi-hole sent every DNS query to Google while Unbound sat idle next to it"
date: 2026-10-24
company: "Homelab"
summary: "The compose file told Pi-hole to use a local Unbound resolver. Pi-hole v6 ignores that variable without a warning, so every lookup in the house went to Google instead. One command shows what Pi-hole is really using."
---

# My Pi-hole sent every DNS query to Google while Unbound sat idle next to it

*Written with AI help, reviewed by the author.*

My Pi-hole was forwarding every DNS lookup in the house to Google. The
Unbound resolver it was supposed to use was running on the same Pi,
healthy, and answering nothing.

The compose file said otherwise:

```yaml
PIHOLE_DNS_: '127.0.0.1#5335'  # Upstream DNS (Unbound recursive resolver)
```

That variable belongs to Pi-hole v5. Version 6 ignores it without a
warning and keeps its settings in `pihole.toml` on the config volume. The
image was `pihole/pihole:latest`, which was already v6 when I added
Unbound in January, so as far as I can tell the line never did anything.
The commit that added it promised "no upstream DNS sees queries".
[QUESTION: fine to say it was like this since January? The log only proves the state on 17 October.]

Two more lines in the same file, `WEBPASSWORD` and `FTLCONF_LOCAL_IPV4`,
were dead for the same reason.

One command shows what Pi-hole is actually using:

```
docker exec pihole pihole-FTL --config dns.upstreams
```

Mine printed `[ 8.8.8.8, 8.8.4.4 ]`.

The fix is the same command with a value:

```
docker exec pihole pihole-FTL --config dns.upstreams '["127.0.0.1#5335"]'
```

Then I deleted the three dead variables and left a comment saying where
v6 keeps its settings, so the file stops lying to the next person who
reads it, who is me. While I was in there I turned on DNSSEC validation
in Unbound (`auto-trust-anchor-file: "/var/unbound/root.key"`).

The checks that it worked: a query to Unbound for `cloudflare.com` comes
back with the `ad` flag, `dnssec-failed.org` returns SERVFAIL, and the
Pi-hole log shows `forwarded ... to 127.0.0.1#5335`. Twelve uncached
domains resolved in 55 to 260 ms, with no failures.

If you run Pi-hole v6 next to Unbound and set it up from a v5-era guide,
run the first command.
