import { beforeEach, expect, suite, test, vi } from 'vitest';
import { GameView } from './gameView.js';

function snapshot(overrides = {}) {
  return {
    phase: 'ready',
    gameOverReason: undefined,
    score: 0,
    bestScore: 240,
    stack: [],
    nextHat: { id: 'crown', label: 'Crown' },
    balance: { ratio: 0 },
    difficulty: 'Breezy',
    ...overrides,
  };
}

suite('GameView', () => {
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.replaceChildren(root);
  });

  test('renders accessible game structure and native controls', () => {
    const view = new GameView(root, {
      onPrimary: vi.fn(),
    });

    expect(view.canvas.getAttribute('role')).toBe('img');
    expect(view.canvas.getAttribute('tabindex')).toBe('0');
    expect(view.leftButton.getAttribute('aria-label')).toBe('Move Buddy left');
    expect(view.rightButton.getAttribute('aria-label')).toBe('Move Buddy right');
    expect(root.querySelector('[aria-live="polite"]')).not.toBeNull();
    expect(root.querySelector('.game-card')).not.toBeNull();
    expect(root.querySelector('.game-bar')).toBeNull();
    expect(root.querySelector('.game-toast')).toBeNull();
    expect(root.querySelector('.overlay-kicker')).toBeNull();
    expect(root.querySelector('[data-score]')).toBeNull();
    expect(root.querySelector('[data-balance-meter]')).toBeNull();
  });

  test('shows the simplified ready message', () => {
    const view = new GameView(root, {
      onPrimary: vi.fn(),
    });

    view.setReady(snapshot());

    expect(view.overlayCopy.textContent).toBe('How many hats can you catch?');
  });

  test('updates the accessible game state without rendering a HUD', () => {
    const view = new GameView(root, {
      onPrimary: vi.fn(),
    });
    const state = snapshot({
      phase: 'playing',
      score: 1325,
      bestScore: 2400,
      stack: [{}, {}, {}, {}],
      balance: { ratio: -0.74 },
    });

    view.update(state);
    view.setPhase(state);

    expect(view.canvas.getAttribute('aria-label')).toContain('Score 1325');
    expect(view.canvas.getAttribute('aria-label')).toContain('4 hats stacked');
    expect(view.overlay.hidden).toBe(true);
    expect(view.leftButton.disabled).toBe(false);
    expect(view.rightButton.disabled).toBe(false);
  });

  test('presents the correct game-over reason and restart action', () => {
    const view = new GameView(root, {
      onPrimary: vi.fn(),
    });
    const state = snapshot({
      phase: 'gameover',
      gameOverReason: 'topple',
      score: 980,
    });

    view.setPhase(state);

    expect(view.overlay.hidden).toBe(false);
    expect(root.querySelector('[data-overlay-title]').textContent).toBe('Game Over');
    expect(root.querySelector('[data-overlay-copy]').textContent).toBe('You caught 980 hats.');
    expect(view.primaryButton.textContent).toBe('Play again');
  });

  test('uses singular hat copy for a one-hat run', () => {
    const view = new GameView(root, {
      onPrimary: vi.fn(),
    });
    const state = snapshot({
      phase: 'gameover',
      gameOverReason: 'miss',
      score: 1,
    });

    view.update(state);
    view.setPhase(state);

    expect(view.overlayTitle.textContent).toBe('Game Over');
    expect(view.overlayCopy.textContent).toBe('You caught 1 hat.');
    expect(view.canvas.getAttribute('aria-label')).toBe('Game over. You caught 1 hat.');
  });

  test('forwards actions and removes listeners on destroy', () => {
    const onPrimary = vi.fn();
    const view = new GameView(root, { onPrimary });
    const primaryButton = view.primaryButton;
    view.setReady(snapshot());

    view.primaryButton.click();

    expect(onPrimary).toHaveBeenCalledOnce();

    view.destroy();
    primaryButton.click();
    expect(onPrimary).toHaveBeenCalledOnce();
    expect(root.childElementCount).toBe(0);
  });
});
