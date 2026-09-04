import { expect, suite, test, vi } from 'vitest';
import { GameRenderer } from './renderer.js';

suite('GameRenderer', () => {
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
