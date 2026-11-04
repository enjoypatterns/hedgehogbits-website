---
title: "Introducing Hedgehog Bits: a vault with no servers"
description: >-
  Why we built a private iPhone vault that keeps everything on the device, with
  no accounts, no sync and no way for us to see your data.
tags: [announcement, privacy, data ownership]
---

Most apps that store your private files ask you to trust them. You create an account, your data is uploaded, and from then on its safety depends on a company's servers, staff and policies.

Hedgehog Bits takes a different approach. It is a vault for notes, photos, videos and documents that lives entirely on your iPhone. We don't run servers for it, we don't ask for an account, and we never receive your data. There is nothing on our side to breach, subpoena or misuse.

## Owning your data, in practice

"You own your data" is easy to write in a privacy policy. We wanted it to be a property of the design instead:

- **The key comes from your password.** Your password is turned into an encryption key on the device. We never see either.
- **There is no copy elsewhere.** The vault is excluded from iCloud backups, computer backups and phone-to-phone transfer.
- **You decide where backups go.** When you want a copy, you export one encrypted file and put it wherever you trust: a Mac, a USB drive, a folder of your choice.
- **There is no recovery.** This is the trade-off. If nobody else can open your vault, nobody else can reset its password either.

We think that last point deserves to be said plainly. A recovery option means someone other than you holds a way in. We chose not to build one.

## Why it looks like a game

When you open Hedgehog Bits, you see a line-art hedgehog and a simple question: *"What's your name?"* Type your vault password and the vault opens. Type anything else and the app greets you and offers six short brain games.

The goal is discretion. An app called "Secret Vault" on a home screen invites questions. A calm game with a hedgehog does not. We wrote more about what this cover can and cannot do in [a separate post]({{ site.baseurl }}{% post_url 2026-11-02-what-a-disguise-can-and-cannot-do %}).

## Built on standard cryptography

We use well-studied building blocks with conservative settings: Argon2id for the password, a random 256-bit master key, per-item keys derived with HKDF, and AES-256-GCM for content. The [security design]({{ '/security/' | relative_url }}) page lists the details, including the limitations.

## What's next

We'll use this blog to explain how the app works and to share practical advice on keeping private data private. If you have questions, the [FAQ]({{ '/faq/' | relative_url }}) is a good place to start.
