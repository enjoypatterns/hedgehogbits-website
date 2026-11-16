# SEO checklist for Hedgehog Bits posts

Based on Google Search Central guidance: people-first ("helpful") content, E-E-A-T,
title links, snippets, image SEO, links. The site already handles the technical side
automatically (see README "SEO and AI agents"): canonical URLs, Open Graph/Twitter
cards, BlogPosting JSON-LD, sitemap, RSS, llms.txt. Don't add those by hand.

## Content (most of the ranking weight)

- [ ] Answers one clear question completely, better than the current top results.
      Search the phrase and note what they miss or get wrong.
- [ ] Original value: plain-language explanation, exact iPhone steps, honest limits
      ("what it doesn't do"), an analogy or diagram. Not a rewrite of other articles.
- [ ] Shows experience and expertise: precise details, correct setting names, sources
      for claims. Trustworthiness matters most for a privacy and security site.
- [ ] Written for people. A keyword appears where a person would naturally say it.
- [ ] The answer appears early (`## The short version`), so skimmers and featured
      snippets get it.
- [ ] No filler intro, no padding to hit a length, no AI clichés ("in today's digital world",
      "delve", "it's important to note").
- [ ] Short: under 1,000 rendered words (5-minute read at most).
- [ ] No repetition: each point made once. No restating in other words, no section recaps, no closing summary.

## Title (`title:`)

- [ ] Unique, specific and 60 characters or fewer, so it isn't cut off in results.
- [ ] Primary phrase near the start, worded the way people search.
- [ ] Matches the `h1` (the layout uses `title` for both). No site name; the
      SEO plugin adds it.
- [ ] Honest. Says exactly what the post delivers, with no clickbait.

## Description (`description:`)

- [ ] 150–160 characters, a complete sentence or two.
- [ ] Says what the reader will learn and includes the primary phrase naturally.
- [ ] Different from every other page's description.

## URL

- [ ] Short, lower-case, hyphenated, readable; contains the primary phrase.
- [ ] Never change it after publishing (it would break links and lose ranking).

## Headings

- [ ] One `h1` (the title, added by the layout). The post itself starts at `##`.
- [ ] `##` then `###`, never skipping a level.
- [ ] Several headings phrased as the questions people ask.

## Links

- [ ] 3–6 descriptive internal links in the body, plus `## Related`.
- [ ] 1–3 older posts link back to the new one.
- [ ] External links only to reputable primary sources (Apple Support, Google, studies,
      regulators, established press). Plain links; the site adds no tracking.

## Images

- [ ] Descriptive file name with hyphenated words (`vpn-on-public-wifi-cafe.webp`),
      not `IMG_1234` or `Gemini_Generated_…`.
- [ ] Alt text describes the image for someone who can't see it, in natural words.
- [ ] `width` and `height` set (prevents layout shift, a Core Web Vitals factor).
- [ ] WebP for the page, kept small (under about 150 KB). JPEG 1200×630 for the social `image:`.
- [ ] Metadata stripped.

## Freshness

- [ ] When an existing post is substantially updated, add `last_modified_at: YYYY-MM-DD`.
