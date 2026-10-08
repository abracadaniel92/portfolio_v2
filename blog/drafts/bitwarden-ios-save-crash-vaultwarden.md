---
title: "Bitwarden on iOS crashes after saving to an old Vaultwarden, and every retry makes a duplicate"
date: 2026-10-08
company: "Homelab"
summary: "The Bitwarden iOS autofill extension crashed every time I saved a login. The save had already worked. The crash was the app failing to read the reply from a server nine months out of date."
---

# Bitwarden on iOS crashes after saving to an old Vaultwarden, and every retry makes a duplicate

When the Bitwarden iOS autofill extension crashes on save against a
self-hosted Vaultwarden, the save has usually already worked. Retrying
it creates a second copy of the same login.

The crash was a `DecodingError.typeMismatch`: the app expected a string
and got a dictionary. The server log shows the order of events:

```
14:57:57  POST /api/ciphers  => 200 OK    <- save succeeded
14:57:59  (app crashes)
14:58:04  POST /api/ciphers  => 200 OK    <- my retry, also succeeded
```

The app crashed reading the *reply* to a write that had already been
committed. The database had two identical 550-byte rows, seven seconds
apart. An earlier cluster of three saves in 26 seconds showed this had
been going on for at least a week before I noticed.

The cause was version skew. The app was 2026.9.0. The server was
Vaultwarden 1.35.1, about nine months and six releases behind, and the
release notes say it plainly: 1.37.0 is required for clients 2026.7.0
and up, and 1.37.2 for 2026.8.0 and up. The app updates from the App
Store on its own. My server didn't update at all, because its compose file
opted it out of Watchtower and the `:latest` tag hadn't been re-pulled
since December.

Upgrading to 1.37.3 fixed the crash. I pinned the tag so the next
version jump is a decision instead of an accident. The duplicates from
the crashed saves stay in the vault until you delete them.
