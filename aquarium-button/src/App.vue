<template>
  <div class="app">
    <!-- Mock agent window chrome -->
    <div class="window-chrome">
      <!-- Gradient overlay — fades in when panel is open -->
      <div class="gradient-overlay" :class="{ visible: panelOpen }" />

      <!-- Button floats top-left -->
      <div class="button-anchor">
        <AquariumButton
          ref="aquariumButtonRef"
          :is-open="panelOpen"
          @toggle="panelOpen = !panelOpen"
        />
      </div>

      <!-- Instructions -->
      <div class="panel-instructions">
        <p>Click the fish to open the aquarium.</p>
        <p>Right-click to choose your fish.</p>
      </div>

      <!-- State preview controls -->
      <div class="state-controls">
        <span class="controls-label">Preview state</span>
        <div class="radio-group">
          <label
            v-for="option in stateOptions"
            :key="option.value"
            class="radio-pill"
            :class="{ selected: previewState === option.value }"
          >
            <input
              type="radio"
              :value="option.value"
              v-model="previewState"
              @change="applyState(option.value)"
            />
            {{ option.label }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AquariumButton from './components/AquariumButton.vue';

const panelOpen = ref(false);
const aquariumButtonRef = ref(null);

// ── State preview ──────────────────────────────────────────────────
const stateOptions = [
  { value: 'happy',    label: 'Happy',    color: '#4ec9b0', level: 85 },
  { value: 'neutral',  label: 'Neutral',  color: '#888888', level: 50 },
  { value: 'sad',      label: 'Hungry',   color: '#f48771', level: 25 },
  { value: 'very-sad', label: 'Starving', color: '#f14c4c', level: 5  },
];

const previewState = ref('happy');

function applyState(value) {
  const option = stateOptions.find(o => o.value === value);
  if (option) aquariumButtonRef.value?.setLevel(option.level);
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141414;
}

/* ── Mock window chrome ─────────────────────────────────────────── */
.window-chrome {
  position: relative;
  width: 480px;
  height: 320px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #3c3c3c;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 24px;
}

/* ── Gradient fade overlay ──────────────────────────────────────── */
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #0b2d45 0%, #0a3d2d 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.gradient-overlay.visible {
  opacity: 1;
}

/* ── Button anchor ──────────────────────────────────────────────── */
.button-anchor {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
}

/* ── Instructions ───────────────────────────────────────────────── */
.panel-instructions {
  text-align: center;
  margin-bottom: 20px;
  z-index: 1;
}

.panel-instructions p {
  font-size: 12px;
  color: #cccccc;
  line-height: 1.8;
  margin: 0;
}

/* ── State controls ─────────────────────────────────────────────── */
.state-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 1;
}

.controls-label {
  font-size: 11px;
  font-weight: 600;
  color: #cccccc;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  white-space: nowrap;
}

.radio-group {
  display: flex;
  gap: 6px;
}

.radio-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid #3c3c3c;
  background: #252526;
  font-size: 12px;
  color: #cccccc;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.radio-pill input[type="radio"] {
  display: none;
}

.radio-pill:hover {
  border-color: #555;
  color: #bbb;
}

.radio-pill.selected {
  border-color: #555;
  background: #2d2d2d;
  color: #cccccc;
}
</style>
