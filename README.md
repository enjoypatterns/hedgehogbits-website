# Hedgehog Bits website

Promotional site and blog for Hedgehog Bits, built with Jekyll for GitHub Pages.
No cookies, analytics, web fonts or third-party scripts. Only the free tools under `/tools/` run JavaScript, all of it served from this site.

## Before publishing

Edit `_config.yml`:

- `url` / `baseurl`: `https://hedgehogbits.com` and `""`. The domain is also in `CNAME`; keep the two in step.
- `app_store_url`: the App Store listing, used by every "Download on the App Store" button.
- `app_store_id`: the numeric App Store ID (`6832221911`). Safari on iPhone uses it to show Apple's Smart App Banner.
- A post or page can set its own social preview with `image: { path: ..., width: ..., height: ..., alt: ... }` in front matter. Otherwise it uses `og-image.png`. Add `last_modified_at:` when you update a page or post substantially.
- `contact_email`: `info@hedgehogbits.com`. Shown in the footer and on the feedback, privacy and security pages and in `security.txt`.
- `.well-known/security.txt`: renew the `Expires` date yearly.

## Deploy

1. Push this folder to the `main` branch of a GitHub repository.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**

`.github/workflows/pages.yml` builds and deploys on every push, and again every day at 06:15 UTC.
The daily run is what publishes scheduled posts (see below). You can also run it by hand from the
**Actions** tab ("Run workflow").

Note: GitHub pauses scheduled workflows in public repositories after 60 days without any commits.
If that happens, GitHub emails you and you can re-enable it from the Actions tab.

## Scheduled posts

A post whose filename date is in the future is left out of the build until that date, then appears
on the next daily build. To schedule a post, just give it a future date.

To link to a post that may not be published yet, use the include instead of `post_url`
(`post_url` to an unpublished post fails the build). It renders nothing until the post is live:

```liquid
{% include post-link.html slug="post-slug" text="Link text" prefix="- " %}
```

To preview scheduled posts locally, add `--future` to `jekyll serve`.

## Preview locally

Needs Ruby 3.x (GitHub Pages' Jekyll 3.10 does not run on Ruby 3.4+/4). With Docker:

```sh
docker run --rm -it -p 4000:4000 -v "$PWD":/site -w /site ruby:3.3 \
  bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0 --future"
```

Then open http://localhost:4000.

## Writing a blog post

Add `_posts/YYYY-MM-DD-slug.md`:

```yaml
---
title: Post title
description: One or two sentences. Used for search results, social previews, the blog list and llms.txt.
tags: [privacy]
---
```

## SEO and AI agents

- `jekyll-seo-tag`: titles, meta descriptions, canonical URLs, Open Graph and Twitter cards, JSON-LD.
- `_includes/structured-data.html`: schema.org `Organization`, `MobileApplication` and, on the FAQ page, `FAQPage`
  (generated from the `faq:` list in `faq.md`, which also renders the visible FAQ).
- `sitemap.xml`, `feed.xml` (RSS), `robots.txt` (explicitly allows search and AI crawlers).
- `llms.txt` and `llms-full.txt`: plain-text summaries for language models, following llmstxt.org.
- Semantic HTML, one `h1` per page, descriptive link text, and light/dark mode.

## Layout

| Path | What |
|---|---|
| `index.html` | Home page |
| `features.md`, `security.md`, `faq.md`, `privacy.md` | Main pages |
| `blog/index.html`, `_posts/` | Blog |
| `tools/`, `assets/js/` | Free tools: photo metadata remover, photo blurrer, password checker |
| `_layouts/`, `_includes/` | Templates |
| `assets/css/main.css` | Styles; colours match the app's `Theme.swift` |
| `assets/images/` | Artwork and icons from the app; `og-image.png` is the social preview |


## Demo video

`/demo/` and the home page hero show a walkthrough of the app, recorded in the iOS Simulator with made-up sample content.

- **Files:** `assets/demo/`. `demo-light.mp4` and `demo-dark.mp4` are about 0.9 MB each. The `NN-name-light|dark.webp` stills are the step-by-step screenshots.
- **Shared markup:** `_includes/demo-video.html`.
  - The hero version plays automatically, muted and looping. With Reduce Motion on, it downloads nothing and shows a still instead.
  - The `/demo/` version has controls and only loads when played.
  - Both follow light and dark mode.
- **Page text:** the `/demo/` front matter holds the video details (used for the VideoObject structured data and `og:video`), the chapter times and the step captions. `llms-full.txt` reuses the captions.
- **Re-recording:** from the app repo, run `Scripts/record_demo.sh ../hedgehog-bits-website`. It builds the app, loads the sample vault, runs the scripted walkthrough (`HedgehogBitsDemo/WebsiteDemo.swift`) in light and dark, and copies the encoded videos here. If the screens change, also update the stills and check the chapter times.

## Security

- **Content-Security-Policy** (in `_includes/head.html`): the site loads nothing from other origins and
  by default runs no JavaScript, so the policy is `default-src 'none'` with only same-origin images and stylesheets.
  Don't add inline `style="…"` attributes or `<style>` blocks; put styles in `assets/css/main.css`.
  GitHub Pages can't send real security headers, so `frame-ancestors` and HSTS aren't available.
- **Pages with JavaScript** (only the free tools in `tools/`) opt in through front matter:
  `scripts:` lists same-origin script files, and the CSP then allows exactly those files and
  enforces Trusted Types, so build the page with `textContent` and DOM methods, never `innerHTML`.
  `csp_connect:` adds origins the page may `fetch` from (the password checker uses
  `https://api.pwnedpasswords.com`), and `csp_img:` adds image sources (`blob:` for local previews).
  `csp_script:` adds script sources that no `<script>` tag loads (the photo blurrer's WebAssembly
  loader, which MediaPipe injects itself, and `'wasm-unsafe-eval'`), and `trusted_types:` names the
  Trusted Types policies a page may create. The blurrer creates a `default` policy that allows only
  that one loader URL.
- **Vendored libraries**, unmodified:
  - `assets/js/vendor/zxcvbn.js`: zxcvbn 4.4.2 from npm (MIT, licence alongside).
  - `assets/js/vendor/mediapipe/`: `@mediapipe/tasks-vision` 1.1.1 from npm (`vision_bundle.js`,
    `wasm/vision_wasm_internal.js` and `.wasm`), and the BlazeFace full-range face detection model
    from Google's `mediapipe-models` bucket (Apache 2.0, licence alongside). The WASM file is about
    13.5 MB and is fetched only when someone opens a photo in the blurrer.
- **Referrer policy:** `no-referrer`, so outbound links don't tell other sites where visitors came from.
- **Workflow:** actions are pinned to commit SHAs, jobs get only the permissions they need, and
  Dependabot (`.github/dependabot.yml`) proposes updates weekly.
- **Outside the repo** (see the domain, email and account checklist): verify the domain on GitHub,
  add SPF/DKIM/DMARC and a CAA record, and use 2FA on the GitHub and registrar accounts.
