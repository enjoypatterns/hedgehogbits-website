---
title: Does deleting a vault app delete your files?
description: >-
  For most on-device vault apps, including Hedgehog Bits, deleting the app deletes the
  vault on the phone. What is safe, what is not, and how to keep a copy first.
last_modified_at: 2026-11-24
tags: [backup, how-to, data ownership]
image:
  path: /assets/blog/deleting-vault-app-deletes-files-social.jpg
  width: 1200
  height: 630
  alt: "Illustration of two movers wheeling away a cabinet full of photos while the owner holds one sealed teal box safely in their hands."
---

**Short answer:** yes, on the phone. If a vault keeps its files on the device, as Hedgehog Bits does, deleting the app deletes the vault with it. A synced copy or a backup you made survives.

That surprises people, and it is the cause of many "I lost all my photos" reviews. Here is how it works on iPhone and how to avoid it.

<figure>
  <img src="{{ '/assets/blog/deleting-vault-app-deletes-files.webp' | relative_url }}" width="1376" height="768" alt="Illustration of two movers wheeling away a cabinet full of photos while the owner holds one sealed teal box safely in their hands.">
</figure>

## Why the files go with the app

Every iPhone app has its own private storage area. Other apps can't read it, which is part of what keeps a vault private. When you delete an app, iOS deletes that storage area too.

Hedgehog Bits also keeps the vault out of iCloud and computer backups unless you turn on **Include in iPhone Backups**, so there is no hidden copy that comes back when you reinstall. Copies exist only where you chose to make them.

## Delete versus offload

iOS has two different options in *Settings → General → iPhone Storage*:

| Option | What happens to the vault |
|---|---|
| **Delete App** | The app and the vault are removed. |
| **Offload App** | The app is removed but its documents and data are kept. Reinstalling brings the vault back. |

If you turn on *Offload Unused Apps*, iOS may offload apps you rarely open. The data stays, so the vault is kept.

## What else removes the vault

- Erasing the iPhone (*Erase All Content and Settings*).
- Restoring the iPhone from a backup, unless you turned on **Include in iPhone Backups** before that backup was made.
- Setting up a new iPhone with Quick Start, which leaves the vault behind unless you turned on that same setting.
- Using **Erase Vault** in the app's settings.

## How to keep a copy

If you use sync (Hedgehog Bits Plus), your vault is already in your iCloud or the folder you chose. Reinstall Hedgehog Bits, tap **Join a Synced Vault…** and enter your password.

Otherwise, before deleting the app, erasing the phone or handing it in for repair:

1. Open the vault and choose **Settings → Export Backup…**
2. Save the `.hhbits` file somewhere outside the phone, such as a Mac or a USB drive.
3. Later, install Hedgehog Bits and choose **Restore from Backup…** on the first screen.

The backup stays encrypted and opens only with your vault password.

## If you have already deleted it

Without sync, an iPhone backup that includes it or an exported backup, the vault can't be recovered. There is no copy on our side, and recovery tools can't decrypt the data without the key. We know that is a hard answer. It is also what makes the vault private.

## Related

- [Moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %})
- [Hedgehog Bits vs cloud-based vault apps]({{ '/compare/cloud-photo-vaults/' | relative_url }})
