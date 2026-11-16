---
title: "What your screenshots give away, and how to share safely"
description: >-
  A screenshot can show more than you meant to share: names, messages, codes and
  addresses. How to spot what's in one, and how to cover it properly on iPhone.
tags: [privacy, how-to, iphone]
image:
  path: /assets/blog/hiding-details-in-a-phone-screenshot-social.jpg
  width: 1200
  height: 630
  alt: "Illustration of a hand covering part of a phone screen with a solid teal card before sharing a screenshot"
---

Screenshots are the quickest way to share something: a message, a booking, a bug in an app. Because they take a second, we rarely look at them closely before sending them on.

But a screenshot captures everything on the screen at that moment, including things you weren't paying attention to. Here's what to look for, and how to hide it properly.

<figure>
  <img src="{{ '/assets/blog/hiding-details-in-a-phone-screenshot.webp' | relative_url }}" width="1376" height="768" alt="Illustration of a hand placing a solid teal card over part of a phone screen on a table, while a message bubble, a map pin and a ticket with a barcode float above it.">
</figure>

## The short version

Before you share a screenshot, look at every corner of it, not just the part you meant to show. Cover anything personal with a solid block rather than a highlighter or a light blur. Then delete the original if you don't need it.

## What a screenshot can show without you noticing

- **Notifications.** A message that arrives as you take the screenshot appears at the top, with the sender's name and a preview of what they wrote.
- **Other people.** Names, phone numbers, profile photos and messages from people in a chat or a group. They didn't choose to be shared.
- **Where you live or are.** Delivery addresses, a map with your location, the name of your Wi-Fi network, a local weather widget.
- **Codes and barcodes.** Order numbers, tracking links, tickets and QR codes. A boarding pass barcode, for example, contains your name and booking reference, which on many airlines is enough to view or change the booking ([Krebs on Security](https://krebsonsecurity.com/2015/10/whats-in-a-boarding-pass-barcode-a-lot/)).
- **Links.** A web address can contain an account or order number, or a link that signs someone in.
- **Your apps.** A screenshot of your home screen shows which apps you use, including any you'd rather keep to yourself.

<figure>
  <img src="{{ '/assets/blog/covering-a-boarding-pass-barcode-on-a-phone.webp' | relative_url }}" width="1376" height="768" alt="Illustration of a traveller at an airport holding a phone that shows a ticket with a barcode, and covering the barcode with a solid teal card. A plane takes off outside the window." loading="lazy">
</figure>

### Full Page screenshots in Safari include the whole page

When you take a screenshot in Safari, you can choose **Full Page**. That saves the entire web page as a PDF, including the parts you never scrolled to ([MacRumors](https://www.macrumors.com/how-to/screenshot-entire-webpage-iphone)). Check the whole PDF before you send it.

## What's in the file itself

A screenshot doesn't come from the camera, so it usually has no GPS location, unlike a photo. It does keep the date and time it was taken. To see exactly what an image file contains, open it in our [photo metadata remover]({{ '/tools/photo-metadata-remover/' | relative_url }}).

If you crop or mark up a screenshot in the Photos app, your library keeps the original. Anyone who can open your Photos library can tap **Revert** to bring back what you covered. That matters on a phone other people use: see [keeping private files private on a shared phone]({{ site.baseurl }}{% post_url 2026-11-16-private-files-on-a-shared-phone %}).

## How to cover things properly

- **Crop first.** The safest detail is the one that isn't in the picture at all. Crop to the part you need to show.
- **Use solid blocks.** Highlighter pens are see-through, and a few strokes of a pen can leave letters readable between the lines. A filled black box hides everything under it.
- **Don't rely on a light blur.** Blurred text can sometimes still be read, especially numbers. Large pixel blocks or solid black are safer.
- **Check the result at full size.** Zoom in on the copy you're about to send, not the original.

Our free [photo blurrer]({{ '/tools/photo-blur/' | relative_url }}) does this in your browser. Drag a box over anything you want hidden and save a new copy. It finds faces automatically too, and the saved image has no metadata.

## Avoid surprises before you take one

Turn off message previews on the lock screen and in banners: go to **Settings → Notifications → Show Previews** and choose **When Unlocked** or **Never**. A Focus such as **Do Not Disturb** also stops most new notifications appearing while you capture the screen.

## After you've shared it

Screenshots are saved to your photo library like any other picture. With iCloud Photos turned on, they appear on your other devices too, and deleting one moves it to **Recently Deleted** for about 30 days. [Where hidden photos on iPhone actually go]({{ site.baseurl }}{% post_url 2026-11-12-where-hidden-photos-on-iphone-actually-go %}) explains how the library and iCloud handle them.

Screenshots of documents, like a passport page, a prescription or a bank letter, are worth deleting once they've done their job, or keeping somewhere private. Our guide to [storing ID, medical and tax documents]({{ site.baseurl }}{% post_url 2026-11-18-storing-id-medical-and-tax-documents-on-iphone %}) covers where they're safest.

## Related

- [Blur faces and number plates in a photo]({{ '/tools/photo-blur/' | relative_url }})
- [See and remove the location in your photos]({{ '/tools/photo-metadata-remover/' | relative_url }})
- [Travelling with private files on your iPhone]({{ site.baseurl }}{% post_url 2026-11-24-travelling-with-private-files %})
