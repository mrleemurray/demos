import { WORLD } from '../game/engine.js';

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
    this.leftHeld = false;
    this.rightHeld = false;
    this.activePointerId = undefined;
    this.listeners = [];

    this._listen(keyboardTarget, 'keydown', event => this._onKeyDown(event));
    this._listen(keyboardTarget, 'keyup', event => this._onKeyUp(event));
    this._listen(keyboardTarget, 'blur', () => this._releaseAll());
    this._listen(surface, 'pointerdown', event => this._onSurfacePointerDown(event));
    this._listen(surface, 'pointermove', event => this._onSurfacePointerMove(event));
    this._listen(surface, 'pointerup', event => this._onSurfacePointerEnd(event));
    this._listen(surface, 'pointercancel', event => this._onSurfacePointerEnd(event));
    this._bindDirectionButton(leftButton, 'leftHeld');
    this._bindDirectionButton(rightButton, 'rightHeld');
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
      this.leftHeld = true;
      this._emitDirection();
    } else if (key === 'arrowright' || key === 'd') {
      event.preventDefault();
      this.rightHeld = true;
      this._emitDirection();
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
      this.leftHeld = false;
      this._emitDirection();
    } else if (key === 'arrowright' || key === 'd') {
      this.rightHeld = false;
      this._emitDirection();
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

  _bindDirectionButton(button, heldProperty) {
    const hold = event => {
      event.preventDefault();
      this[heldProperty] = true;
      this._emitDirection();
    };
    const release = event => {
      event.preventDefault();
      this[heldProperty] = false;
      this._emitDirection();
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

  _releaseAll() {
    this.leftHeld = false;
    this.rightHeld = false;
    this.activePointerId = undefined;
    this.onDirectionChange(0);
    this.onPointerTarget(undefined);
  }

  _emitDirection() {
    this.onDirectionChange((this.rightHeld ? 1 : 0) - (this.leftHeld ? 1 : 0));
  }

  _listen(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    this.listeners.push({ target, type, listener, options });
  }
}
