<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  provider: {
    type: Object,
    required: true,
  },
})

const isPinned = ref(false)

const pathId = computed(() => `provider-orbit-${props.provider.id}`)
const nameId = computed(() => `provider-name-${props.provider.id}`)
const descriptionId = computed(() => `provider-description-${props.provider.id}`)
const orbitText = computed(() => {
  const phrase = `${props.provider.qualities.join(' \u2022 ')} \u2022`
  return `${phrase} ${phrase}\u00A0`.toUpperCase()
})
const accessibleDescription = computed(
  () => `${props.provider.name}: ${props.provider.qualities.join(', ')}.`,
)
const controlLabel = computed(() =>
  isPinned.value
    ? `Let ${props.provider.name} details follow focus`
    : `Keep ${props.provider.name} details visible`,
)
function togglePinned() {
  isPinned.value = !isPinned.value
}

function clearPinned() {
  isPinned.value = false
}

</script>

<template>
  <article
    class="provider-orbit"
    :class="{ 'is-pinned': isPinned }"
    :aria-labelledby="nameId"
  >
    <div class="orbit-stage">
      <div class="provider-ring-shell" aria-hidden="true">
        <svg class="provider-ring" viewBox="0 0 176 176">
          <defs>
            <path
              :id="pathId"
              d="M 88,88 m -67,0 a 67,67 0 1,1 134,0 a 67,67 0 1,1 -134,0"
            />
          </defs>
          <text>
            <textPath
              :href="`#${pathId}`"
              textLength="421"
              lengthAdjust="spacing"
            >
              {{ orbitText }}
            </textPath>
          </text>
        </svg>
      </div>

      <button
        class="provider-trigger"
        type="button"
        :aria-describedby="descriptionId"
        :aria-label="controlLabel"
        :aria-pressed="isPinned"
        @click="togglePinned"
        @keydown.esc.stop="clearPinned"
      >
        <i class="codicon" :class="`codicon-${provider.icon}`" aria-hidden="true" />
      </button>
    </div>

    <span :id="nameId" class="sr-only">{{ provider.name }}</span>
    <span :id="descriptionId" class="sr-only">{{ accessibleDescription }}</span>
  </article>
</template>

<style scoped>
.provider-orbit {
  --orbit-size: 176px;
  display: grid;
  min-width: 0;
  justify-items: center;
  padding: 10px 0;
}

.orbit-stage {
  position: relative;
  display: grid;
  width: var(--orbit-size);
  height: var(--orbit-size);
  place-items: center;
}

.provider-ring-shell {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.93);
  transition:
    opacity 220ms ease-out,
    transform 220ms ease-out;
}

.provider-ring {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  transform-origin: center;
}

.provider-ring text {
  fill: var(--page-muted);
  font-family:
    Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-size: 8.5px;
  font-weight: 650;
  letter-spacing: 1.2px;
}

.provider-orbit:hover .provider-ring-shell,
.provider-orbit:focus-within .provider-ring-shell,
.provider-orbit.is-pinned .provider-ring-shell {
  opacity: 0.86;
  transform: scale(1);
}

.provider-orbit:hover .provider-ring,
.provider-orbit:focus-within .provider-ring,
.provider-orbit.is-pinned .provider-ring {
  animation: provider-orbit-spin 28s linear infinite;
}

.provider-trigger {
  position: relative;
  display: grid;
  width: 76px;
  height: 76px;
  padding: 0;
  place-items: center;
  color: var(--page-foreground);
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: color 180ms ease-out;
}

.provider-trigger:hover,
.provider-trigger:focus-visible,
.is-pinned .provider-trigger {
  color: #ffffff;
}

.provider-trigger:focus-visible {
  outline: 2px solid var(--page-foreground);
  outline-offset: 4px;
}

.provider-trigger .codicon {
  font-size: 32px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes provider-orbit-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .provider-ring-shell,
  .provider-trigger {
    transition: none;
  }

  .provider-orbit:hover .provider-ring,
  .provider-orbit:focus-within .provider-ring,
  .provider-orbit.is-pinned .provider-ring {
    animation: none;
  }

}

@media (forced-colors: active) {
  .provider-ring text {
    fill: CanvasText;
  }

  .provider-trigger,
  .provider-trigger:hover,
  .provider-trigger:focus-visible,
  .is-pinned .provider-trigger {
    color: ButtonText;
    background: ButtonFace;
    border: 1px solid ButtonText;
    box-shadow: none;
  }
}
</style>
