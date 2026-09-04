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
    const controller = new InputController({
      keyboardTarget: window,
      surface,
      leftButton,
      rightButton,
      onDirectionChange,
      onPointerTarget: vi.fn(),
      onPause,
      onPrimary,
    });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(-1);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(1);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));
    expect(onPause).toHaveBeenCalledOnce();
    surface.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onPrimary).toHaveBeenCalledOnce();

    controller.destroy();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0);
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
    expect(onDirectionChange).toHaveBeenLastCalledWith(-1);
    leftButton.dispatchEvent(pointerEvent('pointerup', { clientX: 0 }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0);

    rightButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(1);
    rightButton.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    expect(onDirectionChange).toHaveBeenLastCalledWith(0);

    controller.destroy();
  });
});
