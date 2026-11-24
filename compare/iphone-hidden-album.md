---
title: Hedgehog Bits vs the iPhone Hidden album
section: compare
order: 1
eyebrow: Compare
description: >-
  The iPhone Hidden album keeps photos out of view behind Face ID. Hedgehog Bits encrypts them with its own password, and anything it syncs is encrypted first. The difference.
lead: >-
  Apple's Hidden album is built in, free and convenient. It is designed to keep photos
  out of sight, which is different from keeping them encrypted under a key only you hold.
permalink: /compare/iphone-hidden-album/
last_reviewed: 2026-11-24
last_modified_at: 2026-11-24
---

*Last reviewed {{ page.last_reviewed | date: "%-d %B %Y" }}.*

## The short answer

- **Use the Hidden album** if you want certain photos out of your main library and the people around you are not going to try to get past Face ID or your passcode.
- **Use a vault like Hedgehog Bits** if you want files protected by a password that is separate from your phone's passcode, encrypted before any copy reaches iCloud, and covering documents and notes as well as photos.

## Side by side

| Compared | iPhone Hidden album | Hedgehog Bits |
|---|---|---|
| What unlocks it | Face ID, Touch ID or the **device passcode** | A **separate vault password** |
| Encryption | Protected by iOS like the rest of your library | Its own encryption: Argon2id and AES-256-GCM, keyed from the vault password |
| iCloud | Syncs with iCloud Photos if that is on | Off by default. Optional sync (Plus) and iPhone backups upload only encrypted files |
| Who holds the keys in iCloud | Apple, unless you turn on Advanced Data Protection | Only you: the key comes from your vault password |
| Other devices | Hidden photos also appear (hidden) on your other devices | Only where you turn on sync, through your iCloud or a folder you choose |
| What it holds | Photos and videos | Photos, videos, audio, notes, PDFs and other files |
| Visible that it exists | The Hidden album can be shown or hidden in Photos settings | Looks like a set of brain games |
| Moving to a new iPhone | Automatic with iCloud Photos or a device backup | Join your synced vault, restore an iPhone backup that includes it, or restore an exported file |
| If you forget the password | Your passcode or Apple Account recovery | No recovery |
| Cost | Included with iOS | See the App Store listing |

## What the Hidden album does well

According to [Apple's documentation](https://support.apple.com/104987), hidden photos stay in your library but are kept out of the main view, and from iOS 16 the Hidden album is locked by default and needs Face ID, Touch ID or your passcode to open. If you use iCloud Photos, a photo you hide on one device is hidden on your others too.

For a lot of people, that is enough. It stops a photo from appearing while you scroll through your library in front of someone, and it costs nothing.

## Where it stops

- **Anyone who knows your passcode can open it.** A partner, family member or someone who watched you unlock your phone has the same access you do.
- **It travels with iCloud Photos.** With standard iCloud data protection, Apple holds the keys to iCloud Photos. With [Advanced Data Protection](https://support.apple.com/108756) turned on, your library is end-to-end encrypted, but the feature is opt-in and does not cover the Shared Albums feature in Photos.
- **It appears on every device signed in to your account,** including a shared family Mac or iPad.
- **It is only for photos and videos.** Scans of documents, notes and PDFs need somewhere else.

## Where Hedgehog Bits is different

- The vault password is separate from your device passcode. Knowing how to unlock the phone does not open the vault.
- Files are encrypted by the app itself, and only encrypted copies leave the iPhone: when you turn on sync or iPhone backups, or export a backup.
- It holds documents and notes, not only photos.
- It doesn't look like a vault. To someone else, it opens as ten small games.

## The trade-offs

We think these are worth being clear about:

- **You choose the backups.** Nothing is copied anywhere until you turn on sync or iPhone backups, or export a backup. If you lose your phone without any of them, the vault is gone.
- **No password recovery.** If you forget the vault password, nobody can open it, including us.
- **Moving photos in is a deliberate step.** After importing, remove the originals from Photos and empty *Recently Deleted*.

## Can I use both?

Yes. Many people keep everyday private photos in the Hidden album and move the few things that really matter, such as ID scans, medical records or intimate photos, into an encrypted vault.

## Related

{% include post-link.html slug="where-hidden-photos-on-iphone-actually-go" text="Where hidden photos on iPhone actually go" prefix="- " suffix="" %}
- [Security design]({{ '/security/' | relative_url }})
