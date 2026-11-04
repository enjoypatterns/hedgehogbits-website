---
title: How Hedgehog Bits encrypts your files
description: >-
  A walk through the vault's encryption: Argon2id key derivation, a wrapped master
  key, per-item HKDF keys and chunked AES-256-GCM, and why each choice was made.
tags: [security, encryption, engineering]
---

This post explains, step by step, what happens between typing your password and seeing your photos. It is written for readers who want to understand the design, not only hear that it is "encrypted".

## 1. Your password becomes a key

When you type your password, the app first normalizes it (Unicode NFC), so the same text always produces the same key regardless of how the keyboard encoded it. Any characters are allowed, including spaces and emoji.

The password is then run through **Argon2id**, a password hashing function designed to resist guessing on specialised hardware. We use 3 passes over **256 MiB** of memory with a random salt. On an iPhone this takes about a second. For someone trying millions of guesses, it makes each one expensive.

## 2. The password key unlocks a master key

The password-derived key does not encrypt your files directly. Instead, it unwraps a random **256-bit master key** that was generated when you created the vault. The master key is stored wrapped with AES-256-GCM.

This has a practical benefit: changing your password only re-wraps the master key. A vault with gigabytes of video can change its password in a moment.

## 3. Every item has its own key

From the master key, the app derives a separate key for each blob (each file, each thumbnail and the index that holds names and folders) using **HKDF-SHA256**. Keys are never reused across items.

Because names and folder structure live inside the encrypted index, someone looking at the app's storage sees only opaque blobs.

## 4. Content is encrypted in authenticated chunks

Files are split into **1 MiB chunks**, each encrypted with **AES-256-GCM**. GCM authenticates as well as encrypts, so any change to the ciphertext is detected.

Each chunk's authentication also covers its position and whether it is the final chunk. That closes off three quieter attacks:

- **Tampering:** changing bytes in a chunk.
- **Reordering:** swapping chunks around.
- **Truncation:** cutting off the end of a file.

Chunking also lets the app play video and audio without decrypting a whole file. The player asks for a byte range, and only the chunks covering that range are decrypted, in memory.

## 5. Plaintext stays in memory

Photos, notes, PDFs and text are decrypted in memory and shown directly. A few features, such as sharing a file to another app or previewing an unusual format with Quick Look, need a real file. In those cases the app writes a temporary copy and deletes it when you close the preview and whenever the vault locks.

## 6. Locking means locking

The vault locks the moment the app leaves the foreground. If an unlock, import or note save is still running at that point, it is cancelled or discarded. A closed session can never write to disk again. On top of this, the vault's files use iOS `FileProtection.complete`, so the system also keeps them encrypted while the phone itself is locked.

## Why standard building blocks

None of these primitives are new. That is deliberate. Argon2id, HKDF and AES-GCM are widely reviewed, and we use them through Apple CryptoKit and libsodium rather than our own implementations. The work is in combining them carefully and being clear about what the result does and doesn't protect.

For the full list, including known limitations, see the [security design]({{ '/security/' | relative_url }}).
