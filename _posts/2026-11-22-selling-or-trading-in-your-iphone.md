---
title: Selling or trading in your iPhone without losing your vault
description: >-
  How to move a Hedgehog Bits vault to your new iPhone and make sure nothing private
  is left on the old one before you sell it, trade it in or give it away.
tags: [how-to, backup, iphone]
---

When you replace a phone, two things matter: your files should arrive safely on the new one, and nothing private should be left on the old one. Apple's [guide to selling or trading in an iPhone](https://support.apple.com/109511) covers the device as a whole. This post covers the vault.

## Step 1: Move the vault first

The vault isn't carried across by Quick Start or iCloud Backup, so move it yourself before you erase anything.

1. On the old phone, open the vault and choose **Settings → Export Backup…**
2. Save the `.hhbits` file to Files, AirDrop it to a Mac, or copy it to a USB drive.
3. On the new phone, install Hedgehog Bits and tap **Restore from Backup…**
4. Choose the file and enter your vault password.
5. Open the vault on the new phone and check that your files are there.

Only continue once the new phone has everything.

## Step 2: Erase the old phone

Follow Apple's steps, which end with *Erase All Content and Settings*. Erasing an iPhone removes the vault along with everything else.

The vault was already encrypted with its own key before you erased it, and erasing the device removes the keys that protect its storage. There is nothing extra you need to do for Hedgehog Bits.

If you are trading in at an Apple Store, Apple's guide asks you to let the specialist complete the erase. Make sure your vault backup is done before you go.

## Step 3: Look after the backup file

After restoring, you may still have the `.hhbits` file on a Mac or USB drive. It is encrypted and opens only with your vault password. You can keep it as a backup or delete it. If you keep it, remember it is a snapshot from the day you exported it.

## Common mistakes

- **Erasing before checking the restore.** Confirm the new phone opens the vault first.
- **Relying on iCloud Backup.** It doesn't include the vault, by design.
- **Forgetting the password.** The backup needs the vault password that was in use when you exported it.

## Related

- [Moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %})
{% include post-link.html slug="before-you-hand-in-your-iphone-for-repair" text="Before you hand in your iPhone for repair" prefix="- " suffix="" %}
