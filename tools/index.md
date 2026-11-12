---
title: Free privacy tools
eyebrow: Tools
description: >-
  Free tools that run in your browser: see and remove the location hidden in your
  photos, and check how strong a password is and whether it has leaked in a breach.
lead: >-
  Small, free tools for keeping private things private. They run in your browser,
  need no account, and don't upload what you check.
permalink: /tools/
---

{%- assign tools = site.pages | where: "section", "tools" | sort: "order" %}
<ul class="post-list wide">
{%- for p in tools %}
  <li><a class="card" href="{{ p.url | relative_url }}">
    <h2>{{ p.title }}</h2>
    <p class="muted">{{ p.description }}</p>
  </a></li>
{%- endfor %}
</ul>

These pages are the only ones on this site that run JavaScript. Each one is allowed to run only its own script files, served from this site, and the page says exactly what, if anything, it sends elsewhere.
