import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, suite, test } from 'vitest';
import { HAT_CATALOG } from './catalog.js';
import { createHatMetrics, findOpaqueBounds } from './assets.js';

suite('hat assets', () => {
  test('finds the exact bounds of visible pixels', () => {
    const pixels = new Uint8ClampedArray(4 * 4 * 4);
    const setOpaque = (x, y) => {
      pixels[(y * 4 + x) * 4 + 3] = 255;
    };
    setOpaque(1, 1);
    setOpaque(3, 2);

    expect(findOpaqueBounds(pixels, 4, 4)).toEqual({
      x: 1,
      y: 1,
      width: 3,
      height: 2,
    });
  });

  test('returns no bounds for a fully transparent sprite', () => {
    const pixels = new Uint8ClampedArray(3 * 3 * 4);
    expect(findOpaqueBounds(pixels, 3, 3)).toBeUndefined();
  });

  test('keeps rendered stack steps within playable limits', () => {
    expect(createHatMetrics({ width: 80, height: 12 })).toMatchObject({
      stackStep: 12,
    });
    expect(createHatMetrics({ width: 80, height: 80 })).toMatchObject({
      stackStep: 24,
    });
  });

  test('ships one atlas for every catalogued hat', () => {
    const assetDirectory = resolve(process.cwd(), 'public/assets/vscode-pet/hats');
    const actualFiles = readdirSync(assetDirectory)
      .filter(file => file.endsWith('.png'))
      .sort();
    const expectedFiles = HAT_CATALOG
      .map(hat => `${hat.id}.png`)
      .sort();

    expect(actualFiles).toEqual(expectedFiles);
    expect(new Set(HAT_CATALOG.map(hat => hat.id)).size).toBe(HAT_CATALOG.length);
  });
});
