---
title: Hedgehog Bits vs calculator vault apps
section: compare
order: 2
eyebrow: Compare
description: >-
  Calculator vault apps hide files behind a working calculator. How that disguise
  compares with Hedgehog Bits, what to check about encryption, and where both have limits.
lead: >-
  Calculator vaults made the disguised vault popular. The idea is sound, but the
  disguise is now widely known, and the security behind it varies a great deal.
permalink: /compare/calculator-vault-apps/
last_reviewed: 2026-11-04
---

*Last reviewed {{ page.last_reviewed | date: "%-d %B %Y" }}.*

## How calculator vaults work

A calculator vault opens as a working calculator. Typing a code, such as a PIN followed by `=`, opens a hidden area for photos and files. There are hundreds of these apps on the App Store, from many different developers.

Hedgehog Bits uses the same principle with a different cover: it opens as a set of brain games, and the vault opens when you type your password where it asks for your name.

## Side by side

| | Typical calculator vault | Hedgehog Bits |
|---|---|---|
| Cover | A working calculator | Six working brain games |
| How well known the cover is | Widely known, and often featured in parenting and safety guides | Less common |
| Unlock | Usually a short numeric PIN | A password of any length and characters |
| Encryption | Varies by app. Some encrypt files; others only put a PIN screen in front of them | Always: Argon2id and AES-256-GCM, documented publicly |
| Accounts and cloud | Varies. Some require an account or offer cloud backup | None |
| Ads and tracking | Common in free versions | None |
| Extra features | Often break-in photos, decoy PINs, fake icons | Locks on leaving the app, blocks third-party keyboards, private camera |

## The question that matters most: is it encrypted?

The disguise only decides whether someone notices the vault. Encryption decides whether they can open it.

Academic studies of vault apps have found that some stored "hidden" files unencrypted, or kept the PIN where it could be read from the app's data. For example, [Zhang, Baggili and Breitinger](https://par.nsf.gov/servlets/purl/10566080) found this in several popular apps. Not every calculator vault has these problems, but you can't tell from the App Store listing alone.

Before trusting any vault, look for:

1. A clear statement of **which algorithms** are used and how the key is derived from your PIN or password.
2. Whether the **PIN length** allows a strong secret. A 4-digit PIN has only 10,000 possibilities.
3. Whether an **account or cloud upload** is involved, and what the privacy policy says is collected.

{% include post-link.html slug="what-to-check-before-trusting-a-vault-app" text="What to check before trusting a vault app" prefix="We wrote a longer checklist in " suffix="." %}

## Where calculator vaults may suit you better

- **Decoy PINs and break-in photos.** Some calculator vaults offer these. Hedgehog Bits doesn't today.
- **Familiarity.** If you have used one for years and are happy with its encryption, there may be no reason to switch.

## Limits that apply to every disguised vault, including ours

- **A known app is a known app.** If someone knows what Hedgehog Bits or a calculator vault is, they know a vault may be inside.
- **Storage size can give it away.** *Settings → General → iPhone Storage* shows how much space each app uses. A game or calculator holding several gigabytes stands out.
- **The disguise doesn't replace a strong password.** We explain this further in [What a disguise can and cannot do]({{ site.baseurl }}{% post_url 2026-11-02-what-a-disguise-can-and-cannot-do %}).

## Related

- [Security design]({{ '/security/' | relative_url }})
- [Hedgehog Bits vs the iPhone Hidden album]({{ '/compare/iphone-hidden-album/' | relative_url }})
