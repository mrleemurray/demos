<template>
  <div class="aquarium-button-wrapper">
    <button
      class="aquarium-button"
      :class="[`state-${fishState}`, { active: isOpen }]"
      @click.left="handleLeftClick"
      @contextmenu.prevent="handleRightClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Fish icon — swaps based on state; rendered inline so currentColor works -->
      <span
        class="fish-icon"
        :class="fishIconClass"
        :style="fishIconStyle"
      >
        <Transition name="icon-fade">
          <i v-if="isOpen" key="close" class="codicon codicon-close close-icon" />
          <span v-else :key="selectedAvatarId" class="fish-svg" :class="{ poke: isWiggling }" v-html="currentFishSvg" />
        </Transition>
      </span>

      <!-- Hunger indicator pip -->
      <!--v-if removed: no pip on any state-->
    </button>

    <!-- Streak info — fades in on hover -->
    <div class="streak-label" :class="{ visible: isHovered && !isOpen }">
      {{ streakMessage }}
    </div>

    <!-- Fish picker context menu -->
    <FishPicker
      v-if="showPicker"
      :fish-avatars="fishAvatars"
      :fish-colors="fishColors"
      :selected-id="selectedAvatarId"
      :palette="FISH_PALETTE"
      :position="pickerPosition"
      @select="handleAvatarSelect"
      @color-change="handleColorChange"
      @close="showPicker = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import FishPicker from './FishPicker.vue';

// ── Real fish SVG imports (?raw so currentColor flows from .aquarium-button) ──
import fish1Happy    from '../assets/fish/fish1-happy.svg?raw';
import fish1Neutral  from '../assets/fish/fish1-neutral.svg?raw';
import fish1Sad      from '../assets/fish/fish1-sad.svg?raw';
import fish1VerySad  from '../assets/fish/fish1-very-sad.svg?raw';
import fish2Happy    from '../assets/fish/fish2-happy.svg?raw';
import fish2Neutral  from '../assets/fish/fish2-neutral.svg?raw';
import fish2Sad      from '../assets/fish/fish2-sad.svg?raw';
import fish2VerySad  from '../assets/fish/fish2-very-sad.svg?raw';
import fish3Happy    from '../assets/fish/fish3-happy.svg?raw';
import fish3Neutral  from '../assets/fish/fish3-neutral.svg?raw';
import fish3Sad      from '../assets/fish/fish3-sad.svg?raw';
import fish3VerySad  from '../assets/fish/fish3-very-sad.svg?raw';
import fish4Happy    from '../assets/fish/fish4-happy.svg?raw';
import fish4Neutral  from '../assets/fish/fish4-neutral.svg?raw';
import fish4Sad      from '../assets/fish/fish4-sad.svg?raw';
import fish4VerySad  from '../assets/fish/fish4-very-sad.svg?raw';

// ── Props & Emits ──────────────────────────────────────────────────
const props = defineProps({
  isOpen: { type: Boolean, default: false },
});

const emit = defineEmits(['toggle']);

// ── Fish avatar registry ───────────────────────────────────────────
const fishAvatars = [
  {
    id: 'fish1', label: 'Fish 1',
    happy: fish1Happy, neutral: fish1Neutral, sad: fish1Sad, verySad: fish1VerySad,
  },
  {
    id: 'fish2', label: 'Fish 2',
    happy: fish2Happy, neutral: fish2Neutral, sad: fish2Sad, verySad: fish2VerySad,
  },
  {
    id: 'fish3', label: 'Fish 3',
    happy: fish3Happy, neutral: fish3Neutral, sad: fish3Sad, verySad: fish3VerySad,
  },
  {
    id: 'fish4', label: 'Fish 4',
    happy: fish4Happy, neutral: fish4Neutral, sad: fish4Sad, verySad: fish4VerySad,
  },
];

// Per-fish user-customisable colors — default to foreground
const FISH_PALETTE = ['#cccccc', '#ff8c42', '#4da6ff', '#4ec9b0', '#b388ff'];
const fishColors = ref(Object.fromEntries(fishAvatars.map(a => [a.id, '#cccccc'])));
const currentFishColor = computed(() => fishColors.value[selectedAvatarId.value] ?? '#cccccc');

