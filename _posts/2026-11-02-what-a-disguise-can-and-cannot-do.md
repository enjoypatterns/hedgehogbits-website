---
title: What a disguise can and cannot do
description: >-
  Hedgehog Bits looks like a set of brain games. Here is an honest look at what
  that cover protects against, where it stops, and what actually keeps your data safe.
tags: [security, threat model, privacy]
---

Hedgehog Bits opens like a casual game. That is a useful feature, but it is easy to overstate. This post describes where the cover helps and where it doesn't, so you can rely on the right things.

## What the cover is good for

Most privacy problems are not sophisticated attacks. They are a friend scrolling through your phone, a family member picking it up, or someone glancing over your shoulder at your home screen.

For these situations, the cover helps:

- **The home screen looks ordinary.** A calm app with a hedgehog doesn't invite questions.
- **Opening the app shows games.** Anyone who types a name sees a greeting and six playable games with personal bests.
- **Nothing gives the vault away.** The app never says "wrong password", and a wrong answer takes about as long as a right one.
- **The app switcher shows only the hedgehog,** and the vault locks the moment you leave the app.

We also kept the look deliberately grown-up and plain: flat surfaces, system type, one muted accent colour. Bright, cartoonish design draws attention, which is the opposite of what we want.

## Where the cover stops

A disguise is only a disguise. It is worth being clear about its limits:

- **Someone who knows the app knows what it is.** This website exists, and so does the App Store listing. If a person knows Hedgehog Bits, they know a vault may be inside.
- **Your password is visible as you type it.** The start screen asks for a name, and a name field that hid its letters would look unusual. Be aware of who can see your screen. The field clears as soon as the app leaves the foreground.
- **It can't help on a compromised phone.** If someone controls your device through malware or a jailbreak, no app can keep data safe on it.
- **It doesn't remove traces elsewhere.** Photos you remove from your library after importing them stay in *Recently Deleted* for up to 30 days. Empty that album too.

## What actually protects your data

The protection comes from encryption and from your password:

- Your password is stretched with **Argon2id** (256 MiB, 3 passes), so guessing is slow and expensive.
- Your files are encrypted with **AES-256-GCM**, each with its own key, and stored only on your iPhone.
- There are **no servers and no recovery mechanism**, so there is no second way in.

This means the most important decision is your password. A few random words, such as *"copper lantern orbit meadow"*, is far stronger than a short word with a number, and still easy to remember. The app shows a strength estimate when you choose it.

## A simple way to think about it

The cover decides whether anyone *notices* the vault. The encryption decides whether anyone can *open* it. You should rely on the second and treat the first as a convenience.

For the full design and its limitations, see the [security design]({{ '/security/' | relative_url }}).
