import { expect, suite, test, vi } from 'vitest';
import {
  HatStackerEngine,
  getBalanceLimit,
  getCameraZoom,
  getCatchWindow,
  getMovementProfile,
} from './engine.js';

function createEngine() {
  const events = [];
  const engine = new HatStackerEngine({
    random: () => 0.5,
    onEvent: event => events.push(event),
  });
  return { engine, events };
}

function dropAtStackTop(engine, xOffset = 0) {
  const top = engine.getStackTop();
  engine.spawnHat({
    typeId: 'cowboy-hat',
    x: top.x + xOffset,
    bottomY: top.y - 4,
    verticalVelocity: 200,
    gravity: 0,
    maximumFallSpeed: 200,
    horizontalVelocity: 0,
    swayAmplitude: 0,
    swayFrequency: 0,
  });
  engine.step(0.03);
}

function setStackSize(engine, count) {
  const type = engine.typeById.get('cowboy-hat');
  const metrics = engine.metrics.get('cowboy-hat');
  engine.stack = Array.from({ length: count }, () => ({
    type,
    metrics,
    offset: 0,
    restingRotation: 0,
  }));
}

suite('HatStackerEngine', () => {
  test('starts in a ready state and begins a run on demand', () => {
    const { engine, events } = createEngine();

    expect(engine.getSnapshot()).toMatchObject({
      phase: 'ready',
      score: 0,
      stack: [],
    });

    engine.start();

    expect(engine.phase).toBe('playing');
    expect(engine.nextSpawnX).toBeTypeOf('number');
    expect(engine.getSnapshot().nextSpawnProgress).toBe(0);
    expect(events.at(-1)).toEqual({ type: 'phase', phase: 'playing' });
  });

  test('spawns the next hat from its previewed location', () => {
    const { engine } = createEngine();
    engine.start();
    const previewedX = engine.getSnapshot().nextSpawnX;

    for (let index = 0; index < 12; index += 1) {
      engine.step(0.05);
    }

    expect(engine.fallingHat.originX).toBe(previewedX);
    expect(engine.getSnapshot().nextSpawnX).toBeTypeOf('number');
    expect(engine.getSnapshot().nextSpawnProgress).toBe(0);
  });

  test('refines the next-spawn preview as a falling hat approaches the stack', () => {
    const { engine } = createEngine();
    engine.start();
    for (let index = 0; index < 12; index += 1) {
      engine.step(0.05);
    }

    const initialProgress = engine.getSnapshot().nextSpawnProgress;
    const top = engine.getStackTop();
    engine.fallingHat.bottomY = (
      engine.fallingHat.spawnBottomY
      + top.y
    ) / 2;

    expect(initialProgress).toBe(0);
    expect(engine.getSnapshot().nextSpawnProgress).toBeCloseTo(0.325);
  });

  test('catches a centered falling hat and adds it to the stack', () => {
    const { engine, events } = createEngine();
    engine.start();

    dropAtStackTop(engine);

    const snapshot = engine.getSnapshot();
    expect(snapshot.phase).toBe('playing');
    expect(snapshot.stack).toHaveLength(1);
    expect(snapshot.fallingHat).toBeUndefined();
    expect(snapshot.nextSpawnX).toBeTypeOf('number');
    expect(snapshot.score).toBe(1);
    expect(events.find(event => event.type === 'catch')).toMatchObject({
      perfect: true,
      stackSize: 1,
      score: 1,
    });
    expect(events.find(event => event.type === 'catch')).not.toHaveProperty('points');
  });

  test('catches near-edge hats and preserves their landing position', () => {
    const { engine } = createEngine();
    engine.start();

    dropAtStackTop(engine, 36);

    expect(engine.phase).toBe('playing');
    expect(engine.stack).toHaveLength(1);
    expect(engine.stack[0].offset).toBeGreaterThan(20);
    expect(engine.stack[0].restingRotation).toBeGreaterThan(0);
  });

  test('places ordinary catches close to their actual contact point', () => {
    const { engine } = createEngine();
    engine.start();

    dropAtStackTop(engine, 18);

    const landedX = engine.getSnapshot().stackLayout.items[0].localX;
    expect(landedX).toBeCloseTo(18, 0);
  });

  test('lets a missed hat fall to the ground before ending the run', () => {
    const { engine, events } = createEngine();
    engine.start();

    dropAtStackTop(engine, 180);

    expect(engine.getSnapshot()).toMatchObject({
      phase: 'playing',
      fallingHat: {
        passedCatchLine: true,
      },
    });
    expect(events.at(-1).type).not.toBe('gameover');

    for (let index = 0; index < 60 && engine.phase === 'playing'; index += 1) {
      engine.step(0.05);
    }

    expect(engine.getSnapshot()).toMatchObject({
      phase: 'gameover',
      gameOverReason: 'miss',
    });
    expect(engine.debris).toHaveLength(1);
    expect(events.at(-1)).toMatchObject({
      type: 'gameover',
      reason: 'miss',
    });
  });

  test('topples after the stack remains beyond its balance limit', () => {
    const { engine } = createEngine();
    engine.start();
    dropAtStackTop(engine);
    dropAtStackTop(engine);

    const layout = engine.getStackLayout();
    const limit = getBalanceLimit(engine.stack.length, layout.height);
    for (let index = 0; index < 7 && engine.phase === 'playing'; index += 1) {
      engine.balance.angle = limit * 2.2;
      engine.balance.angularVelocity = 0;
      engine.step(0.05);
    }

    expect(engine.getSnapshot()).toMatchObject({
      phase: 'gameover',
      gameOverReason: 'topple',
    });
    expect(engine.debris).toHaveLength(2);
    expect(engine.debris.every(item => item.vy <= -190)).toBe(true);
    expect(engine.stack).toHaveLength(0);
  });

  test('gives a sixteen-hat stack time to recover from a brief overbalance', () => {
    const { engine } = createEngine();
    engine.start();
    setStackSize(engine, 16);

    const snapshot = engine.getSnapshot();
    expect(snapshot.balance.limit).toBeGreaterThanOrEqual(0.31);

    for (let index = 0; index < 5; index += 1) {
      engine.balance.angle = snapshot.balance.limit * 2.2;
      engine.balance.angularVelocity = 0;
      engine.step(0.05);
    }
    expect(engine.phase).toBe('playing');

    for (let index = 0; index < 2 && engine.phase === 'playing'; index += 1) {
      engine.balance.angle = snapshot.balance.limit * 2.2;
      engine.balance.angularVelocity = 0;
      engine.step(0.05);
    }
    expect(engine.getSnapshot()).toMatchObject({
      phase: 'gameover',
      gameOverReason: 'topple',
    });
  });

  test('quickly forgives recovered balance exposure', () => {
    const { engine } = createEngine();
    engine.start();
    setStackSize(engine, 16);
    engine.toppleExposure = 0.2;
    engine.balance.angle = 0;
    engine.balance.angularVelocity = 0;

    engine.step(0.05);

    expect(engine.phase).toBe('playing');
    expect(engine.toppleExposure).toBeLessThan(0.05);
  });

  test('flexes the upper hats more than the base as a tall stack wobbles', () => {
    const { engine } = createEngine();
    engine.start();
    setStackSize(engine, 16);
    engine.elapsed = 0.5;
    engine.balance.angularVelocity = 0.8;

    const layout = engine.getStackLayout();
    const baseHat = layout.items[0];
    const topHat = layout.items.at(-1);

    expect(Math.abs(topHat.localX)).toBeGreaterThan(Math.abs(baseHat.localX));
    expect(Math.abs(topHat.localRotation)).toBeGreaterThan(Math.abs(baseHat.localRotation));
    expect(layout.topLocalX).toBe(topHat.localX);
  });

  test('drops every stacked hat when a missed hat reaches the ground', () => {
    const { engine, events } = createEngine();
    engine.start();
    dropAtStackTop(engine);
    dropAtStackTop(engine);
    dropAtStackTop(engine, 180);

    for (let index = 0; index < 60 && engine.phase === 'playing'; index += 1) {
      engine.step(0.05);
    }

    expect(engine.phase).toBe('gameover');
    expect(engine.stack).toHaveLength(0);
    expect(engine.debris).toHaveLength(3);
    expect(events.at(-1)).toMatchObject({
      type: 'gameover',
      reason: 'miss',
      stackSize: 2,
    });
  });

  test('maps balance severity to Buddy expressions', () => {
    const { engine } = createEngine();
    engine.start();
    dropAtStackTop(engine);
    dropAtStackTop(engine);

    engine.balance.angle = 0;
    expect(engine.getSnapshot().petExpression).toBe('calm');

    const limit = engine.getSnapshot().balance.limit;
    engine.balance.angle = limit * 0.5;
    expect(engine.getSnapshot().petExpression).toBe('worried');

    engine.balance.angle = limit * 0.8;
    expect(engine.getSnapshot().petExpression).toBe('panic');
  });

  test('freezes gameplay while paused and resumes without resetting', () => {
    const { engine } = createEngine();
    engine.start();
    engine.setDirection(1);
    engine.step(0.05);
    engine.pause();
    const pausedX = engine.pet.x;
    const pausedElapsed = engine.elapsed;

    engine.step(0.5);

    expect(engine.pet.x).toBe(pausedX);
    expect(engine.elapsed).toBe(pausedElapsed);

    engine.resume();
    engine.step(0.05);
    expect(engine.pet.x).toBeGreaterThan(pausedX);
  });

  test('reduces movement and balance margins as the stack grows', () => {
    expect(getMovementProfile(10).maximumSpeed).toBeLessThan(getMovementProfile(0).maximumSpeed);
    expect(getMovementProfile(10).acceleration).toBeLessThan(getMovementProfile(0).acceleration);
    expect(getBalanceLimit(10, 240)).toBeLessThan(getBalanceLimit(2, 44));
    expect(getCatchWindow(72, 72, 10)).toBeLessThan(getCatchWindow(72, 72, 0));
    expect(getCatchWindow(52, 66, 0)).toBeGreaterThan(36);
    expect(getCameraZoom(12)).toBeLessThan(getCameraZoom(3));
    expect(getCameraZoom(16)).toBeLessThan(0.62);
    expect(getCameraZoom(20)).toBe(0.5);
  });

  test('accelerates falling hats under gravity', () => {
    const { engine } = createEngine();
    engine.start();
    const hat = engine.spawnHat({
      verticalVelocity: 60,
      gravity: 300,
      maximumFallSpeed: 400,
      swayAmplitude: 0,
      horizontalVelocity: 0,
    });
    const initialBottom = hat.bottomY;

    engine.step(0.05);
    const firstDistance = hat.bottomY - initialBottom;
    const firstVelocity = hat.verticalVelocity;
    engine.step(0.05);
    const secondDistance = hat.bottomY - initialBottom - firstDistance;

    expect(hat.verticalVelocity).toBeGreaterThan(firstVelocity);
    expect(secondDistance).toBeGreaterThan(firstDistance);
  });

  test('rejects invalid spawning states instead of silently replacing hats', () => {
    const { engine } = createEngine();
    expect(() => engine.spawnHat()).toThrow(/in progress/);

    engine.start();
    engine.spawnHat({ swayAmplitude: 0 });
    expect(() => engine.spawnHat()).toThrow(/already falling/);
  });

  test('emits no movement after a zero-length step', () => {
    const onEvent = vi.fn();
    const engine = new HatStackerEngine({ onEvent });
    onEvent.mockClear();
    engine.start();
    const snapshot = engine.step(0);
    expect(snapshot.phase).toBe('playing');
    expect(snapshot.elapsed).toBe(0);
  });
});
