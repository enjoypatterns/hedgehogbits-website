---
title: Blur faces and number plates in a photo
section: tools
order: 2
eyebrow: Free tool
description: >-
  Hide faces, number plates and other details in a photo before you share it.
  Faces are found automatically; mark anything else by hand. Works in your
  browser, and the photo is never uploaded.
lead: >-
  Cover faces, number plates, house numbers, screens or anything else before you
  post or send a photo. Faces are found automatically, and you can add or remove
  areas by hand. Your photo stays on your device.
permalink: /tools/photo-blur/
scripts:
  - /assets/js/vendor/mediapipe/vision_bundle.js
  - /assets/js/photo-blur.js
csp_script:
  - /assets/js/vendor/mediapipe/vision_wasm_internal.js
  - "'wasm-unsafe-eval'"
trusted_types: default
csp_img: "blob:"
tool:
  name: Photo blurrer
  features:
    - Finds faces automatically with an on-device face detector
    - Mark number plates or anything else by dragging a box
    - Pixelate with large blocks or cover in solid black
    - Removes all metadata from the saved photo, including location, dates and camera details
    - Runs entirely in the browser; photos are never uploaded
faq:
  - q: "Is my photo uploaded?"
    a: "No. The photo is opened, edited and saved by this page in your browser. The face detector is downloaded from this website and runs on your device. The page's security policy blocks connections to other sites, and this website has no server that could receive a photo."
  - q: "Does it find every face?"
    a: "No detector is perfect. It works best on faces that look roughly towards the camera. It can miss faces that are very small, turned away, partly hidden, blurred by movement or in poor light. Always look over the whole photo and drag a box over anything it missed."
  - q: "Why are number plates marked by hand?"
    a: "Accurate number plate detectors are large, and the good ones come with licence terms that don't suit a free tool like this one. Dragging a box over a plate takes a second, and you can see exactly what is covered."
  - q: "Why pixelate rather than blur?"
    a: "A light blur can sometimes be partly reversed, or still leave text readable. Large pixel blocks keep only a few average colours from the area, and the solid black option keeps nothing at all."
  - q: "Is the location removed too?"
    a: "Yes. All metadata is removed from the saved photo: location, dates, camera and phone details, names, and even the blocks browsers add themselves. Only the picture is left. To remove metadata without changing the picture at all, use the photo metadata remover instead."
  - q: "Why is my saved photo smaller?"
    a: "It is saved at the same size in pixels unless the photo is larger than about 16.7 megapixels. Browsers on iPhone can't edit images bigger than that, so larger photos are scaled down to fit and the page tells you the new size. The file size can also differ because the photo is saved again as a high-quality JPEG."
---

<div class="tool" id="pb-tool">
  <noscript><p class="callout">This tool runs in your browser and needs JavaScript. Your photo would still not be uploaded.</p></noscript>
  <input type="file" id="pb-file" class="visually-hidden" accept="image/*">
  <label class="dropzone" id="pb-drop" for="pb-file">
    <span class="dropzone-title">Choose a photo</span>
    <span class="muted small">or drop it here · JPEG, PNG, WebP, or HEIC in Safari</span>
  </label>
  <p id="pb-status" class="pb-status" aria-live="polite"></p>
  <div id="pb-editor" class="pb-editor" hidden>
    <div class="pb-stage">
      <canvas id="pb-canvas" class="pb-canvas" tabindex="0" aria-label="Photo. Drag to cover an area; drag a box to move it; drag its corner handle to resize it."></canvas>
    </div>
    <fieldset class="pb-modes">
      <legend class="visually-hidden">How to cover areas</legend>
      <label><input type="radio" name="pb-mode" value="pixelate" checked> Pixelate</label>
      <label><input type="radio" name="pb-mode" value="black"> Solid black</label>
    </fieldset>
    <div class="tool-actions">
      <button type="button" id="pb-save" class="button">Save photo</button>
      <button type="button" id="pb-remove" class="button button-secondary" disabled>Remove selected box</button>
      <button type="button" id="pb-clear" class="button button-secondary" disabled>Remove all boxes</button>
      <button type="button" id="pb-new" class="button button-secondary">Choose another photo</button>
    </div>
    <p id="pb-size" class="tool-note small muted"></p>
  </div>
  <p class="tool-note small muted">Your photo never leaves this device. The face detector runs on it, and this page can't connect to other sites.</p>
</div>

## How to use it

1. **Choose a photo.** Faces are found and covered automatically. The first time, your browser downloads the face detector (about 14 MB) from this site.
2. **Check the whole photo.** Drag over anything else you want hidden: number plates, house numbers, street signs, name badges, screens, documents, tattoos, or any face the detector missed.
3. **Fix any boxes.** Drag a box to move it, or drag its corner handle to resize it. Tap a box and press **Remove selected box** to delete a wrong one.
4. **Save the photo.** The covered areas are pixelated or blacked out for good in the saved copy, and all metadata is removed from it. The original photo isn't changed.

## What to hide before you share a photo

- **Faces**, especially children's, and people who didn't agree to be posted.
- **Number plates**, which can be linked to a vehicle's owner.
- **House numbers, street signs and landmarks** near your home or a child's school.
- **Screens and paperwork**: messages, emails, boarding passes, tickets, bank cards, letters.
- **Badges and uniforms** that show a name, school or workplace.
- **Reflections** in windows, mirrors and sunglasses.

The photo's hidden details matter too. This tool removes all of them from the saved copy, including the location. If you only want to remove the location and camera details without changing the picture, use the [photo metadata remover]({{ '/tools/photo-metadata-remover/' | relative_url }}).

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

- [See and remove the location in your photos]({{ '/tools/photo-metadata-remover/' | relative_url }})
{% include post-link.html slug="private-files-on-a-shared-phone" text="Keeping private files private on a shared phone" prefix="- " %}
{% include post-link.html slug="where-hidden-photos-on-iphone-actually-go" text="Where hidden photos on iPhone actually go" prefix="- " %}

{% include app-card.html %}
