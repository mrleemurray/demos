import { HAT_CATALOG } from './catalog.js';

export const WORLD = Object.freeze({
  width: 960,
  height: 600,
  groundY: 548,
  petSpriteWidth: 64,
  petSpriteHeight: 64,
  stackBaseOffsetY: 33,
});

export const DEFAULT_HAT_METRICS = Object.freeze({
  width: 52,
  height: 24,
  stackStep: 16,
});

const TOPPLE_EXPOSURE_SECONDS = 0.14;
const GRAVITY = 980;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function moveToward(value, target, amount) {
  if (value < target) {
    return Math.min(value + amount, target);
  }
  return Math.max(value - amount, target);
}

export function getMovementProfile(hatCount) {
  return {
    maximumSpeed: Math.max(238, 470 - hatCount * 15),
    acceleration: Math.max(760, 1_900 - hatCount * 52),
  };
}

export function getBalanceLimit(hatCount, stackHeight) {
  return Math.max(0.22, 0.54 - hatCount * 0.012 - stackHeight * 0.00045);
}

export function getCatchWindow(fallingWidth, surfaceWidth, hatCount) {
  return clamp(Math.min(fallingWidth, surfaceWidth) * 0.58 - hatCount * 0.35, 28, 54);
}

export function getCameraZoom(hatCount) {
  return Math.max(0.58, 1 - Math.max(0, hatCount - 3) * 0.027);
}

export function rotateLocalPoint(localX, localY, angle, originX, originY) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return {
    x: originX + localX * cosine - localY * sine,
    y: originY + localX * sine + localY * cosine,
  };
}

export class HatStackerEngine {
  constructor({
    catalog = HAT_CATALOG,
    hatMetrics = new Map(),
    random = Math.random,
    onEvent = () => {},
    bestScore = 0,
  } = {}) {
    if (catalog.length === 0) {
      throw new Error('Hat Stacker requires at least one hat type.');
    }

    this.catalog = catalog;
    this.typeById = new Map(catalog.map(type => [type.id, type]));
    this.random = random;
    this.onEvent = onEvent;
    this.bestScore = Math.max(0, Number(bestScore) || 0);
    this.metrics = new Map(
      catalog.map(type => [type.id, hatMetrics.get(type.id) ?? DEFAULT_HAT_METRICS]),
    );
    this._hatBag = [];
    this._lastHatId = undefined;
    this.reset();
  }

  reset() {
    this.phase = 'ready';
    this.gameOverReason = undefined;
    this.score = 0;
    this.elapsed = 0;
    this.spawnTimer = 0;
    this.toppleExposure = 0;
    this.celebrationTimer = 0;
    this.inputDirection = 0;
    this.pointerTarget = undefined;
    this.lastAcceleration = 0;
    this.pet = {
      x: WORLD.width / 2,
      vx: 0,
      facing: 'right',
    };
    this.balance = {
      angle: 0,
      angularVelocity: 0,
    };
    this.stack = [];
    this.fallingHat = undefined;
    this.debris = [];
    this._hatBag = [];
    this.nextHat = this._takeHatFromBag();
    this._emit({ type: 'phase', phase: this.phase });
  }

  start() {
    this.reset();
    this.phase = 'playing';
    this.spawnTimer = 0.55;
    this._emit({ type: 'phase', phase: this.phase });
  }

  pause() {
    if (this.phase !== 'playing') {
      return;
    }
    this.phase = 'paused';
    this.pointerTarget = undefined;
    this._emit({ type: 'phase', phase: this.phase });
  }

  resume() {
    if (this.phase !== 'paused') {
      return;
    }
    this.phase = 'playing';
    this._emit({ type: 'phase', phase: this.phase });
  }

  togglePause() {
    if (this.phase === 'playing') {
      this.pause();
    } else if (this.phase === 'paused') {
      this.resume();
    }
  }

