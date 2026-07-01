<template>
  <Transition name="panel">
    <div v-if="isOpen" class="aquarium-panel">
      <!-- Panel header -->
      <div class="panel-header">
        <span class="panel-title">New Session</span>
        <div class="fish-status-badge" :class="`status-${fishState}`">
          <span class="status-dot" />
          <span class="status-label">{{ statusLabel }}</span>
        </div>
      </div>

      <!-- Aquarium viewport -->
      <div class="aquarium-viewport">
        <div class="water-bg" />
        <div class="bubbles">
          <span v-for="b in bubbles" :key="b.id" class="bubble" :style="b.style" />
        </div>
        <div
          class="fish-in-tank"
          :class="[`tank-${fishState}`, { swimming: true }]"
          :style="{ color: fishColor }"
          v-html="currentFishSvg"
        />
        <!-- Hunger overlay -->
        <div v-if="fishState === 'hungry'" class="hunger-overlay">
          <span class="hunger-text">🍽 Your fish needs food!</span>
        </div>
      </div>

      <!-- Feed button -->
      <button
        class="feed-button"
        :disabled="feedingLevel >= 100"
        @click="emit('feed')"
      >
        {{ feedingLevel >= 100 ? '🐟 Fish is stuffed!' : '🍤 Feed fish' }}
      </button>

      <!-- Feeding bar -->
      <div class="feeding-bar-track" title="Fullness">
        <div
          class="feeding-bar-fill"
          :class="`bar-${fishState}`"
          :style="{ width: feedingLevel + '%' }"
        />
      </div>
      <div class="feeding-label">
        <span>Fullness</span>
        <span>{{ feedingLevel }}%</span>
      </div>

      <!-- Divider -->
      <div class="panel-divider" />

      <!-- New session prompt -->
      <div class="prompt-area">
        <div class="prompt-label">Start a new session</div>
        <div class="prompt-input" @click="emit('focus-input')">
          What are you building?
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen:       { type: Boolean, default: false },
  fishState:    { type: String, default: 'neutral' },   // 'neutral' | 'well-fed' | 'hungry'
  feedingLevel: { type: Number, default: 80 },
  currentFishSvg: { type: String, default: '' },
  fishColor:    { type: String, default: '#ff8c42' },
});

const emit = defineEmits(['feed', 'focus-input']);

const statusLabel = computed(() => ({
  'well-fed': 'Well-fed',
  neutral:    'Neutral',
  hungry:     'Hungry!',
}[props.fishState]));

// Decorative bubbles
const bubbles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  style: {
    left:             `${10 + i * 11}%`,
    animationDelay:   `${i * 0.7}s`,
    animationDuration:`${3 + (i % 3)}s`,
    width:            `${4 + (i % 3) * 2}px`,
    height:           `${4 + (i % 3) * 2}px`,
  },
}));
</script>

<style scoped>
/* ── Panel transition ───────────────────────────────────────────── */
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ── Panel shell ────────────────────────────────────────────────── */
.aquarium-panel {
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
  border-radius: 10px;
  width: 260px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Header ─────────────────────────────────────────────────────── */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 8px;
}

.panel-title {
  font-size: 12px;
  font-weight: 600;
  color: #cccccc;
  letter-spacing: 0.01em;
}

