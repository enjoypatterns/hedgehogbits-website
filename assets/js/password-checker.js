/*
 * Password strength and breach checker.
 *
 * Strength is estimated in this tab with zxcvbn (Dropbox, MIT licence, served
 * from this site). It never leaves the page.
 *
 * The breach check runs only when the visitor presses the button. It uses the
 * Have I Been Pwned "range" API with k-anonymity: the password is hashed with
 * SHA-1 here, and only the first 5 hex characters of the hash are sent. The API
 * returns every breached hash that starts with those 5 characters (with random
 * padding entries, so the response size gives nothing away), and the match is
 * looked for here. Neither the password nor its full hash leaves the browser.
 * The page's Content-Security-Policy allows no other outside connection.
 */
(function () {
  'use strict';

  var form = document.getElementById('pc-form');
  var input = document.getElementById('pc-password');
  if (!form || !input) return;

  var toggle = document.getElementById('pc-toggle');
  var out = document.getElementById('pc-strength');
  var bar = document.getElementById('pc-bar');
  var label = document.getElementById('pc-label');
  var times = document.getElementById('pc-times');
  var facts = document.getElementById('pc-facts');
  var advice = document.getElementById('pc-advice');
  var passcode = document.getElementById('pc-passcode');
  var breachBtn = document.getElementById('pc-breach');
  var breach = document.getElementById('pc-breach-result');

  /* Guesses per second for each scenario. The same figures zxcvbn uses. */
  var SCENARIOS = [
    { id: 'pc-t-online', rate: 100 / 3600 },
    { id: 'pc-t-slow', rate: 1e4 },
    { id: 'pc-t-fast', rate: 1e10 }
  ];
  var LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  var MAX_SCORED = 100; // zxcvbn slows down on very long input; the rest adds strength anyway

  document.getElementById('pc-tool').classList.add('is-ready');

  function duration(seconds) {
    if (!isFinite(seconds) || seconds >= 100 * 365.25 * 86400) return 'Centuries';
    if (seconds < 1) return 'Instantly';
    var units = [
      [365.25 * 86400, 'year'], [30.44 * 86400, 'month'], [86400, 'day'],
      [3600, 'hour'], [60, 'minute'], [1, 'second']
    ];
    for (var i = 0; i < units.length; i++) {
      if (seconds >= units[i][0]) {
        var n = Math.round(seconds / units[i][0]);
        return n + ' ' + units[i][1] + (n === 1 ? '' : 's');
      }
    }
    return 'Instantly';
  }

  function bigNumber(n) {
    if (n >= 1e18) return '10^' + Math.round(Math.log10(n));
    var names = [[1e15, 'quadrillion'], [1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
    for (var i = 0; i < names.length; i++) {
      if (n >= names[i][0]) return Math.round(n / names[i][0]) + ' ' + names[i][1];
    }
    return String(Math.max(1, Math.round(n)));
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function li(text) { var e = document.createElement('li'); e.textContent = text; return e; }

  function describe(pw) {
    var kinds = [];
    if (/[a-z]/.test(pw)) kinds.push('lower-case letters');
    if (/[A-Z]/.test(pw)) kinds.push('capitals');
    if (/[0-9]/.test(pw)) kinds.push('numbers');
    if (/[^A-Za-z0-9]/.test(pw)) kinds.push('symbols or spaces');
    var n = Array.from(pw).length;
    return n + ' character' + (n === 1 ? '' : 's') + (kinds.length ? ': ' + kinds.join(', ') : '');
  }

  var PATTERNS = {
    dictionary: 'a common word, name or password',
    spatial: 'a keyboard pattern',
    repeat: 'repeated characters',
    sequence: 'a sequence such as abc or 123',
    regex: 'a recent year',
    date: 'a date'
  };

  function update() {
    var pw = input.value;
    resetBreach();
    if (!pw) { out.hidden = true; return; }
    if (typeof window.zxcvbn !== 'function') return;
    out.hidden = false;

    var r = window.zxcvbn(pw.slice(0, MAX_SCORED));
    var guesses = r.guesses;
    if (pw.length > MAX_SCORED) guesses *= Math.pow(10, pw.length - MAX_SCORED);

    bar.setAttribute('data-score', String(r.score));
    label.textContent = LABELS[r.score];

    SCENARIOS.forEach(function (s) {
      document.getElementById(s.id).textContent = duration(guesses / s.rate);
    });

    clear(facts);
    facts.appendChild(li(describe(pw)));
    facts.appendChild(li('Takes about ' + bigNumber(guesses) + ' guesses to find'));
    var seen = {};
    r.sequence.forEach(function (m) {
      var what = PATTERNS[m.pattern];
      if (!what || seen[what]) return;
      seen[what] = true;
      var extra = m.pattern === 'dictionary' && m.l33t ? ' (with letters swapped for symbols)' :
        m.pattern === 'dictionary' && m.reversed ? ' (written backwards)' : '';
      facts.appendChild(li('Contains ' + what + extra));
    });

    clear(advice);
    if (r.feedback.warning) advice.appendChild(li(r.feedback.warning));
    r.feedback.suggestions.forEach(function (s) { advice.appendChild(li(s)); });
    if (r.score >= 3 && !advice.firstChild) advice.appendChild(li('Good. Use it in one place only, and keep it in a password manager.'));
    advice.hidden = !advice.firstChild;

    passcode.hidden = !/^\d{4,6}$/.test(pw);
  }

  var timer = 0;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(update, 120);
  });

  if (toggle) {
    toggle.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.textContent = show ? 'Hide' : 'Show';
      toggle.setAttribute('aria-pressed', show ? 'true' : 'false');
      input.focus();
    });
  }

  /* zxcvbn is large; if it arrives after the visitor has started typing, score what's there. */
  if (typeof window.zxcvbn === 'function') update();
  else window.addEventListener('load', update);

  /* ---------- breach check ---------- */

  var checking = 0;

  function resetBreach() {
    checking++;
    clear(breach);
    breach.hidden = true;
    breachBtn.disabled = false;
  }

  function show(cls, title, body, sent) {
    clear(breach);
    breach.className = 'pc-breach ' + cls;
    var h = document.createElement('p');
    h.className = 'pc-breach-title';
    h.textContent = title;
    breach.appendChild(h);
    if (body) {
      var p = document.createElement('p');
      p.textContent = body;
      breach.appendChild(p);
    }
    if (sent) {
      var s = document.createElement('p');
      s.className = 'small muted';
      s.appendChild(document.createTextNode('Sent to Have I Been Pwned: only '));
      var c = document.createElement('code');
      c.textContent = sent;
      s.appendChild(c);
      s.appendChild(document.createTextNode(', the first 5 characters of the password’s SHA-1 hash.'));
      breach.appendChild(s);
    }
    breach.hidden = false;
  }

  function sha1Hex(text) {
    return crypto.subtle.digest('SHA-1', new TextEncoder().encode(text)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join('').toUpperCase();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var pw = input.value;
    if (!pw) { input.focus(); return; }
    if (!window.crypto || !crypto.subtle) {
      show('is-error', 'This browser can’t run the check.', 'It needs a secure (https) connection and a current browser.');
      return;
    }
    var run = ++checking;
    breachBtn.disabled = true;
    show('is-pending', 'Checking…');
    var prefix;
    sha1Hex(pw).then(function (hash) {
      prefix = hash.slice(0, 5);
      var suffix = hash.slice(5);
      return fetch('https://api.pwnedpasswords.com/range/' + prefix, {
        headers: { 'Add-Padding': 'true' },
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        cache: 'no-store'
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      }).then(function (body) {
        var count = 0;
        body.split('\n').some(function (line) {
          var parts = line.trim().split(':');
          if (parts[0] === suffix) { count = parseInt(parts[1], 10) || 0; return true; }
          return false;
        });
        return count;
      });
    }).then(function (count) {
      if (run !== checking) return;
      breachBtn.disabled = false;
      if (count > 0) {
        show('is-bad', 'Found in data breaches ' + count.toLocaleString('en-GB') + ' time' + (count === 1 ? '' : 's') + '.',
          'Attackers try leaked passwords first, so this password is unsafe however strong it looks. If you use it anywhere, change it there, starting with your email account.', prefix);
      } else {
        show('is-good', 'Not found in known data breaches.',
          'That’s a good sign, but it doesn’t make a short or predictable password strong. Check the strength estimate too.', prefix);
      }
    }).catch(function () {
      if (run !== checking) return;
      breachBtn.disabled = false;
      show('is-error', 'Couldn’t reach Have I Been Pwned.', 'Check your connection and try again. A content blocker can also stop the request.');
    });
  });
})();
