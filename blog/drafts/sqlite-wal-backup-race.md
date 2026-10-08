---
title: "Stopping the container before backing up SQLite still left seven weeks out of my Vaultwarden backup"
date: 2026-10-08
company: "Homelab"
summary: "My backup stopped Vaultwarden, tarred the SQLite file and skipped the WAL, on the assumption that shutdown had already folded the WAL in. It hadn't. The archive was missing seven weeks of data."
---

# Stopping the container before backing up SQLite still left seven weeks out of my Vaultwarden backup

A backup I took right before upgrading Vaultwarden had 598 entries, and
the newest one was from 3 August. The live vault had 603, and the newest
was from earlier that day, 25 September. The archive was valid, it
extracted cleanly, and it was missing seven weeks.

The backup script stopped the container, tarred `db.sqlite3`, and
excluded `*.sqlite3-wal` and `*.sqlite3-shm` by pattern, then started
the container again. That only works if SQLite has finished its
shutdown checkpoint, which copies everything in the WAL file back into
the main database, before `tar` reads the file. The whole
stop, tar, start sequence logged inside one second. `tar` got the main
file as it was before the checkpoint, and the 424 KB WAL holding the
recent writes was skipped on purpose.

This catches any service that keeps SQLite in WAL mode, not just
Vaultwarden. The fix is to stop trying to time the shutdown and use
SQLite's online backup API, which reads through the WAL and gives you a
consistent copy with the container still running:

```python
import sqlite3
src = sqlite3.connect("file:db.sqlite3?mode=ro", uri=True)
src.backup(sqlite3.connect("backup.sqlite3"))
```

`sqlite3 db.sqlite3 ".backup backup.sqlite3"` does the same from the
shell. Then check the copy with `PRAGMA integrity_check` and count the
rows against the live database.
