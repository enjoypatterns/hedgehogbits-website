---
title: "Incognito mode: what it does and what it doesn't"
description: >-
  Incognito mode stops your phone or computer from remembering what you did.
  It doesn't make you invisible online. A plain-language guide to what it hides,
  and from whom.
tags: [privacy, how-to, iphone]
---

Most web browsers have a private mode. Chrome calls it **Incognito**, Safari calls it **Private Browsing**, Firefox calls it a **Private Window** and Microsoft Edge calls it **InPrivate**. The names sound secretive, and many people think it hides more than it does.

In a study of 460 people, more than half believed that searching in a private window stopped Google from saving those searches, even while they were signed in to their Google account. More than a third thought it stopped their employer from seeing what they visited. Neither is true ([Wu et al., 2018](https://cispa.de/en/research/publications/69070-your-secrets-are-safe-how-browsers-explanations-impact-misconceptions-about-private-browsing-mode)).

Here is what it really does, in plain words.

## The short version

Incognito mode is about **your device forgetting**. It is not about **the internet forgetting**.

When you close your private windows, your phone or computer throws away what it would normally remember from that visit. The websites you visited, and the networks your connection passed through, can still see what they always could.

<figure>
  <img src="{{ '/assets/blog/firefox-private-window.webp' | relative_url }}" width="1200" height="610" loading="lazy" alt="Firefox's private window. It says: You're off the record. We'll erase every search and sign-in when you close all your Private Windows. Firefox's built-in protections are on here too, like blocking trackers.">
  <figcaption>Firefox's private window. "Off the record" means your device won't keep a record. The websites you visit still can.</figcaption>
</figure>

## What incognito mode does

When you close your private windows or tabs, your device forgets:

- **Your browsing history.** The pages you visited won't appear in your history list.
- **What you typed into search boxes and forms.** It won't be suggested to you next time.
- **Sign-ins.** If you sign in to a website in private mode, you are signed out when you close it.
- **Small notes websites leave on your device.** Websites store little bits of information to recognise you when you come back (these are often called *cookies*). In private mode, they are deleted when you close it.

This makes incognito mode genuinely useful when:

- **you're using someone else's phone or computer** and want to check your email without staying signed in.
- **you're shopping for a gift** on a shared device and don't want the surprise spoiled by history or suggestions.
- **you're looking up something sensitive**, like a health worry, and don't want it popping up as a suggestion when someone else uses the browser.

### Some browsers add a little more

As the Firefox screen above says, some browsers also turn on extra protection in private mode. Firefox blocks many *trackers*: hidden pieces of other companies' code that follow you from site to site. Safari on iPhone blocks known trackers too, and strips some of the tracking information that gets added to links.

This helps, but it has limits. It doesn't stop the website you are actually on from seeing what you do there, and it can't help once you sign in.

## What incognito mode doesn't do

### Websites still know it's you if you sign in

If you sign in to Google, Facebook, Amazon or any other account in private mode, that website knows exactly who you are and can keep a record of what you do there, just as it normally would.

### Websites still see what you do on them

Even without signing in, a website can see which of its pages you look at and what you search for on it. Google now says this plainly on Chrome's Incognito page: using Incognito won't change how data is collected by websites you visit and the services they use, including Google.

### Your internet provider, school or workplace can still see where you go

Your visits still travel through your home internet provider, your mobile network, or the Wi-Fi you are using. At work or school, that network may be monitored. A private window doesn't hide your visits from any of them.

### Websites can still see roughly where you are

The websites you visit can usually tell which town or area you are connecting from. Private mode on its own doesn't change that.

### It doesn't protect you from viruses or scams

A private window is not a safer window. Fake websites, harmful downloads and scam messages work exactly the same in private mode.

### Things you save stay saved

Private mode only forgets what the *browser* remembers. If you download a file, take a screenshot or add a bookmark, that stays on your device after you close the window. Almost everyone in the study above got this one right.

### Open private tabs can still be seen

Private tabs stay open until you close them. If someone picks up your unlocked phone or computer while they are still open, they can see them. Close them when you're done, or lock them (see below).

## Even big companies have been caught out

In 2024, Google settled a US lawsuit brought by people who said Google kept collecting information about them while they used Incognito mode. Google agreed to delete or anonymise records it had collected, to explain more clearly what Incognito does, and to block some tracking in Incognito by default ([The Register](https://www.theregister.com/2024/04/01/google_will_delete_data_incognito/)). The lesson is simple: private mode was never designed to stop websites from collecting information.

## How to open a private tab on iPhone

1. Open **Safari**.
2. Touch and hold the **tabs button** (two overlapping squares).
3. Choose **New Private Tab**.

Safari shows that you are in Private mode. To go back to your normal tabs, tap the tabs button and switch from **Private** to your other tabs. The buttons can move a little between versions of iOS, but the tabs button is always the place to look.

Since iOS 17, Safari locks your private tabs when you leave them, so they need Face ID or your passcode to open again. This is usually on already. You can check it in **Settings → Apps → Safari** (on older versions, **Settings → Safari**): look for **Require Face ID to Unlock Private Browsing**. It's worth keeping on if other people sometimes use your phone.

## Related

{% include post-link.html slug="private-files-on-a-shared-phone" text="Keeping private files private on a shared phone" prefix="- " %}
{% include post-link.html slug="where-hidden-photos-on-iphone-actually-go" text="Where hidden photos on iPhone actually go" prefix="- " %}
- [What a disguise can and cannot do]({{ site.baseurl }}{% post_url 2026-11-02-what-a-disguise-can-and-cannot-do %})