  setDirection(direction) {
    this.inputDirection = clamp(direction, -1, 1);
    if (this.inputDirection !== 0) {
      this.pointerTarget = undefined;
    }
  }

  setPointerTarget(x) {
    this.pointerTarget = x === undefined ? undefined : clamp(x, 0, WORLD.width);
  }

  spawnHat({
    typeId,
    x,
    bottomY,
    verticalVelocity,
    gravity,
    maximumFallSpeed,
    horizontalVelocity,
    swayAmplitude,
    swayFrequency,
  } = {}) {
    if (this.phase !== 'playing') {
      throw new Error('Hats can only be spawned while a game is in progress.');
    }
    if (this.fallingHat) {
      throw new Error('Cannot spawn a second hat while one is already falling.');
    }

    const type = typeId ? this.typeById.get(typeId) : this.nextHat;
    if (!type) {
      throw new Error(`Unknown hat type: ${typeId}`);
    }
    if (!typeId) {
      this.nextHat = this._takeHatFromBag();
    }
    const metrics = this._metricsFor(type.id);
    const defaultX = this._getFairSpawnX(metrics.width);
    const cameraZoom = getCameraZoom(this.stack.length);
    const visibleTopY = WORLD.groundY - WORLD.groundY / cameraZoom;
    const defaultBottomY = visibleTopY - Math.max(12, metrics.height * 0.4);

    this.fallingHat = {
      type,
      x: x ?? defaultX,
      originX: x ?? defaultX,
      bottomY: bottomY ?? defaultBottomY,
      previousBottomY: bottomY ?? defaultBottomY,
      verticalVelocity: verticalVelocity ?? 68 + this.stack.length * 3.1,
      gravity: gravity ?? Math.min(370, 245 + this.stack.length * 6.9),
      maximumFallSpeed: maximumFallSpeed ?? Math.min(490, 342 + this.stack.length * 9.7),
      horizontalVelocity: horizontalVelocity ?? (this.random() - 0.5) * 24,
      swayAmplitude: swayAmplitude ?? 6 + this.random() * 12,
      swayFrequency: swayFrequency ?? 1.5 + this.random() * 1.2,
      swayPhase: this.random() * Math.PI * 2,
      elapsed: 0,
      rotation: (this.random() - 0.5) * 0.18,
      rotationVelocity: (this.random() - 0.5) * 0.45,
      passedCatchLine: false,
      metrics,
    };
    this._emit({ type: 'drop', hat: type });
    return this.fallingHat;
  }

  step(deltaSeconds) {
    const delta = clamp(deltaSeconds, 0, 0.05);
    if (delta === 0) {
      return this.getSnapshot();
    }

    if (this.phase === 'playing') {
      this.elapsed += delta;
      this.celebrationTimer = Math.max(0, this.celebrationTimer - delta);
      this._updatePlayer(delta);
      this._updateBalance(delta);
      this._updateFallingHat(delta);
      if (this.phase === 'playing') {
        this._updateSpawn(delta);
        this._checkTopple(delta);
      }
    } else if (this.phase === 'gameover') {
      this._updateDebris(delta);
    }

    return this.getSnapshot();
  }

  getStackBase() {
    return {
      x: this.pet.x,
      y: WORLD.groundY - WORLD.petSpriteHeight + WORLD.stackBaseOffsetY,
    };
  }

  getStackLayout() {
    let localX = 0;
    let height = 0;
    const items = this.stack.map(item => {
      localX += item.offset;
      const layoutItem = {
        ...item,
        localX,
        localBottomY: -height,
      };
      height += item.metrics.stackStep;
      return layoutItem;
    });

    return {
      items,
      height,
      topLocalX: localX,
      topLocalY: -height,
      surfaceWidth: items.at(-1)?.metrics.width ?? 66,
    };
  }

