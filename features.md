---
title: Features
eyebrow: Features
description: >-
  What Hedgehog Bits can do: an encrypted iPhone vault for notes, photos, videos and files, with folders, a built-in camera, streaming and encrypted backups.
lead: >-
  A focused set of tools for keeping private things private. Everything below works
  offline, on your iPhone, without an account.
permalink: /features/
---

## Opening the vault

Hedgehog Bits opens with a line-art hedgehog and one question: **"Who is playing?"**

- Type your vault password and the vault opens.
- Type anything else and the app says hello by that name ("Hi, Sam.") and offers ten games.
- The name you type is kept in memory only and never saved, because it might be a mistyped password.
- A wrong answer takes about as long as a right one, and the app never says "wrong password".

## What you can keep

| Item | Details |
|---|---|
| **Notes** | Write and edit notes inside the vault. Each save is encrypted before it reaches storage. |
| **Photos** | Import from your photo library. After the whole batch is encrypted and saved, the app can offer to remove the originals from Photos. |
| **Videos and audio** | Play them inside the vault. They are decrypted piece by piece as they play, so a full plain copy is never written to disk. |
| **Camera** | Take photos and videos that go straight into the vault without being saved to your photo library. |
| **Documents** | Import PDFs, text files and other documents from the Files app and view them in the app. |
| **Folders** | Create folders, move items between them, and drag a tile onto a folder to move it in. |

## Backup and moving to a new iPhone

The vault is deliberately left out of iCloud backups, computer backups and Quick Start phone-to-phone transfer. You decide where copies go.

- **Export Backup** saves the whole vault as one `.hhbits` file, still encrypted. Keep it on a Mac, a USB drive or any storage you trust.
- **Restore from Backup** on a new iPhone brings back your folders, files and password exactly as they were.
- Restoring is all-or-nothing. Every item is checked before anything is written, so a damaged file can't leave you with half a vault.

Read more in [Moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %}).

## Settings

- **Change password.** Only the key that protects your files is re-encrypted, so this is quick even for large vaults.
- **Storage.** See how much space the vault uses.
- **Erase vault.** Permanently deletes everything and lets you start over with a new password. You type ERASE to confirm.

## The games

The cover is a set of ten complete games with personal bests, styled to look calm and ordinary.

| Game | How it plays |
|---|---|
| Gaps | Tap to rise through gaps between walls. Endless. |
| Tap Rush | Tap targets before they fade. Faster taps and combos score more. 30 seconds. |
| Rule Swipe | Swipe right if the card fits the rule, left if not. The rule changes every five cards, and one slip ends the run. |
| Pairs | A memory game with 12 cards, scored by time. |
| Stop Line | Hold to move the marker and let go in the zone. 15 rounds, each faster. |
| Six Letters | Make words from six letter tiles in 60 seconds, checked against the iPhone's offline dictionary. |
| Quick Sums | Pick the right answer from three for 60 seconds. Sums get harder, and a wrong pick costs 3 seconds. |
| Echo | Repeat a growing sequence on four pads. Each pad has its own shape, not just a colour. |
| In Order | Tap 1 to 25 on a shuffled grid. Fastest time wins, and a wrong tap adds a second. |
| Reflex | Tap the moment the panel changes. The average of five rounds, in milliseconds. |

## Requirements

- iPhone with {{ site.app.os_requirement }}
- About as much free storage as the files you want to keep
- No network connection needed

<div class="actions">{% include app-store-button.html %}<a class="button button-secondary" href="{{ '/security/' | relative_url }}">Security design</a></div>
