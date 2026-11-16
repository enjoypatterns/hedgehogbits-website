---
name: seo-blog-post
description: >-
  Write a new SEO-optimised Hedgehog Bits blog post: pick a topic that fits the
  blog's audience, write a short (5 minutes at most), non-repetitive read in plain language, add internal links,
  give the user Gemini prompts for an editorial image in the site's style, then
  review the finished post for technical inaccuracies before scheduling it. Use
  when the user asks for a new blog post or article, or ideas for one.
---

# Writing an SEO-optimised blog post for Hedgehog Bits

Work through the steps in order. Don't skip the accuracy review (step 7): a wrong
technical claim on a privacy blog costs more trust than the post earns in traffic.

The repo conventions are in `README.md` ("Scheduled posts", "Writing a blog post",
"SEO and AI agents"). SEO details are in `references/seo-checklist.md`, image prompts
in `references/image-prompts.md`.

## 1. Learn the blog and its audience

Read before proposing anything:

- `_config.yml` (site description), `index.md`/`features.md` for what the app is.
- Every post in `_posts/`: titles, descriptions, tags, headings
  (`grep "^title\|^description\|^tags\|^## " _posts/*.md`). Read two or three in full
  to absorb the voice, especially `2026-11-10-what-incognito-mode-does-and-does-not-do.md`
  and `2026-11-26-what-a-vpn-does-and-does-not-do.md`, which are the model posts.
- `tools/` for the free tools (photo metadata remover, photo blurrer, password checker).

**The audience:** ordinary iPhone owners who want to keep private things private
(photos, documents, notes) and want to understand privacy without jargon. Not
developers, not security professionals. Many arrive from a search like "is incognito
mode private" or "where do hidden photos go".

## 2. Choose the topic

If the user named a topic, check it doesn't duplicate an existing post. If they
didn't, propose 3–5 ideas and let them pick. A good topic:

- matches a question real people search for, phrased the way they'd type it
  ("does a VPN hide my location", "what can my Wi-Fi provider see");
- fits the audience and the app's world (privacy, iPhone, files, photos, sharing,
  travel, device hand-offs) without being an advert for the app;
- links naturally to at least two existing posts or tools;
- isn't already covered. If it overlaps, suggest an angle that complements it.

State the **primary search phrase** and 3–5 related phrases or questions before
writing. Use them naturally; never stuff keywords.

## 3. Write the post

**Length:** short. A 5-minute read at most: the layout shows `words / 200 + 1` minutes,
counted from the rendered page (including any diagram text), so stay **under 1,000
rendered words**. That's a ceiling, not a goal: shorter is better whenever the
question is fully answered (most existing posts are 400–600 words). If the topic
needs more, narrow it or split it into two posts rather than going over. Check with
`scripts/check_post.py` (step 6).

