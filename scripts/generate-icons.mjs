import { cpSync, mkdirSync, mkdtempSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const outputDir = join(process.cwd(), 'public', 'icons');
const sourceIcon = join(outputDir, 'icon.svg');
const sizes = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512]
];

mkdirSync(outputDir, { recursive: true });

for (const [fileName, size] of sizes) {
  const tempDir = mkdtempSync(join(tmpdir(), 'medicine-icon-'));

  try {
    execFileSync('qlmanage', ['-t', '-s', String(size), '-o', tempDir, sourceIcon], {
      stdio: 'ignore'
    });
    renameSync(join(tempDir, 'icon.svg.png'), join(outputDir, fileName));
  } catch {
    cpSync(sourceIcon, join(outputDir, fileName));
  } finally {
    rmSync(tempDir, { force: true, recursive: true });
  }
}