  getStackTop() {
    const layout = this.getStackLayout();
    const base = this.getStackBase();
    const point = rotateLocalPoint(
      layout.topLocalX,
      layout.topLocalY,
      this.balance.angle,
      base.x,
      base.y,
    );
    return {
      ...point,
      localX: layout.topLocalX,
      localY: layout.topLocalY,
      surfaceWidth: layout.surfaceWidth,
      stackHeight: layout.height,
    };
  }

  getEffectiveTilt() {
    const layout = this.getStackLayout();
    if (layout.height === 0) {
      return this.balance.angle;
    }
    const offsetLean = (layout.topLocalX / Math.max(72, layout.height)) * 0.72;
    return this.balance.angle + offsetLean;
  }

  getSnapshot() {
    const layout = this.getStackLayout();
    const balanceLimit = getBalanceLimit(this.stack.length, layout.height);
    const effectiveTilt = this.getEffectiveTilt();
    const balanceRatio = clamp(effectiveTilt / balanceLimit, -1.4, 1.4);
    const absoluteBalanceRatio = Math.abs(balanceRatio);
    return {
      phase: this.phase,
      gameOverReason: this.gameOverReason,
      score: this.score,
      bestScore: this.bestScore,
      elapsed: this.elapsed,
      pet: { ...this.pet },
      petMood: this.phase === 'gameover'
        ? 'dizzy'
        : absoluteBalanceRatio >= 0.4
          ? 'worry'
          : this.celebrationTimer > 0
            ? 'clapping'
            : 'idle',
      petExpression: this.phase === 'gameover'
        ? 'dizzy'
        : absoluteBalanceRatio >= 0.72
          ? 'panic'
          : absoluteBalanceRatio >= 0.4
            ? 'worried'
            : 'calm',
      stack: this.stack,
      stackLayout: layout,
      fallingHat: this.fallingHat,
      debris: this.debris,
      balance: {
        ...this.balance,
        effectiveTilt,
        limit: balanceLimit,
        ratio: balanceRatio,
      },
      nextHat: this.nextHat,
      difficulty: this._getDifficultyLabel(),
    };
  }

  _updatePlayer(delta) {
    const profile = getMovementProfile(this.stack.length);
    let desiredDirection = this.inputDirection;

    if (this.pointerTarget !== undefined) {
      const distance = this.pointerTarget - this.pet.x;
      desiredDirection = Math.abs(distance) < 4 ? 0 : clamp(distance / 42, -1, 1);
    }

    const previousVelocity = this.pet.vx;
    const targetVelocity = desiredDirection * profile.maximumSpeed;
    const acceleration = profile.acceleration * (desiredDirection === 0 ? 1.35 : 1);
    this.pet.vx = moveToward(this.pet.vx, targetVelocity, acceleration * delta);
    this.pet.x += this.pet.vx * delta;

    const boundary = WORLD.petSpriteWidth / 2 + 6;
    const boundedX = clamp(this.pet.x, boundary, WORLD.width - boundary);
    if (boundedX !== this.pet.x) {
      this.pet.vx = 0;
      this.pet.x = boundedX;
    }

    this.lastAcceleration = (this.pet.vx - previousVelocity) / delta;
    if (Math.abs(this.pet.vx) > 8) {
      this.pet.facing = this.pet.vx < 0 ? 'left' : 'right';
    }
  }

  _updateBalance(delta) {
    if (this.stack.length === 0) {
      this.balance.angularVelocity *= Math.max(0, 1 - delta * 8);
      this.balance.angle *= Math.max(0, 1 - delta * 10);
      return;
    }

    const layout = this.getStackLayout();
    const load = 1 + this.stack.length * 0.09 + layout.height / 230;
    const spring = Math.max(3.1, 8.7 - this.stack.length * 0.24);
    const damping = Math.max(1.25, 3.5 - this.stack.length * 0.06);
    const accelerationTorque = -this.lastAcceleration * 0.00135 * load;
    const offsetTorque = (layout.topLocalX / Math.max(70, layout.height)) * 1.15 * load;
    const windTorque = Math.sin(this.elapsed * 1.35 + 0.7) * Math.max(0, this.stack.length - 2) * 0.005;
    const angularAcceleration =
      -spring * this.balance.angle
      - damping * this.balance.angularVelocity
      + accelerationTorque
      + offsetTorque
      + windTorque;

    this.balance.angularVelocity += angularAcceleration * delta;
    this.balance.angularVelocity = clamp(this.balance.angularVelocity, -2.8, 2.8);
    this.balance.angle += this.balance.angularVelocity * delta;
  }

