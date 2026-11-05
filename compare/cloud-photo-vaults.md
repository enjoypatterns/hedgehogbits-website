---
title: Hedgehog Bits vs cloud-based vault apps
section: compare
order: 3
eyebrow: Compare
description: >-
  Some vault apps back up to their own cloud with an account. Hedgehog Bits keeps everything on the iPhone. The trade-offs between convenience and control.
lead: >-
  Many popular vault apps offer an account and cloud backup. That is genuinely useful.
  It is also a different model of ownership from an offline vault.
permalink: /compare/cloud-photo-vaults/
last_reviewed: 2026-11-04
last_modified_at: 2026-11-04
---

*Last reviewed {{ page.last_reviewed | date: "%-d %B %Y" }}.*

## Two ways to build a vault

**Cloud-backed vaults** keep files on your phone and, optionally, copy them to the developer's servers. You sign in with an account, and your vault can be restored on a new phone or shared across devices. Some describe their backup as *zero-knowledge*, meaning the files are encrypted before upload with a key the company does not hold.

**Offline vaults** like Hedgehog Bits keep files only on the device. There is no account and no server. If you want a copy elsewhere, you export it yourself.

Both can be well built. The difference is about who holds what, and what you depend on.

## Side by side

| Compared | Cloud-backed vault | Hedgehog Bits |
|---|---|---|
| Account | Usually needed, at least for backup | None |
| Where copies live | Your phone and the developer's servers | Your phone, plus any backup file you export |
| New phone | Sign in and restore | Export a file, restore on the new phone |
| If the phone is lost | Restore from the cloud | Restore from your last exported backup, if you have one |
| Depends on the company | For backup, restore and sometimes access | Not after installation |
| Information the service can see | Varies: account details, usage, file sizes, payment data | None. We run no servers for the app |
| Pricing | Often a subscription for cloud features | See the App Store listing |
| Password recovery | Sometimes available | Not available |

## When a cloud vault is the better choice

- You want automatic backup and don't want to think about it.
- You use the vault on more than one device.
- You would rather accept an account than risk losing files with a lost phone.

If you choose one, read its documentation on encryption and its privacy policy. *Zero-knowledge* backup is a strong design when it is implemented well. Check what is collected alongside your files, such as contact details, usage data and advertising identifiers.

## When an offline vault is the better choice

- You don't want any copy of your files on someone else's servers, however it is encrypted.
- You don't want an account linked to your vault, your email or your payment details.
- You want to keep using your files regardless of a company's future plans, pricing or servers.
- You are comfortable making a backup yourself, from time to time.

## What "owning your data" asks of you

An offline vault puts you in control, and with that comes a small amount of responsibility:

- **Export a backup** after adding things you can't replace, and keep it somewhere safe.
- **Remember your password.** There is no reset.
- **Keep the backup file private.** It is encrypted and opens only with your password, but it does show roughly how large the vault is.

[Moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %}) shows how backups work in practice.

## Related

{% include post-link.html slug="does-deleting-a-vault-app-delete-your-files" text="Does deleting a vault app delete your files?" prefix="- " suffix="" %}
- [Privacy policy]({{ '/privacy/' | relative_url }})
