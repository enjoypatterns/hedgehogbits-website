---
title: How Hedgehog Bits compares
eyebrow: Compare
description: >-
  Side-by-side comparisons of Hedgehog Bits with the iPhone Hidden album,
  calculator vault apps and cloud-based photo vaults. Honest trade-offs included.
lead: >-
  There is no single right way to keep files private. These pages set out what each
  approach protects, what it costs you, and where Hedgehog Bits fits.
permalink: /compare/
---

{%- assign comparisons = site.pages | where: "section", "compare" | sort: "order" %}
<ul class="post-list wide">
{%- for p in comparisons %}
  <li><a class="card" href="{{ p.url | relative_url }}">
    <h2>{{ p.title }}</h2>
    <p class="muted">{{ p.description }}</p>
  </a></li>
{%- endfor %}
</ul>

## How we write these pages

- We describe other approaches by what they are designed to do, using their own documentation where we can.
- We include the cases where another option is the better choice for you.
- Each page shows the date it was last reviewed. Apps change, so check current details before you decide.

If you think something here is out of date or unfair, we would like to correct it.