  _updateFallingHat(delta) {
    const hat = this.fallingHat;
    if (!hat) {
      return;
    }

    hat.previousBottomY = hat.bottomY;
    hat.elapsed += delta;
    hat.verticalVelocity = Math.min(
      hat.maximumFallSpeed,
      hat.verticalVelocity + hat.gravity * delta,
    );
    hat.bottomY += hat.verticalVelocity * delta;
    hat.x = clamp(
      hat.originX
        + hat.horizontalVelocity * hat.elapsed
        + Math.sin(hat.elapsed * hat.swayFrequency + hat.swayPhase) * hat.swayAmplitude,
      hat.metrics.width / 2,
      WORLD.width - hat.metrics.width / 2,
    );
    hat.rotation += hat.rotationVelocity * delta;

    const top = this.getStackTop();
    if (!hat.passedCatchLine && hat.previousBottomY <= top.y && hat.bottomY >= top.y) {
      const distance = Math.abs(hat.x - top.x);
      const catchWindow = getCatchWindow(
        hat.metrics.width,
        top.surfaceWidth,
        this.stack.length,
      );
      if (distance <= catchWindow) {
        this._catchHat(hat, top, distance, catchWindow);
      } else {
        hat.passedCatchLine = true;
      }
      return;
    }

    if (hat.bottomY >= WORLD.groundY) {
      this._triggerGameOver('miss', hat);
    }
  }

  _catchHat(hat, stackTop, distance, catchWindow) {
    const signedDistance = hat.x - stackTop.x;
    const perfect = distance <= catchWindow * 0.18;
    const offset = clamp(signedDistance * 0.28 + (this.random() - 0.5) * 1.6, -11, 11);
    const item = {
      type: hat.type,
      metrics: hat.metrics,
      offset,
      restingRotation: (this.random() - 0.5) * 0.07,
    };

    this.stack.push(item);
    this.balance.angularVelocity += (signedDistance / catchWindow) * 0.38;
    this.score += 1;
    this.bestScore = Math.max(this.bestScore, this.score);
    this.celebrationTimer = perfect ? 0.72 : 0.2;
    this.fallingHat = undefined;
    this.spawnTimer = Math.max(0.3, 0.72 - this.stack.length * 0.024);
    this._emit({
      type: 'catch',
      hat: hat.type,
      perfect,
      stackSize: this.stack.length,
      score: this.score,
    });
  }

  _updateSpawn(delta) {
    if (this.fallingHat) {
      return;
    }
    this.spawnTimer -= delta;
    if (this.spawnTimer <= 0) {
      this.spawnHat();
    }
  }

  _checkTopple(delta) {
    if (this.stack.length < 2) {
      this.toppleExposure = 0;
      return;
    }

    const layout = this.getStackLayout();
    const limit = getBalanceLimit(this.stack.length, layout.height);
    if (Math.abs(this.getEffectiveTilt()) > limit) {
      this.toppleExposure += delta;
      if (this.toppleExposure >= TOPPLE_EXPOSURE_SECONDS) {
        this._triggerGameOver('topple');
      }
    } else {
      this.toppleExposure = Math.max(0, this.toppleExposure - delta * 1.8);
    }
  }

