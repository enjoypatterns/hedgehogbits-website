---
title: What to check before trusting a vault app
description: >-
  Seven questions to ask before you put private photos or documents into any vault
  app, including ours: encryption, keys, accounts, backups and what happens if things go wrong.
tags: [security, how-to, buying guide]
---

A vault app asks for a lot of trust. You are giving it the files you least want anyone else to see. Studies of vault apps have found that some of them [store "hidden" files unencrypted](https://par.nsf.gov/servlets/purl/10566080) behind a PIN screen, so it is worth checking before you commit.

Here are the questions we would ask of any vault, with our own answers alongside.

## 1. Does it say how files are encrypted?

"Bank-level security" is not an answer. Look for named algorithms and an explanation of how they fit together.

**Hedgehog Bits:** AES-256-GCM for content, in authenticated 1 MiB chunks, with a separate HKDF-derived key for each item. The details are on our [security design]({{ '/security/' | relative_url }}) page.

## 2. How is the key made from your PIN or password?

This step matters as much as the encryption itself. If a short PIN is turned into a key quickly, it can be guessed quickly too. Look for a slow, memory-hard function such as Argon2id or scrypt, and a password that can be longer than four digits.

**Hedgehog Bits:** Argon2id with 256 MiB of memory and 3 passes. Passwords can be any length and use any characters.

## 3. Does it need an account, and what does the company collect?

An account links your vault to an email address, a payment method or a phone number. Read the privacy policy for what is collected alongside your files: usage data, advertising identifiers, contact details.

**Hedgehog Bits:** No account. The app collects nothing. Our [privacy policy]({{ '/privacy/' | relative_url }}) is short for that reason.

## 4. Where do copies of your files end up?

Some vaults upload files to their own servers. Some leave originals in your photo library or in iCloud. Check where your files live after import, and whether the originals are removed.

**Hedgehog Bits:** Only on your iPhone. The vault is excluded from iCloud and computer backups. After import, the app can offer to remove the originals from Photos. You then need to empty *Recently Deleted* too.

## 5. What happens when you get a new phone?

This is the most common source of lost files in vault app reviews. Find out before you need to.

**Hedgehog Bits:** You export one encrypted backup file and restore it on the new phone. See [Moving your vault to a new iPhone]({{ site.baseurl }}{% post_url 2026-10-28-moving-your-vault-to-a-new-iphone %}).

## 6. What happens if you forget the password?

If a company can reset your password, it has a way in. That may be a fair trade for you, but you should know which kind of app you are using.

**Hedgehog Bits:** There is no recovery. Choose a password you will remember, such as a few random words.

## 7. What happens if the app disappears?

Apps are discontinued, removed from the App Store or change their pricing. Ask whether you can still get your files out.

**Hedgehog Bits:** It works without any server, so an installed copy keeps working. Your exported backups stay in your hands.

## A note on reviews

Many "best vault app" lists are written by vault app developers, and that includes this blog. Use lists like this one as a set of questions rather than a verdict, and look for answers in each app's own documentation.
