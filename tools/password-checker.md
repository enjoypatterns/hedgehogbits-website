---
title: Password strength and breach checker
section: tools
order: 2
eyebrow: Free tool
description: >-
  See how long a password or passcode would take to crack, and check whether it
  has appeared in a data breach, without sending the password anywhere.
lead: >-
  Find out how quickly a password could be guessed, and whether it's already in a
  list of leaked passwords. The strength check runs on your device. The breach
  check sends only a 5-character fragment of a hash, never the password.
permalink: /tools/password-checker/
scripts:
  - /assets/js/vendor/zxcvbn.js
  - /assets/js/password-checker.js
csp_connect: "https://api.pwnedpasswords.com"
tool:
  name: Password strength and breach checker
  features:
    - Estimates how many guesses a password takes, using the zxcvbn algorithm
    - Shows time to crack for online guessing, slow hashes and fast hashes
    - Checks Have I Been Pwned's leaked-password list using k-anonymity
    - The password never leaves the browser
faq:
  - q: "Is it safe to type my real password here?"
    a: "The password stays in this browser tab. The strength estimate runs on your device, and the breach check sends only the first 5 characters of the password's SHA-1 hash, which matches hundreds of unrelated passwords. The page runs no analytics and can't connect anywhere except Have I Been Pwned. If you'd still rather not, test a password built the same way instead."
  - q: "How does the breach check work without sending my password?"
    a: "Your browser turns the password into a SHA-1 hash and sends the first 5 of its 40 characters to Have I Been Pwned. The service replies with every leaked hash that starts the same way, plus random padding so the reply size reveals nothing. Your browser then looks for a full match. This method is called k-anonymity."
  - q: "How is the time to crack worked out?"
    a: "The zxcvbn algorithm, created at Dropbox, estimates how many guesses an attacker would need by spotting common passwords, words, names, dates, keyboard patterns and sequences. That number is divided by a guessing speed for each scenario. Real attacks vary, so treat the times as a guide to compare passwords, not a guarantee."
  - q: "Is a 6-digit iPhone passcode strong enough?"
    a: "For unlocking the phone itself, usually yes, because the iPhone limits how fast passcodes can be tried and adds longer delays after repeated wrong attempts. The same 6 digits would be weak anywhere guesses can be made offline, such as the password for an encrypted backup or a vault app."
  - q: "What makes a strong password?"
    a: "Length and unpredictability. Four or five random words, chosen by a password manager or dice rather than by you, are both strong and memorable. Use a different password for every account and keep them in a password manager."
  - q: "Can I check whether my email address was in a breach?"
    a: "Yes, on [haveibeenpwned.com](https://haveibeenpwned.com/). Checking an email address means sending it to the service, so this page doesn't do it for you."
---

<div class="tool" id="pc-tool">
  <noscript><p class="callout">This tool runs in your browser and needs JavaScript. Nothing you type here is sent anywhere without it.</p></noscript>
  <form id="pc-form" class="pc-form" autocomplete="off">
    <label class="pc-label-text" for="pc-password">Password or passcode</label>
    <div class="pc-field">
      <input id="pc-password" type="password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="256" aria-describedby="pc-privacy">
      <button type="button" id="pc-toggle" class="button button-secondary" aria-pressed="false" aria-controls="pc-password">Show</button>
    </div>
    <p id="pc-privacy" class="tool-note small muted">The strength estimate runs on this device as you type. Nothing is sent anywhere unless you press Check data breaches.</p>

    <div id="pc-strength" class="pc-strength" hidden>
      <div class="pc-score" aria-live="polite">
        <div id="pc-bar" class="pc-bar" data-score="0" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
        <p id="pc-label" class="pc-score-label"></p>
      </div>
      <h3>Time to crack</h3>
      <table class="spec pc-times">
        <tr><th>Guessing at a login page that limits attempts <span class="muted">(100 an hour)</span></th><td id="pc-t-online"></td></tr>
        <tr><th>Offline, against a slow hash such as bcrypt or Argon2id <span class="muted">(10,000 a second)</span></th><td id="pc-t-slow"></td></tr>
        <tr><th>Offline, against a fast or leaked unsalted hash <span class="muted">(10 billion a second)</span></th><td id="pc-t-fast"></td></tr>
      </table>
      <ul id="pc-facts" class="pc-facts"></ul>
      <ul id="pc-advice" class="pc-advice" hidden></ul>
      <div id="pc-passcode" class="callout" hidden>
        <p>On an iPhone, a short numeric passcode is more reasonable than these times suggest, because the phone limits how fast it can be tried and adds longer delays after wrong attempts. Those limits don't apply to a password for an encrypted backup, a vault app or a website, where guesses can be made offline.</p>
      </div>
    </div>

    <div class="tool-actions">
      <button type="submit" id="pc-breach" class="button">Check data breaches</button>
    </div>
    <div id="pc-breach-result" class="pc-breach" hidden aria-live="polite"></div>
  </form>
</div>

## What the results mean

**Strength** comes from [zxcvbn](https://github.com/dropbox/zxcvbn), an open-source estimator created at Dropbox. Rather than counting character types, it looks for the shortcuts attackers use: common passwords, dictionary words, names, dates, keyboard patterns like `qwerty`, sequences like `1234`, and letters swapped for symbols like `p@ssw0rd`. `Summer2024!` follows the usual rules but is quick to guess.

**Time to crack** depends on where the password is used:

- A website that limits login attempts slows attackers to a crawl.
- If a site's password database leaks, attackers can guess offline as fast as their hardware allows. Slow hashes such as bcrypt or Argon2id make each guess expensive. Old or careless systems use fast hashes, where billions of guesses a second are possible.

**Breach check** looks up the password in [Have I Been Pwned](https://haveibeenpwned.com/Passwords)'s collection of passwords from real data breaches, currently hundreds of millions. Attackers try these first, so a breached password is unsafe however complex it looks.

## How your password stays private

- The page runs only two scripts, both served from this site: zxcvbn and the checker itself. Its security policy lets it connect to one outside address, `api.pwnedpasswords.com`, and nothing else.
- No request is made until you press **Check data breaches**.
- Your browser hashes the password with SHA-1 and sends only the first 5 characters of the 40-character hash. Have I Been Pwned replies with every leaked hash that starts with those 5 characters, plus random padding, and your browser looks for a match. The service never learns the password or which result you were looking for.
- After a check, the page shows you exactly what was sent.

## Choosing a vault password

The password for an encrypted vault or backup can't rely on lockouts, because whoever has the file can guess offline. Hedgehog Bits slows each guess down with Argon2id, using 256 MiB of memory and 3 passes. Even so, the password itself does most of the work. Four or five random words make a good vault password that you can also remember. There is no recovery if you forget it, so choose something memorable.

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

- [How Hedgehog Bits encrypts your files]({% post_url 2026-10-24-how-hedgehog-bits-encrypts-your-files %})
{% include post-link.html slug="what-to-check-before-trusting-a-vault-app" text="What to check before trusting a vault app" prefix="- " %}
- [See and remove the location in your photos]({{ '/tools/photo-metadata-remover/' | relative_url }})

{% include app-card.html %}
