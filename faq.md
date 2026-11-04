---
title: Frequently asked questions
eyebrow: FAQ
description: >-
  Answers about Hedgehog Bits: how the vault opens, where data is stored, what
  happens if you forget your password, backups, new iPhones and privacy.
permalink: /faq/
faq:
  - q: "What is Hedgehog Bits?"
    a: "An iPhone app that keeps notes, photos, videos and files in an encrypted vault on your device. It opens like a set of six brain games, and the vault opens only when you type your password where the app asks for your name."
  - q: "How do I open the vault?"
    a: "When the app asks \"What's your name?\", type your vault password and tap Continue. Any other answer opens the games."
  - q: "Where is my data stored?"
    a: "Only on your iPhone, encrypted. It is not sent to any server, not included in iCloud or computer backups, and not copied during Quick Start phone-to-phone transfer."
  - q: "Do I need an account?"
    a: "No. There is no sign-up, no email address and no login. The app works fully offline."
  - q: "Can you see my files?"
    a: "No. We run no servers for the app and never receive your data or your password. The encryption key is derived from your password on your device."
  - q: "What if I forget my password?"
    a: "The vault cannot be opened. There is no recovery option and no back door, for you or for us. Choose a password you will remember, such as a few random words, and keep an exported backup."
  - q: "How do I move my vault to a new iPhone?"
    a: "On the old phone, open the vault and go to Settings → Export Backup to save an encrypted `.hhbits` file. On the new phone, install Hedgehog Bits, tap Restore from Backup on the first screen, choose the file and enter your password."
  - q: "Is the backup file safe to store in iCloud Drive or on a USB drive?"
    a: "The backup stays encrypted with your vault's keys and opens only with your password. It does reveal roughly how large the vault is and how many items it holds. Where you keep it is your choice."
  - q: "What encryption does it use?"
    a: "Argon2id (256 MiB, 3 passes) turns your password into a key that unwraps a random 256-bit master key. Each item has its own HKDF-derived key, and content is encrypted with AES-256-GCM in authenticated 1 MiB chunks. Details are on the Security design page."
  - q: "Are the games real?"
    a: "Yes. All six are complete games with personal bests: Gaps, Tap Rush, Rule Swipe, Pairs, Stop Line and Six Letters."
  - q: "Does the disguise make my data secure?"
    a: "The disguise helps the app look ordinary at a glance. Your data is protected by encryption and the strength of your password, not by the disguise."
  - q: "Does the app collect analytics or show ads?"
    a: "No. There are no analytics, no tracking and no advertising. Personal best scores are stored on the device like any casual game."
  - q: "What happens when I switch to another app?"
    a: "The vault locks immediately and the app switcher shows only the hedgehog. Anything in progress, such as an import or save, is cancelled safely."
  - q: "Why do photos still appear in Recently Deleted?"
    a: "When you remove originals from Photos after importing, iOS keeps them in the Recently Deleted album for up to 30 days. Empty that album to remove them fully."
  - q: "Which devices are supported?"
    a: "iPhone with iOS 26 or later."
---

<div class="faq">
{%- for item in page.faq %}
<details>
  <summary>{{ item.q }}</summary>
  <div>{{ item.a | markdownify }}</div>
</details>
{%- endfor %}
</div>

Still have a question? Read the [security design]({{ '/security/' | relative_url }}) or the [blog]({{ '/blog/' | relative_url }}), or [get in touch]({{ '/feedback/' | relative_url }}).
