const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function inspectNonTransparentPixels(filePath) {
  try {
    const { data, info } = await sharp(filePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    const channels = info.channels;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;

      if (a > 10) { // Non-transparent pixel
        rSum += r;
        gSum += g;
        bSum += b;
        count++;
      }
    }

    console.log(`\nFile: ${path.basename(filePath)}`);
    console.log(`Non-transparent pixel count: ${count} / ${info.width * info.height}`);
    if (count > 0) {
      console.log(`Average non-transparent RGB: (${(rSum / count).toFixed(2)}, ${(gSum / count).toFixed(2)}, ${(bSum / count).toFixed(2)})`);
    } else {
      console.log(`No non-transparent pixels found.`);
    }
  } catch (err) {
    console.error(`Error inspecting ${filePath}:`, err);
  }
}

async function run() {
  const publicDir = path.join(__dirname, '../public');
  await inspectNonTransparentPixels(path.join(publicDir, 'syncmasterwhite.png'));
  await inspectNonTransparentPixels(path.join(publicDir, 'Syncdark.png'));
  await inspectNonTransparentPixels(path.join(publicDir, 'logo.png'));
}

run();
