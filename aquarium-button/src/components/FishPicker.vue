<template>
  <!-- Teleport to body so it escapes any overflow clipping -->
  <Teleport to="body">
    <div
      class="fish-picker-overlay"
      @click.stop="emit('close')"
    />
    <div
      class="fish-picker"
      :style="{ left: safeX + 'px', top: safeY + 'px' }"
      @click.stop
    >
      <div class="picker-grid">
        <button
          v-for="avatar in fishAvatars"
          :key="avatar.id"
          class="picker-item"
          :class="{ selected: avatar.id === selectedId }"
          :title="avatar.label"
          :style="{ color: fishColors[avatar.id] }"
          @click="emit('select', avatar.id)"
        >
          <span class="picker-fish" v-html="avatar.neutral" />
          <!-- Preset color swatches -->
          <div class="color-swatches" @click.stop>
            <button
              v-for="color in palette"
              :key="color"
              class="color-swatch"
              :class="{ active: fishColors[avatar.id] === color }"
              :style="{ background: color }"
              :title="color"
              @click="emit('color-change', avatar.id, color)"
            />
          </div>
          <i v-if="avatar.id === selectedId" class="codicon codicon-check picker-check" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  fishAvatars: { type: Array,  required: true },
  fishColors:  { type: Object, required: true },
  selectedId:  { type: String, required: true },
  position:    { type: Object, required: true },
  palette:     { type: Array,  required: true },
});

const emit = defineEmits(['select', 'color-change', 'close']);

// Keep menu within viewport
const MENU_WIDTH  = 48;
const MENU_HEIGHT = props.fishAvatars.length * 48 + 36; // approx

const safeX = computed(() =>
  Math.min(props.position.x, window.innerWidth  - MENU_WIDTH  - 8)
);
const safeY = computed(() =>
  Math.min(props.position.y, window.innerHeight - MENU_HEIGHT - 8)
);
</script>

<style scoped>
.fish-picker-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
}

.fish-picker {
  position: fixed;
  z-index: 1000;
  background: #252526;
  border: 1px solid #454545;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  padding: 3px;
  min-width: 0;
  animation: picker-appear 0.12s ease;
}

@keyframes picker-appear {
  from { opacity: 0; transform: scale(0.94) translateY(-4px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

.picker-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.picker-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  width: 100%;
  text-align: left;
  transition: background 0.1s ease;
  position: relative;
}

.picker-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.picker-item.selected {
  background: rgba(255, 255, 255, 0.05);
}

.picker-fish {
  display: flex;
  align-items: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.picker-fish :deep(svg) {
  width: 100%;
  height: 100%;
}

.picker-item:hover .picker-fish {
  animation: picker-fish-hover 0.6s ease both;
}

@keyframes picker-fish-hover {
  0%   { transform: rotate(0deg)  scale(1); }
  45%  { transform: rotate(-8deg) scale(1.15); }
  100% { transform: rotate(-3deg) scale(1.1); }
}

.picker-check {
  font-size: 14px;
  color: #4ec9b0;
  margin-left: auto;
  flex-shrink: 0;
}

/* ── Color swatch ──────────────────────────────────────────── */
.color-swatches {
  display: flex;
  gap: 4px;
  align-items: center;
}

.color-swatch {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: transform 0.1s ease, border-color 0.1s ease;
}

.color-swatch:hover {
  transform: scale(1.2);
}

.color-swatch.active {
  border-color: rgba(255, 255, 255, 0.7);
}
</style>