function handleColorChange(id, color) {
  fishColors.value[id] = color;
}

// ── Tamagotchi state ───────────────────────────────────────────────
const selectedAvatarId = ref('fish1');
const feedingLevel = ref(80);

// 4-band state derived from feeding level
const fishState = computed(() => {
  if (feedingLevel.value >= 65) return 'happy';
  if (feedingLevel.value >= 35) return 'neutral';
  if (feedingLevel.value >= 15) return 'sad';
  return 'very-sad';
});

// Drain feeding level over time (prototype speed: 1 point every 8s ≈ ~13 min to go hungry)
let drainTimer = null;
const DRAIN_INTERVAL_MS = 8000;
const DRAIN_AMOUNT = 1;

function startDrain() {
  drainTimer = setInterval(() => {
    feedingLevel.value = Math.max(0, feedingLevel.value - DRAIN_AMOUNT);
  }, DRAIN_INTERVAL_MS);
}

function stopDrain() {
  clearInterval(drainTimer);
}

// Feed the fish (called from parent via expose, or by clicking the panel's feed button)
function feed(amount = 25) {
  feedingLevel.value = Math.min(100, feedingLevel.value + amount);
  triggerWiggle();
}

const isWiggling = ref(false);
const isHovered  = ref(false);
const isSelecting = ref(false);
const happyAnimPhase = ref('swim'); // 'swim' | 'bob'
let wiggleTimeout = null;
let selectionTimeout = null;
let happyTimer = null;

const SWIM_DURATION_MS = 700;

function handleMouseEnter() {
  isHovered.value = true;
  if (fishState.value === 'happy') {
    happyAnimPhase.value = 'swim';
    clearTimeout(happyTimer);
    happyTimer = setTimeout(() => { happyAnimPhase.value = 'bob'; }, SWIM_DURATION_MS);
  }
}

function handleMouseLeave() {
  isHovered.value = false;
  clearTimeout(happyTimer);
  happyAnimPhase.value = 'swim';
}

function triggerWiggle() {
  isWiggling.value = true;
  clearTimeout(wiggleTimeout);
  wiggleTimeout = setTimeout(() => { isWiggling.value = false; }, 600);
}

function triggerSelectionAnimation() {
  isSelecting.value = true;
  clearTimeout(selectionTimeout);
  selectionTimeout = setTimeout(() => { isSelecting.value = false; }, 750);
}

// Priority: selecting > hovering (skip hover when aquarium is open)
const fishIconClass = computed(() => {
  if (props.isOpen) return '';
  if (isSelecting.value) return 'selection-burst';
  if (isHovered.value) {
    if (fishState.value === 'happy') return `hover-happy-${happyAnimPhase.value}`;
    return `hover-${fishState.value}`;
  }
  return '';
});

// No inline style needed — very-sad now uses animation instead of transition
const fishIconStyle = computed(() => ({}));

// ── Computed icon SVG & color ──────────────────────────────────────
const selectedAvatar = computed(() =>
  fishAvatars.find(a => a.id === selectedAvatarId.value) ?? fishAvatars[0]
);

const currentFishSvg = computed(() => {
  const avatar = selectedAvatar.value;
  switch (fishState.value) {
    case 'happy':    return avatar.happy;
    case 'sad':      return avatar.sad;
    case 'very-sad': return avatar.verySad;
    default:         return avatar.neutral;
  }
});

const buttonTitle = computed(() => {
  const stateLabel = {
    happy:      'Happy 😄',
    neutral:    'Neutral 😐',
    sad:        'Hungry 😟',
    'very-sad': 'Starving! 😰',
  }[fishState.value];
  return `Aquarium — ${stateLabel} (right-click to change fish)`;
});

const streakMessage = computed(() => ({
  happy:      '5 day streak!',
  neutral:    '3 day streak',
  sad:        "It's been a while...",
  'very-sad': "It's been weeks...",
}[fishState.value]));

