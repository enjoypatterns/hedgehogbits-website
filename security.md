---
title: Security design
eyebrow: Security
description: >-
  How Hedgehog Bits protects your data: Argon2id, per-item keys, chunked
  AES-256-GCM, iOS hardening, optional encrypted sync and backups, and known limitations.
lead: >-
  This page describes how the vault is built, what it protects against and where its
  limits are. We would rather you understand the design than take it on trust.
permalink: /security/
last_modified_at: 2026-11-24
---

## Summary

- Your data is encrypted on your iPhone. It leaves the phone only if you turn on sync or iPhone backups, or export a backup, and then only encrypted.
- There is no server of ours, no account and no recovery mechanism. Only your password can open the vault.
- The design uses standard primitives: **Argon2id**, **HKDF** and **AES-256-GCM**, through Apple CryptoKit and libsodium.

## From password to key

| Step | Details |
|---|---|
| Password handling | Any Unicode characters are allowed. Passwords are NFC-normalized so the same text always gives the same key. Whitespace counts. |
| Key derivation | Argon2id (libsodium), 3 passes over 256 MiB of memory, with a random salt. |
| Master key | A random 256-bit key, wrapped with AES-256-GCM under the password-derived key. |
| Changing password | Only the wrapped master key is re-encrypted. Your files don't need to be touched. |
| Wrong password | Costs about one second of Argon2 work. Right and wrong answers take a similar time, and the app never reports a wrong password. |

## How data is encrypted

- Every blob (each file, each thumbnail and the index of names and folders) has its own key, derived from the master key with HKDF.
- Content is encrypted in **1 MiB AES-256-GCM chunks**. Each chunk's authentication covers its position and a final-chunk flag, so tampering, reordering and truncation are all detected.
- File and folder names live inside the encrypted index, not in the file system.

## No plaintext at rest

- Photos, notes, PDFs and text are decrypted in memory only.
- Video and audio stream through a resource loader that decrypts only the byte ranges being played.
- Sharing and Quick Look previews need a real file. These use a temporary copy that is deleted when you close it and whenever the vault locks.

## iOS hardening

- The vault is excluded from iCloud and computer backups unless you turn on **Include in iPhone Backups**, and uses iOS `FileProtection.complete`, so its files are also protected by the device passcode while the phone is locked.
- The vault locks the moment the app leaves the foreground.
- The app switcher snapshot shows only the hedgehog.
- Third-party keyboards are blocked.
- The name field has autocorrect, auto-capitalisation, spell check, smart punctuation, predictions and Writing Tools turned off, so iOS never changes what is typed or learns it.
- Unlocking, vault creation, imports and note saves are cancelled or discarded if the app locks while they are running. A closed session can never write to disk again.
- Drag and drop carries only an item's ID under a private type that other apps don't accept, so nothing can be dropped out of the vault.

## Encrypted backups

A backup is the vault's own ciphertext packed into one file. It is never decrypted or re-encrypted on the way, so it is as strong as the vault itself.

- **Integrity.** An HMAC keyed from the master key covers every entry. Any change, truncation, missing item, swap or addition is rejected.
- **All-or-nothing restore.** The password is checked first. Data is unpacked into a staging folder, verified against the index, flushed to disk and only then moved into place.
- **Locking stops it.** Locking cancels an export or restore in progress, so the key isn't held in the background.
- **What a backup reveals.** Roughly how large the vault is and how many items it holds.

## Sync and iPhone backups

Both are optional and off until you turn them on. Neither decrypts anything: what leaves the phone is the vault's own ciphertext, the same files that are on the iPhone.

- **Sync** (part of Hedgehog Bits Plus) goes through your own iCloud, in a private area only the app can use, or a folder you choose in the Files app. The storage provider sees how many files there are, roughly how big they are and when they change, but no names or contents.
- **The decoy stays hidden.** The synced copy looks the same with or without a decoy vault. If someone makes you open a decoy and points sync somewhere of theirs, the real vault doesn't sync there unless you agree.
- **Merging is safe.** Files go up before the index that names them, so another device never sees half a change. A note edited on two devices keeps both versions.
- **iPhone backups** include the encrypted vault in your iCloud or computer backups, so restoring a whole phone brings it back.

A copy outside the phone doesn't have the iPhone's passcode protection. Anyone holding it can try passwords against it on their own computers, at Argon2id speed. That is why a long password matters most if you sync or back up. [How to sync private files between iPhone and iPad]({{ site.baseurl }}{% post_url 2026-11-23-sync-private-files-between-iphone-and-ipad %}) covers sync in detail.

## What this protects against

- Someone who picks up or borrows your unlocked phone and opens the app.
- Someone who copies the app's files from the device or a backup without your password.
- Modified or damaged backup files.
- Your data being exposed through a cloud service. We run none, and a copy you sync or back up is encrypted before it leaves your iPhone.

## Known limitations

We think it is important to be clear about these.

- **The password is visible as you type it.** The name field shows letters, like any name field. Be aware of who can see your screen. The field clears when the app leaves the foreground.
- **Recently Deleted.** Photos removed from your library after import stay in the Photos app's *Recently Deleted* album for up to 30 days. Empty that album too.
- **No recovery.** If you forget the password, the vault cannot be opened, by you or by us.
- **Lost phone, lost vault, unless you keep a copy.** Without sync, an iPhone backup that includes the vault, or an exported backup, erasing or losing the iPhone means losing the vault.
- **Copies can be attacked offline.** A synced or backed-up copy can be tested against password guesses away from your iPhone. Choose a long password.
- **The cover is not encryption.** The games make the app look ordinary. Someone who knows about Hedgehog Bits knows a vault may be inside. Your protection comes from the encryption and a strong password. See [what a disguise can and cannot do]({{ site.baseurl }}{% post_url 2026-11-02-what-a-disguise-can-and-cannot-do %}).
- **A compromised device.** No app can protect data on a phone that is already under someone else's control, for example through malware or a jailbreak.

## Choosing a password

Any characters work: letters, numbers, spaces, symbols and emoji. A few random words make a password that is strong and easy to remember. The app shows a strength estimate while you choose it.

## Questions or findings

If you believe you have found a security issue, we would like to hear about it.{% if site.contact_email != "" %} Please write to [{{ site.contact_email }}](mailto:{{ site.contact_email }}).{% endif %} See also [`/.well-known/security.txt`]({{ '/.well-known/security.txt' | relative_url }}).
