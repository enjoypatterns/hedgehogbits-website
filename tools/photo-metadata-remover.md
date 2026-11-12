---
title: See and remove the location in your photos
section: tools
order: 1
eyebrow: Free tool
description: >-
  Find out what your photos reveal (GPS location, date, phone model) and
  download a clean copy with that metadata removed. Works with iPhone HEIC, JPEG,
  PNG and WebP. Nothing is uploaded.
lead: >-
  Photos from a phone usually carry the exact place they were taken, the date and
  time, and the phone model. Check what yours give away, then save a clean copy
  without it. Your photos stay on your device.
permalink: /tools/photo-metadata-remover/
scripts:
  - /assets/js/photo-metadata.js
csp_img: "blob:"
tool:
  name: Photo metadata remover
  features:
    - Shows GPS location, date and time, device, lens and camera settings
    - Removes EXIF, XMP, IPTC and comments without re-compressing the image
    - Supports HEIC, HEIF, AVIF, JPEG, PNG and WebP
    - Runs entirely in the browser; photos are never uploaded
faq:
  - q: "Are my photos uploaded?"
    a: "No. The photo is read and cleaned by this page in your browser. The page's security policy blocks connections to other sites, and this website has no server that could receive a file. You can load the page, turn off Wi-Fi and mobile data, and it still works."
  - q: "Does removing metadata reduce the quality?"
    a: "No. The tool removes the metadata blocks and copies the image data exactly as it was, without re-compressing it. The clean copy is checked before you can download it."
  - q: "What is kept?"
    a: "The colour profile, so colours look the same, and the rotation setting, so the photo still shows the right way up. Everything else, including location, dates, device details, names and the small preview thumbnail, is removed."
  - q: "Does it work on iPhone?"
    a: "Yes, in Safari. Tap Choose photos, then Photo Library or Browse. Depending on the iOS version and the option you pick, iPhone may hand the page a JPEG copy of a HEIC photo. The tool shows what that copy contains and cleans it."
  - q: "Do social networks remove location anyway?"
    a: "Many large social networks remove it from the public copy when you post. But they may still read it when you upload. Email attachments, AirDrop, cloud storage links, many forums and photos sent \"as a file\" or \"as a document\" in messaging apps usually pass along the original file with its metadata."
  - q: "How do I stop my iPhone adding location to photos?"
    a: "Go to Settings → Privacy & Security → Location Services → Camera and choose Never. To remove location from one photo you're sharing, tap Options at the top of the share sheet and turn off Location."
---

<div class="tool" id="pm-tool">
  <noscript><p class="callout">This tool runs in your browser and needs JavaScript. Your photo would still not be uploaded.</p></noscript>
  <input type="file" id="pm-file" class="visually-hidden" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif,.jpg,.jpeg,.png,.webp,.heic,.heif,.avif" multiple>
  <label class="dropzone" id="pm-drop" for="pm-file">
    <span class="dropzone-title">Choose photos</span>
    <span class="muted small">or drop them here · HEIC, JPEG, PNG, WebP, AVIF</span>
  </label>
  <p class="tool-note small muted">Your photos never leave this device. This page can't connect to other sites, and this website has no server to receive files.</p>
  <p class="tool-note small muted"><strong>On a Mac:</strong> picking a photo straight from the Photos library can hand over a smaller preview copy instead of the original. For the full-size photo, select it in Photos, choose File → Export → Export Unmodified Original, and drop that file here.</p>
  <div id="pm-results" class="tool-results" aria-live="polite"></div>
</div>

## What a photo can give away

A photo from a phone stores extra details alongside the picture. Most of it comes from the camera's EXIF data:

- **Location.** GPS coordinates accurate to a few metres, often with altitude and the direction the camera was facing. A photo taken at home can reveal your home address.
- **Date and time.** When the photo was taken, down to the second, with the time zone.
- **Device.** The phone or camera model, the lens, the iOS version, and on some cameras a serial number that links photos to the same device.
- **Names and notes.** Author or owner names, captions and comments added by editing apps.
- **A thumbnail.** A small preview of the original photo. If the photo was cropped in some editors, the preview can still show the uncropped picture.

## How the tool works

1. It reads the file in your browser and lists every metadata field it finds, in plain language.
2. It builds a copy with the metadata blocks taken out. The image data itself is copied byte for byte, so nothing is re-compressed. The colour profile and rotation setting stay so the photo looks the same.
3. It reads the copy again to confirm that no location, date, device or name details are left. Only then does it offer the download.

## Stop location being added in the first place

On iPhone, go to **Settings → Privacy & Security → Location Services → Camera** and choose **Never**. New photos won't record where they were taken.

To share a single photo without its location, select it in Photos, tap **Share**, tap **Options** at the top of the share sheet, and turn off **Location**. To change or remove the location saved with a photo in your library, open the photo, swipe up, and tap **Adjust** next to the map.

## Questions

<div class="faq">
{%- for item in page.faq %}
<details>
  <summary>{{ item.q }}</summary>
  <div>{{ item.a | markdownify }}</div>
</details>
{%- endfor %}
</div>

## Related

{% include post-link.html slug="where-hidden-photos-on-iphone-actually-go" text="Where hidden photos on iPhone actually go" prefix="- " %}
{% include post-link.html slug="private-files-on-a-shared-phone" text="Keeping private files private on a shared phone" prefix="- " %}
- [Password strength and breach checker]({{ '/tools/password-checker/' | relative_url }})

{% include app-card.html %}