// ── Click handlers ─────────────────────────────────────────────────
function handleLeftClick() {
  emit('toggle');
  triggerWiggle();
}

// ── Right-click picker ─────────────────────────────────────────────
const showPicker = ref(false);
const pickerPosition = ref({ x: 0, y: 0 });

function handleRightClick(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  pickerPosition.value = { x: rect.left, y: rect.bottom + 6 };
  showPicker.value = true;
}

function handleAvatarSelect(id) {
  selectedAvatarId.value = id;
  showPicker.value = false;
}

// Close picker on outside click
function handleWindowClick() {
  if (showPicker.value) showPicker.value = false;
}

// ── Lifecycle ──────────────────────────────────────────────────────
onMounted(() => {
  startDrain();
  window.addEventListener('click', handleWindowClick);
});

onUnmounted(() => {
  stopDrain();
  clearTimeout(wiggleTimeout);
  clearTimeout(selectionTimeout);
  clearTimeout(happyTimer);
  window.removeEventListener('click', handleWindowClick);
});

function setLevel(n) {
  feedingLevel.value = Math.max(0, Math.min(100, n));
}

defineExpose({ feed, setLevel, feedingLevel, fishState, currentFishSvg, fishColor: currentFishColor });
</script>

<style scoped>
.aquarium-button-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* ── Streak label ───────────────────────────────────────────────── */
.streak-label {
  position: absolute;
  left: calc(100% + 8px);
  white-space: nowrap;
  font-size: 12px;
  color: #cccccc;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.streak-label.visible {
  opacity: 1;
  transform: translateX(0);
}

.aquarium-button {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
  transition:
    background 0.12s ease,
    transform 0.1s ease;
  outline: none;
  /* Fish color — foreground by default, user-customisable */
  color: v-bind('currentFishColor');
}

.aquarium-button:hover {
  background: rgba(255, 255, 255, 0.08);
}

.aquarium-button.active {
  background: rgba(255, 255, 255, 0.1);
}

.aquarium-button:focus-visible {
  outline: 1px solid rgba(255, 255, 255, 0.5);
  outline-offset: 1px;
}

/* ── Fish icon ──────────────────────────────────────────────────── */
.fish-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 22px;
  height: 22px;
}

