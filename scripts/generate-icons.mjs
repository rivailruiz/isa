import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

const outputDir = join(process.cwd(), 'public', 'icons');
mkdirSync(outputDir, { recursive: true });

const sizes = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512]
];

for (const [fileName, size] of sizes) {
  writeFileSync(join(outputDir, fileName), createPng(size));
}

function createPng(size) {
  const rows = [];

  for (let y = 0; y < size; y += 1) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0;

    for (let x = 0; x < size; x += 1) {
      const color = pixelColor(x, y, size);
      const offset = 1 + x * 4;
      row[offset] = color[0];
      row[offset + 1] = color[1];
      row[offset + 2] = color[2];
      row[offset + 3] = color[3];
    }

    rows.push(row);
  }

  const raw = Buffer.concat(rows);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', Buffer.concat([uint32(size), uint32(size), Buffer.from([8, 6, 0, 0, 0])])),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function pixelColor(x, y, size) {
  const scale = size / 512;
  const cx = x / scale;
  const cy = y / scale;
  const radius = roundedRectDistance(cx, cy, 256, 256, 512, 512, 112);

  if (radius > 0) {
    return [0, 0, 0, 0];
  }

  if (distance(cx, cy, 256, 256) < 176) {
    if (capsuleDistance(cx, cy, 309, 258, 256, 86) < 0) {
      return [39, 113, 93, 255];
    }

    if (capsuleDistance(cx, cy, 345, 221, 170, 86) < 0 && cx > cy + 52) {
      return [136, 201, 177, 255];
    }

    if (checkMark(cx, cy)) {
      return [255, 255, 255, 255];
    }

    return [223, 243, 231, 255];
  }

  return [246, 251, 248, 255];
}

function checkMark(x, y) {
  return distanceToSegment(x, y, 185, 271, 230, 316) < 15 || distanceToSegment(x, y, 230, 316, 318, 218) < 15;
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function capsuleDistance(x, y, cx, cy, length, radius) {
  const angle = -Math.PI / 4;
  const dx = x - cx;
  const dy = y - cy;
  const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
  const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
  const qx = Math.abs(rx) - length / 2;
  return Math.hypot(Math.max(qx, 0), ry) + Math.min(Math.max(qx, Math.abs(ry)), 0) - radius;
}

function roundedRectDistance(x, y, cx, cy, width, height, radius) {
  const qx = Math.abs(x - cx) - width / 2 + radius;
  const qy = Math.abs(y - cy) - height / 2 + radius;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return distance(px, py, ax + t * dx, ay + t * dy);
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  return Buffer.concat([uint32(data.length), typeBuffer, data, uint32(crc32(Buffer.concat([typeBuffer, data])))]);
}

function uint32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value >>> 0);
  return buffer;
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}
