import { getCameraZoom, WORLD, rotateLocalPoint } from './engine.js';

const STAR_COLORS = ['#163854', '#1d4d68', '#26667c', '#2b8190'];
const PARTICLE_COLORS = ['#ffcc0f', '#24bfa5', '#23a8f2', '#ff8f40', '#f778ba'];

function createSeededValue(index, salt) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function frameAtTime(frameDurations, elapsedMilliseconds) {
  const totalDuration = frameDurations.reduce((sum, duration) => sum + duration, 0);
  const time = elapsedMilliseconds % totalDuration;
  let frameEnd = 0;
  for (let index = 0; index < frameDurations.length; index += 1) {
    frameEnd += frameDurations[index];
    if (time < frameEnd) {
      return index;
    }
  }
  return frameDurations.length - 1;
}

export class GameRenderer {
  constructor(canvas, assets, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.assets = assets;
    this.reducedMotion = reducedMotion;
    this.context = canvas.getContext('2d');
    if (!this.context) {
      throw new Error('Hat Stacker requires Canvas 2D support.');
    }

    this.context.imageSmoothingEnabled = false;
    this.particles = [];
    this.previousTimestamp = 0;
    this.cameraZoom = 1;
    this.stars = Array.from({ length: 44 }, (_, index) => ({
      x: createSeededValue(index, 1) * WORLD.width,
      y: 36 + createSeededValue(index, 2) * 330,
      size: createSeededValue(index, 3) > 0.78 ? 4 : 2,
      color: STAR_COLORS[index % STAR_COLORS.length],
      phase: createSeededValue(index, 4) * Math.PI * 2,
    }));

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  setReducedMotion(reducedMotion) {
    this.reducedMotion = reducedMotion;
  }

  resize() {
    const rectangle = this.canvas.getBoundingClientRect();
    const width = rectangle.width || WORLD.width;
    const height = rectangle.height || WORLD.height;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const targetWidth = Math.round(width * pixelRatio);
    const targetHeight = Math.round(height * pixelRatio);
    if (this.canvas.width !== targetWidth || this.canvas.height !== targetHeight) {
      this.canvas.width = targetWidth;
      this.canvas.height = targetHeight;
    }
  }

  celebrate(stackTop, perfect) {
    const count = perfect ? 18 : 10;
    for (let index = 0; index < count; index += 1) {
      const angle = Math.PI * (1.08 + (index / Math.max(1, count - 1)) * 0.84);
      const speed = 70 + Math.random() * 120;
      this.particles.push({
        x: stackTop.x,
        y: stackTop.y + 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.48 + Math.random() * 0.32,
        age: 0,
        size: Math.random() > 0.7 ? 5 : 3,
        color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
      });
    }
  }

  render(snapshot, timestamp) {
    const delta = this.previousTimestamp === 0
      ? 0
      : Math.min(0.05, (timestamp - this.previousTimestamp) / 1000);
    this.previousTimestamp = timestamp;

    const context = this.context;
    const scaleX = this.canvas.width / WORLD.width;
    const scaleY = this.canvas.height / WORLD.height;
    context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    context.clearRect(0, 0, WORLD.width, WORLD.height);
    context.imageSmoothingEnabled = false;

    this._drawSky(context, timestamp, snapshot);
    const cameraHatCount = snapshot.phase === 'gameover'
      ? Math.max(snapshot.stack.length, snapshot.debris.length)
      : snapshot.stack.length;
    const targetZoom = getCameraZoom(cameraHatCount);
    this.cameraZoom = this.reducedMotion
      ? targetZoom
      : this.cameraZoom + (targetZoom - this.cameraZoom) * (1 - Math.exp(-delta * 4.5));

    context.save();
    context.translate(WORLD.width / 2, WORLD.groundY);
    context.scale(this.cameraZoom, this.cameraZoom);
    context.translate(-WORLD.width / 2, -WORLD.groundY);
    this._drawStackGuide(context, snapshot);
    this._drawGround(context);
    this._drawFallingHat(context, snapshot.fallingHat);
    this._drawDebris(context, snapshot.debris);
    this._drawPetShadow(context, snapshot.pet.x);
    this._drawPet(context, snapshot, timestamp);
    this._drawStack(context, snapshot);
    this._drawParticles(context, delta);
    context.restore();
    this._drawSpawnIndicator(context, snapshot, timestamp);
    this._drawDanger(context, snapshot.balance.ratio);
  }

  getCurrentZoom() {
    return this.cameraZoom;
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.particles = [];
  }

  _drawSky(context, timestamp, snapshot) {
    const gradient = context.createLinearGradient(0, 0, 0, WORLD.height);
    gradient.addColorStop(0, '#07111b');
    gradient.addColorStop(0.62, '#0b2030');
    gradient.addColorStop(1, '#102938');
    context.fillStyle = gradient;
    context.fillRect(0, 0, WORLD.width, WORLD.height);

    const glow = context.createRadialGradient(
      WORLD.width * 0.5,
      WORLD.height * 0.74,
      20,
      WORLD.width * 0.5,
      WORLD.height * 0.74,
      440,
    );
    glow.addColorStop(0, 'rgba(35, 168, 242, 0.13)');
    glow.addColorStop(0.5, 'rgba(36, 191, 165, 0.05)');
    glow.addColorStop(1, 'rgba(7, 17, 27, 0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, WORLD.width, WORLD.height);

    context.save();
    context.globalAlpha = 0.5;
    for (const star of this.stars) {
      const twinkle = this.reducedMotion
        ? 0.7
        : 0.58 + Math.sin(timestamp * 0.0015 + star.phase) * 0.2;
      context.globalAlpha = twinkle;
      context.fillStyle = star.color;
      context.fillRect(
        Math.round(star.x),
        Math.round(star.y),
        star.size,
        star.size,
      );
    }

    context.restore();

    context.strokeStyle = 'rgba(48, 112, 139, 0.12)';
    context.lineWidth = 1;
    for (let y = 92; y < WORLD.groundY; y += 56) {
      context.beginPath();
      context.moveTo(0, y + 0.5);
      context.lineTo(WORLD.width, y + 0.5);
      context.stroke();
    }

    if (snapshot.phase === 'ready') {
      const hatAsset = this.assets.hats.get(snapshot.nextHat.id);
      if (hatAsset) {
        const bob = this.reducedMotion ? 0 : Math.sin(timestamp * 0.0022) * 6;
        this._drawHat(context, hatAsset, WORLD.width / 2, 210 + bob, -0.05);
      }
    }
  }

  _drawSpawnIndicator(context, snapshot, timestamp) {
    if (
      snapshot.phase !== 'playing'
      || snapshot.fallingHat?.passedCatchLine
      || !Number.isFinite(snapshot.nextSpawnX)
    ) {
      return;
    }

    const zoneWidth = WORLD.width / 5;
    const zoneIndex = Math.min(4, Math.floor(snapshot.nextSpawnX / zoneWidth));
    const roughWorldX = (zoneIndex + 0.5) * zoneWidth;
    const progress = Math.max(0, Math.min(1, snapshot.nextSpawnProgress ?? 0));
    const accuracyProgress = progress * progress * (3 - 2 * progress);
    const indicatorWorldX = roughWorldX
      + (snapshot.nextSpawnX - roughWorldX) * accuracyProgress;
    const wideBandWidth = Math.max(80, zoneWidth * this.cameraZoom * 0.75);
    const bandWidth = wideBandWidth + (32 - wideBandWidth) * accuracyProgress;
    const screenX = Math.max(
      bandWidth / 2,
      Math.min(
        WORLD.width - bandWidth / 2,
        WORLD.width / 2 + (indicatorWorldX - WORLD.width / 2) * this.cameraZoom,
      ),
    );
    const pulse = this.reducedMotion ? 0 : Math.sin(timestamp * 0.008) * 2;

    context.save();
    context.translate(screenX, 9 + pulse);
    context.globalAlpha = this.reducedMotion
      ? 0.5
      : 0.43 + Math.sin(timestamp * 0.008) * 0.1;
    context.fillStyle = '#75beff';
    context.fillRect(-bandWidth / 2, -2, bandWidth, 3);
    context.restore();
  }

  _drawGround(context) {
    context.fillStyle = '#0a131d';
    context.fillRect(-WORLD.width, WORLD.groundY, WORLD.width * 3, WORLD.height - WORLD.groundY);
    context.fillStyle = '#18384b';
    context.fillRect(-WORLD.width, WORLD.groundY, WORLD.width * 3, 3);
    context.fillStyle = '#23576d';
    for (let x = -WORLD.width; x < WORLD.width * 2; x += 24) {
      context.fillRect(x, WORLD.groundY, 12, 3);
    }

  }

  _drawStackGuide(context, snapshot) {
    if (snapshot.stack.length < 2 || snapshot.phase === 'gameover') {
      return;
    }
    const base = {
      x: snapshot.pet.x,
      y: WORLD.groundY - WORLD.petSpriteHeight + WORLD.stackBaseOffsetY,
    };
    const top = rotateLocalPoint(
      snapshot.stackLayout.topLocalX,
      snapshot.stackLayout.topLocalY,
      snapshot.balance.angle,
      base.x,
      base.y,
    );

    context.save();
    context.setLineDash([4, 8]);
    context.lineWidth = 1;
    context.strokeStyle = Math.abs(snapshot.balance.ratio) > 0.72
      ? 'rgba(255, 143, 64, 0.5)'
      : 'rgba(83, 181, 208, 0.22)';
    context.beginPath();
    context.moveTo(base.x, base.y + 8);
    context.lineTo(top.x, top.y - 12);
    context.stroke();
    context.restore();
  }

  _drawPetShadow(context, x) {
    context.save();
    context.scale(1, 0.35);
    const gradient = context.createRadialGradient(x, WORLD.groundY * 2.84, 3, x, WORLD.groundY * 2.84, 36);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, WORLD.groundY * 2.84, 36, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  _drawPet(context, snapshot, timestamp) {
    const sprite = this.assets.petSprites[snapshot.petMood] ?? this.assets.petSprites.idle;
    const image = this.reducedMotion ? sprite.staticImage : sprite.animatedImage;
    const frame = this.reducedMotion ? 0 : frameAtTime(sprite.frameDurations, timestamp);
    const speedRatio = Math.min(1, Math.abs(snapshot.pet.vx) / 420);
    const bob = this.reducedMotion ? 0 : Math.sin(timestamp * 0.03) * speedRatio * 2;
    const displayScale = WORLD.petSpriteWidth / sprite.frameWidth;
    const displayWidth = sprite.frameWidth * displayScale;
    const displayHeight = sprite.frameHeight * displayScale;
    const sourceX = frame * sprite.frameWidth;
    const drawX = -displayWidth / 2;
    const drawY = -displayHeight + bob;

    context.save();
    context.translate(snapshot.pet.x, WORLD.groundY);
    if (snapshot.pet.facing === 'left') {
      context.scale(-1, 1);
    }
    context.drawImage(
      image,
      sourceX,
      0,
      sprite.frameWidth,
      sprite.frameHeight,
      drawX,
      drawY,
      displayWidth,
      displayHeight,
    );
    if (snapshot.petExpression !== 'dizzy') {
      this._drawPetFace(context, snapshot, timestamp, {
        drawX,
        drawY,
        displayScale,
      });
    }
    context.restore();
  }

  _drawPetFace(context, snapshot, timestamp, { drawX, drawY, displayScale }) {
    const expression = snapshot.petExpression;
    const fallingHat = snapshot.fallingHat;
    const worldTargetOffset = fallingHat
      ? Math.max(-4, Math.min(4, (fallingHat.x - snapshot.pet.x) / 45))
      : Math.max(-3, Math.min(3, -snapshot.balance.ratio * 3));
    const targetOffset = snapshot.pet.facing === 'left'
      ? -worldTargetOffset
      : worldTargetOffset;
    const blink = expression === 'calm'
      && !this.reducedMotion
      && timestamp % 3_200 > 3_080;

    const drawPixelRect = (x, y, width, height, color = '#191a1b') => {
      context.fillStyle = color;
      context.fillRect(
        Math.round(drawX + x * displayScale),
        Math.round(drawY + y * displayScale),
        Math.max(1, Math.round(width * displayScale)),
        Math.max(1, Math.round(height * displayScale)),
      );
    };

    if (snapshot.petMood === 'worry') {
      drawPixelRect(79, 48, 5, 8, '#8ee8ff');
      drawPixelRect(83, 57, 4, 5, '#52bddc');
      if (expression === 'panic') {
        drawPixelRect(25, 53, 4, 6, '#8ee8ff');
        drawPixelRect(22, 60, 3, 4, '#52bddc');
      }
      return;
    }

    if (blink) {
      drawPixelRect(39, 69, 9, 3);
      drawPixelRect(63, 69, 9, 3);
      return;
    }

    const eyeHeight = expression === 'panic' ? 7 : expression === 'worried' ? 11 : 14;
    const eyeY = expression === 'panic' ? 66 : 64;
    drawPixelRect(40 + targetOffset, eyeY, 8, eyeHeight);
    drawPixelRect(64 + targetOffset, eyeY, 8, eyeHeight);

  }

  _drawStack(context, snapshot) {
    if (snapshot.stackLayout.items.length === 0) {
      return;
    }

    const baseY = WORLD.groundY - WORLD.petSpriteHeight + WORLD.stackBaseOffsetY;
    context.save();
    context.translate(snapshot.pet.x, baseY);
    context.rotate(snapshot.balance.angle);
    for (const item of snapshot.stackLayout.items) {
      const asset = this.assets.hats.get(item.type.id);
      if (!asset) {
        continue;
      }
      this._drawHat(
        context,
        asset,
        item.localX,
        item.localBottomY,
        item.localRotation,
      );
    }
    context.restore();
  }

  _drawFallingHat(context, hat) {
    if (!hat) {
      return;
    }
    const asset = this.assets.hats.get(hat.type.id);
    if (!asset) {
      return;
    }

    context.save();
    context.globalAlpha = 0.16;
    context.fillStyle = '#78d8ef';
    const trailLength = Math.min(96, 18 + hat.verticalVelocity * 0.2);
    for (let index = 0; index < 5; index += 1) {
      const size = Math.max(2, 6 - index);
      context.fillRect(
        Math.round(hat.x - size / 2),
        Math.round(hat.bottomY - hat.metrics.height - 18 - index * (trailLength / 5)),
        size,
        size,
      );
    }
    context.restore();
    this._drawHat(context, asset, hat.x, hat.bottomY, hat.rotation);
  }

  _drawDebris(context, debris) {
    for (const item of debris) {
      const asset = this.assets.hats.get(item.type.id);
      if (asset) {
        this._drawHatCentered(context, asset, item.x, item.y, item.rotation);
      }
    }
  }

  _drawHat(context, asset, centerX, bottomY, rotation = 0) {
    const { bounds, metrics } = asset;
    context.save();
    context.translate(centerX, bottomY);
    context.rotate(rotation);
    context.drawImage(
      asset.canvas,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      -metrics.width / 2,
      -metrics.height,
      metrics.width,
      metrics.height,
    );
    context.restore();
  }

  _drawHatCentered(context, asset, centerX, centerY, rotation = 0) {
    const { bounds, metrics } = asset;
    context.save();
    context.translate(centerX, centerY);
    context.rotate(rotation);
    context.drawImage(
      asset.canvas,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      -metrics.width / 2,
      -metrics.height / 2,
      metrics.width,
      metrics.height,
    );
    context.restore();
  }

  _drawParticles(context, delta) {
    if (this.reducedMotion) {
      this.particles = [];
      return;
    }

    for (const particle of this.particles) {
      particle.age += delta;
      particle.vy += 250 * delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
    }
    this.particles = this.particles.filter(particle => particle.age < particle.life);

    for (const particle of this.particles) {
      context.globalAlpha = 1 - particle.age / particle.life;
      context.fillStyle = particle.color;
      context.fillRect(
        Math.round(particle.x),
        Math.round(particle.y),
        particle.size,
        particle.size,
      );
    }
    context.globalAlpha = 1;
  }

  _drawDanger(context, balanceRatio) {
    const danger = Math.max(0, Math.abs(balanceRatio) - 0.64) / 0.76;
    if (danger <= 0) {
      return;
    }

    const gradient = context.createRadialGradient(
      WORLD.width / 2,
      WORLD.height / 2,
      200,
      WORLD.width / 2,
      WORLD.height / 2,
      620,
    );
    gradient.addColorStop(0, 'rgba(255, 92, 92, 0)');
    gradient.addColorStop(1, `rgba(255, 92, 92, ${danger * 0.24})`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, WORLD.width, WORLD.height);
  }
}
