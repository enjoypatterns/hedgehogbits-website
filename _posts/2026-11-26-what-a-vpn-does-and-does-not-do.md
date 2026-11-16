---
title: "VPNs: what they do and what they don't"
description: >-
  A VPN hides which websites you visit from the Wi-Fi or internet provider you're
  using, and hides your real location from the websites. It doesn't make you
  anonymous. A plain-language guide to what it protects, and from whom.
tags: [privacy, how-to, iphone]
---

VPN apps are advertised everywhere, often with big promises: total privacy, complete anonymity, protection from hackers. A VPN is a useful tool, but it does one specific job. Knowing what that job is makes it much easier to decide whether you need one.

Here is how it works, in plain words.

## The short version

A VPN changes **who can see where you go online**. It doesn't change **what the websites themselves can see**.

Normally, everything you do online passes through whoever provides your connection: your home internet provider, your mobile network, or the café's Wi-Fi. With a VPN switched on, your connection goes in a locked tunnel to the VPN company's computer first, and then out to the internet from there.

## How it works

Think of sending a letter.

**Without a VPN**, every envelope you post shows who it's for. As long as the website uses a secure connection (almost all do now), the postal service can't read the letter inside. But it can see the address on every envelope, so it knows which websites you visit and when.

**With a VPN**, you put all your envelopes inside one big envelope addressed to the VPN company. The postal service only sees letters going to the VPN company. The VPN company opens the big envelope and posts each letter on for you. When the replies come back, it bundles them up and sends them back to you the same way.

That has two effects:

1. **Your Wi-Fi or internet provider can no longer see which websites you visit.** It can see that you're using a VPN, roughly how much you're sending and receiving, and when, but not where it's going.
2. **The websites see the VPN company's address instead of yours.** Every connection to the internet has an address (an *IP address*), and it usually reveals roughly which town or area you're in and which provider you use. With a VPN, websites see the VPN's address and its location instead.

## What a VPN does

- **Hides which websites you visit from the network you're on.** That includes your home internet provider, your mobile network, and whoever runs the Wi-Fi in a hotel, café, airport or office.
- **Adds protection on public Wi-Fi.** Most websites and apps already encrypt what you send, so the risk is smaller than it used to be. A VPN still stops the Wi-Fi owner, or someone snooping on it, from seeing which websites you visit, and it protects the occasional app or website that doesn't use a secure connection.
- **Hides your real location and address from websites.** A website sees the location of the VPN's computer, which can be in another city or another country.
- **Can get you past some network blocks.** If a school, workplace or hotel network blocks certain websites, a VPN often gets around it. Check the rules first: going around a block at work or school can break their policies.

## What a VPN doesn't do

### It doesn't make you anonymous

If you sign in to Google, Facebook, Amazon or any other account, that website knows exactly who you are, VPN or not. Websites can also recognise you from the small notes they leave on your device (often called *cookies*) and from details about your phone or browser. A VPN changes your address; it doesn't change you.

### Websites still see what you do on them

A VPN hides your connection on the way to a website. Once you arrive, the website can still see which pages you look at, what you search for and what you buy, just as it normally would. Ads and tracking work much the same way too.

### Your location can still be shared

If you've let an app or website use your location, your phone tells it where you are using GPS and other signals, and a VPN doesn't stop that. The same goes for anything you share yourself, like a delivery address or a photo with its location saved inside it.

### The VPN company can see what your provider used to see

This is the most important thing to understand. A VPN doesn't remove the problem of someone seeing which websites you visit; it moves it. Instead of your internet provider, **the VPN company** is now in a position to see it.

So the VPN company needs to be one you trust. Many promise that they keep no records (a *no-logs* policy), and some have paid independent firms to check this. Be most careful with **free VPNs**: running a VPN costs money, and some free ones have been found showing ads, collecting what you do and selling it, or carrying malware.

### It doesn't protect you from scams or viruses

A fake website, a harmful download or a scam message works exactly the same with a VPN on. Some VPN apps include extra features that block known bad websites, but that's an add-on, not what a VPN itself does.

### It doesn't protect what's stored on your phone

A VPN protects your connection while information travels. It does nothing for the photos, files and messages kept on your phone. If someone picks up your unlocked phone, or it's lost or stolen, a VPN doesn't help. Your passcode, and encryption for anything private you store, do that job.

### It isn't the same as incognito mode

A VPN doesn't stop your phone from keeping your browsing history. A private window does that, but it doesn't hide anything from your internet provider. They solve different problems. [Our guide to incognito mode]({{ site.baseurl }}{% post_url 2026-11-10-what-incognito-mode-does-and-does-not-do %}) explains what that one does.

### It doesn't always work everywhere

- **Streaming services** often notice VPNs and block them, and watching another country's catalogue can break their terms.
- **Banks and shopping sites** sometimes ask for extra checks, or block you, when you appear to be in a different place than usual.
- **Some countries** restrict or ban VPNs. If you're travelling, check the rules where you're going.
- **If the VPN connection drops**, your phone may carry on without it, unless the app has a setting that stops this (often called a *kill switch*).

## Do you need one?

A VPN is worth it if you often use **public Wi-Fi**, if you don't want your **internet provider** to see which websites you visit, or if you want websites to see a **different location** from your own.

It isn't worth it if what you want is to stop **Google, Facebook or other websites** from knowing what you do. For that, sign in less, use private windows, and turn off tracking in your apps and browser.

If you do get one, choose a well-known paid provider that has had its no-logs promise checked independently, rather than whichever free app tops the App Store chart.

## A VPN on iPhone

Most VPN providers have an iPhone app that sets everything up for you. When you first open it, your iPhone asks for permission to add a VPN configuration. After that, you can switch the VPN on and off in the app, or in **Settings → VPN**. You can see and remove VPN configurations in **Settings → General → VPN & Device Management**.

### iCloud Private Relay

If you pay for iCloud storage, you may already have something similar. **iCloud Private Relay** sends your Safari browsing through two separate companies: the first, run by Apple, sees your internet address but not which website you're visiting, and the second, run by a partner company, sees the website but not your address. So no single company, not even Apple, sees both.

It's different from a VPN in a few ways. It covers Safari, plus some other traffic, but not everything every app does. By default, websites still see roughly which area you're in, rather than a different country. And it isn't offered in every country. To check it, go to **Settings**, tap your name, then **iCloud → Private Relay**.

## A VPN from work

A VPN from your employer or school does a different job: it connects your device to their private network so you can reach their internal systems. While it's on, your traffic can pass through their network, so they may be able to see where you go. Switch it off when you don't need it.

## Related

- [Incognito mode: what it does and what it doesn't]({{ site.baseurl }}{% post_url 2026-11-10-what-incognito-mode-does-and-does-not-do %})
{% include post-link.html slug="travelling-with-private-files" text="Travelling with private files on your iPhone" prefix="- " %}
- [What to check before trusting a vault app]({{ site.baseurl }}{% post_url 2026-11-11-what-to-check-before-trusting-a-vault-app %})