.fish-status-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-well-fed .status-dot  { background: #4ec9b0; }
.status-neutral .status-dot   { background: #cccccc; }
.status-hungry .status-dot    { background: #f48771; animation: pip-pulse 1.5s ease-in-out infinite; }

.status-well-fed .status-label { color: #4ec9b0; }
.status-neutral .status-label  { color: #999; }
.status-hungry .status-label   { color: #f48771; }

/* ── Aquarium viewport ──────────────────────────────────────────── */
.aquarium-viewport {
  position: relative;
  height: 120px;
  overflow: hidden;
  background: linear-gradient(180deg, #0d1b2a 0%, #1a3a5c 60%, #0a2540 100%);
  border-top: 1px solid #2a3a4a;
  border-bottom: 1px solid #2a3a4a;
}

.water-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 60%, rgba(30, 80, 140, 0.3) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 40%, rgba(10, 50, 100, 0.2) 0%, transparent 50%);
}

/* ── Bubbles ────────────────────────────────────────────────────── */
.bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bubble {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: bubble-rise linear infinite;
}

@keyframes bubble-rise {
  from { transform: translateY(0) scale(1); opacity: 0.7; }
  to   { transform: translateY(-140px) scale(1.1); opacity: 0; }
}

/* ── Fish in tank ───────────────────────────────────────────────── */
.fish-in-tank {
  position: absolute;
  width: 64px;
  height: 64px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: fish-swim 6s ease-in-out infinite;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.fish-in-tank :deep(svg) {
  width: 100%;
  height: 100%;
}

.tank-well-fed  { animation: fish-swim-happy 4s ease-in-out infinite; }
.tank-hungry    { animation: fish-swim-sad   7s ease-in-out infinite; }

@keyframes fish-swim {
  0%   { transform: translate(-50%, -50%) translateX(0px)    scaleX(1); }
  25%  { transform: translate(-50%, -50%) translateX(40px)   scaleX(1); }
  50%  { transform: translate(-50%, -50%) translateX(40px)   scaleX(-1); }
  75%  { transform: translate(-50%, -50%) translateX(-30px)  scaleX(-1); }
  100% { transform: translate(-50%, -50%) translateX(0px)    scaleX(1); }
}

@keyframes fish-swim-happy {
  0%   { transform: translate(-50%, -50%) translateX(0px)    translateY(0px) scaleX(1); }
  20%  { transform: translate(-50%, -50%) translateX(50px)   translateY(-8px) scaleX(1); }
  50%  { transform: translate(-50%, -50%) translateX(50px)   translateY(8px)  scaleX(-1); }
  80%  { transform: translate(-50%, -50%) translateX(-40px)  translateY(-4px) scaleX(-1); }
  100% { transform: translate(-50%, -50%) translateX(0px)    translateY(0px)  scaleX(1); }
}

@keyframes fish-swim-sad {
  0%   { transform: translate(-50%, -50%) translateX(0px)    translateY(4px)  scaleX(1);  rotate: 5deg; }
  40%  { transform: translate(-50%, -50%) translateX(20px)   translateY(10px) scaleX(1);  rotate: 8deg; }
  60%  { transform: translate(-50%, -50%) translateX(20px)   translateY(10px) scaleX(-1); rotate: -8deg; }
  100% { transform: translate(-50%, -50%) translateX(0px)    translateY(4px)  scaleX(1);  rotate: 5deg; }
}

/* ── Hunger overlay ─────────────────────────────────────────────── */
.hunger-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 8px;
  background: linear-gradient(transparent, rgba(244, 135, 113, 0.15));
  text-align: center;
}

.hunger-text {
  font-size: 10px;
  color: #f48771;
  font-weight: 500;
}

/* ── Feed button ────────────────────────────────────────────────── */
.feed-button {
  margin: 10px 14px 4px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #454545;
  background: #2d2d2d;
  color: #cccccc;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;
  text-align: center;
}

.feed-button:not(:disabled):hover {
  background: #3c3c3c;
  border-color: #6a9955;
  color: #d4d4d4;
}

.feed-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ── Feeding bar ────────────────────────────────────────────────── */
.feeding-bar-track {
  margin: 0 14px;
  height: 3px;
  background: #2d2d2d;
  border-radius: 999px;
  overflow: hidden;
}

.feeding-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease, background 0.4s ease;
}

.bar-well-fed  { background: #4ec9b0; }
.bar-neutral   { background: #cccccc; }
.bar-hungry    { background: #f48771; }

.feeding-label {
  display: flex;
  justify-content: space-between;
  padding: 3px 14px 8px;
  font-size: 10px;
  color: #666;
}

/* ── Divider ────────────────────────────────────────────────────── */
.panel-divider {
  height: 1px;
  background: #3c3c3c;
  margin: 0;
}

/* ── New session prompt ─────────────────────────────────────────── */
.prompt-area {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prompt-label {
  font-size: 11px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.prompt-input {
  padding: 8px 10px;
  background: #2d2d2d;
  border: 1px solid #454545;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: text;
  transition: border-color 0.12s ease;
}

.prompt-input:hover {
  border-color: #6a6a6a;
  color: #999;
}

/* Shared keyframe from AquariumButton (duplicated for Teleport scope) */
@keyframes pip-pulse {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(1.3); opacity: 0.7; }
}
</style>
