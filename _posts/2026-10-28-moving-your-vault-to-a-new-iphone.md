---
title: Moving your vault to a new iPhone
description: >-
  Hedgehog Bits stays out of iCloud and phone-to-phone transfer unless you choose
  otherwise. Here is how to move your vault: with sync, an iPhone backup, or an
  encrypted backup file.
last_modified_at: 2026-11-24
tags: [backup, how-to, data ownership]
image:
  path: /assets/blog/move-vault-to-new-iphone-social.jpg
  width: 1200
  height: 630
  alt: "Illustration of a hand carrying a sealed teal envelope from an old smartphone to a new one, with a laptop and a USB drive on the desk."
---

A new iPhone usually copies everything across on its own. Hedgehog Bits is an exception, by design: unless you choose otherwise, the vault is left out of iCloud backups, computer backups and Quick Start transfer. That way, a copy of your vault only exists where you put one.

There are three ways to move it, and each takes a couple of minutes:

- **If you use sync** (Hedgehog Bits Plus): install Hedgehog Bits on the new iPhone, tap **Join a Synced Vault…** on the first screen and enter your password. [How to sync private files between iPhone and iPad]({{ site.baseurl }}{% post_url 2026-11-23-sync-private-files-between-iphone-and-ipad %}) explains it.
- **If you turned on Settings → Include in iPhone Backups**: set up the new iPhone from an iCloud or computer backup made since, and the vault comes back. For iCloud, iCloud Backup must be on in your iPhone's Settings.
- **Otherwise, with a backup file**, as below.

<figure>
  <img src="{{ '/assets/blog/move-vault-to-new-iphone.webp' | relative_url }}" width="1376" height="768" alt="Illustration of a hand carrying a sealed teal envelope from an old smartphone to a new one, with a laptop and a USB drive on the desk.">
</figure>

## On your old iPhone

1. Open the vault.
2. Go to **Settings → Export Backup…**
3. Save the `.hhbits` file somewhere you can reach from the new phone: AirDrop it to your Mac, save it to Files, or copy it to a USB drive.

Keep the app open until the export finishes. If the app locks during an export, the export is cancelled, so the key is never kept in the background.

## On your new iPhone

1. Install Hedgehog Bits.
2. On the first screen, tap **Restore from Backup…**
3. Choose the backup file and enter the vault password.

Your folders, files and password come back exactly as they were. From then on, type your password where the app asks for your name.

## What makes the backup safe

The backup is the vault's own ciphertext, packed into a single file. It is never decrypted or re-encrypted along the way, so it is as strong as the vault itself.

- **It opens only with your password.**
- **It can't be quietly modified.** An HMAC keyed from your master key covers every entry. If anything is changed, removed, swapped or added, the restore is refused.
- **Restore is all-or-nothing.** The password is checked before anything is written. The data is unpacked into a staging area, verified, flushed to disk and only then moved into place. A damaged file or an interrupted restore can't leave you with half a vault.

## Things to keep in mind

- **A backup is a snapshot.** It contains what was in the vault when you exported it. Export again after adding important files.
- **It reveals size, not content.** Someone with the file can see roughly how big the vault is and how many items it holds, but nothing inside it.
- **Where you keep it is your choice.** A USB drive in a drawer, an encrypted disk, or a cloud folder you already trust. Each has trade-offs, and you are best placed to judge them.
- **Make one before you need it.** If your phone is lost or erased and you have no backup, no iPhone backup that includes the vault and no sync, the vault is gone too.
{% include post-link.html slug="sync-private-files-between-iphone-and-ipad" prefix="- **Want two devices to stay the same instead?** See " text="how to sync private files between iPhone and iPad" suffix="." %}
