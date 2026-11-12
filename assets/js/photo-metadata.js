/*
 * Photo metadata viewer and remover.
 *
 * Everything happens in this browser tab. The page's Content-Security-Policy
 * allows no network requests other than to this site, so the photo can't be sent
 * anywhere even by mistake.
 *
 * Cleaning is lossless: the image data is copied byte for byte and only the
 * metadata blocks are taken out.
 *   JPEG  drops APP1 (EXIF, XMP), APP13 (IPTC), comments, non-ICC APP2 (MPF) and
 *         anything after the end of the main image (extra images such as HDR gain maps).
 *   PNG   drops eXIf, tEXt, zTXt, iTXt and tIME chunks.
 *   WebP  drops EXIF and XMP chunks and updates the header flags.
 *   HEIC, HEIF, AVIF
 *         overwrites the Exif item with an empty EXIF block and any XMP item with
 *         an empty packet, in place, so every offset in the file stays valid.
 * Colour profiles are kept. If the photo relies on the EXIF Orientation tag to
 * display the right way up, a tiny EXIF block with only that tag is written back.
 * The cleaned file is then read again, and it is only offered for download if
 * nothing identifying is left.
 */
(function () {
  'use strict';

  var MAX_BYTES = 200 * 1024 * 1024;
  var latin1 = new TextDecoder('windows-1252');
  var utf8 = new TextDecoder('utf-8');

  /* ---------- small helpers ---------- */

  function ascii(b, start, len) {
    var s = '';
    for (var i = 0; i < len && start + i < b.length; i++) s += String.fromCharCode(b[start + i]);
    return s;
  }
  function startsWith(b, start, str) { return ascii(b, start, str.length) === str; }
  function u16be(b, o) { return (b[o] << 8) | b[o + 1]; }
  function u32be(b, o) { return ((b[o] << 24) >>> 0) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3]; }
  function u32le(b, o) { return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16)) + ((b[o + 3] << 24) >>> 0); }
  function concat(parts) {
    var n = 0, i, out, off = 0;
    for (i = 0; i < parts.length; i++) n += parts[i].length;
    out = new Uint8Array(n);
    for (i = 0; i < parts.length; i++) { out.set(parts[i], off); off += parts[i].length; }
    return out;
  }
  function fromAscii(str) {
    var out = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 0xff;
    return out;
  }

  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(b) {
    var c = 0xffffffff;
    for (var i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  /* ---------- EXIF (TIFF) ---------- */

  var TYPE_SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };

  function parseTiff(b) {
    if (!b || b.length < 8) return null;
    var le;
    if (b[0] === 0x49 && b[1] === 0x49) le = true;
    else if (b[0] === 0x4d && b[1] === 0x4d) le = false;
    else return null;
    var dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    function u16(o) { return dv.getUint16(o, le); }
    function u32(o) { return dv.getUint32(o, le); }
    if (u16(2) !== 42) return null;

    var out = { ifd0: {}, exif: {}, gps: {}, ifd1: {}, count: 0, tags: [] };
    var seen = {};

    function value(type, count, off) {
      var i, arr = [];
      if (type === 2) {
        var s = latin1.decode(b.subarray(off, off + count));
        return s.replace(/\0[\s\S]*$/, '').trim();
      }
      if (type === 1 || type === 6 || type === 7) {
        if (count > 64) return { bytes: count };
        for (i = 0; i < count; i++) arr.push(type === 6 ? dv.getInt8(off + i) : b[off + i]);
        return count === 1 ? arr[0] : arr;
      }
      var size = TYPE_SIZE[type];
      var n = Math.min(count, 32);
      for (i = 0; i < n; i++) {
        var o = off + i * size;
        switch (type) {
          case 3: arr.push(u16(o)); break;
          case 4: arr.push(u32(o)); break;
          case 8: arr.push(dv.getInt16(o, le)); break;
          case 9: arr.push(dv.getInt32(o, le)); break;
          case 5: arr.push(u32(o + 4) ? u32(o) / u32(o + 4) : NaN); break;
          case 10: arr.push(dv.getInt32(o + 4, le) ? dv.getInt32(o, le) / dv.getInt32(o + 4, le) : NaN); break;
          case 11: arr.push(dv.getFloat32(o, le)); break;
          case 12: arr.push(dv.getFloat64(o, le)); break;
        }
      }
      return count === 1 ? arr[0] : arr;
    }

    function readIfd(off, target, name) {
      if (!off || off + 2 > b.length || seen[off]) return 0;
      seen[off] = true;
      var n = u16(off);
      for (var i = 0; i < n; i++) {
        var e = off + 2 + i * 12;
        if (e + 12 > b.length) break;
        var tag = u16(e), type = u16(e + 2), count = u32(e + 4);
        var size = TYPE_SIZE[type];
        if (!size) continue;
        var total = size * count;
        var vo = total <= 4 ? e + 8 : u32(e + 8);
        if (vo + total > b.length || total > b.length) continue;
        try {
          target[tag] = value(type, count, vo);
          out.count++;
          out.tags.push(name + ':' + tag);
        } catch (err) { /* skip unreadable tag */ }
      }
      var nextAt = off + 2 + n * 12;
      return nextAt + 4 <= b.length ? u32(nextAt) : 0;
    }

    try {
      var next = readIfd(u32(4), out.ifd0, 'ifd0');
      if (next) readIfd(next, out.ifd1, 'ifd1');
      if (typeof out.ifd0[0x8769] === 'number') readIfd(out.ifd0[0x8769], out.exif, 'exif');
      if (typeof out.ifd0[0x8825] === 'number') readIfd(out.ifd0[0x8825], out.gps, 'gps');
    } catch (err) { /* keep whatever was read */ }
    return out;
  }

  /* A TIFF block holding only an Orientation tag (big-endian, 26 bytes). */
  function orientationTiff(o) {
    var t = new Uint8Array(26);
    var dv = new DataView(t.buffer);
    t.set([0x4d, 0x4d, 0x00, 0x2a]);
    dv.setUint32(4, 8);
    dv.setUint16(8, 1);
    dv.setUint16(10, 0x0112);
    dv.setUint16(12, 3);
    dv.setUint32(14, 1);
    dv.setUint16(18, o);
    dv.setUint32(22, 0);
    return t;
  }
  /* A TIFF block with no tags at all. */
  var EMPTY_TIFF = new Uint8Array([0x4d, 0x4d, 0x00, 0x2a, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0]);

  function orientationOf(tiff) {
    var o = tiff && tiff.ifd0[0x0112];
    return typeof o === 'number' && o >= 2 && o <= 8 ? o : 1;
  }

  /* ---------- XMP ---------- */

  function xmpLocation(text) {
    function grab(name, refs) {
      var m = new RegExp(name + '(?:\\s*=\\s*["\']|>)\\s*([0-9.,]+)\\s*([' + refs + '])').exec(text);
      if (!m) return null;
      var parts = m[1].split(',').map(Number);
      var v = (parts[0] || 0) + (parts[1] || 0) / 60 + (parts[2] || 0) / 3600;
      if (!isFinite(v)) return null;
      return /[SW]/.test(m[2]) ? -v : v;
    }
    var lat = grab('GPSLatitude', 'NS'), lon = grab('GPSLongitude', 'EW');
    return lat !== null && lon !== null ? { lat: lat, lon: lon } : null;
  }

  /* ---------- JPEG ---------- */

  function walkJpeg(b) {
    if (b[0] !== 0xff || b[1] !== 0xd8) throw new Error('Not a JPEG file.');
    var segs = [{ m: 0xd8, s: 0, e: 2 }];
    var i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) throw new Error('This JPEG file looks damaged.');
      var m = b[i + 1];
      while (m === 0xff && i + 2 < b.length) { i++; m = b[i + 1]; }
      if (m === 0xd9) { segs.push({ m: m, s: i, e: i + 2 }); return { segs: segs, end: i + 2 }; }
      if ((m >= 0xd0 && m <= 0xd7) || m === 0x01) { segs.push({ m: m, s: i, e: i + 2 }); i += 2; continue; }
      if (i + 4 > b.length) break;
      var len = u16be(b, i + 2);
      var e = i + 2 + len;
      if (len < 2 || e > b.length) throw new Error('This JPEG file looks damaged.');
      segs.push({ m: m, s: i, e: e });
      i = e;
      if (m === 0xda) {
        /* Entropy-coded image data runs until the next marker that isn't a
           stuffed 0xFF00 byte or a restart marker. */
        var j = i;
        while (j < b.length - 1) {
          if (b[j] === 0xff) {
            var n = b[j + 1];
            if (n === 0x00 || (n >= 0xd0 && n <= 0xd7)) { j += 2; continue; }
            if (n === 0xff) { j += 1; continue; }
            break;
          }
          j++;
        }
        if (j >= b.length - 1) j = b.length;
        segs.push({ m: -1, s: i, e: j });
        i = j;
      }
    }
    return { segs: segs, end: b.length };
  }

  function appName(m) { return 'APP' + (m - 0xe0); }

  function readJpeg(b, info) {
    var w = walkJpeg(b);
    w.segs.forEach(function (sg) {
      var d = sg.s + 4, len = sg.e - d;
      if (sg.m === 0xe1 && startsWith(b, d, 'Exif\0')) {
        info.tiff = info.tiff || parseTiff(b.subarray(d + 6, sg.e));
        info.blocks.push({ exif: true, label: 'EXIF data (camera, date, location)', bytes: len, removed: true });
      } else if (sg.m === 0xe1 && startsWith(b, d, 'http://ns.adobe.com/x')) {
        var text = utf8.decode(b.subarray(d, sg.e));
        info.xmpLoc = info.xmpLoc || xmpLocation(text);
        info.blocks.push({ label: 'XMP data (editing and descriptive metadata)', bytes: len, removed: true });
      } else if (sg.m === 0xe2 && startsWith(b, d, 'ICC_PROFILE\0')) {
        info.blocks.push({ label: 'Colour profile', bytes: len, removed: false });
      } else if (sg.m === 0xe2 && startsWith(b, d, 'MPF\0')) {
        info.blocks.push({ label: 'Multi-picture index', bytes: len, removed: true });
      } else if (sg.m === 0xed) {
        info.blocks.push({ label: 'IPTC data (captions, keywords, credits)', bytes: len, removed: true });
      } else if (sg.m === 0xfe) {
        info.comment = latin1.decode(b.subarray(d, sg.e)).trim();
        info.blocks.push({ label: 'Comment', bytes: len, removed: true });
      } else if (sg.m >= 0xe1 && sg.m <= 0xef && sg.m !== 0xee) {
        info.blocks.push({ label: 'Other application data (' + appName(sg.m) + ')', bytes: len, removed: true });
      }
    });
    if (w.end < b.length) {
      info.blocks.push({ label: 'Extra data after the image (such as an HDR gain map or depth map)', bytes: b.length - w.end, removed: true });
    }
  }

  function cleanJpeg(b, orientation) {
    var w = walkJpeg(b);
    var parts = [], exifAdded = orientation === 1;
    function addExif() {
      var tiff = orientationTiff(orientation);
      var seg = new Uint8Array(4 + 6 + tiff.length);
      seg[0] = 0xff; seg[1] = 0xe1;
      seg[2] = (seg.length - 2) >> 8; seg[3] = (seg.length - 2) & 0xff;
      seg.set(fromAscii('Exif\0\0'), 4);
      seg.set(tiff, 10);
      parts.push(seg);
      exifAdded = true;
    }
    w.segs.forEach(function (sg, idx) {
      var d = sg.s + 4, keep;
      if (sg.m === 0xe2) keep = startsWith(b, d, 'ICC_PROFILE\0');
      else if (sg.m === 0xe0 || sg.m === 0xee) keep = true; // JFIF header, Adobe colour transform
      else if (sg.m >= 0xe1 && sg.m <= 0xef) keep = false;
      else if (sg.m === 0xfe) keep = false;
      else keep = true;
      if (!exifAdded && sg.m !== 0xd8 && sg.m !== 0xe0) addExif();
      if (keep) parts.push(b.subarray(sg.s, sg.e));
    });
    return concat(parts);
  }

  /* ---------- PNG ---------- */

  var PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

  function walkPng(b) {
    var chunks = [], i = 8;
    while (i + 12 <= b.length) {
      var len = u32be(b, i), type = ascii(b, i + 4, 4), e = i + 12 + len;
      if (e > b.length) throw new Error('This PNG file looks damaged.');
      chunks.push({ type: type, s: i, d: i + 8, e: e, len: len });
      i = e;
      if (type === 'IEND') break;
    }
    return chunks;
  }

  var PNG_DROP = { eXIf: 1, tEXt: 1, zTXt: 1, iTXt: 1, tIME: 1 };

  function readPng(b, info) {
    walkPng(b).forEach(function (c) {
      var data = b.subarray(c.d, c.d + c.len);
      if (c.type === 'eXIf') {
        info.tiff = info.tiff || parseTiff(data);
        info.blocks.push({ exif: true, label: 'EXIF data (camera, date, location)', bytes: c.len, removed: true });
      } else if (c.type === 'tEXt' || c.type === 'zTXt' || c.type === 'iTXt') {
        var nul = data.indexOf(0);
        var key = latin1.decode(data.subarray(0, nul < 0 ? Math.min(79, data.length) : nul));
        if (key === 'XML:com.adobe.xmp') {
          info.xmpLoc = info.xmpLoc || xmpLocation(utf8.decode(data));
          info.blocks.push({ label: 'XMP data (editing and descriptive metadata)', bytes: c.len, removed: true });
        } else {
          info.blocks.push({ label: 'Text field "' + key + '"', bytes: c.len, removed: true });
        }
      } else if (c.type === 'tIME') {
        info.blocks.push({ label: 'Last-modified time', bytes: c.len, removed: true });
      } else if (c.type === 'iCCP' || c.type === 'sRGB' || c.type === 'cICP') {
        info.blocks.push({ label: 'Colour profile', bytes: c.len, removed: false });
      }
    });
  }

  function pngChunk(type, data) {
    var out = new Uint8Array(12 + data.length);
    var dv = new DataView(out.buffer);
    dv.setUint32(0, data.length);
    out.set(fromAscii(type), 4);
    out.set(data, 8);
    dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
    return out;
  }

  function cleanPng(b, orientation) {
    var parts = [new Uint8Array(PNG_SIG)];
    walkPng(b).forEach(function (c) {
      if (PNG_DROP[c.type]) return;
      parts.push(b.subarray(c.s, c.e));
      if (c.type === 'IHDR' && orientation !== 1) parts.push(pngChunk('eXIf', orientationTiff(orientation)));
    });
    return concat(parts);
  }

  /* ---------- WebP ---------- */

  function walkWebp(b) {
    var chunks = [], i = 12;
    while (i + 8 <= b.length) {
      var type = ascii(b, i, 4), len = u32le(b, i + 4), e = i + 8 + len + (len & 1);
      if (i + 8 + len > b.length) throw new Error('This WebP file looks damaged.');
      chunks.push({ type: type, s: i, d: i + 8, len: len, e: Math.min(e, b.length) });
      i = e;
    }
    return chunks;
  }

  function webpTiff(data) {
    return startsWith(data, 0, 'Exif\0\0') ? data.subarray(6) : data;
  }

  function readWebp(b, info) {
    walkWebp(b).forEach(function (c) {
      var data = b.subarray(c.d, c.d + c.len);
      if (c.type === 'EXIF') {
        info.tiff = info.tiff || parseTiff(webpTiff(data));
        info.blocks.push({ exif: true, label: 'EXIF data (camera, date, location)', bytes: c.len, removed: true });
      } else if (c.type === 'XMP ') {
        info.xmpLoc = info.xmpLoc || xmpLocation(utf8.decode(data));
        info.blocks.push({ label: 'XMP data (editing and descriptive metadata)', bytes: c.len, removed: true });
      } else if (c.type === 'ICCP') {
        info.blocks.push({ label: 'Colour profile', bytes: c.len, removed: false });
      }
    });
  }

  function cleanWebp(b, orientation) {
    var parts = [b.subarray(0, 12)];
    var chunks = walkWebp(b);
    /* Only the extended format (VP8X) can carry EXIF; a simple WebP can't keep the rotation tag. */
    if (!chunks.some(function (c) { return c.type === 'VP8X'; })) orientation = 1;
    chunks.forEach(function (c) {
      if (c.type === 'EXIF' || c.type === 'XMP ') return;
      var chunk = b.slice(c.s, c.e);
      if (c.type === 'VP8X') {
        chunk[8] &= ~0x04; // XMP flag
        if (orientation === 1) chunk[8] &= ~0x08; // EXIF flag
      }
      parts.push(chunk);
    });
    if (orientation !== 1) {
      var tiff = orientationTiff(orientation);
      var head = new Uint8Array(8);
      head.set(fromAscii('EXIF'));
      new DataView(head.buffer).setUint32(4, tiff.length, true);
      parts.push(head, tiff);
    }
    var out = concat(parts);
    new DataView(out.buffer).setUint32(4, out.length - 8, true);
    return out;
  }

  /* ---------- HEIC / HEIF / AVIF (ISO base media file format) ---------- */

  function boxes(b, start, end) {
    var list = [], i = start;
    while (i + 8 <= end) {
      var size = u32be(b, i), type = ascii(b, i + 4, 4), hdr = 8;
      if (size === 1) { size = u32be(b, i + 8) * 4294967296 + u32be(b, i + 12); hdr = 16; }
      else if (size === 0) size = end - i;
      if (size < hdr || i + size > end) break;
      list.push({ type: type, s: i, d: i + hdr, e: i + size });
      i += size;
    }
    return list;
  }
  function find(list, type) {
    for (var i = 0; i < list.length; i++) if (list[i].type === type) return list[i];
    return null;
  }
  function readUint(b, o, size) {
    if (size === 0) return 0;
    if (size === 2) return u16be(b, o);
    if (size === 4) return u32be(b, o);
    if (size === 8) return u32be(b, o) * 4294967296 + u32be(b, o + 4);
    throw new Error('Unsupported field size.');
  }

  function heifItems(b) {
    var meta = find(boxes(b, 0, b.length), 'meta');
    if (!meta) throw new Error('This HEIC file has no metadata box.');
    var kids = boxes(b, meta.d + 4, meta.e);
    var iinf = find(kids, 'iinf'), iloc = find(kids, 'iloc'), idat = find(kids, 'idat');
    var items = {};
    if (iinf) {
      var v = b[iinf.d], p = iinf.d + 4;
      p += v === 0 ? 2 : 4;
      boxes(b, p, iinf.e).forEach(function (infe) {
        if (infe.type !== 'infe') return;
        var ver = b[infe.d], q = infe.d + 4;
        if (ver < 2) return;
        var id = ver === 2 ? u16be(b, q) : u32be(b, q);
        q += (ver === 2 ? 2 : 4) + 2;
        var type = ascii(b, q, 4);
        q += 4;
        var ct = '';
        if (type === 'mime') {
          while (q < infe.e && b[q] !== 0) q++; // item_name
          q++;
          var st = q;
          while (q < infe.e && b[q] !== 0) q++;
          ct = ascii(b, st, q - st);
        }
        items[id] = { id: id, type: type, contentType: ct, extents: [] };
      });
    }
    if (iloc) {
      var lv = b[iloc.d], r = iloc.d + 4;
      var offSize = b[r] >> 4, lenSize = b[r] & 15, baseSize = b[r + 1] >> 4;
      var idxSize = lv === 1 || lv === 2 ? b[r + 1] & 15 : 0;
      r += 2;
      var count = lv < 2 ? u16be(b, r) : u32be(b, r);
      r += lv < 2 ? 2 : 4;
      for (var k = 0; k < count; k++) {
        var id = lv < 2 ? u16be(b, r) : u32be(b, r);
        r += lv < 2 ? 2 : 4;
        var method = 0;
        if (lv === 1 || lv === 2) { method = u16be(b, r) & 15; r += 2; }
        r += 2; // data_reference_index
        var base = readUint(b, r, baseSize);
        r += baseSize;
        var ec = u16be(b, r);
        r += 2;
        var ext = [];
        for (var x = 0; x < ec; x++) {
          r += idxSize;
          var eo = readUint(b, r, offSize); r += offSize;
          var el = readUint(b, r, lenSize); r += lenSize;
          ext.push({ off: eo, len: el });
        }
        if (!items[id]) continue;
        var origin = method === 1 && idat ? idat.d : 0;
        if (method === 2) continue; // item references: not used for Exif or XMP
        items[id].extents = ext.map(function (e) {
          var start = origin + base + e.off;
          var len = e.len || (method === 1 && idat ? idat.e - start : b.length - start);
          return { off: start, len: len };
        }).filter(function (e) { return e.off >= 0 && e.off + e.len <= b.length; });
      }
    }
    return Object.keys(items).map(function (k) { return items[k]; });
  }

  function itemBytes(b, item) {
    return concat(item.extents.map(function (e) { return b.subarray(e.off, e.off + e.len); }));
  }
  function isXmpItem(it) { return it.type === 'mime' && /rdf\+xml|xmp/i.test(it.contentType); }
  function heifTiffStart(data) {
    if (data.length < 8) return -1;
    var start = 4 + u32be(data, 0);
    if (start + 8 <= data.length && (data[start] === 0x4d || data[start] === 0x49)) return start;
    for (var i = 0; i < Math.min(64, data.length - 4); i++) {
      if ((data[i] === 0x4d && data[i + 1] === 0x4d && data[i + 2] === 0 && data[i + 3] === 0x2a) ||
          (data[i] === 0x49 && data[i + 1] === 0x49 && data[i + 2] === 0x2a && data[i + 3] === 0)) return i;
    }
    return -1;
  }

  function readHeif(b, info) {
    heifItems(b).forEach(function (it) {
      if (it.type === 'Exif' && it.extents.length) {
        var data = itemBytes(b, it), ts = heifTiffStart(data);
        var t = ts >= 0 ? parseTiff(data.subarray(ts)) : null;
        if (t && t.count) {
          info.tiff = info.tiff || t;
          info.blocks.push({ exif: true, label: 'EXIF data (camera, date, location)', bytes: data.length, removed: true });
        }
      } else if (isXmpItem(it) && it.extents.length) {
        var x = itemBytes(b, it), text = utf8.decode(x);
        if (/<x:xmpmeta[\s\S]*\S[\s\S]*<\/x:xmpmeta>|rdf:Description/.test(text)) {
          info.xmpLoc = info.xmpLoc || xmpLocation(text);
          info.blocks.push({ label: 'XMP data (editing and descriptive metadata)', bytes: x.length, removed: true });
        }
      }
    });
    info.blocks.push({ label: 'Rotation and colour information', bytes: 0, removed: false });
  }

  function writeItem(out, item, data) {
    var p = 0;
    item.extents.forEach(function (e) {
      out.set(data.subarray(p, p + e.len), e.off);
      p += e.len;
    });
  }

  function cleanHeif(b) {
    var out = b.slice();
    heifItems(b).forEach(function (it) {
      if (!it.extents.length) return;
      var data = itemBytes(b, it), repl;
      if (it.type === 'Exif') {
        repl = new Uint8Array(data.length);
        var ts = heifTiffStart(data);
        if (ts >= 0 && ts + EMPTY_TIFF.length <= data.length) {
          repl.set(data.subarray(0, ts));
          repl.set(EMPTY_TIFF, ts);
        }
        writeItem(out, it, repl);
      } else if (isXmpItem(it)) {
        repl = new Uint8Array(data.length).fill(0x20);
        var packet = fromAscii('<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"/>');
        var tail = fromAscii('<?xpacket end="w"?>');
        if (packet.length + tail.length <= repl.length) {
          repl.set(packet, 0);
          repl.set(tail, repl.length - tail.length);
        }
        writeItem(out, it, repl);
      }
    });
    return out;
  }

  /* ---------- pixel dimensions, read from the file itself ---------- */

  function rawDimensions(b, fmt) {
    var i, w = 0, h = 0, turned = false;
    if (fmt.id === 'jpeg') {
      var segs = walkJpeg(b).segs;
      for (i = 0; i < segs.length; i++) {
        var m = segs[i].m;
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
          h = u16be(b, segs[i].s + 5); w = u16be(b, segs[i].s + 7);
          break;
        }
      }
    } else if (fmt.id === 'png') {
      w = u32be(b, 16); h = u32be(b, 20);
    } else if (fmt.id === 'webp') {
      var chunks = walkWebp(b);
      for (i = 0; i < chunks.length; i++) {
        var c = chunks[i], d = c.d;
        if (c.type === 'VP8X') {
          w = 1 + (b[d + 4] | (b[d + 5] << 8) | (b[d + 6] << 16));
          h = 1 + (b[d + 7] | (b[d + 8] << 8) | (b[d + 9] << 16));
          break;
        }
        if (c.type === 'VP8 ') { w = (b[d + 6] | (b[d + 7] << 8)) & 0x3fff; h = (b[d + 8] | (b[d + 9] << 8)) & 0x3fff; break; }
        if (c.type === 'VP8L') {
          var bits = u32le(b, d + 1);
          w = 1 + (bits & 0x3fff); h = 1 + ((bits >>> 14) & 0x3fff);
          break;
        }
      }
    } else {
      /* HEIC/AVIF: the largest 'ispe' (image size) property is the full image; the
         others belong to tiles and thumbnails. An 'irot' of 90 or 270 degrees turns it. */
      var meta = find(boxes(b, 0, b.length), 'meta');
      var iprp = meta && find(boxes(b, meta.d + 4, meta.e), 'iprp');
      var ipco = iprp && find(boxes(b, iprp.d, iprp.e), 'ipco');
      if (ipco) {
        boxes(b, ipco.d, ipco.e).forEach(function (p) {
          if (p.type === 'ispe') {
            var pw = u32be(b, p.d + 4), ph = u32be(b, p.d + 8);
            if (pw * ph > w * h) { w = pw; h = ph; }
          } else if (p.type === 'irot' && (b[p.d] & 1)) {
            turned = true;
          }
        });
      }
    }
    return w && h ? { w: w, h: h, turned: turned } : null;
  }

  /* Width and height as the photo is displayed, after any rotation. */
  function dimensions(b, info) {
    var d = rawDimensions(b, info.format);
    if (!d) return null;
    var swap = d.turned || orientationOf(info.tiff) >= 5;
    return swap ? { w: d.h, h: d.w } : { w: d.w, h: d.h };
  }
  function fmtDims(d) { return d.w + ' \u00d7 ' + d.h + ' pixels'; }

  /* ---------- format detection and analysis ---------- */

  function detect(b) {
    if (b.length < 12) return null;
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { id: 'jpeg', name: 'JPEG', ext: 'jpg' };
    if (PNG_SIG.every(function (v, i) { return b[i] === v; })) return { id: 'png', name: 'PNG', ext: 'png' };
    if (startsWith(b, 0, 'RIFF') && startsWith(b, 8, 'WEBP')) return { id: 'webp', name: 'WebP', ext: 'webp' };
    if (startsWith(b, 4, 'ftyp')) {
      var brands = ascii(b, 8, Math.min(u32be(b, 0), 64) - 8);
      if (/avif|avis/.test(brands)) return { id: 'heif', name: 'AVIF', ext: 'avif' };
      if (/heic|heix|heim|heis|hevc|hevx|mif1|msf1|mif2/.test(brands)) return { id: 'heif', name: 'HEIC', ext: 'heic' };
    }
    return null;
  }

  function analyse(b) {
    var fmt = detect(b);
    if (!fmt) throw new Error('This file type isn\u2019t supported. Try a JPEG, HEIC, PNG, WebP or AVIF photo.');
    var info = { format: fmt, tiff: null, xmpLoc: null, comment: '', blocks: [] };
    if (fmt.id === 'jpeg') readJpeg(b, info);
    else if (fmt.id === 'png') readPng(b, info);
    else if (fmt.id === 'webp') readWebp(b, info);
    else readHeif(b, info);
    /* A photo cleaned here keeps an EXIF block holding only the rotation setting. */
    var onlyRotation = info.tiff && info.tiff.tags.length > 0 &&
      info.tiff.tags.every(function (t) { return t === 'ifd0:274'; });
    if (onlyRotation) {
      info.blocks.forEach(function (bl) {
        if (bl.exif) { bl.label = 'Rotation setting'; bl.removed = false; }
      });
    }
    info.fields = describe(info);
    try { info.dims = dimensions(b, info); } catch (err) { info.dims = null; }
    return info;
  }

  function clean(b, info) {
    var o = orientationOf(info.tiff);
    if (info.format.id === 'jpeg') return cleanJpeg(b, o);
    if (info.format.id === 'png') return cleanPng(b, o);
    if (info.format.id === 'webp') return cleanWebp(b, o);
    return cleanHeif(b);
  }

  /* ---------- turning tags into plain-language fields ---------- */

  function dms(v) {
    if (!Array.isArray(v) || v.length < 1) return NaN;
    return (v[0] || 0) + (v[1] || 0) / 60 + (v[2] || 0) / 3600;
  }
  function fmtNum(n, max) {
    return n.toLocaleString('en-GB', { maximumFractionDigits: max === undefined ? 1 : max });
  }
  function fmtDate(s, offset) {
    var m = /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(s || '');
    if (!m || m[1] === '0000') return s || '';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var mon = months[parseInt(m[2], 10) - 1] || m[2];
    return parseInt(m[3], 10) + ' ' + mon + ' ' + m[1] + ' at ' + m[4] + ':' + m[5] + (offset ? ' (UTC' + offset + ')' : '');
  }
  function str(v) { return typeof v === 'string' && v.trim() ? v.trim() : ''; }

  function describe(info) {
    var t = info.tiff || { ifd0: {}, exif: {}, gps: {}, ifd1: {}, count: 0 };
    var f = { location: [], device: [], time: [], people: [], camera: [], other: [], coords: null, count: t.count };
    var g = t.gps;

    var lat = dms(g[2]), lon = dms(g[4]);
    if (isFinite(lat) && isFinite(lon) && (lat !== 0 || lon !== 0) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      if (g[1] === 'S') lat = -lat;
      if (g[3] === 'W') lon = -lon;
      f.coords = { lat: lat, lon: lon };
    } else if (info.xmpLoc) {
      f.coords = info.xmpLoc;
    }
    if (f.coords) {
      f.location.push(['GPS position', fmtNum(f.coords.lat, 5) + ', ' + fmtNum(f.coords.lon, 5)]);
    }
    if (typeof g[6] === 'number' && isFinite(g[6])) {
      f.location.push(['Altitude', fmtNum(g[5] === 1 ? -g[6] : g[6], 0) + ' m' + (g[5] === 1 ? ' below' : ' above') + ' sea level']);
    }
    if (typeof g[0x11] === 'number' && isFinite(g[0x11])) f.location.push(['Direction the camera faced', fmtNum(g[0x11], 0) + '\u00b0']);
    if (typeof g[0x0d] === 'number' && isFinite(g[0x0d]) && g[0x0d] > 0) {
      var unit = { K: 'km/h', M: 'mph', N: 'knots' }[g[0x0c]] || '';
      f.location.push(['Speed when taken', fmtNum(g[0x0d], 1) + (unit ? ' ' + unit : '')]);
    }
    if (typeof g[0x1f] === 'number' && isFinite(g[0x1f])) f.location.push(['Position accuracy', 'within about ' + fmtNum(g[0x1f], 0) + ' m']);
    if (!f.coords && Object.keys(g).length) f.location.push(['GPS fields', Object.keys(g).length + ' present']);

    var make = str(t.ifd0[0x010f]), model = str(t.ifd0[0x0110]);
    if (make || model) f.device.push(['Device', model.indexOf(make) === 0 ? model : (make + ' ' + model).trim()]);
    if (str(t.exif[0xa434])) f.device.push(['Lens', str(t.exif[0xa434])]);
    var sw = str(t.ifd0[0x0131]);
    if (sw) f.device.push(['Software', make === 'Apple' && /^\d+(\.\d+)*$/.test(sw) ? 'iOS ' + sw : sw]);
    if (str(t.ifd0[0x013c])) f.device.push(['Computer', str(t.ifd0[0x013c])]);
    if (str(t.exif[0xa431])) f.device.push(['Camera serial number', str(t.exif[0xa431])]);
    if (str(t.exif[0xa435])) f.device.push(['Lens serial number', str(t.exif[0xa435])]);
    if (t.exif[0x927c]) {
      var mn = t.exif[0x927c], size = mn && mn.bytes ? mn.bytes : (Array.isArray(mn) ? mn.length : 0);
      f.device.push(['Manufacturer data', (make || 'Hidden') + ' maker note' + (size ? ', ' + fmtNum(size, 0) + ' bytes' : '')]);
    }

    var taken = str(t.exif[0x9003]), offset = str(t.exif[0x9011]);
    if (taken) f.time.push(['Taken', fmtDate(taken, offset)]);
    var modified = str(t.ifd0[0x0132]);
    if (modified && modified !== taken) f.time.push(['Last changed', fmtDate(modified, str(t.exif[0x9010]))]);
    if (g[0x1d]) f.time.push(['GPS date', String(g[0x1d]).replace(/:/g, '-')]);

    if (str(t.ifd0[0x013b])) f.people.push(['Artist or author', str(t.ifd0[0x013b])]);
    if (str(t.exif[0xa430])) f.people.push(['Camera owner', str(t.exif[0xa430])]);
    if (str(t.ifd0[0x8298])) f.people.push(['Copyright', str(t.ifd0[0x8298])]);
    if (str(t.ifd0[0x010e])) f.people.push(['Description', str(t.ifd0[0x010e])]);
    if (info.comment) f.people.push(['Comment', info.comment]);

    var cam = [];
    var exp = t.exif[0x829a];
    if (typeof exp === 'number' && exp > 0) cam.push(exp < 1 ? '1/' + Math.round(1 / exp) + ' s' : fmtNum(exp, 1) + ' s');
    if (typeof t.exif[0x829d] === 'number' && isFinite(t.exif[0x829d])) cam.push('f/' + fmtNum(t.exif[0x829d], 1));
    var iso = t.exif[0x8827];
    if (Array.isArray(iso)) iso = iso[0];
    if (typeof iso === 'number') cam.push('ISO ' + iso);
    if (typeof t.exif[0x920a] === 'number' && isFinite(t.exif[0x920a])) cam.push(fmtNum(t.exif[0x920a], 1) + ' mm');
    if (cam.length) f.camera.push(['Settings', cam.join(' \u00b7 ')]);
    var w = t.exif[0xa002], h = t.exif[0xa003];
    if (typeof w === 'number' && typeof h === 'number') f.camera.push(['Size', w + ' \u00d7 ' + h + ' pixels']);

    if (str(t.exif[0xa420])) f.other.push(['Unique image ID', str(t.exif[0xa420])]);
    if (Object.keys(t.ifd1).length) f.other.push(['Thumbnail', 'A small preview copy of the original photo']);
    return f;
  }

  function hasIdentifying(info) {
    var f = info.fields;
    return !!(f.coords || f.location.length || f.device.length || f.time.length || f.people.length || f.camera.length || f.other.length ||
      info.blocks.some(function (bl) { return bl.removed; }));
  }

  /* ---------- page ---------- */

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  function fmtBytes(n) {
    if (n < 1024) return n + ' bytes';
    if (n < 1048576) return fmtNum(n / 1024, 0) + ' KB';
    return fmtNum(n / 1048576, 1) + ' MB';
  }

  var GROUPS = [
    ['location', 'Location'],
    ['time', 'Date and time'],
    ['device', 'Device'],
    ['people', 'Names and descriptions'],
    ['camera', 'Camera settings'],
    ['other', 'Other']
  ];

  var results = document.getElementById('pm-results');
  var urls = [];

  function renderFile(file) {
    var card = el('section', 'card tool-result');
    var head = el('div', 'result-head');
    var title = el('div');
    title.appendChild(el('h3', 'result-name', file.name || 'Photo'));
    var sub = el('p', 'muted small', fmtBytes(file.size));
    title.appendChild(sub);
    head.appendChild(title);
    card.appendChild(head);
    var status = el('p', 'muted', 'Reading\u2026');
    card.appendChild(status);
    results.insertBefore(card, results.firstChild);

    if (file.size > MAX_BYTES) {
      status.textContent = 'This file is larger than 200 MB, which is too big to process here.';
      status.className = 'result-error';
      return;
    }

    file.arrayBuffer().then(function (buf) {
      var b = new Uint8Array(buf);
      var info = analyse(b);
      sub.textContent = info.format.name + ' \u00b7 ' + (info.dims ? fmtDims(info.dims) + ' \u00b7 ' : '') + fmtBytes(file.size);
      card.removeChild(status);

      var preview = el('img', 'result-preview');
      preview.alt = '';
      var pUrl = URL.createObjectURL(file);
      urls.push(pUrl);
      preview.addEventListener('error', function () { preview.remove(); });
      preview.src = pUrl;
      head.insertBefore(preview, head.firstChild);

      var f = info.fields;
      var chips = el('ul', 'chips');
      function chip(on, yes, no) { chips.appendChild(el('li', 'chip ' + (on ? 'chip-warn' : 'chip-ok'), on ? yes : no)); }
      chip(!!f.coords, 'Location included', 'No location');
      chip(f.time.length > 0, 'Date and time included', 'No date or time');
      chip(f.device.length > 0, 'Device details included', 'No device details');
      card.appendChild(chips);

      var any = false;
      GROUPS.forEach(function (g) {
        var rows = f[g[0]];
        if (!rows.length) return;
        any = true;
        card.appendChild(el('h4', 'meta-group', g[1]));
        var dl = el('dl', 'meta-list');
        rows.forEach(function (r) {
          dl.appendChild(el('dt', null, r[0]));
          dl.appendChild(el('dd', null, r[1]));
        });
        card.appendChild(dl);
        if (g[0] === 'location' && f.coords) {
          var p = el('p', 'small');
          var a = el('a', null, 'Show this place on OpenStreetMap');
          a.href = 'https://www.openstreetmap.org/?mlat=' + f.coords.lat.toFixed(5) + '&mlon=' + f.coords.lon.toFixed(5) +
            '#map=17/' + f.coords.lat.toFixed(5) + '/' + f.coords.lon.toFixed(5);
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          p.appendChild(a);
          p.appendChild(document.createTextNode(' (opens a new tab and sends the coordinates to OpenStreetMap)'));
          card.appendChild(p);
        }
      });
      if (!any) card.appendChild(el('p', null, 'No camera, date or location details were found in this photo.'));

      if (info.blocks.length) {
        card.appendChild(el('h4', 'meta-group', 'Metadata blocks in the file'));
        var ul = el('ul', 'block-list');
        info.blocks.forEach(function (bl) {
          var li = el('li', bl.removed ? 'is-removed' : 'is-kept');
          li.appendChild(el('span', null, bl.label + (bl.bytes ? ' \u00b7 ' + fmtBytes(bl.bytes) : '')));
          li.appendChild(el('span', 'block-action', bl.removed ? 'Removed' : 'Kept'));
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      if (!hasIdentifying(info)) {
        card.appendChild(el('p', 'result-ok', 'Nothing to remove: this photo is already clean.'));
        return;
      }

      var cleaned = clean(b, info);
      var check = analyse(cleaned);
      var cf = check.fields;
      var leftover = cf.coords || cf.location.length || cf.device.length || cf.time.length || cf.people.length || cf.other.length;
      if (leftover) throw new Error('The cleaned copy still contained metadata, so it isn\u2019t offered for download. Please report this file type to us.');

      var base = (file.name || 'photo').replace(/\.[^.]+$/, '');
      var blob = new Blob([cleaned], { type: file.type || 'application/octet-stream' });
      var url = URL.createObjectURL(blob);
      urls.push(url);

      var actions = el('div', 'tool-actions');
      var dl2 = el('a', 'button', 'Download clean copy');
      dl2.href = url;
      dl2.download = base + '-clean.' + info.format.ext;
      actions.appendChild(dl2);
      card.appendChild(actions);

      var same = info.dims && check.dims && info.dims.w === check.dims.w && info.dims.h === check.dims.h;
      if (info.dims && check.dims && !same) throw new Error('The cleaned copy came out a different size, so it isn\u2019t offered for download. Please report this file to us.');
      var kept = orientationOf(info.tiff) !== 1 ? ' Only the rotation setting was kept, so the photo still shows the right way up.' : '';
      card.appendChild(el('p', 'small muted',
        'Checked: the clean copy (' + (same ? fmtDims(check.dims) + ', ' : '') + fmtBytes(cleaned.length) + ') has no location, date, device or name details left. The picture itself is unchanged, pixel for pixel, at the same size.' + kept));
    }).catch(function (err) {
      if (status.parentNode) card.removeChild(status);
      /* Messages written in this file are plain Error objects; anything else is a low-level read error. */
      var msg = err && err.name === 'Error' && err.message ? err.message : 'This file looks damaged, or it isn\u2019t a format this tool can read.';
      card.appendChild(el('p', 'result-error', msg));
    });
  }

  function handle(files) {
    for (var i = 0; i < files.length; i++) renderFile(files[i]);
  }

  var input = document.getElementById('pm-file');
  var drop = document.getElementById('pm-drop');
  var clearBtn = document.getElementById('pm-clear');
  if (!input || !drop || !results) return;

  document.getElementById('pm-tool').classList.add('is-ready');

  input.addEventListener('change', function () {
    handle(input.files);
    input.value = '';
  });
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) handle(e.dataTransfer.files);
  });
  /* Stop a photo dropped next to the drop area from opening in the tab. */
  window.addEventListener('dragover', function (e) { e.preventDefault(); });
  window.addEventListener('drop', function (e) { e.preventDefault(); });

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      while (results.firstChild) results.removeChild(results.firstChild);
      urls.forEach(function (u) { URL.revokeObjectURL(u); });
      urls = [];
    });
  }
})();
