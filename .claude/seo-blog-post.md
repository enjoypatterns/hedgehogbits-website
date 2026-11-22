# Blog profile for seo-blog-post

Read by the `seo-blog-post` skill (`~/.claude/skills/seo-blog-post/`). Facts here override
the skill's general guidance.

## Site
- **What it is:** the website and blog for Hedgehog Bits, an encrypted, offline vault for iPhone
  that looks like a set of brain games. It has no servers and no accounts. From the release that
  adds it, Plus includes optional sync (Settings > Sync: the user's own iCloud or a folder in Files),
  which uploads only ciphertext; posts from before that release describe the vault as never synced.
  The sync post is `2026-12-01-sync-private-files-between-iphone-and-ipad.md`; its URL is hard-coded
  in the app (`SyncSettings.articleURL`), so never rename or redate it without changing the app. Product facts:
  `features.md`, `security.md`, the post `2026-10-24-how-hedgehog-bits-encrypts-your-files.md`.
  The free tools are under `tools/`: photo metadata remover, photo blurrer and password checker.
- **Generator:** Jekyll 3.10 (GitHub Pages).
  - Posts are `_posts/YYYY-MM-DD-slug.md`.
  - URLs are `/blog/YYYY/MM/slug/`.
- **Front matter:**
  ```yaml
  title: "VPNs: what they do and what they don't"
  description: >-
    150–160 characters.
  tags: [privacy, how-to, iphone]   # reuse existing tags
  image:                             # the post's social preview
    path: /assets/blog/<name>-social.jpg
    width: 1200
    height: 630
    alt: "..."
  ```
  `jekyll-seo-tag` produces the meta tags, Open Graph tags and BlogPosting JSON-LD from these fields. Don't add them by hand.
- **Post links:**
  - To a post dated *before* the new one: `[text]({{ site.baseurl }}{% post_url YYYY-MM-DD-slug %})`.
  - To a post that may not be published yet:
    `{% include post-link.html slug="slug" text="Link text" prefix="- " suffix="" %}`.
    It renders nothing, including the prefix and suffix, until that post is live. Use it for
    back-links from older posts to a scheduled post, and keep the whole sentence inside
    `prefix`/`text`/`suffix`.
  - To pages and tools: `{{ '/tools/photo-metadata-remover/' | relative_url }}`.
- **Scheduling and deploy:**
  - A future-dated post is published by the daily GitHub Actions build (06:15 UTC).
  - **Pushing to `main` deploys the site.** Commit and push only when the user asks.
  - Default date: the day after the latest post in `_posts/`.
- **Build and preview:**
  - Ports 4000 and 4001 are used by the user's own containers. Use 4010, built and then served
    statically. `jekyll serve` rewrites the URL to 0.0.0.0, which breaks the CSP script URLs.
  - Build into a scratch folder:
    ```sh
    printf 'url: "http://localhost:4010"\nfuture: true\n' > _dev_tmp.yml
    docker run --rm -v "$PWD":/srv -v "$PWD/.bundle-docker":/usr/local/bundle -v "$OUT":/out -w /srv \
      ruby:3.3 bundle exec jekyll build --config _config.yml,_dev_tmp.yml -d /out; rm -f _dev_tmp.yml
    python3 -m http.server 4010 --bind 127.0.0.1 --directory "$OUT"
    ```
  - The production-style build is the same command without the extra config, into another folder.
- **Reading time:** `words / 200 + 1` minutes. The count is the post's rendered content, including
  inline SVG text, so a post must stay **under 1,000 words** to show "5 min read". Run the checker
  with `--wpm 200`, and remember the site rounds down and adds one.
- **Images:**
  - Post images go in `assets/blog/`: a WebP for the page and a `-social.jpg` (1200×630) for `image:`.
  - In the post, use `<figure><img src="{{ '/assets/blog/NAME.webp' | relative_url }}" width=".." height=".." alt="..."></figure>`.
  - The lead image goes after the intro, before `## The short version`.
- **Constraints:**
  - The CSP allows no inline styles: all CSS goes in `assets/css/main.css`.
  - Posts have no JavaScript.
  - Inline SVG is fine, as long as it's styled by classes in `main.css` and has fallback presentation
    attributes.
  - Diagrams are includes in `_includes/diagrams/`; `vpn.html` is the model.
  - The stylesheet URL is versioned on each build.

## Audience and voice
- **Readers:** ordinary iPhone owners who want to keep private things private (photos, documents,
  notes) and understand privacy without jargon. They're not developers. They arrive from searches
  like "is incognito mode private" or "where do hidden photos go".
- **Voice:**
  - British English (travelling, colour, organise).
  - Second person.
  - Calm, practical and honest about limits.
- **Model posts:** `2026-11-10-what-incognito-mode-does-and-does-not-do.md` and
  `2026-11-26-what-a-vpn-does-and-does-not-do.md`, which follow the pattern "short version, what it
  does, what it doesn't, iPhone steps, Related". `2026-11-12-where-hidden-photos-on-iphone-actually-go.md`
  is the model for length.
- **Product:** mention Hedgehog Bits only where it genuinely helps the reader. The layout adds an
  app card to every post.
- **Sources:** primary sources, linked inline. Apple Support pages for iPhone behaviour.

## Visual style
- **Palette:**
  - deep teal `#0B6E77` (dark mode `#4CCBD0`)
  - warm sand `#9C8C6E`
  - cream
  - soft grey background `#F3F5F6`
  - charcoal text `#1B2428`
  - warning red `#B3412E`
- **Image style:** calm, flat editorial illustration with everyday people and one visual metaphor.
  Reference: `assets/blog/vpn-on-public-wifi-cafe.webp`.
- **Clichés to avoid:** hackers in hoodies, floating padlocks in cyberspace, binary code,
  glowing circuitry, recognisable Apple devices or UI.

## Rules from the user
- Posts are short: a 5-minute read at most (under 1,000 words). Shorter is fine.
- No repetition: each point is made once. No recaps, and no closing summary.
- Every technical claim must be accurate. Run the accuracy review every time.
- Existing posts are fine as they are. Don't shorten them unless asked.
