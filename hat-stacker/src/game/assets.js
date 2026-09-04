import { HAT_CATALOG } from './catalog.js';

const HAT_ATLAS_CELL_SIZE = 96;
const HAT_RENDER_SCALE = 0.8;

const PET_SPRITE_DEFINITIONS = Object.freeze({
  idle: {
    animated: 'buddy-idle-stable-tracking-96.spritesheet.png',
    static: 'buddy-idle-stable-tracking-96.png',
    frameWidth: 96,
    frameHeight: 96,
    frameDurations: Array.from({ length: 50 }, () => 40),
  },
  clapping: {
    animated: 'buddy-clapping-stable-tracking-96.spritesheet.png',
    static: 'buddy-clapping-stable-tracking-96.png',
    frameWidth: 96,
    frameHeight: 96,
    frameDurations: [80, 40, 40, 40, 80, 40, 40, 40, 40, 80, 40, 40, 80],
  },
  worry: {
    animated: 'buddy-worry-stable-96.spritesheet.png',
    static: 'buddy-worry-stable-96.png',
    frameWidth: 96,
    frameHeight: 96,
    frameDurations: [600, 600],
  },
  dizzy: {
    animated: 'buddy-dizzy-stable-128.spritesheet.png',
    static: 'buddy-dizzy-stable-128.png',
    frameWidth: 96,
    frameHeight: 128,
    frameDurations: Array.from({ length: 8 }, () => 120),
  },
});

export function findOpaqueBounds(pixels, width, height) {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] === 0) {
        continue;
      }
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < left || bottom < top) {
    return undefined;
  }

  return {
    x: left,
    y: top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

export function createHatMetrics(bounds) {
  const width = bounds.width * HAT_RENDER_SCALE;
  const height = bounds.height * HAT_RENDER_SCALE;
  return {
    width,
    height,
    stackStep: Math.max(12, Math.min(24, height * 0.58)),
  };
}

function joinAssetPath(baseUrl, path) {
  return `${baseUrl.replace(/\/?$/, '/')}${path.replace(/^\//, '')}`;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => resolve(image), { once: true });
    image.addEventListener('error', () => reject(new Error(`Failed to load image asset: ${url}`)), { once: true });
    image.src = url;
  });
}

function composeHatSprite(image, documentRef) {
  const canvas = documentRef.createElement('canvas');
  canvas.width = HAT_ATLAS_CELL_SIZE;
  canvas.height = HAT_ATLAS_CELL_SIZE;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    throw new Error('Canvas 2D is required to compose the hat sprites.');
  }

  context.imageSmoothingEnabled = false;
  context.drawImage(
    image,
    0,
    0,
    HAT_ATLAS_CELL_SIZE,
    HAT_ATLAS_CELL_SIZE,
    0,
    0,
    HAT_ATLAS_CELL_SIZE,
    HAT_ATLAS_CELL_SIZE,
  );
  context.drawImage(
    image,
    0,
    HAT_ATLAS_CELL_SIZE,
    HAT_ATLAS_CELL_SIZE,
    HAT_ATLAS_CELL_SIZE,
    0,
    0,
    HAT_ATLAS_CELL_SIZE,
    HAT_ATLAS_CELL_SIZE,
  );

  const imageData = context.getImageData(0, 0, HAT_ATLAS_CELL_SIZE, HAT_ATLAS_CELL_SIZE);
  const bounds = findOpaqueBounds(imageData.data, HAT_ATLAS_CELL_SIZE, HAT_ATLAS_CELL_SIZE);
  if (!bounds) {
    throw new Error('A hat atlas did not contain any visible upright pixels.');
  }

  return {
    canvas,
    bounds,
    metrics: createHatMetrics(bounds),
  };
}

export async function loadGameAssets(baseUrl = import.meta.env.BASE_URL, documentRef = document) {
  const assetRoot = joinAssetPath(baseUrl, 'assets/vscode-pet/');
  const hats = new Map();
  const petSprites = {};

  await Promise.all([
    ...HAT_CATALOG.map(async type => {
      const image = await loadImage(`${assetRoot}hats/${type.id}.png`);
      hats.set(type.id, {
        type,
        ...composeHatSprite(image, documentRef),
      });
    }),
    ...Object.entries(PET_SPRITE_DEFINITIONS).map(async ([state, definition]) => {
      const [animatedImage, staticImage] = await Promise.all([
        loadImage(`${assetRoot}${definition.animated}`),
        loadImage(`${assetRoot}${definition.static}`),
      ]);
      petSprites[state] = {
        ...definition,
        animatedImage,
        staticImage,
      };
    }),
  ]);

  return {
    hats,
    petSprites,
    hatMetrics: new Map([...hats].map(([id, asset]) => [id, asset.metrics])),
  };
}