/* SVG rendered via v-html — size & color via currentColor */
.fish-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.fish-svg {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Close icon shown when aquarium is open */
.close-icon {
  display: flex !important;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  color: currentColor;
}

/* ── Icon fade (fish ↔ close, fish ↔ fish) ───────────────────────── */
.icon-fade-enter-active,
.icon-fade-leave-active {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
}

/* Poke (left-click) — on .fish-svg so it composes with the outer bob-y transform */
.fish-svg.poke {
  animation: poke 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

@keyframes poke {
  0%   { transform: scale(1);    }
  30%  { transform: scale(0.78); }
  100% { transform: scale(1);    }
}

@keyframes poke {
  0%   { transform: scale(1);    }
  30%  { transform: scale(0.85); }
  100% { transform: scale(1);    }
}

/* ── Selection burst (avatar pick) ──────────────────────────────── */
.selection-burst {
  animation: selection-burst 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes selection-burst {
  0%   { transform: scale(1)    rotate(0deg);  }
  25%  { transform: scale(1.12) rotate(-8deg); }
  55%  { transform: scale(1.08) rotate(5deg);  }
  75%  { transform: scale(1.03) rotate(-2deg); }
  100% { transform: scale(1)    rotate(0deg);  }
}

/* ── State hover animations ─────────────────────────────────────── */

/* Happy: one swim circle, then looping bob (class swapped by JS timer) */
.hover-happy-swim {
  animation: swim-circle 0.7s linear forwards;
}

.hover-happy-bob {
  animation: bob-y 1.4s ease-in-out infinite alternate;
}
.hover-happy-bob :deep(.fish-svg) {
  animation: bob-rock-happy 1.0s ease-in-out infinite alternate;
}

@keyframes bob-y {
  from { transform: translateY(0); }
  to   { transform: translateY(-4px); }
}
@keyframes bob-rock-happy {
  from { transform: rotate(0deg); }
  to   { transform: rotate(14deg); }
}

@keyframes swim-circle {
  0%   { transform: translateX(0px)   perspective(120px) rotateY(0deg)   scale(1);    }
  12%  { transform: translateX(-6px)  perspective(120px) rotateY(45deg)  scale(1.0);  }
  25%  { transform: translateX(-10px) perspective(120px) rotateY(90deg)  scale(0.85); }
  37%  { transform: translateX(-6px)  perspective(120px) rotateY(135deg) scale(0.75); }
  50%  { transform: translateX(0px)   perspective(120px) rotateY(180deg) scale(0.7);  }
  62%  { transform: translateX(6px)   perspective(120px) rotateY(225deg) scale(0.75); }
  75%  { transform: translateX(10px)  perspective(120px) rotateY(270deg) scale(0.85); }
  87%  { transform: translateX(6px)   perspective(120px) rotateY(315deg) scale(1.0);  }
  100% { transform: translateX(0px)   perspective(120px) rotateY(360deg) scale(1);    }
}

/* Neutral: gentle lift, then slow bob */
.hover-neutral {
  animation:
    hover-neutral  0.7s ease forwards,
    bob-y-neutral  1.6s ease-in-out 0.7s infinite alternate;
}
.hover-neutral :deep(.fish-svg) {
  animation: bob-rock-neutral 1.15s ease-in-out 0.7s infinite alternate;
}

@keyframes hover-neutral {
  0%   { transform: translateY(0);    }
  50%  { transform: translateY(-3px); }
  100% { transform: translateY(-2px); }
}
@keyframes bob-y-neutral {
  from { transform: translateY(-2px); }
  to   { transform: translateY(-5px); }
}
@keyframes bob-rock-neutral {
  from { transform: rotate(0deg); }
  to   { transform: rotate(10deg); }
}

/* Sad: sluggish droop, then heavy bob */
.hover-sad {
  animation:
    hover-sad  0.9s ease forwards,
    bob-y-sad  2.0s ease-in-out 0.9s infinite alternate;
}
.hover-sad :deep(.fish-svg) {
  animation: bob-rock-sad 1.4s ease-in-out 0.9s infinite alternate;
}

@keyframes hover-sad {
  0%   { transform: translateY(0);   }
  100% { transform: translateY(2px); }
}
@keyframes bob-y-sad {
  from { transform: translateY(2px); }
  to   { transform: translateY(5px); }
}
@keyframes bob-rock-sad {
  from { transform: rotate(0deg); }
  to   { transform: rotate(8deg); }
}

/* Very sad: Z-flip through screen, then bob upside-down */
.hover-very-sad {
  animation:
    flip-very-sad  1.1s ease forwards,
    bob-y-very-sad  1.5s ease-in-out 1.1s infinite alternate;
}
.hover-very-sad :deep(.fish-svg) {
  animation: bob-rock-very-sad 1.1s ease-in-out 1.1s infinite alternate;
}

@keyframes flip-very-sad {
  0%   { transform: translateY(0)    perspective(120px) rotateX(0deg);   }
  100% { transform: translateY(-3px) perspective(120px) rotateX(180deg); }
}
@keyframes bob-y-very-sad {
  from { transform: translateY(-3px) perspective(120px) rotateX(180deg); }
  to   { transform: translateY(-6px) perspective(120px) rotateX(180deg); }
}
@keyframes bob-rock-very-sad {
  from { transform: rotate(0deg); }
  to   { transform: rotate(14deg); }
}

/* ── Hunger pip ─────────────────────────────────────────────────── */
.hunger-pip {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f48771;
  border: 1.5px solid #1e1e1e;
  animation: pip-pulse 1.8s ease-in-out infinite;
}

.hunger-pip.critical {
  background: #f14c4c;
  animation: pip-pulse 0.9s ease-in-out infinite;
}

@keyframes pip-pulse {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(1.3); opacity: 0.7; }
}
</style>
