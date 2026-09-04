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

const TOPPLE_EXPOSURE_SECONDS = 0.3;
const JUMP_DURATION_SECONDS = 0.28;
const JUMP_COOLDOWN_SECONDS = 0.1;
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

export function getMovementProfile(hatCount, sprinting = false) {
  const maximumSpeed = Math.max(238, 470 - hatCount * 15);
  const acceleration = Math.max(760, 1_900 - hatCount * 52);
  return sprinting
    ? {
        maximumSpeed: maximumSpeed * 1.45,
        acceleration: acceleration * 1.2,
      }
    : { maximumSpeed, acceleration };
}

export function getBalanceLimit(hatCount, stackHeight) {
  return Math.max(0.31, 0.58 - hatCount * 0.0105 - stackHeight * 0.00036);
}

export function getCatchWindow(fallingWidth, surfaceWidth, hatCount) {
  return clamp((fallingWidth + surfaceWidth) * 0.32 - hatCount * 0.18, 32, 58);
}

export function getCameraZoom(hatCount) {
  return Math.max(0.5, 1 - Math.max(0, hatCount - 3) * 0.031);
}

export function getSpawnDelay(hatCount, randomValue = 0.5) {
  const baseDelay = Math.max(0.3, 0.72 - hatCount * 0.024);
  return clamp(baseDelay * (0.82 + clamp(randomValue, 0, 1) * 0.36), 0.24, 0.85);
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
    this.spawnDelay = 0;
    this.nextSpawnProgressBase = 0;
    this.toppleExposure = 0;
    this.celebrationTimer = 0;
    this.jumpTimer = 0;
    this.jumpCooldown = 0;
    this.inputDirection = 0;
    this.inputSprint = false;
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
    this._prepareNextDrop();
    this._emit({ type: 'phase', phase: this.phase });
  }

  start() {
    this.reset();
    this.phase = 'playing';
    this.spawnTimer = 0.55;
    this.spawnDelay = this.spawnTimer;
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

  setDirection(direction, sprinting = false) {
    this.inputDirection = clamp(direction, -1, 1);
    this.inputSprint = this.inputDirection !== 0 && sprinting;
    if (this.inputDirection !== 0) {
      this.pointerTarget = undefined;
    }
  }

  setPointerTarget(x) {
    this.pointerTarget = x === undefined ? undefined : clamp(x, 0, WORLD.width);
    if (this.pointerTarget !== undefined) {
      this.inputSprint = false;
    }
  }

  jump() {
    if (this.phase !== 'playing' || this.jumpCooldown > 0) {
      return false;
    }

    this.jumpTimer = JUMP_DURATION_SECONDS;
    this.jumpCooldown = JUMP_COOLDOWN_SECONDS;
    this.balance.angle *= 0.68;
    this.balance.angularVelocity *= 0.5;
    this.toppleExposure *= 0.25;
    for (const item of this.stack) {
      item.offset *= 0.9;
      item.restingRotation *= 0.75;
    }
    return true;
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

    const usesPreparedDrop = typeId === undefined;
    const type = typeId ? this.typeById.get(typeId) : this.nextHat;
    if (!type) {
      throw new Error(`Unknown hat type: ${typeId}`);
    }
    const metrics = this._metricsFor(type.id);
    const defaultX = usesPreparedDrop
      ? this.nextSpawnX ?? this._getFairSpawnX(metrics.width)
      : this._getFairSpawnX(metrics.width);
    const cameraZoom = getCameraZoom(this.stack.length);
    const visibleTopY = WORLD.groundY - WORLD.groundY / cameraZoom;
    const defaultBottomY = visibleTopY - Math.max(12, metrics.height * 0.4);
    if (usesPreparedDrop) {
      this._prepareNextDrop();
    }

    this.fallingHat = {
      type,
      x: x ?? defaultX,
      originX: x ?? defaultX,
      bottomY: bottomY ?? defaultBottomY,
      previousBottomY: bottomY ?? defaultBottomY,
      spawnBottomY: bottomY ?? defaultBottomY,
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
      this.jumpTimer = Math.max(0, this.jumpTimer - delta);
      this.jumpCooldown = Math.max(0, this.jumpCooldown - delta);
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
      y: WORLD.groundY
        - WORLD.petSpriteHeight
        + WORLD.stackBaseOffsetY
        - this.getJumpOffset(),
    };
  }

  getJumpOffset(delayRatio = 0) {
    if (this.jumpTimer <= 0) {
      return 0;
    }
    const progress = 1 - this.jumpTimer / JUMP_DURATION_SECONDS;
    const delayedProgress = clamp(
      (progress - delayRatio) / (1 - delayRatio),
      0,
      1,
    );
    return Math.sin(delayedProgress * Math.PI) * 14;
  }

  getStackLayout() {
    let localX = 0;
    let height = 0;
    const petJumpOffset = this.getJumpOffset();
    const wobbleAmplitude = Math.min(12, Math.max(0, this.stack.length - 2) * 0.65);
    const wobblePhase = this.elapsed * (2.4 + Math.min(16, this.stack.length) * 0.025);
    const velocityFlex = clamp(-this.balance.angularVelocity * 4, -7, 7);
    let topLocalX = 0;
    let topLocalY = 0;
    const items = this.stack.map((item, index) => {
      localX += item.offset;
      const heightRatio = (index + 1) / this.stack.length;
      const flexRatio = heightRatio * heightRatio;
      const jumpDelay = Math.min(0.55, (index + 1) * 0.055);
      const hatJumpOffset = this.getJumpOffset(jumpDelay) * (1 + heightRatio * 0.35);
      const jumpLag = petJumpOffset - hatJumpOffset;
      const jumpTwist = Math.sin((index + 1) * 1.7)
        * (hatJumpOffset / 14)
        * 0.11
        * heightRatio;
      const flex = (
        Math.sin(wobblePhase + index * 0.55) * wobbleAmplitude
        + velocityFlex
      ) * flexRatio;
      const layoutItem = {
        ...item,
        localX: localX + flex,
        localBottomY: -height + jumpLag,
        localRotation: item.restingRotation
          + Math.sin(wobblePhase + index * 0.7) * 0.05 * heightRatio
          + clamp(this.balance.angularVelocity * 0.06, -0.1, 0.1) * heightRatio
          + jumpTwist,
      };
      topLocalX = layoutItem.localX;
      topLocalY = layoutItem.localBottomY - item.metrics.stackStep;
      height += item.metrics.stackStep;
      return layoutItem;
    });

    return {
      items,
      height,
      topLocalX,
      topLocalY,
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
      pet: {
        ...this.pet,
        jumpOffset: this.getJumpOffset(),
      },
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
      nextSpawnX: this.nextSpawnX,
      nextSpawnProgress: this._getNextSpawnProgress(),
      difficulty: this._getDifficultyLabel(),
    };
  }

  _updatePlayer(delta) {
    const profile = getMovementProfile(this.stack.length, this.inputSprint);
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
    const spring = Math.max(3.8, 9.4 - this.stack.length * 0.23);
    const damping = Math.max(0.95, 3.1 - this.stack.length * 0.07);
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
    const targetLocalX = stackTop.localX + signedDistance * Math.cos(this.balance.angle);
    const maximumLandingOffset = clamp(
      Math.min(hat.metrics.width, stackTop.surfaceWidth) * 0.44,
      16,
      26,
    );
    const item = {
      type: hat.type,
      metrics: hat.metrics,
      offset: 0,
      restingRotation: 0,
    };

    this.stack.push(item);
    const initialLocalX = this.getStackLayout().items.at(-1).localX;
    item.offset = clamp(
      targetLocalX - initialLocalX,
      -maximumLandingOffset,
      maximumLandingOffset,
    );
    const landingRatio = item.offset / maximumLandingOffset;
    this.balance.angularVelocity += landingRatio * 0.28;
    const shiftedLocalX = this.getStackLayout().items.at(-1).localX;
    item.offset = clamp(
      item.offset + targetLocalX - shiftedLocalX,
      -maximumLandingOffset,
      maximumLandingOffset,
    );
    item.restingRotation = clamp(
      (item.offset / maximumLandingOffset) * 0.075 + (this.random() - 0.5) * 0.025,
      -0.09,
      0.09,
    );
    this.score += 1;
    this.bestScore = Math.max(this.bestScore, this.score);
    this.celebrationTimer = perfect ? 0.72 : 0.2;
    this.fallingHat = undefined;
    this.spawnTimer = getSpawnDelay(this.stack.length, this.random());
    this.spawnDelay = this.spawnTimer;
    this.nextSpawnProgressBase = 0.65;
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
      this.toppleExposure = Math.max(0, this.toppleExposure - delta * 3.2);
    }
  }

  _triggerGameOver(reason, missedHat) {
    if (this.phase !== 'playing') {
      return;
    }

    this.phase = 'gameover';
    this.gameOverReason = reason;
    this.inputDirection = 0;
    this.inputSprint = false;
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
      const horizontalSpeed = reason === 'topple'
        ? 90 + index * 16
        : 58 + index * 12;
      return {
        type: item.type,
        metrics: item.metrics,
        x: center.x,
        y: center.y,
        vx: direction * horizontalSpeed + (this.random() - 0.5) * (reason === 'topple' ? 90 : 42),
        vy: reason === 'topple' ? -190 - index * 10 : -110 - index * 8,
        rotation: this.balance.angle + item.localRotation,
        rotationVelocity: direction * (
          reason === 'topple'
            ? 2.6 + this.random() * 3.4
            : 1.4 + this.random() * 2
        ),
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

  _prepareNextDrop() {
    this.nextHat = this._takeHatFromBag();
    this.nextSpawnX = this._getFairSpawnX(this._metricsFor(this.nextHat.id).width);
    this.nextSpawnProgressBase = 0;
  }

  _getNextSpawnProgress() {
    if (!Number.isFinite(this.nextSpawnX)) {
      return 0;
    }
    if (this.fallingHat) {
      const top = this.getStackTop();
      const fallDistance = top.y - this.fallingHat.spawnBottomY;
      if (fallDistance <= 0) {
        return 0;
      }
      return clamp(
        ((this.fallingHat.bottomY - this.fallingHat.spawnBottomY) / fallDistance) * 0.65,
        0,
        0.65,
      );
    }
    if (this.spawnDelay <= 0) {
      return 1;
    }
    const timerProgress = 1 - clamp(this.spawnTimer / this.spawnDelay, 0, 1);
    return this.nextSpawnProgressBase + (1 - this.nextSpawnProgressBase) * timerProgress;
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
