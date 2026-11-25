<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = defineProps({
  theme: { type: String, required: true },
  canMove: { type: Boolean, default: false },
})
const emit = defineEmits(['create', 'move'])
const menu = ref()
const opened = ref(false)
const position = ref({})
const menuId = `session-menu-${useId()}`
let contextTrigger

async function open(event) {
  close(false)
  contextTrigger = event.currentTarget
  contextTrigger.focus()
  const bounds = contextTrigger.getBoundingClientRect()
  const anchor = event.type === 'contextmenu' && (event.clientX || event.clientY)
    ? { left: event.clientX, top: event.clientY, bottom: event.clientY } : bounds
  const width = Math.min(320, globalThis.innerWidth - 24)
  const below = Math.max(0, globalThis.innerHeight - anchor.bottom - 16)
  const above = Math.max(0, anchor.top - 16)
  const useBelow = below >= Math.min(180, above)
  position.value = {
    left: `${Math.max(12, Math.min(anchor.left, globalThis.innerWidth - width - 12))}px`,
    top: '0px',
    width: `${width}px`,
    maxHeight: `${useBelow ? below : above}px`,
    visibility: 'hidden',
  }
  opened.value = true
  await nextTick()
  if (!opened.value || !menu.value) return
  const height = menu.value.getBoundingClientRect().height
  position.value = { ...position.value, top: `${useBelow ? anchor.bottom + 4 : Math.max(12, anchor.top - height - 4)}px`, visibility: 'visible' }
  await nextTick()
  if (!opened.value) return
  menu.value.querySelector('[role="menuitem"]')?.focus()
}

function close(restoreFocus = true) {
  opened.value = false
  if (restoreFocus) contextTrigger?.focus()
  contextTrigger = undefined
}

function choose(destination) {
  close(false)
  emit('create', destination)
}

function move() {
  close()
  emit('move')
}

function keyboard(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    close()
  } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    const items = [...menu.value.querySelectorAll('[role="menuitem"]:not(:disabled)')]
    const index = items.indexOf(document.activeElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
      : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[next]?.focus()
  } else if (event.key === 'Tab') {
    close()
  }
}

function outside(event) {
  if (opened.value && !contextTrigger?.contains(event.target) && !menu.value?.contains(event.target)) close(false)
}

function scroll(event) {
  if (opened.value && !menu.value?.contains(event.target)) close(false)
}

function resize() { close(false) }

defineExpose({ open, close })

onMounted(() => {
  document.addEventListener('pointerdown', outside)
  document.addEventListener('scroll', scroll, true)
  globalThis.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  close(false)
  document.removeEventListener('pointerdown', outside)
  document.removeEventListener('scroll', scroll, true)
  globalThis.removeEventListener('resize', resize)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="opened" :id="menuId" ref="menu" class="prototype-page session-context-menu" :data-theme="theme" :style="position" role="menu" aria-label="Session actions" @keydown="keyboard">
      <button class="menu-action" role="menuitem" tabindex="-1" data-action="here" @click="choose('here')"><i class="codicon codicon-code" aria-hidden="true" />Open in Editor</button>
      <button class="menu-action" role="menuitem" tabindex="-1" data-action="new-window" @click="choose('new-window')"><i class="codicon codicon-open-in-window" aria-hidden="true" />Open in Editor in new window</button>
      <div class="menu-divider" role="separator" />
      <button class="menu-action" role="menuitem" tabindex="-1" data-action="move" :disabled="!canMove" @click="move"><i class="codicon codicon-arrow-swap" aria-hidden="true" />Move session…</button>
    </div>
  </Teleport>
</template>
