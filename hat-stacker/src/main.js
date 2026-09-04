import './style.css';
import { loadGameAssets } from './game/assets.js';
import { HatStackerEngine } from './game/engine.js';
import { GameRenderer } from './game/renderer.js';
import { GameView } from './ui/gameView.js';
import { InputController } from './ui/inputController.js';

const BEST_SCORE_KEY = 'hat-stacker.best-hats';
const root = document.querySelector('#app');

if (!root) {
  throw new Error('Hat Stacker could not find its application root.');
}

let engine;
let renderer;
let input;
let failedToLoad = false;
let animationFrame;
let previousFrameTime = performance.now();
let previousUiUpdate = 0;

const view = new GameView(root, {
  onPrimary: () => handlePrimaryAction(),
});

function readBestScore() {
  try {
    const value = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch (error) {
    console.warn('Hat Stacker could not read the saved high score.', error);
    return 0;
  }
}

function saveBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch (error) {
    console.warn('Hat Stacker could not save the high score.', error);
  }
}

function handlePrimaryAction() {
  if (failedToLoad) {
    window.location.reload();
    return;
  }
  if (!engine) {
    return;
  }

  if (engine.phase === 'paused') {
    engine.resume();
  } else if (engine.phase === 'ready' || engine.phase === 'gameover') {
    engine.start();
  }
  const snapshot = engine.getSnapshot();
  view.setPhase(snapshot);
  view.update(snapshot);
  view.canvas.focus();
}

function handlePauseAction() {
  if (!engine) {
    return;
  }
  engine.togglePause();
  const snapshot = engine.getSnapshot();
  view.setPhase(snapshot);
  view.update(snapshot);
  view.announce(snapshot.phase === 'paused' ? 'Game paused.' : 'Game resumed.');
  if (snapshot.phase === 'playing') {
    view.canvas.focus();
  }
}

function handleGameEvent(event) {
  if (!engine) {
    return;
  }

  if (event.type === 'drop') {
    view.announce(`${event.hat.label} falling.`);
  } else if (event.type === 'catch') {
    const snapshot = engine.getSnapshot();
    renderer.celebrate(engine.getStackTop(), event.perfect);
    view.announce(
      `${event.perfect ? 'Perfect catch.' : 'Hat caught.'} ${event.stackSize} hats stacked. Score ${event.score}.`,
    );
    view.update(snapshot);
  } else if (event.type === 'gameover') {
    const snapshot = engine.getSnapshot();
    saveBestScore(event.bestScore);
    view.setPhase(snapshot);
    view.update(snapshot);
    const hatLabel = event.score === 1 ? 'hat' : 'hats';
    view.announce(
      event.reason === 'topple'
        ? `Game over. The stack toppled. You caught ${event.score} ${hatLabel}.`
        : `Game over. A hat was missed. You caught ${event.score} ${hatLabel}.`,
    );
  }
}

function frame(timestamp) {
  if (!engine || !renderer) {
    return;
  }
  const delta = (timestamp - previousFrameTime) / 1000;
  previousFrameTime = timestamp;
  const snapshot = engine.step(delta);
  renderer.render(snapshot, timestamp);
  if (timestamp - previousUiUpdate >= 50) {
    view.update(snapshot);
    previousUiUpdate = timestamp;
  }
  animationFrame = requestAnimationFrame(frame);
}

async function bootstrap() {
  const assets = await loadGameAssets();
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  engine = new HatStackerEngine({
    hatMetrics: assets.hatMetrics,
    bestScore: readBestScore(),
    onEvent: handleGameEvent,
  });
  renderer = new GameRenderer(view.canvas, assets, {
    reducedMotion: reducedMotionQuery.matches,
  });
  input = new InputController({
    keyboardTarget: window,
    surface: view.canvas,
    leftButton: view.leftButton,
    rightButton: view.rightButton,
    onDirectionChange: direction => engine.setDirection(direction),
    onPointerTarget: x => engine.setPointerTarget(x),
    onPause: handlePauseAction,
    onPrimary: handlePrimaryAction,
    getCameraZoom: () => renderer.getCurrentZoom(),
  });

  const onReducedMotionChange = event => renderer.setReducedMotion(event.matches);
  reducedMotionQuery.addEventListener('change', onReducedMotionChange);

  const onVisibilityChange = () => {
    if (document.hidden && engine.phase === 'playing') {
      engine.pause();
      const snapshot = engine.getSnapshot();
      view.setPhase(snapshot);
      view.update(snapshot);
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrame);
    input.destroy();
    renderer.destroy();
    view.destroy();
    reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  }, { once: true });

  const snapshot = engine.getSnapshot();
  view.setReady(snapshot);
  renderer.render(snapshot, performance.now());
  previousFrameTime = performance.now();
  animationFrame = requestAnimationFrame(frame);
}

bootstrap().catch(error => {
  failedToLoad = true;
  console.error('Hat Stacker failed to start.', error);
  view.showError('Buddy or one of the hat sprites could not be loaded. Reload to try again.');
});