  _triggerGameOver(reason, missedHat) {
    if (this.phase !== 'playing') {
      return;
    }

    this.phase = 'gameover';
    this.gameOverReason = reason;
    this.inputDirection = 0;
    this.pointerTarget = undefined;

    const stackedHatCount = this.stack.length;
    const base = this.getStackBase();
    const layout = this.getStackLayout();
    const toppleDirection = Math.sign(this.getEffectiveTilt()) || (this.random() < 0.5 ? -1 : 1);
    this.debris = layout.items.map((item, index) => {
      const center = rotateLocalPoint(
        item.localX,
        item.localBottomY - item.metrics.height / 2,
        this.balance.angle,
        base.x,
        base.y,
      );
      const direction = reason === 'topple'
        ? toppleDirection
        : index % 2 === 0 ? -1 : 1;
      return {
        type: item.type,
        metrics: item.metrics,
        x: center.x,
        y: center.y,
        vx: direction * (58 + index * 12) + (this.random() - 0.5) * 42,
        vy: -110 - index * 8,
        rotation: this.balance.angle + item.restingRotation,
        rotationVelocity: direction * (1.4 + this.random() * 2),
        settled: false,
      };
    });
    this.stack = [];

    if (missedHat) {
      this.debris.push({
        type: missedHat.type,
        metrics: missedHat.metrics,
        x: missedHat.x,
        y: missedHat.bottomY - missedHat.metrics.height / 2,
        vx: missedHat.horizontalVelocity,
        vy: missedHat.verticalVelocity,
        rotation: missedHat.rotation,
        rotationVelocity: missedHat.rotationVelocity,
        settled: false,
      });
    }

    this.fallingHat = undefined;
    this._emit({
      type: 'gameover',
      reason,
      score: this.score,
      bestScore: this.bestScore,
      stackSize: stackedHatCount,
    });
  }

  _updateDebris(delta) {
    for (const item of this.debris) {
      if (item.settled) {
        continue;
      }
      item.vy += GRAVITY * delta;
      item.x += item.vx * delta;
      item.y += item.vy * delta;
      item.rotation += item.rotationVelocity * delta;

      const floorY = WORLD.groundY - item.metrics.height / 2;
      if (item.y >= floorY) {
        item.y = floorY;
        item.vy = -Math.abs(item.vy) * 0.24;
        item.vx *= 0.76;
        item.rotationVelocity *= 0.65;
        if (Math.abs(item.vy) < 42) {
          item.vy = 0;
          item.vx = 0;
          item.rotationVelocity = 0;
          item.settled = true;
        }
      }
    }
  }

  _getFairSpawnX(hatWidth) {
    const range = Math.min(360, 145 + this.stack.length * 18);
    const margin = Math.max(52, hatWidth / 2);
    return clamp(
      this.pet.x + (this.random() * 2 - 1) * range,
      margin,
      WORLD.width - margin,
    );
  }

  _takeHatFromBag() {
    if (this._hatBag.length === 0) {
      this._hatBag = [...this.catalog];
      for (let index = this._hatBag.length - 1; index > 0; index -= 1) {
        const target = Math.floor(this.random() * (index + 1));
        [this._hatBag[index], this._hatBag[target]] = [this._hatBag[target], this._hatBag[index]];
      }
      if (this._hatBag.at(-1)?.id === this._lastHatId && this._hatBag.length > 1) {
        [this._hatBag[0], this._hatBag[this._hatBag.length - 1]] = [
          this._hatBag[this._hatBag.length - 1],
          this._hatBag[0],
        ];
      }
    }

    const hat = this._hatBag.pop();
    this._lastHatId = hat.id;
    return hat;
  }

  _metricsFor(typeId) {
    return this.metrics.get(typeId) ?? DEFAULT_HAT_METRICS;
  }

  _getDifficultyLabel() {
    if (this.stack.length < 4) {
      return 'Breezy';
    }
    if (this.stack.length < 8) {
      return 'Wobbly';
    }
    if (this.stack.length < 12) {
      return 'Precarious';
    }
    return 'Unhinged';
  }

  _emit(event) {
    this.onEvent(event);
  }
}
