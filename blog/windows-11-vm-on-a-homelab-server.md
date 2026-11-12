---
title: "A Windows 11 VM on a 7th-gen homelab server, and the disk driver that didn't stick"
date: 2026-11-12
company: "Homelab"
summary: "Running Windows 11 under KVM next to about 30 production containers on a 4-core i5-7500T. The one shortcut that cost me a boot loop: loading the virtio disk driver with drvload instead of through setup."
---

# A Windows 11 VM on a 7th-gen homelab server, and the disk driver that didn't stick

*Written with AI help, reviewed by the author.*

I wanted a Windows machine I could open and use the way you'd use a
Hyper-V VM on a desktop. I didn't want new hardware, so the candidate was
my homelab server: a Lenovo mini PC with an i5-7500T (4 cores, 7th
generation) that already runs about 30 containers people actually use.

It works. Windows 11 Pro runs under KVM, managed from Cockpit's web UI.
Most of the setup was routine. One shortcut during the install sent the
fresh Windows into a boot loop, and that's the part worth writing down.

## Can this box even do it?

The checks before installing anything:

- **Virtualization:** the CPU has VT-x and the `kvm_intel` module was
  already loaded.
- **Memory:** 31 GB in total, about 20 GB free with every container
  running.
- **Disk:** my mount named `/mnt/ssd_1tb` sounds like the right place for
  a VM image. It isn't. Despite the name, it's a 2.5" laptop hard drive,
  and it also holds my photo library. A Windows VM doing updates on a
  spinning disk shared with Immich would hurt both. The VM went on the
  NVMe instead.

## Making room

Space on the NVMe was the first problem. `docker image prune` (dangling
images only) freed **46 GB**, mostly old image layers left behind by
image updates. That took free space on `/home` from 147 to 190 GB.

I planned a 40 GB disk. Windows 11 setup refuses anything under 64 GB.
That's fine with a **thin qcow2** image: the file only grows as Windows
writes to it, so a "64 GB" disk costs what's actually used.

The VM: 8 GB RAM, 2 vCPUs (host-passthrough), UEFI with Secure Boot, a
software TPM 2.0 (`swtpm`), and the disk and network on virtio.

## Getting past the installer

Two things block a stock Windows 11 install here.

**The CPU isn't on Microsoft's list.** 7th-gen Intel is below the Windows
11 requirement. In setup, Shift+F10 opens a command prompt, and one
registry key skips the check:

```
reg add HKLM\SYSTEM\Setup\LabConfig /v BypassCPUCheck /t REG_DWORD /d 1 /f
```

**Setup sees no disk.** Windows has no virtio storage driver built in, so
the installer shows an empty disk list until you give it `viostor` from
the virtio-win ISO. That's where I took the shortcut.

## The trap: drvload works, until the first boot

Since I already had the Shift+F10 prompt open, I loaded the driver from
there:

```
drvload E:\viostor\w11\amd64\viostor.inf
```

The disk appeared, Windows installed, and on the first boot from disk it
crashed with `INACCESSIBLE_BOOT_DEVICE` (0x7B). Then again. A boot loop.

The reason: `drvload` loads a driver into the **running installer** only.
Setup doesn't know about it, so it never copies it into the new Windows.
The installed system boots, can't read its own disk, and stops.

The right way is setup's own **Load driver** button on the disk screen
(Browse to `E:\viostor\w11\amd64`). Setup then installs the driver into
the new system as well.

## The fix without reinstalling

I didn't have to start over. The driver can be injected into the
installed image from the installer:

1. Boot the ISO again and open Shift+F10.
2. `drvload` viostor again, so the installed `C:` becomes visible.
3. Add the drivers to the installed Windows with DISM:

   ```
   dism /image:c:\ /add-driver /driver:e:\viostor\w11\amd64\viostor.inf /driver:e:\netkvm\w11\amd64\netkvm.inf
   ```

4. `wpeutil shutdown`, then boot from disk.

I added the NetKVM network driver in the same step, which meant the
first-run setup had internet straight away instead of another missing
driver.

## Driving a VM when the console drops keys

Cockpit's browser console didn't pass arrow keys through to the UEFI boot
menu, which matters when you're picking a boot device. The workaround was
to drive the VM from the host's shell instead:

```bash
virsh send-key win11 KEY_DOWN
virsh screenshot win11 screen.ppm
```

Send a key, take a screenshot, look, repeat. Slow, but it doesn't depend on
the browser. Later, with the QEMU guest agent installed, the host can run
PowerShell inside Windows directly, which was handy when the console
keyboard misbehaved again.

## Networking without touching the host

The server's network carries every live service, so I didn't want to
rebuild it into a bridge. The VM uses **macvtap** on the physical NIC
instead: it gets its own address from the router like any other machine on
the LAN, and the host's network config doesn't change at all.

The cost is a known macvtap limitation: the host itself can't talk to the
VM over that interface, and neither can anything that comes in through the
host, like my VPN clients. For remote access I added a second, isolated
host-only network and tunnel RDP through SSH to it. On the LAN, Remote
Desktop goes straight to the VM.

## What it costs the server

During Windows Update, the worst case so far:

| | |
|---|---|
| VM | 2 cores at 100% |
| Host CPU idle | 28% |
| CPU temperature | 66 °C |
| Swap use | 2 GB to 3.2 GB |

The containers kept running fine. But swap growing under load says 8 GB is
the ceiling for this VM on this box. The VM doesn't autostart; I start it
from Cockpit when I need it.

## What I'd tell someone doing the same

- Check what your disks actually are, not what their mount points are
  called.
- Use a thin qcow2 to satisfy Windows' 64 GB minimum without paying for
  it.
- Load the virtio disk driver with setup's **Load driver** button, never
  `drvload`. If you already did, `dism /add-driver` fixes it without a
  reinstall.
- Keep `virsh send-key` and `virsh screenshot` in mind for when the web
  console fails you.
