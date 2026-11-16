#!/usr/bin/env python3
"""Check a built Hedgehog Bits blog post for SEO and link problems.

Usage: check_post.py <built-site-dir> <post-slug>

Build the site first with future posts included (see SKILL.md step 6).
Exits with status 1 if anything needs fixing.
"""
import glob
import html
import os
import re
import sys

if len(sys.argv) != 3:
    sys.exit(__doc__)
root, slug = sys.argv[1].rstrip('/'), sys.argv[2]
found = glob.glob(f'{root}/blog/*/*/{slug}/index.html')
if not found:
    sys.exit(f'No built post for slug "{slug}" under {root}/blog/. Built with future posts?')
page = open(found[0], encoding='utf-8').read()

problems, notes = [], []
def bad(msg): problems.append(msg)
def ok(msg): notes.append(msg)

# Post body: what the layout counts for reading time (between the header and the app card).
body = page[page.find('</header>', page.find('<article')):page.find('<aside class="app-card"')]
text = html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)\b.*?</\1>', ' ', body, flags=re.S)))
words = len(text.split())
minutes = words // 200 + 1
(ok if words < 1000 else bad)(f'{words} rendered words -> shown as "{minutes} min read" (5 minutes at most: under 1,000 words)')

def meta(attr, name):
    m = re.search(rf'<meta {attr}="{re.escape(name)}"[^>]*content="([^"]*)"', page) or \
        re.search(rf'<meta content="([^"]*)"[^>]*{attr}="{re.escape(name)}"', page)
    return html.unescape(m.group(1)) if m else None

h1 = re.findall(r'<h1[^>]*>(.*?)</h1>', page, re.S)
title = html.unescape(re.sub(r'<[^>]+>', '', h1[0])).strip() if h1 else ''
(ok if len(h1) == 1 else bad)(f'{len(h1)} h1 element(s)')
(ok if 0 < len(title) <= 60 else bad)(f'title {len(title)} chars (max 60): {title}')

desc = meta('name', 'description') or ''
(ok if 120 <= len(desc) <= 165 else bad)(f'description {len(desc)} chars (aim 150-160)')

levels = [int(n) for n in re.findall(r'<h([2-6])\b', body)]
skips = [f'h{a}->h{b}' for a, b in zip([2] + levels, levels) if b > a + 1]
(bad if skips else ok)('heading levels ' + ('skip: ' + ', '.join(skips) if skips else 'in order'))
(ok if len(levels) >= 4 else bad)(f'{len(levels)} sub-headings')

for img in re.findall(r'<img\b[^>]*>', body):
    src = re.search(r'src="([^"]*)"', img).group(1)
    alt = re.search(r'alt="([^"]*)"', img)
    if not alt or len(alt.group(1).strip()) < 15:
        bad(f'image without useful alt text: {src}')
    if 'width=' not in img or 'height=' not in img:
        bad(f'image without width/height: {src}')
    if re.search(r'(IMG_|Gemini_|image\d|screenshot)', os.path.basename(src), re.I):
        bad(f'image file name is not descriptive: {src}')
    path = root + re.sub(r'^https?://[^/]+', '', src)
    if os.path.exists(path) and os.path.getsize(path) > 200_000:
        bad(f'image is {os.path.getsize(path) // 1000} KB (keep under ~150 KB): {src}')

og = meta('property', 'og:image') or ''
(bad if not og or og.endswith('/og-image.png') else ok)(
    'social image: ' + (og or 'missing') + (' (site default; add image: to front matter)' if og.endswith('/og-image.png') else ''))
(ok if meta('property', 'og:image:alt') else bad)('social image alt text ' + ('set' if meta('property', 'og:image:alt') else 'missing'))

internal, external = set(), set()
for href in re.findall(r'<a\b[^>]*href="([^"]+)"', body):
    if href.startswith(('http://localhost', '/')):
        path = re.sub(r'^https?://[^/]+', '', href).split('#')[0]
        if path in ('/blog/', '/'):
            continue
        target = root + path + ('index.html' if path.endswith('/') else '')
        (internal.add(path) if os.path.exists(target) else bad(f'broken internal link: {href}'))
    elif href.startswith('http'):
        external.add(href)
(ok if len(internal) >= 3 else bad)(f'{len(internal)} distinct internal links: ' + ', '.join(sorted(internal)))
ok(f'{len(external)} external links' + (': ' + ', '.join(sorted(external)) if external else ''))

backlinks = []
for f in glob.glob(f'{root}/blog/*/*/*/index.html'):
    if f != found[0] and f'/{slug}/' in open(f, encoding='utf-8').read().split('<aside class="app-card"')[0].split('<article')[-1]:
        backlinks.append(f.split('/')[-2])
(ok if backlinks else bad)(f'{len(backlinks)} other posts link here' + (': ' + ', '.join(backlinks) if backlinks else ''))

print(f'Checked {found[0]}\n')
for n in notes: print('  ok    ' + n)
for p in problems: print('  FIX   ' + p)
sys.exit(1 if problems else 0)
