import { expect, suite, test, vi } from 'vitest';
import { GameRenderer } from './renderer.js';

suite('GameRenderer', () => {
  test('moves Buddy and the stack together during a jump', () => {
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
    };
    const renderer = Object.create(GameRenderer.prototype);
    renderer.reducedMotion = true;
    renderer.assets = {
      petSprites: {
        idle: {
          staticImage: {},
          animatedImage: {},
          frameWidth: 110,
          frameHeight: 110,
          frameDurations: [100],
        },
      },
      hats: new Map([['crown', {}]]),
    };
    renderer._drawHat = vi.fn();
    const snapshot = {
      pet: { x: 480, facing: 'right', vx: 0, jumpOffset: 12 },
      petMood: 'idle',
      petExpression: 'dizzy',
      balance: { angle: 0 },
      stackLayout: {
        items: [{
          type: { id: 'crown' },
          localX: 0,
          localBottomY: 0,
          localRotation: 0,
        }],
      },
    };

    renderer._drawPet(context, snapshot, 0);
    renderer._drawStack(context, snapshot);

    expect(context.translate).toHaveBeenNthCalledWith(1, 480, 536);
    expect(context.translate).toHaveBeenNthCalledWith(2, 480, 505);
  });

  test('draws the next-spawn marker while the current hat is falling', () => {
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      fillRect: vi.fn(),
    };
    const renderer = Object.create(GameRenderer.prototype);
    renderer.cameraZoom = 0.6;
    renderer.reducedMotion = true;
    const snapshot = {
      phase: 'playing',
      fallingHat: {},
      nextSpawnX: 200,
      nextSpawnProgress: 0,
    };

    renderer._drawSpawnIndicator(context, snapshot, 1000);

    const [screenX, screenY] = context.translate.mock.calls[0];
    const [left, top, width, height] = context.fillRect.mock.calls[0];
    expect(screenX).toBeCloseTo(364.8);
    expect(screenY).toBe(9);
    expect(left).toBeCloseTo(-43.2);
    expect(top).toBe(-2);
    expect(width).toBeCloseTo(86.4);
    expect(height).toBe(3);

    renderer._drawSpawnIndicator(context, {
      ...snapshot,
      nextSpawnProgress: 1,
    }, 1000);
    const [accurateX] = context.translate.mock.calls[1];
    const [accurateLeft, , accurateWidth] = context.fillRect.mock.calls[1];
    expect(accurateX).toBe(312);
    expect(accurateLeft).toBe(-16);
    expect(accurateWidth).toBe(32);

    renderer._drawSpawnIndicator(context, {
      ...snapshot,
      nextSpawnX: undefined,
    }, 1000);
    expect(context.fillRect).toHaveBeenCalledTimes(2);
  });
});
