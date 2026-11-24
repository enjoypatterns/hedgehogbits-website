---
title: Hedgehog Bits vs cloud-based vault apps
section: compare
order: 3
eyebrow: Compare
description: >-
  Some vault apps back up to their own cloud with an account. Hedgehog Bits keeps the vault on your iPhone, with optional sync through your own iCloud or folder. The trade-offs between convenience and control.
lead: >-
  Many popular vault apps offer an account and cloud backup. That is genuinely useful.
  It is also a different model of ownership from a vault that keeps copies only where you put them.
permalink: /compare/cloud-photo-vaults/
last_reviewed: 2026-11-24
last_modified_at: 2026-11-24
---

*Last reviewed {{ page.last_reviewed | date: "%-d %B %Y" }}.*

## Two ways to build a vault

**Cloud-backed vaults** keep files on your phone and, optionally, copy them to the developer's servers. You sign in with an account, and your vault can be restored on a new phone or shared across devices. Some describe their backup as *zero-knowledge*, meaning the files are encrypted before upload with a key the company does not hold.

**On-device vaults** like Hedgehog Bits keep files on the device, with no account and no server of the developer's. Copies go only where you put them: Hedgehog Bits can sync an encrypted copy through your own iCloud or a folder you choose, include it in your iPhone backups, or export it as a file.

Both can be well built. The difference is about who holds what, and what you depend on.

## Side by side

| Compared | Cloud-backed vault | Hedgehog Bits |
|---|---|---|
| Account | Usually needed, at least for backup | None |
| Where copies live | Your phone and the developer's servers | Your phone, plus your own iCloud, folder or backups if you choose |
| New phone | Sign in and restore | Join the synced vault with your password, or restore a backup |
| If the phone is lost | Restore from the cloud | Join from your synced copy or restore a backup, if you keep one |
| Depends on the company | For backup, restore and sometimes access | Not after installation; sync depends only on your own storage |
| Information the service can see | Varies: account details, usage, file sizes, payment data | None. We run no servers for the app |
| Pricing | Often a subscription for cloud features | See the App Store listing |
| Password recovery | Sometimes available | Not available |

## When a cloud vault is the better choice

- You want automatic backup and don't want to think about it.
- You use the vault on more than one device.
- You want the company to handle storage for you, rather than using your own iCloud or cloud drive.

If you choose one, read its documentation on encryption and its privacy policy. *Zero-knowledge* backup is a strong design when it is implemented well. Check what is collected alongside your files, such as contact details, usage data and advertising identifiers.

## When an on-device vault is the better choice

- You want to decide whether any copy leaves your phone at all, and where it goes.
- You don't want an account linked to your vault, your email or your payment details.
- You want to keep using your files regardless of a company's future plans, pricing or servers.
- You are comfortable making a backup yourself, from time to time.

## What "owning your data" asks of you

An on-device vault puts you in control, and with that comes a small amount of responsibility:

- **Keep a copy.** Turn on sync or iPhone backups, or export a backup after adding things you can't replace.
- **Remember your password.** There is no reset.
- **Use a long password.** Synced and backed-up copies are encrypted and open only with your password, but they show roughly how large the vault is, and anyone holding one can try guesses.

[How to sync private files between iPhone and iPad]({{ site.baseurl }}{% post_url 2026-11-23-sync-private-files-between-iphone-and-ipad %}) and [moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %}) show how sync and backups work in practice.

## Related

{% include post-link.html slug="does-deleting-a-vault-app-delete-your-files" text="Does deleting a vault app delete your files?" prefix="- " suffix="" %}
- [Privacy policy]({{ '/privacy/' | relative_url }})
