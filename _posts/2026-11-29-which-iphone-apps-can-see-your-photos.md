---
title: Which iPhone apps can see your photos and location?
description: >-
  How to check which iPhone apps can see your photos, location, contacts, camera and
  microphone, and how to give each one only as much as it really needs.
tags: [privacy, how-to, iphone]
image:
  path: /assets/blog/share-selected-photos-with-apps-iphone-social.jpg
  width: 1200
  height: 630
  alt: "Illustration of two people at a café table. One hands the other a single photo while keeping a hand on a closed photo album, with a phone lying on the table between them."
---

When an app asks to see your photos or know your location, you decide in a second, often just to get past the pop-up. That choice stays in place, sometimes for years, until you change it.

Most apps use what you give them sensibly. But over the years, apps collect more access than they need, and it's easy to forget which ones can see everything. Checking takes about ten minutes, and iPhone makes it easy to give each app less without breaking it.

<figure>
  <img src="{{ '/assets/blog/share-selected-photos-with-apps-iphone.webp' | relative_url }}" width="1376" height="768" alt="Illustration of two people at a café table by a window. One hands the other a single photo, while keeping a hand on a closed photo album. A phone lies on the table between them.">
</figure>

## The short version

Go to **Settings → Privacy & Security**. Each type of information, such as Photos, Location Services or Contacts, lists the apps that asked for it and what they're allowed. For each app, pick the smallest option that still lets it do its job: selected photos instead of all of them, location only while you're using the app, a few contacts instead of the whole list.

<ul class="feature-shots post-shots">
  <li><figure>
    <picture>
      <source srcset="{{ '/assets/blog/iphone-privacy-and-security-settings-dark.webp' | relative_url }}" media="(prefers-color-scheme: dark)">
      <img src="{{ '/assets/blog/iphone-privacy-and-security-settings-light.webp' | relative_url }}" width="600" height="1304" loading="lazy" alt="The Privacy & Security screen in iPhone Settings, listing Location Services, Tracking, Calendars, Contacts and other types of information, each with how many apps can use it.">
    </picture>
    <figcaption><strong>Privacy &amp; Security</strong> <span>Each type of information shows how many apps can use it.</span></figcaption>
  </figure></li>
  <li><figure>
    <picture>
      <source srcset="{{ '/assets/blog/iphone-app-location-access-options-dark.webp' | relative_url }}" media="(prefers-color-scheme: dark)">
      <img src="{{ '/assets/blog/iphone-app-location-access-options-light.webp' | relative_url }}" width="600" height="1304" loading="lazy" alt="Location settings for the Maps app: Never, Ask Next Time or When I Share, While Using the App, and While Using the App or Widgets, with a Precise Location switch below.">
    </picture>
    <figcaption><strong>One app's location access</strong> <span>Choose when it can see your location, and how exactly.</span></figcaption>
  </figure></li>
</ul>

## How permissions work

An app has to ask before it can use your photos, location, contacts, camera or microphone, and an app only appears in the list once it has asked ([Apple](https://support.apple.com/102515)). Saying no doesn't delete the app or anything in it. It just closes that door until you open it again.

Some things don't need a permission at all. Many apps use Apple's own photo picker, which hands over only the photos you tap, without the app getting access to your library ([Apple](https://developer.apple.com/videos/play/wwdc2020/10652/)). It's the difference between passing someone one photo and handing them the album.

## Photos

Go to **Settings → Privacy & Security → Photos** and tap an app. You'll see some of these options:

- **None:** the app can't see your library.
- **Limited Access:** the app sees only the photos you've picked. Tap **Edit Selected Photos** to change them.
- **Full Access:** the app can see every photo and video, including details saved inside them, such as where each one was taken. Our free [photo metadata remover]({{ '/tools/photo-metadata-remover/' | relative_url }}) shows what those details reveal.
- **Add Photos Only:** offered by some apps that save pictures, like a camera or editing app. They can add photos but not look through the ones you have.

Full Access makes sense for a backup or photo-editing app you trust. A shopping, social or messaging app rarely needs it. Since iOS 16, apps with Full Access aren't given your hidden photos while the Hidden album is locked with Face ID, which is the setting it starts with ([Apple](https://developer.apple.com/documentation/photos/phfetchoptions/includehiddenassets)). Our guide to [where hidden photos actually go]({{ site.baseurl }}{% post_url 2026-11-12-where-hidden-photos-on-iphone-actually-go %}) explains what the Hidden album does and doesn't protect.

## Location

Go to **Settings → Privacy & Security → Location Services** and tap an app:

- **Never**
- **Ask Next Time or When I Share**
- **While Using the App**
- **Always**, which some apps offer, lets the app check your location even when you're not using it.

Below these, **Precise Location** decides whether the app gets your exact spot or only a rough area. A weather app works fine with a rough area; a maps or delivery app needs the exact one. When an app asks for the first time, you can also choose **Allow Once**.

Few apps need **Always**. If an app has it and you don't know why, change it to **While Using the App**.

## Contacts

Since iOS 18, you can share just some of your contacts with an app instead of the whole list ([TechCrunch](https://techcrunch.com/2024/06/12/ios-18-cracks-down-on-apps-asking-for-full-address-book-access)). In **Settings → Privacy & Security → Contacts**, tap an app, choose **Limited Access** and pick who it can see.

This is about other people's privacy as much as yours. Your contacts include their phone numbers, addresses and sometimes birthdays, and they didn't agree to share them with the app.

## Camera and microphone

Check **Camera** and **Microphone** under **Privacy & Security** in the same way. While an app is using them, iPhone shows a dot at the top of the screen: **orange** for the microphone, **green** for the camera ([Apple](https://support.apple.com/108331)). If you see one when you don't expect it, open Control Centre: the top of the screen shows which app used it recently.

## Tracking by other companies

Under **Privacy & Security → Tracking**, you can turn off **Allow Apps to Request to Track**. Apps then can't even ask, and each one is treated as if you'd chosen **Ask App Not to Track** ([Apple](https://support.apple.com/102420)).

An app told not to track isn't allowed to follow you across other companies' apps and websites, for example to target ads. It can still collect what you do inside the app itself.

## See what apps actually did

**Settings → Privacy & Security → App Privacy Report** shows how often each app used your location, photos, camera, microphone and contacts over the past seven days, and which internet addresses it contacted. The report is kept only on your phone ([Apple](https://support.apple.com/102188)). Turn it on, use your phone normally for a week, then look.

## If someone else may have set this up

If you're worried that another person has access to your phone or accounts, **Settings → Privacy & Security → Safety Check** lets you review which people and apps you're sharing with, and stop it ([Apple](https://support.apple.com/guide/personal-safety/ips2aad835e1/web)). Our guide to [private files on a shared phone]({{ site.baseurl }}{% post_url 2026-11-16-private-files-on-a-shared-phone %}) has more on this, including staying safe while you make changes.

## Related

- [Where hidden photos on iPhone actually go]({{ site.baseurl }}{% post_url 2026-11-12-where-hidden-photos-on-iphone-actually-go %})
- [What your screenshots give away]({{ site.baseurl }}{% post_url 2026-11-27-what-your-screenshots-give-away %})
- [Which browser is most private?]({{ site.baseurl }}{% post_url 2026-11-28-which-browser-is-most-private %})
- [What to check before trusting a vault app]({{ site.baseurl }}{% post_url 2026-11-11-what-to-check-before-trusting-a-vault-app %})
