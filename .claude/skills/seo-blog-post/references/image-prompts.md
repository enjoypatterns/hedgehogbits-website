# Editorial image prompts (Gemini)

The blog's images are calm, flat editorial illustrations in the site's palette. They
go along with the article rather than explaining it, which is what the SVG diagrams do.
The VPN post's café scene is the reference: `assets/blog/vpn-on-public-wifi-cafe.webp`.

## Rules for every prompt

- **No text in the image** (no words, letters, numbers, logos, brand names, app UI).
  Generators misspell text, and text in images doesn't help search.
- **The site's palette:** deep teal `#0B6E77`, warm sand `#9C8C6E`, cream, soft grey
  `#F3F5F6`, charcoal `#1B2428` accents.
- **Friendly and reassuring:** everyday people in everyday places, diverse and
  natural. Not dramatic or fearful.
- **Avoid the clichés:** hackers in hoodies, floating padlocks in cyberspace, binary
  code, glowing circuitry, skulls, dark rooms, photorealism.
- **Wide 16:9, subject centred** so it survives the 1200×630 social crop.
- **One visual metaphor for the article's main idea** (a sealed envelope, a ribbon
  shielding a connection, a drawer with a lock), placed naturally in the scene.
- **Real products only as generic shapes:** a generic smartphone, never a recognisable
  Apple device or interface.

## Template

```
A calm, minimal editorial illustration for a blog article about <TOPIC>, written for
non-technical readers.

Scene: <WHO is doing WHAT, WHERE: one everyday moment>. <THE METAPHOR: one simple
visual idea that hints at the article's point>. <2–3 supporting background details
that make the place feel real>.

Style: flat vector illustration with soft shading, clean shapes, generous empty space,
friendly and reassuring rather than dramatic. Muted palette: deep teal (#0B6E77),
warm sand (#9C8C6E), cream, soft grey (#F3F5F6) and charcoal accents. No harsh shadows.

Avoid: any text, letters, numbers, logos or brand names; recognisable phone brands or app
screens; hackers in hoodies; padlocks floating in cyberspace; binary code; glowing
circuitry; dark or threatening mood; photorealism.

Format: wide 16:9 landscape, with the main subject centred so it still works when
cropped to 1200×630.
```

Offer two or three variations: one symbolic (an object metaphor), one human (a person
in a real setting), and optionally one close-up. Say in a line what each conveys.
