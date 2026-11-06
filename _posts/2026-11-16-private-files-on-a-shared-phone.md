---
title: Keeping private files private on a shared phone
description: >-
  Partners, children and friends often pick up our phones. Practical ways to keep a
  few things private on a shared iPhone, and where a disguised vault helps.
tags: [privacy, iphone, threat model]
---

Researchers who interviewed vault app users found that most people aren't worried about hackers. They are worried about the people around them: a friend swiping through photos, a child playing a game, a partner who knows the passcode. One participant put it simply: *"Say I'm in public… I don't want my nudes to pop up."* ([Geeng et al., SOUPS 2024](https://www.usenix.org/conference/soups2024/presentation/geeng))

That kind of privacy is about everyday situations, so the answers are mostly practical ones.

## Start with what iPhone already offers

- **Lock or hide individual apps.** Recent versions of iOS let you require Face ID for an app, or hide it in a locked folder. Touch and hold the app icon to see the options.
- **Keep the Hidden album out of view.** In Photos settings you can choose whether the Hidden album is shown at all.
- **Check what shows up elsewhere.** Photo widgets, Memories and shared albums can surface pictures you didn't expect.
- **Be careful with shared Apple Accounts.** If a family shares one account, iCloud Photos puts the same library on every device.

These steps help a lot, but they share one weakness: anyone who knows your device passcode can usually get past them.

## Where a separate vault helps

A vault with its own password protects files even from someone who can unlock the phone. Hedgehog Bits adds a few things for shared phones:

- **It looks like a game.** If someone opens it, they see ten playable games. Children can play them without finding anything.
- **It locks as soon as you leave it.** Switch apps or lock the screen and the vault closes. The app switcher shows only the hedgehog.
- **It doesn't announce itself.** A wrong answer just greets the person by name. The app never says "wrong password".

## Things to be careful about

- **Your password is visible while you type it.** The field is a name field, so it shows letters. Type it when nobody is looking.
- **Storage usage can be seen.** *Settings → General → iPhone Storage* shows how much space each app uses.
- **Delete originals.** After moving photos into the vault, remove them from Photos and empty *Recently Deleted*.

## If you don't feel safe

If someone is monitoring your phone, controlling your accounts or threatening you, a vault app is not enough on its own. Apple's [Personal Safety User Guide](https://support.apple.com/guide/personal-safety/welcome/web) explains how to review who has access to your devices and accounts, including the *Safety Check* feature. Changes to sharing settings can be noticed by the other person, so consider your safety first. Local support organisations can help you plan.

## Related

- [What a disguise can and cannot do]({{ site.baseurl }}{% post_url 2026-11-02-what-a-disguise-can-and-cannot-do %})
- [Hedgehog Bits vs the iPhone Hidden album]({{ '/compare/iphone-hidden-album/' | relative_url }})