**No repetition.** Say each thing once, in the place it fits best. Don't restate a
point in different words in a later section, don't end sections with a recap of what
they just said, and don't add a closing summary that repeats the body. The only
deliberate overlap is `## The short version`. It gives the answer in 2–3
sentences, and the body adds detail to that answer without repeating its wording. If two
sections cover the same ground, merge them. Cross-references are fine ("see
*What a VPN doesn't do* above"); re-explaining is not.

**Language:**
- British English (travelling, colour, organise), matching the rest of the site.
- Short sentences and everyday words. Explain any unavoidable term the first time,
  in italics: "an address (an *IP address*)".
- Second person ("you", "your phone"). Calm and practical, never alarmist.
- One idea per paragraph; paragraphs of 1–4 sentences.
- A concrete analogy helps for anything technical (the VPN post's envelopes).

**Structure** (adapt; this is what works on this blog):
1. Intro of 2–3 short paragraphs that names the question and the common misunderstanding.
2. `## The short version`: the answer in 2–3 sentences, for skimmers and for
   Google's featured snippets.
3. Body sections with `##` headings phrased the way people search
   ("What a VPN doesn't do"). Use `###` for sub-points. Bulleted lists with a bold
   lead-in are good for "what it does" lists.
4. A practical iPhone section with exact steps where relevant
   (**Settings → Privacy & Security → …**, bold for on-screen names).
5. `## Related` with 2–4 links.

Mention Hedgehog Bits only where it genuinely helps the reader; the layout already
adds an app card at the end of every post.

**File and front matter:** `_posts/YYYY-MM-DD-slug.md`.

```yaml
---
title: "VPNs: what they do and what they don't"   # 60 chars max, primary phrase near the start
description: >-
  150–160 characters. Answers the question and says who it's for. Used for the
  search snippet, social previews, the blog list and llms.txt.
tags: [privacy, how-to, iphone]   # reuse existing tags; check with grep
image:                             # add once the user supplies the image (step 5)
  path: /assets/blog/<slug-words>-social.jpg
  width: 1200
  height: 630
  alt: "..."
---
```

The slug is short, lower-case, hyphenated and contains the primary phrase
(`what-a-vpn-does-and-does-not-do`). No dates or stop-word padding beyond what reads naturally.

**Date:** unless the user gives one, schedule it for **the day after the latest
post in `_posts/`**. Future-dated posts are published by the daily build.

**Sources:** for any statistic, legal point, study or company behaviour, link a
reputable primary source inline, as the incognito post does. If you can't verify it,
leave it out.

**Optional diagram:** if an idea is easier to see than read, draw an inline SVG include
like `_includes/diagrams/vpn.html`. Use the generator approach from that file: `vd-*`
classes styled in `assets/css/main.css` so it follows light/dark mode, *plus* fallback
presentation attributes (fill, stroke, font-size) so it still reads if CSS is stale.
Portrait panels about 320 units wide, so they stack on phones. Text inside it counts
towards the reading time.

## 4. Internal links

Scan the whole blog and the tools for pages related to each section
(`grep -il "<keyword>" _posts/*.md tools/*.md`). Then:

- Add **3–6 inline links** in the body, on descriptive anchor text that says
  where the link goes ("[travelling with private files](…)"), never "click here".
  Link where the text already touches the subject; don't bolt on sentences just
  to hold a link.
- Link to the free tools where they help (`{{ '/tools/photo-metadata-remover/' | relative_url }}`).
- Fill `## Related` with the closest 2–4 posts or tools.
- **Linking to posts:** a post dated before the new one can use
  `[text]({{ site.baseurl }}{% post_url YYYY-MM-DD-slug %})`.
  A post dated *after the new one* must use the include, which renders nothing
  until that post is live:
  `{% include post-link.html slug="slug" text="Link text" prefix="- " %}`.
- **Links back:** find 1–3 *existing* posts where a sentence naturally leads to the
  new post, and add a link there with the `post-link.html` include (put the whole
  sentence in `prefix`/`text`/`suffix`, so nothing dangles before the new post is
  published). Add it to their `## Related` lists too.

## 5. Editorial image

Give the user one to three Gemini prompts following `references/image-prompts.md`:
in the site's palette, no text in the image, and a centred subject that survives the
1200×630 crop. Explain briefly what each shows.

When the user sends the image back:

```sh
SRC=~/Downloads/<file>.jpg; NAME=<descriptive-seo-words>   # e.g. vpn-on-public-wifi-cafe
magick "$SRC" -strip -quality 82 -define webp:method=6 assets/blog/$NAME.webp
# Social crop: centre-crop to 1.905:1, then 1200x630 (adjust the crop to the source size)
magick "$SRC" -gravity center -crop <W>x<round(W/1.905)>+0+0 +repage -resize 1200x630! \
  -strip -quality 85 -interlace JPEG assets/blog/$NAME-social.jpg
```

- `-strip` removes all metadata, including AI-generation tags. Look at the social crop to make sure nobody is cut off.
- Put the WebP after the intro, before `## The short version`, as
  `<figure><img src="{{ '/assets/blog/NAME.webp' | relative_url }}" width=".." height=".." alt="..."></figure>`.
- Alt text describes what's in the picture in one or two plain sentences, naturally
  including the topic. Set the same image as `image:` in front matter (the social JPEG).

## 6. Build and check

Build to a scratch folder with future posts included, and once more without them,
the way production builds today:

```sh
S=<scratchpad>; printf 'url: "http://localhost:4010"\nfuture: true\n' > _dev_tmp.yml
docker run --rm -v "$PWD":/srv -v "$PWD/.bundle-docker":/usr/local/bundle -v "$S/site":/out -w /srv \
  ruby:3.3 bundle exec jekyll build --config _config.yml,_dev_tmp.yml -d /out; rm -f _dev_tmp.yml
docker run --rm -v "$PWD":/srv -v "$PWD/.bundle-docker":/usr/local/bundle -v "$S/site-prod":/out -w /srv \
  ruby:3.3 bundle exec jekyll build -d /out
python3 .claude/skills/seo-blog-post/scripts/check_post.py "$S/site" <slug>
```

The script reports rendered words and reading time, title and description lengths,
heading order, missing alt text, social image tags, and any internal link that doesn't
resolve. Fix everything it flags. Serve `$S/site` (for example
`python3 -m http.server 4010 --bind 127.0.0.1`; port 4000 may be in use) and give the
user the preview link. If a diagram or image was added, look at it at phone width and
in dark mode.

## 7. Accuracy review

Re-read the finished post as a sceptical expert. For **every** factual or technical
sentence, ask: is it true, is it true *in general* (not just usually), and could a
non-technical reader take it to mean something false? Check in particular:

- **Overclaiming:** "always", "never", "completely", "anonymous", "can't be traced".
  Prefer precise, modest wording.
- **iPhone steps and setting names:** match the current iOS wording and paths. Say
  when they moved between versions.
- **Company and product behaviour:** what Apple, Google, VPN providers or others do,
  as of now. Link the source.
- **Numbers, dates, laws and studies:** each one sourced and correctly quoted.
- **Analogies:** the simplification mustn't teach something false.
- **Images and diagrams:** labels and arrows say the same as the text.
- **Consistency with other posts and the app's own claims** (`features.md`, the
  encryption post).

Then do a **repetition pass**: list each section's main point in one line. Wherever
two lines say the same thing, keep it in the better place and cut or merge the other.
Also check that no paragraph restates the one before it, and that the ending doesn't
summarise the body. Cutting repetition is the first way to get under the word limit.

Fix what you find, then tell the user what you changed and why (a short list, including
any repetition you cut), so they can see the review happened.

## 8. Hand over

Summarise: title, date, word count/reading time, primary search phrase, internal
links added (in the new post and back-links in older ones), image prompts, and what the
accuracy review changed. **Don't commit or push until the user asks.** Pushing to
`main` deploys the site. Commit messages end with the attribution line given in the
session instructions.
