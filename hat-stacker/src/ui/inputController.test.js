import { beforeEach, expect, suite, test, vi } from 'vitest';
import { InputController } from './inputController.js';

function pointerEvent(type, { clientX, pointerId = 1 }) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: clientX },
    pointerId: { value: pointerId },
  });
  return event;
}

suite('InputController', () => {
  let surface;
  let leftButton;
  let rightButton;

  beforeEach(() => {
    surface = document.createElement('canvas');
    leftButton = document.createElement('button');
    rightButton = document.createElement('button');
    document.body.replaceChildren(surface, leftButton, rightButton);
    surface.getBoundingClientRect = () => ({
      left: 100,
      right: 1060,
      top: 0,
      bottom: 600,
      width: 960,
      height: 600,
      x: 100,
      y: 0,
      toJSON: () => {},
    });
  });

  test('maps keyboard movement, pause, and primary actions', () => {
    const onDirectionChange = vi.fn();
    const onPause = vi.fn();
    const onPrimary = vi.fn();
    const onJump = vi.fn();
    const controller = new InputController({
      keyboardTarget: window,
      surface,
      leftButton,
      rightButton,
      onDirectionChange,
      onPointerTarget: vi.fn(),
      onPause,
      onPrimary,
      onJump,
    });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(-1, false);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0, false);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(1, false);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));
    expect(onPause).toHaveBeenCalledOnce();
    surface.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onJump).toHaveBeenCalledOnce();
    surface.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onPrimary).toHaveBeenCalledOnce();

    controller.destroy();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0, false);
  });

  test('maps playfield pointers into world coordinates and releases the target', () => {
    const onPointerTarget = vi.fn();
    const controller = new InputController({
      keyboardTarget: window,
      surface,
      leftButton,
      rightButton,
      onDirectionChange: vi.fn(),
      onPointerTarget,
      onPause: vi.fn(),
      onPrimary: vi.fn(),
    });

    surface.dispatchEvent(pointerEvent('pointerdown', { clientX: 580 }));
    expect(onPointerTarget).toHaveBeenLastCalledWith(480);
    surface.dispatchEvent(pointerEvent('pointermove', { clientX: 1060 }));
    expect(onPointerTarget).toHaveBeenLastCalledWith(960);
    surface.dispatchEvent(pointerEvent('pointerup', { clientX: 1060 }));
    expect(onPointerTarget).toHaveBeenLastCalledWith(undefined);

    controller.destroy();
  });

  test('maps pointer targets through the current camera zoom', () => {
    const onPointerTarget = vi.fn();
    const controller = new InputController({
      keyboardTarget: window,
      surface,
      leftButton,
      rightButton,
      onDirectionChange: vi.fn(),
      onPointerTarget,
      onPause: vi.fn(),
      onPrimary: vi.fn(),
      getCameraZoom: () => 0.5,
    });

    surface.dispatchEvent(pointerEvent('pointerdown', { clientX: 820 }));
    expect(onPointerTarget).toHaveBeenLastCalledWith(960);

    controller.destroy();
  });

  test('supports press-and-hold movement buttons for pointer and keyboard users', () => {
    const onDirectionChange = vi.fn();
    const controller = new InputController({
      keyboardTarget: window,
      surface,
      leftButton,
      rightButton,
      onDirectionChange,
      onPointerTarget: vi.fn(),
      onPause: vi.fn(),
      onPrimary: vi.fn(),
    });

    leftButton.dispatchEvent(pointerEvent('pointerdown', { clientX: 0 }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(-1, false);
    leftButton.dispatchEvent(pointerEvent('pointerup', { clientX: 0 }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0, false);

    rightButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(1, false);
    rightButton.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0, false);

    controller.destroy();
  });

  test('sprints after a short tap followed by a same-direction hold', () => {
    let now = 0;
    const onDirectionChange = vi.fn();
    const controller = new InputController({
      keyboardTarget: window,
      surface,
      leftButton,
      rightButton,
      onDirectionChange,
      onPointerTarget: vi.fn(),
      onPause: vi.fn(),
      onPrimary: vi.fn(),
      now: () => now,
    });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    now = 100;
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }));
    now = 260;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(onDirectionChange).toHaveBeenLastCalledWith(1, true);

    now = 700;
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0, false);
    controller.destroy();
  });

  test('does not sprint after a different-direction or late follow-up press', () => {
    let now = 0;
    const onDirectionChange = vi.fn();
    const controller = new InputController({
      keyboardTarget: window,
      surface,
      leftButton,
      rightButton,
      onDirectionChange,
      onPointerTarget: vi.fn(),
      onPause: vi.fn(),
      onPrimary: vi.fn(),
      now: () => now,
    });

    leftButton.dispatchEvent(pointerEvent('pointerdown', { clientX: 0 }));
    now = 80;
    leftButton.dispatchEvent(pointerEvent('pointerup', { clientX: 0 }));
    now = 160;
    rightButton.dispatchEvent(pointerEvent('pointerdown', { clientX: 0 }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(1, false);
    rightButton.dispatchEvent(pointerEvent('pointerup', { clientX: 0 }));

    now = 1_000;
    leftButton.dispatchEvent(pointerEvent('pointerdown', { clientX: 0 }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(-1, false);
    controller.destroy();
  });
});
