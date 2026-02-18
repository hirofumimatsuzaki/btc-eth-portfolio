import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'assets');
const srcSvg = path.join(assetsDir, 'icon.svg');
const bgColor = '#0F172A';
const sizes = [512, 256];

async function render() {
  const svg = await fs.readFile(srcSvg);

  for (const size of sizes) {
    const transparent = await sharp(svg, { density: 1024 })
      .resize(size, size)
      .png()
      .toBuffer();

    await fs.writeFile(path.join(assetsDir, `icon-${size}.png`), transparent);

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bgColor,
      },
    })
      .composite([{ input: transparent }])
      .png()
      .toFile(path.join(assetsDir, `icon-bg-${size}.png`));
  }

  console.log('Generated icon PNG files in assets/');
}

render().catch((error) => {
  console.error(error);
  process.exit(1);
});
