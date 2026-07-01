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
          <!-- Neutral preview rendered inline -->
          <span class="picker-fish" v-html="avatar.neutral" />
          <!-- Color swatch — opens native color picker without selecting the fish -->
          <label class="color-swatch" :style="{ background: fishColors[avatar.id] }" @click.stop>
            <input
              type="color"
              :value="fishColors[avatar.id]"
              @input="emit('color-change', avatar.id, $event.target.value)"
            />
          </label>
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
.color-swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}

.color-swatch input[type="color"] {
  position: absolute;
  inset: -4px;
  opacity: 0;
  cursor: pointer;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  border: none;
  padding: 0;
}
</style>
