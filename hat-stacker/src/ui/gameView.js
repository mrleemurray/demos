function phaseDescription(snapshot) {
  if (snapshot.phase === 'playing') {
    const nextSpawnDescription = snapshot.fallingHat?.passedCatchLine
      || !Number.isFinite(snapshot.nextSpawnX)
      ? ''
      : ` Next hat near the ${snapshot.nextSpawnX < 320 ? 'left' : snapshot.nextSpawnX > 640 ? 'right' : 'center'}.`;
    return `Hat Stacker in progress. Score ${snapshot.score}. ${snapshot.stack.length} hats stacked.${nextSpawnDescription}`;
  }
  if (snapshot.phase === 'paused') {
    return `Hat Stacker paused. Score ${snapshot.score}. ${snapshot.stack.length} hats stacked.`;
  }
  if (snapshot.phase === 'gameover') {
    return `Game over. You caught ${snapshot.score} ${snapshot.score === 1 ? 'hat' : 'hats'}.`;
  }
  return 'Hat Stacker is ready. Start the game to catch falling hats.';
}

export class GameView {
  constructor(root, {
    onPrimary,
    windowRef = window,
  }) {
    this.root = root;
    this.onPrimary = onPrimary;
    this.windowRef = windowRef;
    this.announcementTimer = undefined;
    this.listeners = [];
    this.previousCanvasDescription = '';

    root.innerHTML = `
      <div class="hat-stacker-app" data-phase="loading">
        <main class="game-shell">
          <section class="game-card" aria-label="Hat Stacker">
            <h1 class="visually-hidden">Hat Stacker</h1>
            <div class="playfield-frame">
              <canvas
                class="playfield"
                width="960"
                height="600"
                tabindex="0"
                role="img"
                aria-label="Hat Stacker is loading."
                aria-describedby="control-help"
              ></canvas>
              <div class="scanlines" aria-hidden="true"></div>

              <div class="game-overlay" data-overlay>
                <div class="overlay-panel">
                  <h2 data-overlay-title>Hats incoming...</h2>
                  <p data-overlay-copy>Getting Buddy and the hat rack ready.</p>
                  <button class="primary-button" type="button" data-action="primary" disabled>
                    Loading
                  </button>
                </div>
              </div>

              <div class="touch-controls" aria-label="Movement controls">
                <button type="button" data-control="left" aria-label="Move Buddy left">
                  <span aria-hidden="true">←</span>
                </button>
                <button type="button" data-control="right" aria-label="Move Buddy right">
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </section>

          <p class="game-help" id="control-help">
            Move with <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd>, or drag.
            Tap then hold a direction to sprint. <kbd>P</kbd> pauses.
          </p>
          <div class="visually-hidden" data-live-region aria-live="polite" aria-atomic="true"></div>
        </main>
      </div>
    `;

    this.app = this._query('.hat-stacker-app');
    this.canvas = this._query('.playfield');
    this.primaryButton = this._query('[data-action="primary"]');
    this.leftButton = this._query('[data-control="left"]');
    this.rightButton = this._query('[data-control="right"]');
    this.overlay = this._query('[data-overlay]');
    this.overlayTitle = this._query('[data-overlay-title]');
    this.overlayCopy = this._query('[data-overlay-copy]');
    this.liveRegion = this._query('[data-live-region]');

    this._listen(this.primaryButton, 'click', () => this.onPrimary());
  }

  setReady(snapshot) {
    this.primaryButton.disabled = false;
    this.update(snapshot);
    this.setPhase(snapshot);
  }

  setPhase(snapshot) {
    this.app.dataset.phase = snapshot.phase;
    const isPlaying = snapshot.phase === 'playing';
    this.overlay.hidden = isPlaying;
    this.overlay.setAttribute('aria-hidden', String(isPlaying));
    this.leftButton.disabled = !isPlaying;
    this.rightButton.disabled = !isPlaying;

    if (snapshot.phase === 'ready') {
      this.overlayTitle.textContent = 'Hat Stacker';
      this.overlayCopy.textContent = 'How many hats can you catch?';
      this.primaryButton.textContent = 'Start';
      this.primaryButton.disabled = false;
    } else if (snapshot.phase === 'paused') {
      this.overlayTitle.textContent = 'Stack on hold';
      this.overlayCopy.textContent = `${snapshot.stack.length} hats stacked. Score: ${snapshot.score}.`;
      this.primaryButton.textContent = 'Resume';
      this.primaryButton.disabled = false;
    } else if (snapshot.phase === 'gameover') {
      const hatLabel = snapshot.score === 1 ? 'hat' : 'hats';
      this.overlayTitle.textContent = 'Game Over';
      this.overlayCopy.textContent = `You caught ${snapshot.score.toLocaleString()} ${hatLabel}.`;
      this.primaryButton.textContent = 'Play again';
      this.primaryButton.disabled = false;
    }
  }

  update(snapshot) {
    const canvasDescription = phaseDescription(snapshot);
    if (canvasDescription !== this.previousCanvasDescription) {
      this.canvas.setAttribute('aria-label', canvasDescription);
      this.previousCanvasDescription = canvasDescription;
    }
  }

  announce(message) {
    this.windowRef.clearTimeout(this.announcementTimer);
    this.liveRegion.textContent = '';
    this.announcementTimer = this.windowRef.setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 20);
  }

  showError(message) {
    this.app.dataset.phase = 'error';
    this.overlay.hidden = false;
    this.overlay.setAttribute('aria-hidden', 'false');
    this.overlayTitle.textContent = "The hats didn't land.";
    this.overlayCopy.textContent = message;
    this.primaryButton.textContent = 'Reload';
    this.primaryButton.disabled = false;
    this.announce(message);
  }

  destroy() {
    this.windowRef.clearTimeout(this.announcementTimer);
    for (const { element, type, listener } of this.listeners) {
      element.removeEventListener(type, listener);
    }
    this.listeners = [];
    this.root.innerHTML = '';
  }

  _query(selector) {
    const element = this.root.querySelector(selector);
    if (!element) {
      throw new Error(`Hat Stacker UI is missing required element: ${selector}`);
    }
    return element;
  }

  _listen(element, type, listener) {
    element.addEventListener(type, listener);
    this.listeners.push({ element, type, listener });
  }
}
