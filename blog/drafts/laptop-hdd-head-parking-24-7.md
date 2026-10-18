---
title: "A laptop hard drive in my homelab parked its heads 282,000 times in 9,400 hours"
date: 2026-11-07
company: "Homelab"
summary: "A 2.5-inch laptop drive running 24/7 had used almost half its rated head load cycles, because its power saving parked the heads every two minutes. One hdparm setting stopped it."
---

# A laptop hard drive in my homelab parked its heads 282,000 times in 9,400 hours

*Written with AI help, reviewed by the author.*

The drive that holds my photo library had a SMART `Load_Cycle_Count` of
282k after 9.4k power-on hours. It's a WD10SPZX, a 2.5" laptop drive,
rated for about 600k load cycles. At the rate it was going, it would have
reached that rating in roughly 1.2 years.

A load cycle is the drive parking its read/write heads off the platters
to save power. On a laptop that's sensible: the disk sits idle, the heads
park, the battery lasts longer. In a server that never sleeps, the drive
parked its heads about every two minutes, around 30 times an hour, all
day, every day. Nothing complained. I only found it by reading the
SMART output, 9.4k hours in.

The fix is the drive's APM (Advanced Power Management) level. `254` means
maximum performance, which on this drive means no head parking:

```bash
sudo hdparm -B 254 /dev/sdX
```

The setting resets when the drive loses power, so it also has to go in
`/etc/hdparm.conf` to be applied at boot. Use the `by-id` path, since
`/dev/sdX` names can change between boots:

```
/dev/disk/by-id/ata-WDC_WD10SPZX-<serial> {
	apm = 254
}
```

I wrapped both in a small
script that saves a baseline count on the first run and prints the growth
since then on every later run. The result, 215 minutes after the change:

```
 APM_level      = 254
Load cycles: +0 in 215 min (before the fix: ~30/hour)
```

That fixes the parking, not the drive. It's still a laptop drive running
24/7, so I watch `Reallocated_Sector_Ct` and `Current_Pending_Sector` in
SMART, and the script gets re-run after the next reboot to confirm the
setting stuck.
