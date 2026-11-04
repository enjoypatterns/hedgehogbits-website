---
title: Where hidden photos on iPhone actually go
description: >-
  Hiding a photo on iPhone moves it out of view, not out of your library. How hidden
  photos interact with iCloud, your other devices, backups and Recently Deleted.
tags: [iphone, icloud, privacy]
---

When you tap **Hide** on a photo, it disappears from your library view. It is easy to assume it has gone somewhere safer. In practice it stays in the same place, with a different label.

This post explains where hidden photos live and who else might be able to see them, based on [Apple's own documentation](https://support.apple.com/104987).

## They stay in your library

Hidden photos remain part of your Photos library. They move into the **Hidden** album, which, since iOS 16, is locked by default and opens with Face ID, Touch ID or your device passcode.

That lock depends on your device passcode. Anyone who knows the passcode can open the Hidden album.

## They sync with iCloud Photos

If iCloud Photos is turned on, a photo you hide on your iPhone is hidden on every device signed in to the same Apple Account: an iPad, a Mac, or a family computer you share.

How well they are protected in iCloud depends on a setting:

- **Standard data protection:** iCloud Photos is encrypted, but Apple holds the keys.
- **[Advanced Data Protection](https://support.apple.com/108756):** iCloud Photos is end-to-end encrypted, and only your devices hold the keys. It is off by default, and Apple notes that the Shared Albums feature does not support it.

## They can be in iCloud Backup

If iCloud Photos is off, your photo library, including hidden photos, is normally part of your iCloud Backup instead. The same rule applies: Apple holds the keys unless Advanced Data Protection is on.

## Recently Deleted keeps them for a while

Deleting a photo moves it to **Recently Deleted**, where it stays for about 30 days. That album is also locked behind Face ID or your passcode, but the photo isn't gone until you empty it.

## Shared albums and Shared Library are separate

Photos in a shared album or an iCloud Shared Photo Library are visible to the people you share with. Hiding a photo in your own view doesn't change what others can see in a shared space. Check where a photo lives before assuming it is private.

## What this means in practice

The Hidden album is a good way to keep photos out of sight while you scroll in front of others. It is not designed to keep photos away from someone who knows your passcode, or off your other devices.

If you need that, you have two broad options:

1. **Turn on Advanced Data Protection** to make iCloud Photos end-to-end encrypted, and keep the photos in your library.
2. **Move the photos into an encrypted vault** that stays off iCloud, such as Hedgehog Bits, then delete the originals and empty *Recently Deleted*.

We compare the two approaches in [Hedgehog Bits vs the iPhone Hidden album]({{ '/compare/iphone-hidden-album/' | relative_url }}).
