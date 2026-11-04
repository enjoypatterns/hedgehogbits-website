---
title: Does deleting a vault app delete your files?
description: >-
  For most offline vault apps, including Hedgehog Bits, deleting the app deletes the
  vault. What is safe, what is not, and how to keep a copy first.
tags: [backup, how-to, data ownership]
---

**Short answer:** yes. If a vault keeps its files on the device, as Hedgehog Bits does, deleting the app deletes the vault with it.

That surprises people, and it is the cause of many "I lost all my photos" reviews. Here is how it works on iPhone and how to avoid it.

## Why the files go with the app

Every iPhone app has its own private storage area. Other apps can't read it, which is part of what keeps a vault private. When you delete an app, iOS deletes that storage area too.

Hedgehog Bits also keeps the vault out of iCloud and computer backups on purpose, so there is no hidden copy that comes back when you reinstall.

## Delete versus offload

iOS has two different options in *Settings → General → iPhone Storage*:

| Option | What happens to the vault |
|---|---|
| **Delete App** | The app and the vault are removed. |
| **Offload App** | The app is removed but its documents and data are kept. Reinstalling brings the vault back. |

If you turn on *Offload Unused Apps*, iOS may offload apps you rarely open. The data stays, so the vault is kept.

## What else removes the vault

- Erasing the iPhone (*Erase All Content and Settings*).
- Restoring the iPhone from a backup, because the vault is not in backups.
- Setting up a new iPhone with Quick Start, which leaves the vault behind.
- Using **Erase Vault** in the app's settings.

## How to keep a copy

Before deleting the app, erasing the phone or handing it in for repair:

1. Open the vault and choose **Settings → Export Backup…**
2. Save the `.hhbits` file somewhere outside the phone, such as a Mac or a USB drive.
3. Later, install Hedgehog Bits and choose **Restore from Backup…** on the first screen.

The backup stays encrypted and opens only with your vault password.

## If you have already deleted it

Without an exported backup, the vault can't be recovered. There is no server copy, and recovery tools can't decrypt the data without the key. We know that is a hard answer. It is also what makes the vault private.

## Related

- [Moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %})
- [Hedgehog Bits vs cloud-based vault apps]({{ '/compare/cloud-photo-vaults/' | relative_url }})
