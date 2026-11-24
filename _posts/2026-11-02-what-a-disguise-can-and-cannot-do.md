---
title: What a disguise can and cannot do
description: >-
  Hedgehog Bits looks like a set of brain games. An honest look at what that cover protects against, where it stops, and what actually keeps your data safe.
last_modified_at: 2026-11-24
tags: [security, threat model, privacy]
image:
  path: /assets/blog/vault-app-disguise-vs-encryption-social.jpg
  width: 1200
  height: 630
  alt: "Illustration of a hand opening a book on a bookshelf to reveal a steel safe hidden inside: a disguise on the outside, real protection within."
---

Hedgehog Bits opens like a casual game. That is a useful feature, but it is easy to overstate. The cover decides whether anyone *notices* the vault. The encryption decides whether anyone can *open* it. Rely on the second, and treat the first as a convenience.

<figure>
  <img src="{{ '/assets/blog/vault-app-disguise-vs-encryption.webp' | relative_url }}" width="1376" height="768" alt="Illustration of a hand opening a book on a bookshelf to reveal a steel safe hidden inside: a disguise on the outside, real protection within.">
</figure>

## What the cover is good for

Most privacy problems are not sophisticated attacks. They are a friend scrolling through your phone, a family member picking it up, or someone glancing over your shoulder at your home screen.

For these situations, the cover helps:

- **The home screen looks ordinary.** A calm app with a hedgehog doesn't invite questions.
- **Opening the app shows games.** Anyone who types a name sees a greeting and ten playable games with personal bests.
- **Nothing gives the vault away.** The app never says "wrong password", and a wrong answer takes about as long as a right one.
- **The app switcher shows only the hedgehog,** and the vault locks the moment you leave the app.

We also kept the look deliberately grown-up and plain: flat surfaces, system type, one muted accent colour. Bright, cartoonish design draws attention, which is the opposite of what we want.

## Where the cover stops

The cover doesn't help in these cases:

- **Someone who knows the app knows what it is.** This website exists, and so does the App Store listing. If a person knows Hedgehog Bits, they know a vault may be inside.
- **Your password is visible as you type it.** The start screen asks for a name, and a name field that hid its letters would look unusual. Be aware of who can see your screen. The field clears as soon as the app leaves the foreground.
- **It can't help on a compromised phone.** If someone controls your device through malware or a jailbreak, no app can keep data safe on it.
- **It doesn't remove traces elsewhere.** Photos you remove from your library after importing them stay in *Recently Deleted* for up to 30 days. Empty that album too.

## What actually protects your data

The protection comes from encryption and from your password:

- Your password is stretched with **Argon2id** (256 MiB, 3 passes), so guessing is slow and expensive.
- Your files are encrypted with **AES-256-GCM**, each with its own key, on your iPhone. Anything you sync or back up is encrypted the same way first.
- There are **no servers of ours and no recovery mechanism**, so there is no second way in.

This means the most important decision is your password. A few random words, such as *"copper lantern orbit meadow"*, is far stronger than a short word with a number, and still easy to remember. The app shows a strength estimate when you choose it.

For the full design and its limitations, see the [security design]({{ '/security/' | relative_url }}).
