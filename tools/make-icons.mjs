// Draws the Pomodoro app icon (a glossy tomato kitchen timer) and writes the PNG sizes the PWA needs.
// Pure Node, no dependencies: a supersampled rasterizer plus a tiny PNG encoder.
// Run from the repo root:  node tools/make-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

/* ---------- PNG encoder ---------- */
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

/* ---------- helpers ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const WHITE = [251, 250, 247];

/* ---------- the drawing, in a 0..1 square ---------- */
function shade(x, y) {
  // background: charcoal with a faint lift behind the tomato
  let c = mix(hex("#2A2E2B"), hex("#111312"), clamp(y));
  c = mix(c, hex("#343936"), 0.35 * (1 - sm(0, 0.55, Math.hypot(x - 0.5, y - 0.48))));

  // soft contact shadow
  const ds = Math.hypot((x - 0.5) / 0.3, (y - 0.865) / 0.045);
  c = mix(c, [0, 0, 0], 0.5 * (1 - sm(0.35, 1.5, ds)));

  // body: a slightly squat ellipse with soft lobes on the upper half
  const dx = (x - 0.5) / 0.335, dy = (y - 0.545) / 0.31;
  const th = Math.atan2(dx, -dy);
  const lobe = 0.035 * (Math.pow(Math.abs(Math.cos(3.5 * th)), 0.6) - 0.7) * clamp(-dy * 1.6);
  const r = Math.hypot(dx, dy) / (1 + lobe);
  if (r < 1) {
    const l = clamp(1 - Math.hypot(dx + 0.38, dy + 0.45) / 1.55);
    let b = mix(hex("#7A0804"), hex("#EE3A26"), Math.pow(l, 0.85));
    b = b.map((v) => v * (1 - 0.35 * sm(0.8, 1, r)));
    // seam (a gentle smile) and the darker bottom part
    const seam = 0.3 + 0.12 * (1 - dx * dx);
    if (dy > seam) b = b.map((v) => v * 0.9);
    if (Math.abs(dy - seam) < 0.02) b = b.map((v) => v * 0.55);
    // printed minute ticks above the seam
    for (let k = -7; k <= 7; k++) {
      const a = k * 0.19, tx = Math.sin(a) * 0.97, major = k % 5 === 0;
      const w = (major ? 0.032 : 0.02) * Math.cos(a), h = major ? 0.15 : 0.09, sy = 0.3 + 0.12 * (1 - tx * tx);
      if (Math.abs(dx - tx) < w / 2 && dy > sy - 0.035 - h && dy < sy - 0.035) b = WHITE;
    }
    // fixed pointer
    const apex = seam + 0.08, base = seam + 0.19;
    if (dy > apex && dy < base && Math.abs(dx) < 0.07 * (dy - apex) / (base - apex)) b = WHITE;
    // gloss
    const hx = dx + 0.42, hy = dy + 0.42, ca = Math.cos(-0.6), sa = Math.sin(-0.6);
    const h1 = Math.hypot((hx * ca - hy * sa) / 0.27, (hx * sa + hy * ca) / 0.09);
    b = mix(b, [255, 255, 255], 0.5 * (1 - sm(0.55, 1, h1)));
    const h2 = Math.hypot((dx - 0.32) / 0.09, (dy + 0.56) / 0.04);
    b = mix(b, [255, 255, 255], 0.45 * (1 - sm(0.5, 1, h2)));
    c = b;
  }

  // calyx: a six-pointed dark-green star seen slightly from above, and the stem
  const px = (x - 0.5) / 0.21, py = (y - 0.262) / 0.075, pr = Math.hypot(px, py), pa = Math.atan2(py, px) + 0.3;
  const star = 0.22 + 0.78 * Math.pow(Math.abs(Math.cos(3 * pa)), 2.4);
  if (pr < star) c = mix(hex("#1A4A26"), hex("#2E6B38"), clamp(0.5 - py * 0.4));
  if (Math.abs(x - 0.503) < 0.012 && y > 0.2 && y < 0.262) c = hex("#173E20");
  if (Math.hypot((x - 0.503) / 0.013, (y - 0.2) / 0.008) < 1) c = hex("#245A2E");
  return c;
}

function render(size, scale) {
  const SS = 4, out = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    let r = 0, g = 0, b = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
      const u = (px + (sx + 0.5) / SS) / size, v = (py + (sy + 0.5) / SS) / size;
      const c = shade((u - 0.5) / scale + 0.5, (v - 0.5) / scale + 0.5);
      r += c[0]; g += c[1]; b += c[2];
    }
    const i = (py * size + px) * 4, n = SS * SS;
    out[i] = Math.round(r / n); out[i + 1] = Math.round(g / n); out[i + 2] = Math.round(b / n); out[i + 3] = 255;
  }
  return png(size, size, out);
}

mkdirSync("icons", { recursive: true });
const jobs = [
  ["icons/icon-192.png", 192, 1],
  ["icons/icon-512.png", 512, 1],
  ["icons/icon-maskable-512.png", 512, 0.78], // keeps the tomato inside Android's safe zone
  ["icons/apple-touch-icon.png", 180, 0.92],
  ["icons/favicon-48.png", 48, 1.08],
];
for (const [file, size, scale] of jobs) { writeFileSync(file, render(size, scale)); console.log("wrote", file); }
