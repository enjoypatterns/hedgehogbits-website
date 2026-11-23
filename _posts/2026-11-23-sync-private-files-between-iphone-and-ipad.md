---
title: How to sync private files between iPhone and iPad
description: >-
  Keep private files the same on iPhone and iPad without buying more iCloud storage:
  sync encrypted copies through iCloud or a free Google Drive or Dropbox folder.
tags: [backup, how-to, data ownership]
image:
  path: /assets/blog/sync-private-files-iphone-ipad-social.jpg
  width: 1200
  height: 630
  alt: "Illustration of a person relaxing on a sofa with a tablet while a sealed teal envelope travels from their phone, through a small cloud, to the tablet."
---

Keeping private files on two devices usually means trusting a cloud service with them. And if your iCloud storage is already full, the obvious option costs money.

You don't need either. If what leaves your phone is already encrypted, it can go through any storage you have, free or paid, and the company holding it can't read it.

<figure>
  <img src="{{ '/assets/blog/sync-private-files-iphone-ipad.webp' | relative_url }}" width="1376" height="768" alt="Illustration of a person relaxing on a teal sofa in the evening, reading on a tablet. A sealed teal envelope follows a dotted path from the phone lying on the cushion, through a small cloud, to the tablet.">
</figure>

## The short version

Hedgehog Bits can keep your vault the same on several devices, through your own iCloud or any folder in the Files app, such as Google Drive or Dropbox. Only encrypted files leave your iPhone. Sync is part of Hedgehog Bits Plus. Exporting a backup file stays free.

## Two ways to sync

Open the vault, go to **Settings → Sync** and choose:

- **iCloud.** The vault goes to a private area of your own iCloud that only the app can use. It's the simplest choice if you have room, but it counts against your iCloud storage, and the free plan is [5 GB shared with your backups and photos](https://support.apple.com/en-us/108922).
- **Folder.** You pick a folder in the Files app, and the vault syncs through it. It works with any service that shows up in Files: Google Drive (its [15 GB free is shared with Gmail and Google Photos](https://support.google.com/googleone/answer/9312312)), Dropbox ([2 GB on the free Basic plan](https://help.dropbox.com/plans/dropbox-basic-faq)), OneDrive, Nextcloud, or a drive on your home network. Install the service's app first, and pick one of its folders, not one under **On My iPhone**, which stays on that phone.

You don't need to tidy anything first: the app puts everything in a new **Hedgehog Bits** folder inside the one you choose, so your own files stay separate. Each Hedgehog Bits folder holds one vault. If it already holds a different one, the app says so and won't sync with it.

## Adding your iPad or a second iPhone

1. Install Hedgehog Bits on the other device. It's made for iPhone, and it runs on iPad too.
2. On the first screen, tap **Join a Synced Vault…**
3. Choose **iCloud** (signed in to the same Apple Account) or **Folder**, then pick the **Hedgehog Bits** folder, or the folder that contains it.
4. Enter your vault password. It's checked before anything is saved on the device.

The vault then downloads. From then on, both devices keep each other up to date.

## What the storage company can see

Everything the app uploads is already encrypted on your phone, with keys that never leave it. So Apple, Google or Dropbox can see:

- that there are some files, how many, and roughly how big the vault is;
- when they change.

They can't see file names, folder names, notes, photos or anything else inside. Nor can anyone who gets into your cloud account. Your vault password is what protects the copy, so make it long: our [password checker]({{ '/tools/password-checker/' | relative_url }}) shows how long a password would take to guess. [How Hedgehog Bits encrypts your files]({{ site.baseurl }}{% post_url 2026-10-24-how-hedgehog-bits-encrypts-your-files %}) explains the encryption itself.

### What about the decoy vault?

The synced copy looks the same whether or not you have a [decoy vault]({{ '/features/' | relative_url }}). Suppose someone makes you open the decoy, then points sync at a folder of their own. The app uploads nothing that would help them guess your real password, and your real vault doesn't sync there unless you agree.

## When it syncs

- When you open the vault.
- A few seconds after you change something.
- Every 30 seconds while the vault is open.

The vault locks as soon as you leave the app. If you lock it straight after a change, the app still sends that change, using only the encrypted files: your key is gone the moment the vault locks. If the synced copy changed meanwhile, the two are combined the next time you open the vault instead. Otherwise nothing syncs while the vault is locked, so each device catches up when you next open the vault on it.

### If you edit the same note on both devices

If you change the same note or file on both devices before they've synced, you keep both. One version keeps its name and the other is saved as "(conflict)", so nothing is overwritten. Other changes simply combine: something added on one device and something deleted on the other both happen.

### If a sync is interrupted

Nothing is lost. Files go up before the list that names them, so the other device never sees a half-finished change. The next sync carries on where the last one stopped.

### If you change your password

The new password reaches your other device the next time you open the vault there with the old one and it syncs. After that, only the new password works.

## Sync isn't a backup

Sync keeps two copies the same, deletions included: delete something on your iPhone and it goes from your iPad too. For a copy that stays as it was, use one or both of these:

- **Settings → Export Backup** saves the whole vault as one encrypted file you can keep anywhere. It's free, and [moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %}) shows how to restore it.
- **Settings → Include in iPhone Backups** (off unless you turn it on) puts the encrypted vault in your iCloud or computer backups, so restoring a whole phone brings it back.

## Related

- [Moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %})
- [What to check before trusting a vault app]({{ site.baseurl }}{% post_url 2026-11-11-what-to-check-before-trusting-a-vault-app %})
- [Hedgehog Bits and cloud photo vaults compared]({{ '/compare/cloud-photo-vaults/' | relative_url }})
- [Security design]({{ '/security/' | relative_url }})
