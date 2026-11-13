/*
 * Photo blurrer: hide faces, number plates and anything else in a photo.
 *
 * Everything happens in this browser tab; the photo is never uploaded.
 *
 * Faces are found with Google's MediaPipe Face Detector (Apache 2.0), served
 * from this site and loaded only after a photo is chosen. The detector looks at
 * the whole photo and then at overlapping tiles, so smaller faces in group and
 * street photos are found too. Number plates and anything else are marked by
 * hand. Detection can miss faces, so the page asks people to check every photo.
 *
 * Covered areas are pixelated with large blocks or filled in solid black. A
 * light blur isn't offered, because it can sometimes be partly reversed.
 * The saved photo is drawn fresh from a canvas, and any blocks the browser adds
 * (JFIF, colour profile, Exif, PNG text) are stripped, so it has no metadata.
 */
(function () {
  'use strict';

  var VENDOR = '/assets/js/vendor/mediapipe/';
  var LOADER_URL = new URL(VENDOR + 'vision_wasm_internal.js', location.href).href;
  var BINARY_URL = new URL(VENDOR + 'vision_wasm_internal.wasm', location.href).href;
  var MODEL_URL = new URL(VENDOR + 'blaze_face_full_range.tflite', location.href).href;
  var MAX_PIXELS = 16777216; // iPhone Safari's canvas limit (4096 x 4096)
  var BLOCKS = 7; // pixel blocks across the longer side of a covered area

  var tool = document.getElementById('pb-tool');
  if (!tool) return;

  /* The detector adds its WebAssembly loader with a <script> tag. The page's
     Trusted Types policy allows exactly that one URL and nothing else. */
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
      window.trustedTypes.createPolicy('default', {
        createScriptURL: function (url) {
          if (url === LOADER_URL) return url;
          throw new TypeError('Blocked script URL: ' + url);
        }
      });
    } catch (err) { /* policy already exists */ }
  }

  var input = document.getElementById('pb-file');
  var drop = document.getElementById('pb-drop');
  var editor = document.getElementById('pb-editor');
  var canvas = document.getElementById('pb-canvas');
  var status = document.getElementById('pb-status');
  var removeBtn = document.getElementById('pb-remove');
  var clearBtn = document.getElementById('pb-clear');
  var saveBtn = document.getElementById('pb-save');
  var newBtn = document.getElementById('pb-new');
  var sizeNote = document.getElementById('pb-size');
  var ctx = canvas.getContext('2d');

  var photo = null;    // canvas holding the photo at working resolution
  var fileName = 'photo';
  var outType = 'image/jpeg';
  var boxes = [];      // {x, y, w, h, auto} in photo pixels
  var selected = -1;
  var scale = 1;       // display pixels per photo pixel
  var detector = null;
  var detectorPromise = null;

  tool.classList.add('is-ready');

  function setStatus(text, cls) {
    status.textContent = text;
    status.className = 'pb-status' + (cls ? ' ' + cls : '');
  }

  function mode() {
    var r = document.querySelector('input[name="pb-mode"]:checked');
    return r ? r.value : 'pixelate';
  }

  /* ---------- covering an area ---------- */

  function cover(c, src, b, k) {
    /* b is in photo pixels; k converts to the target canvas's pixels. */
    var x = Math.max(0, Math.floor(b.x * k)), y = Math.max(0, Math.floor(b.y * k));
    var x2 = Math.min(c.canvas.width, Math.ceil((b.x + b.w) * k));
    var y2 = Math.min(c.canvas.height, Math.ceil((b.y + b.h) * k));
    var w = x2 - x, h = y2 - y;
    if (w < 1 || h < 1) return;
    if (mode() === 'black') {
      c.fillStyle = '#000';
      c.fillRect(x, y, w, h);
      return;
    }
    var cols = w >= h ? BLOCKS : Math.max(1, Math.round(BLOCKS * w / h));
    var rows = h >= w ? BLOCKS : Math.max(1, Math.round(BLOCKS * h / w));
    var tmp = document.createElement('canvas');
    tmp.width = cols; tmp.height = rows;
    var t = tmp.getContext('2d');
    t.imageSmoothingEnabled = true;
    t.imageSmoothingQuality = 'high';
    t.drawImage(src, x / k, y / k, w / k, h / k, 0, 0, cols, rows);
    c.save();
    c.imageSmoothingEnabled = false;
    c.drawImage(tmp, 0, 0, cols, rows, x, y, w, h);
    c.restore();
  }

  /* ---------- drawing the editor ---------- */

  function layout() {
    if (!photo) return;
    var cssW = canvas.parentNode.clientWidth;
    var ratio = window.devicePixelRatio || 1;
    var dispW = Math.min(cssW, photo.width / ratio);
    scale = (dispW * ratio) / photo.width;
    canvas.width = Math.round(photo.width * scale);
    canvas.height = Math.round(photo.height * scale);
    canvas.style.width = dispW + 'px';
    canvas.style.height = (canvas.height / ratio) + 'px';
    draw();
  }

  function draw() {
    if (!photo) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);
    boxes.forEach(function (b) { cover(ctx, photo, b, scale); });
    var ratio = window.devicePixelRatio || 1;
    boxes.forEach(function (b, i) {
      var x = b.x * scale, y = b.y * scale, w = b.w * scale, h = b.h * scale;
      ctx.save();
      ctx.lineWidth = (i === selected ? 3 : 2) * ratio;
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([6 * ratio, 4 * ratio]);
      ctx.strokeStyle = i === selected ? '#4CCBD0' : (b.auto ? '#FFFFFF' : '#F3D27A');
      ctx.strokeRect(x, y, w, h);
      if (i === selected) {
        var hs = 14 * ratio;
        ctx.setLineDash([]);
        ctx.fillStyle = '#4CCBD0';
        ctx.fillRect(x + w - hs / 2, y + h - hs / 2, hs, hs);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5 * ratio;
        ctx.strokeRect(x + w - hs / 2, y + h - hs / 2, hs, hs);
      }
      ctx.restore();
    });
    removeBtn.disabled = selected < 0;
    clearBtn.disabled = boxes.length === 0;
  }

  /* ---------- pointer editing ---------- */

  var drag = null;

  function toPhoto(e) {
    var r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width * photo.width,
      y: (e.clientY - r.top) / r.height * photo.height
    };
  }
  function clampBox(b) {
    if (b.w < 0) { b.x += b.w; b.w = -b.w; }
    if (b.h < 0) { b.y += b.h; b.h = -b.h; }
    b.x = Math.max(0, Math.min(b.x, photo.width - 1));
    b.y = Math.max(0, Math.min(b.y, photo.height - 1));
    b.w = Math.min(b.w, photo.width - b.x);
    b.h = Math.min(b.h, photo.height - b.y);
    return b;
  }
  function hit(p) {
    var cssToPhoto = photo.width / canvas.getBoundingClientRect().width;
    if (selected >= 0) {
      var s = boxes[selected], hs = 16 * cssToPhoto;
      if (Math.abs(p.x - (s.x + s.w)) <= hs && Math.abs(p.y - (s.y + s.h)) <= hs) return { i: selected, resize: true };
    }
    for (var i = boxes.length - 1; i >= 0; i--) {
      var b = boxes[i];
      if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) return { i: i, resize: false };
    }
    return null;
  }

  canvas.addEventListener('pointerdown', function (e) {
    if (!photo || e.button > 0) return;
    e.preventDefault();
    canvas.focus({ preventScroll: true });
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* keep going without capture */ }
    var p = toPhoto(e), h = hit(p);
    if (h) {
      selected = h.i;
      var b = boxes[h.i];
      drag = h.resize ? { kind: 'resize', b: b } : { kind: 'move', b: b, dx: p.x - b.x, dy: p.y - b.y };
    } else {
      var nb = { x: p.x, y: p.y, w: 0, h: 0, auto: false };
      boxes.push(nb);
      selected = boxes.length - 1;
      drag = { kind: 'new', b: nb, x0: p.x, y0: p.y };
    }
    draw();
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var p = toPhoto(e), b = drag.b;
    if (drag.kind === 'move') {
      b.x = Math.max(0, Math.min(p.x - drag.dx, photo.width - b.w));
      b.y = Math.max(0, Math.min(p.y - drag.dy, photo.height - b.h));
    } else if (drag.kind === 'resize') {
      b.w = Math.max(4, Math.min(p.x, photo.width) - b.x);
      b.h = Math.max(4, Math.min(p.y, photo.height) - b.y);
    } else {
      b.x = Math.min(drag.x0, p.x); b.y = Math.min(drag.y0, p.y);
      b.w = Math.abs(p.x - drag.x0); b.h = Math.abs(p.y - drag.y0);
      clampBox(b);
    }
    draw();
  });
  function endDrag() {
    if (!drag) return;
    if (drag.kind === 'new') {
      var minSize = 8 * photo.width / canvas.getBoundingClientRect().width;
      if (drag.b.w < minSize || drag.b.h < minSize) {
        boxes.splice(boxes.indexOf(drag.b), 1);
        selected = -1;
      }
    }
    drag = null;
    draw();
    announce();
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  function removeSelected() {
    if (selected < 0) return;
    boxes.splice(selected, 1);
    selected = -1;
    draw();
    announce();
  }
  canvas.addEventListener('keydown', function (e) {
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeSelected(); }
    if (e.key === 'Escape') { selected = -1; draw(); }
  });
  removeBtn.addEventListener('click', removeSelected);
  clearBtn.addEventListener('click', function () {
    boxes = []; selected = -1; draw(); announce();
  });
  Array.prototype.forEach.call(document.querySelectorAll('input[name="pb-mode"]'), function (r) {
    r.addEventListener('change', draw);
  });

  var faceCount = null;
  function announce() {
    var auto = boxes.filter(function (b) { return b.auto; }).length;
    var manual = boxes.length - auto;
    var parts = [];
    if (faceCount !== null) parts.push(auto === 1 ? '1 face covered' : auto + ' faces covered');
    if (manual) parts.push(manual + ' area' + (manual === 1 ? '' : 's') + ' you marked');
    var lead = parts.length ? parts.join(', ') + '. ' : '';
    setStatus(lead + 'Check the whole photo: drag over anything the detector missed, such as number plates, faces turned away or in the distance, name badges and screens.', boxes.length ? '' : 'is-warn');
  }

  /* ---------- face detection ---------- */

  function loadDetector() {
    if (detectorPromise) return detectorPromise;
    if (!window.Vision || typeof WebAssembly !== 'object') {
      return (detectorPromise = Promise.reject(new Error('unsupported')));
    }
    detectorPromise = window.Vision.FaceDetector.createFromOptions(
      { wasmLoaderPath: LOADER_URL, wasmBinaryPath: BINARY_URL },
      {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.5
      }
    ).then(function (d) { detector = d; return d; });
    return detectorPromise;
  }

  function iou(a, b) {
    var x1 = Math.max(a.x, b.x), y1 = Math.max(a.y, b.y);
    var x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h);
    var inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    var smaller = Math.min(a.w * a.h, b.w * b.h);
    return { iou: inter / (a.w * a.h + b.w * b.h - inter), cover: smaller ? inter / smaller : 0 };
  }

  function detectAll(d) {
    var found = [];
    function run(src, ox, oy, k, minScore) {
      var res = d.detect(src);
      (res.detections || []).forEach(function (det) {
        var bb = det.boundingBox, score = det.categories && det.categories[0] ? det.categories[0].score : 1;
        if (!bb || score < minScore) return;
        found.push({ x: ox + bb.originX / k, y: oy + bb.originY / k, w: bb.width / k, h: bb.height / k, score: score });
      });
    }

    /* Whole photo, scaled so the long side is at most 1280 px. */
    var W = photo.width, H = photo.height;
    var k0 = Math.min(1, 1280 / Math.max(W, H));
    var whole = document.createElement('canvas');
    whole.width = Math.round(W * k0); whole.height = Math.round(H * k0);
    whole.getContext('2d').drawImage(photo, 0, 0, whole.width, whole.height);
    run(whole, 0, 0, k0, 0.5);

    /* Overlapping tiles at two sizes, for faces that are small in the frame. */
    var tile = document.createElement('canvas'), tc = tile.getContext('2d');
    [0.5, 0.3].forEach(function (f) {
      var T = Math.round(Math.min(W, H) * f);
      if (T < 160) return;
      var step = Math.round(T * 0.7);
      var k = Math.min(1, 640 / T);
      tile.width = Math.round(T * k); tile.height = Math.round(T * k);
      for (var ty = 0; ty < H; ty += step) {
        for (var tx = 0; tx < W; tx += step) {
          var x = Math.min(tx, W - T), y = Math.min(ty, H - T);
          tc.clearRect(0, 0, tile.width, tile.height);
          tc.drawImage(photo, x, y, T, T, 0, 0, tile.width, tile.height);
          run(tile, x, y, k, 0.6);
          if (tx + T >= W) break;
        }
        if (ty + T >= H) break;
      }
    });

    /* Merge duplicates: keep the stronger of two boxes that overlap a lot. */
    found.sort(function (a, b) { return b.score - a.score; });
    var kept = [];
    found.forEach(function (f) {
      var dup = kept.some(function (k) { var o = iou(f, k); return o.iou > 0.3 || o.cover > 0.6; });
      if (!dup) kept.push(f);
    });

    /* Pad each face so hair, ears and chin are covered too. */
    return kept.map(function (f) {
      var padX = f.w * 0.25, padTop = f.h * 0.45, padBottom = f.h * 0.2;
      return clampBox({ x: f.x - padX, y: f.y - padTop, w: f.w + padX * 2, h: f.h + padTop + padBottom, auto: true });
    });
  }

  /* ---------- loading a photo ---------- */

  function decode(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { resolve({ img: img, url: url }); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });
  }

  function open(file) {
    if (!file) return;
    fileName = (file.name || 'photo').replace(/\.[^.]+$/, '');
    outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    setStatus('Opening the photo…');
    editor.hidden = false;
    decode(file).then(function (r) {
      /* Browsers apply the photo's rotation when drawing it, so it comes out upright. */
      var w = r.img.naturalWidth, h = r.img.naturalHeight;
      var k = Math.min(1, Math.sqrt(MAX_PIXELS / (w * h)));
      photo = document.createElement('canvas');
      photo.width = Math.round(w * k); photo.height = Math.round(h * k);
      var pc = photo.getContext('2d');
      pc.imageSmoothingQuality = 'high';
      pc.drawImage(r.img, 0, 0, photo.width, photo.height);
      URL.revokeObjectURL(r.url);
      sizeNote.textContent = k < 1
        ? 'The saved photo will be ' + photo.width + ' × ' + photo.height + ' pixels, down from ' + w + ' × ' + h + ', because browsers limit how large an image they can edit.'
        : 'The saved photo will be ' + photo.width + ' × ' + photo.height + ' pixels, the same as the original.';
      boxes = []; selected = -1; faceCount = null;
      drop.hidden = true;
      layout();
      editor.scrollIntoView({ block: 'start', behavior: 'smooth' });
      setStatus('Looking for faces… The first time, this downloads the face detector (about 14 MB).', 'is-pending');
      return loadDetector().then(function (d) {
        /* Let the status message paint before the detector blocks the page briefly. */
        return new Promise(function (res) { setTimeout(res, 30); }).then(function () { return detectAll(d); });
      }).then(function (faces) {
        boxes = faces.concat(boxes);
        faceCount = faces.length;
        draw();
        announce();
      }, function () {
        faceCount = null;
        setStatus('Automatic face detection isn’t available in this browser. Drag over each face, number plate or anything else you want to hide.', 'is-warn');
      });
    }).catch(function () {
      editor.hidden = true;
      drop.hidden = false;
      setStatus(/heic|heif/i.test(file.type + file.name)
        ? 'This browser can’t open HEIC photos. Use Safari, or convert the photo to JPEG first.'
        : 'This file couldn’t be opened as a photo.', 'is-error');
    });
  }

  /* ---------- saving ---------- */

  /* A canvas export has no location or camera details, but browsers can still
     add their own blocks (JFIF header, colour profile, Exif with the size,
     PNG text or density chunks). Strip everything except the image data so the
     saved file carries no metadata at all, then check the result. The canvas
     is sRGB, which is what viewers assume when there's no profile. */
  function stripJpeg(b) {
    if (b[0] !== 0xFF || b[1] !== 0xD8) throw new Error('not jpeg');
    var parts = [b.subarray(0, 2)], i = 2;
    while (i < b.length) {
      if (b[i] !== 0xFF) throw new Error('bad marker');
      var m = b[i + 1];
      if (m === 0xFF) { i++; continue; } // fill byte
      if (m === 0xDA) { parts.push(b.subarray(i)); break; } // scan data and the rest
      if (m === 0xD9) { parts.push(b.subarray(i, i + 2)); break; }
      var len = (b[i + 2] << 8) | b[i + 3];
      var end = i + 2 + len;
      if (len < 2 || end > b.length) throw new Error('bad segment');
      var meta = (m >= 0xE0 && m <= 0xEF) || m === 0xFE; // APP0–APP15, comment
      if (!meta) parts.push(b.subarray(i, end));
      i = end;
    }
    return parts;
  }

  var PNG_KEEP = { IHDR: 1, PLTE: 1, tRNS: 1, IDAT: 1, IEND: 1 };
  function stripPng(b) {
    var sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    for (var k = 0; k < 8; k++) if (b[k] !== sig[k]) throw new Error('not png');
    var parts = [b.subarray(0, 8)], i = 8;
    while (i + 8 <= b.length) {
      var len = ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
      var type = String.fromCharCode(b[i + 4], b[i + 5], b[i + 6], b[i + 7]);
      var end = i + 12 + len;
      if (end > b.length) throw new Error('bad chunk');
      if (PNG_KEEP[type]) parts.push(b.subarray(i, end));
      i = end;
      if (type === 'IEND') break;
    }
    return parts;
  }

  function isClean(b, png) {
    var parts = png ? stripPng(b) : stripJpeg(b);
    var n = 0;
    parts.forEach(function (p) { n += p.length; });
    return n === b.length;
  }

  function stripMetadata(blob, png) {
    return blob.arrayBuffer().then(function (buf) {
      var b = new Uint8Array(buf);
      var parts = png ? stripPng(b) : stripJpeg(b), size = 0, at = 0;
      parts.forEach(function (p) { size += p.length; });
      var clean = new Uint8Array(size);
      parts.forEach(function (p) { clean.set(p, at); at += p.length; });
      if (!isClean(clean, png)) throw new Error('metadata left');
      return new Blob([clean], { type: blob.type });
    });
  }

  saveBtn.addEventListener('click', function () {
    if (!photo) return;
    var out = document.createElement('canvas');
    out.width = photo.width; out.height = photo.height;
    var oc = out.getContext('2d');
    oc.drawImage(photo, 0, 0);
    boxes.forEach(function (b) { cover(oc, photo, b, 1); });
    saveBtn.disabled = true;
    var png = outType === 'image/png';
    out.toBlob(function (raw) {
      if (!raw) {
        saveBtn.disabled = false;
        setStatus('The photo couldn’t be saved. Try a smaller photo.', 'is-error');
        return;
      }
      stripMetadata(raw, png).then(download, function () {
        saveBtn.disabled = false;
        setStatus('The photo couldn’t be saved without metadata in this browser. Try another browser.', 'is-error');
      });
    }, outType, 0.92);

    function download(blob) {
      saveBtn.disabled = false;
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = fileName + '-blurred.' + (outType === 'image/png' ? 'png' : 'jpg');
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    }
  });

  newBtn.addEventListener('click', function () {
    photo = null; boxes = []; selected = -1;
    editor.hidden = true;
    drop.hidden = false;
    setStatus('');
    input.focus();
  });

  /* ---------- choosing a photo ---------- */

  input.addEventListener('change', function () {
    open(input.files[0]);
    input.value = '';
  });
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) open(e.dataTransfer.files[0]);
  });
  window.addEventListener('dragover', function (e) { e.preventDefault(); });
  window.addEventListener('drop', function (e) { e.preventDefault(); });

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 100);
  });
})();
