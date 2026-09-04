import { WORLD } from '../game/engine.js';

const TAP_MAX_DURATION_MS = 180;
const SPRINT_FOLLOW_UP_WINDOW_MS = 320;

function isEditableTarget(target) {
  if (!(target instanceof Element)) {
    return false;
  }
  return target.matches('input, textarea, select, [contenteditable="true"]');
}

export class InputController {
  constructor({
    keyboardTarget,
    surface,
    leftButton,
    rightButton,
    onDirectionChange,
    onPointerTarget,
    onPause,
    onPrimary,
    getCameraZoom = () => 1,
    now = () => performance.now(),
  }) {
    this.keyboardTarget = keyboardTarget;
    this.surface = surface;
    this.leftButton = leftButton;
    this.rightButton = rightButton;
    this.onDirectionChange = onDirectionChange;
    this.onPointerTarget = onPointerTarget;
    this.onPause = onPause;
    this.onPrimary = onPrimary;
    this.getCameraZoom = getCameraZoom;
    this.now = now;
    this.leftHeld = false;
    this.rightHeld = false;
    this.leftPressedAt = undefined;
    this.rightPressedAt = undefined;
    this.lastTapDirection = 0;
    this.lastTapReleasedAt = Number.NEGATIVE_INFINITY;
    this.sprintDirection = 0;
    this.activePointerId = undefined;
    this.listeners = [];

    this._listen(keyboardTarget, 'keydown', event => this._onKeyDown(event));
    this._listen(keyboardTarget, 'keyup', event => this._onKeyUp(event));
    this._listen(keyboardTarget, 'blur', () => this._releaseAll());
    this._listen(surface, 'pointerdown', event => this._onSurfacePointerDown(event));
    this._listen(surface, 'pointermove', event => this._onSurfacePointerMove(event));
    this._listen(surface, 'pointerup', event => this._onSurfacePointerEnd(event));
    this._listen(surface, 'pointercancel', event => this._onSurfacePointerEnd(event));
    this._bindDirectionButton(leftButton, -1);
    this._bindDirectionButton(rightButton, 1);
  }

  destroy() {
    this._releaseAll();
    for (const { target, type, listener, options } of this.listeners) {
      target.removeEventListener(type, listener, options);
    }
    this.listeners = [];
  }

  _onKeyDown(event) {
    if (isEditableTarget(event.target)) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === 'arrowleft' || key === 'a') {
      event.preventDefault();
      this._pressDirection(-1);
    } else if (key === 'arrowright' || key === 'd') {
      event.preventDefault();
      this._pressDirection(1);
    } else if ((key === 'p' || key === 'escape') && !event.repeat) {
      event.preventDefault();
      this.onPause();
    } else if (
      (key === ' ' || key === 'enter')
      && !event.repeat
      && event.target === this.surface
    ) {
      event.preventDefault();
      this.onPrimary();
    }
  }

  _onKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key === 'arrowleft' || key === 'a') {
      this._releaseDirection(-1);
    } else if (key === 'arrowright' || key === 'd') {
      this._releaseDirection(1);
    }
  }

  _onSurfacePointerDown(event) {
    this.activePointerId = event.pointerId;
    this.surface.setPointerCapture?.(event.pointerId);
    this._emitPointerTarget(event.clientX);
  }

  _onSurfacePointerMove(event) {
    if (event.pointerId === this.activePointerId) {
      this._emitPointerTarget(event.clientX);
    }
  }

  _onSurfacePointerEnd(event) {
    if (event.pointerId !== this.activePointerId) {
      return;
    }
    this.surface.releasePointerCapture?.(event.pointerId);
    this.activePointerId = undefined;
    this.onPointerTarget(undefined);
  }

  _emitPointerTarget(clientX) {
    const rectangle = this.surface.getBoundingClientRect();
    if (rectangle.width <= 0) {
      return;
    }
    const normalized = Math.max(0, Math.min(1, (clientX - rectangle.left) / rectangle.width));
    const screenX = normalized * WORLD.width;
    const zoom = Math.max(0.1, this.getCameraZoom());
    const worldX = WORLD.width / 2 + (screenX - WORLD.width / 2) / zoom;
    this.onPointerTarget(Math.max(0, Math.min(WORLD.width, worldX)));
  }

  _bindDirectionButton(button, direction) {
    const hold = event => {
      event.preventDefault();
      this._pressDirection(direction);
    };
    const release = event => {
      event.preventDefault();
      this._releaseDirection(direction);
    };
    this._listen(button, 'pointerdown', hold);
    this._listen(button, 'pointerup', release);
    this._listen(button, 'pointercancel', release);
    this._listen(button, 'pointerleave', release);
    this._listen(button, 'keydown', event => {
      if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
        hold(event);
      }
    });
    this._listen(button, 'keyup', event => {
      if (event.key === ' ' || event.key === 'Enter') {
        release(event);
      }
    });
  }

  _pressDirection(direction) {
    const heldProperty = direction < 0 ? 'leftHeld' : 'rightHeld';
    if (this[heldProperty]) {
      return;
    }

    const now = this.now();
    const pressedAtProperty = direction < 0 ? 'leftPressedAt' : 'rightPressedAt';
    this[heldProperty] = true;
    this[pressedAtProperty] = now;
    this.sprintDirection = this.lastTapDirection === direction
      && now - this.lastTapReleasedAt <= SPRINT_FOLLOW_UP_WINDOW_MS
      ? direction
      : 0;
    this.lastTapDirection = 0;
    this.lastTapReleasedAt = Number.NEGATIVE_INFINITY;
    this._emitDirection();
  }

  _releaseDirection(direction) {
    const heldProperty = direction < 0 ? 'leftHeld' : 'rightHeld';
    if (!this[heldProperty]) {
      return;
    }

    const pressedAtProperty = direction < 0 ? 'leftPressedAt' : 'rightPressedAt';
    const now = this.now();
    const wasSprinting = this.sprintDirection === direction;
    const heldDuration = now - this[pressedAtProperty];
    this[heldProperty] = false;
    this[pressedAtProperty] = undefined;
    this.sprintDirection = 0;

    if (!wasSprinting && heldDuration <= TAP_MAX_DURATION_MS) {
      this.lastTapDirection = direction;
      this.lastTapReleasedAt = now;
    } else {
      this.lastTapDirection = 0;
      this.lastTapReleasedAt = Number.NEGATIVE_INFINITY;
    }
    this._emitDirection();
  }

  _releaseAll() {
    this.leftHeld = false;
    this.rightHeld = false;
    this.leftPressedAt = undefined;
    this.rightPressedAt = undefined;
    this.lastTapDirection = 0;
    this.lastTapReleasedAt = Number.NEGATIVE_INFINITY;
    this.sprintDirection = 0;
    this.activePointerId = undefined;
    this.onDirectionChange(0, false);
    this.onPointerTarget(undefined);
  }

  _emitDirection() {
    const direction = (this.rightHeld ? 1 : 0) - (this.leftHeld ? 1 : 0);
    this.onDirectionChange(
      direction,
      direction !== 0 && direction === this.sprintDirection,
    );
  }

  _listen(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    this.listeners.push({ target, type, listener, options });
  }
}
