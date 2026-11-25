<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useId, watch } from 'vue'

const props = defineProps({
  spaces: { type: Array, required: true },
  initialWindowIds: { type: Array, default: () => [] },
  initialActiveWindowId: { type: String, default: null },
  previewSpaceId: { type: String, default: null },
  previewTheme: { type: String, default: null },
  switchingAnimation: { type: String, default: 'fade' },
  collectionSwitchingAnimation: { type: String, default: 'fade' },
  reducedMotion: { type: Boolean, default: false },
  modalWindowIds: { type: Array, default: () => [] },
})
const emit = defineEmits(['select', 'close', 'toggle-sidebar', 'open-change', 'open-work-area'])
const contexts = computed(() => new Map(props.spaces.flatMap(space => space.windows.map(area => [area.id, { area, space }]))))
const openWindowIds = ref(props.initialWindowIds.filter(id => contexts.value.has(id)))
const activeWindowId = ref(props.initialActiveWindowId)
const lastUsedWindowId = ref(props.initialActiveWindowId)
const windows = computed(() => openWindowIds.value.map(id => contexts.value.get(id)?.area).filter(Boolean))
const layoutKey = 'vscode-collections-floating-layout-v1'
const layoutBackupKey = `${layoutKey}-before-explicit-windows`
const canvas = ref()
const ready = ref(false)
const bounds = reactive({ width: 0, height: 0 })
const layouts = reactive(Object.create(null))
const frameIds = reactive(Object.create(null))
const switches = reactive(Object.create(null))
const idleTransition = { animation: 'none', name: 'work-area-fade', scope: 'work-area', direction: 1 }
const stack = ref([])
const layoutError = ref('')
const announcement = ref('')
const instructionsId = `floating-instructions-${useId()}`
let resizeObserver
let interaction
let legacyLayout
let initializeRecord = true

function validLayout(value) {
  return value && ['x', 'y', 'width', 'height'].every(key => Number.isFinite(value[key])) &&
    value.width > 0 && value.height > 0 && typeof value.minimized === 'boolean' && typeof value.maximized === 'boolean'
}

try {
  const raw = localStorage.getItem(layoutKey)
  if (raw !== null) {
    const saved = JSON.parse(raw)
    if (![1, 2, 3].includes(saved?.version) || !saved.windows || typeof saved.windows !== 'object' ||
      Array.isArray(saved.windows) || !Object.values(saved.windows).every(validLayout)) {
      throw new Error('Unsupported floating-window layout.')
    }
    if (saved.version >= 2 && (!Array.isArray(saved.openWindowIds) ||
      !saved.openWindowIds.every(id => typeof id === 'string') ||
      new Set(saved.openWindowIds).size !== saved.openWindowIds.length ||
      saved.activeWindowId !== null && typeof saved.activeWindowId !== 'string' ||
      saved.lastUsedWindowId !== undefined && saved.lastUsedWindowId !== null && typeof saved.lastUsedWindowId !== 'string')) {
      throw new Error('Unsupported open-window state.')
    }
    if (saved.version === 3 && (!saved.frameIds || typeof saved.frameIds !== 'object' || Array.isArray(saved.frameIds) ||
      !saved.openWindowIds.every(id => Object.hasOwn(saved.frameIds, id) && typeof saved.frameIds[id] === 'string' && saved.frameIds[id]) ||
      new Set(saved.openWindowIds.map(id => saved.frameIds[id])).size !== saved.openWindowIds.length)) {
      throw new Error('Unsupported window identities.')
    }
    Object.assign(layouts, saved.windows)
    if (saved.version >= 2) {
      openWindowIds.value = saved.openWindowIds.filter(id => contexts.value.has(id))
      activeWindowId.value = saved.activeWindowId
      lastUsedWindowId.value = saved.lastUsedWindowId ?? saved.activeWindowId ?? props.initialActiveWindowId
      if (saved.version === 3) Object.assign(frameIds, saved.frameIds)
      initializeRecord = saved.version !== 3
    } else {
      legacyLayout = raw
    }
  }
} catch (error) {
  initializeRecord = false
  console.error('Unable to load floating-window layout:', error)
  layoutError.value = 'Window positions could not be loaded. Using the default arrangement.'
}
for (const id of openWindowIds.value) frameIds[id] ??= crypto.randomUUID()
if (!openWindowIds.value.includes(activeWindowId.value) || layouts[activeWindowId.value]?.minimized) {
  activeWindowId.value = openWindowIds.value.find(id => !layouts[id]?.minimized) || null
}

const allMinimized = computed(() => windows.value.length > 0 && windows.value.every(area => layouts[area.id]?.minimized))

function spaceFor(area) {
  return contexts.value.get(area.id).space
}

function themeFor(area) {
  const space = spaceFor(area)
  return space.id === props.previewSpaceId && props.previewTheme ? props.previewTheme : space.theme
}

function transitionFor(area) {
  return switches[frameIds[area.id]] || idleTransition
}

function prepareContentTransition(element) {
  element.style.setProperty('--collection-slide-direction', String(switches[element.dataset.frameId]?.direction ?? 1))
}

function disableLeavingContent(element) {
  prepareContentTransition(element)
  element.setAttribute('inert', '')
  element.setAttribute('aria-hidden', 'true')
}

function windowCaption(area) {
  const context = area.sessionContext?.title || (area.kind === 'agents'
    ? area.sessions.find(session => session.id === area.selectedSessionId)?.title : area.branch)
  return context && context !== 'main' ? `${area.project} - ${context}` : area.project
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum))
}

function fit(layout) {
  const width = clamp(layout.width, Math.min(360, bounds.width), bounds.width)
  const height = clamp(layout.height, Math.min(280, bounds.height), bounds.height)
  return { ...layout, width, height, x: clamp(layout.x, 0, bounds.width - width), y: clamp(layout.y, 0, bounds.height - height) }
}

function ensureLayout(id) {
  if (!Object.hasOwn(layouts, id)) {
    const index = Math.max(0, windows.value.findIndex(area => area.id === id))
    layouts[id] = fit({
      x: 24 + index % 5 * 40, y: 20 + index % 5 * 28,
      width: Math.min(900, bounds.width - 48), height: Math.min(600, bounds.height - 40),
      minimized: false, maximized: false,
    })
  }
  return layouts[id]
}

function saveLayout() {
  try {
    if (legacyLayout && localStorage.getItem(layoutBackupKey) === null) localStorage.setItem(layoutBackupKey, legacyLayout)
    localStorage.setItem(layoutKey, JSON.stringify({
      version: 3, windows: layouts, openWindowIds: openWindowIds.value, activeWindowId: activeWindowId.value, lastUsedWindowId: lastUsedWindowId.value, frameIds,
    }))
    legacyLayout = undefined
    layoutError.value = ''
  } catch (error) {
    console.error('Unable to save floating-window layout:', error)
    layoutError.value = 'Window positions could not be saved. They will be lost on reload.'
  }
}

function raise(id) {
  if (stack.value.at(-1) !== id) stack.value = [...stack.value.filter(item => item !== id), id]
}

function activate(id) {
  if (id) {
    lastUsedWindowId.value = id
    raise(id)
  }
  if (activeWindowId.value !== id) {
    activeWindowId.value = id
    emit('select', id)
    if (ready.value) saveLayout()
  }
}

function measure() {
  const width = canvas.value?.clientWidth ?? 0
  const height = canvas.value?.clientHeight ?? 0
  if (width <= 0 || height <= 0) return
  bounds.width = width
  bounds.height = height
  for (const area of windows.value) layouts[area.id] = fit(ensureLayout(area.id))
  const firstLayout = !ready.value
  ready.value = true
  if (activeWindowId.value && !layouts[activeWindowId.value]?.minimized) raise(activeWindowId.value)
  if (firstLayout) {
    emit('select', activeWindowId.value)
    if (initializeRecord) {
      saveLayout()
      initializeRecord = false
    }
  }
}

function frameStyle(id) {
  const layout = layouts[id]
  return {
    left: `${layout.maximized ? 0 : layout.x}px`, top: `${layout.maximized ? 0 : layout.y}px`,
    width: `${layout.maximized ? bounds.width : layout.width}px`,
    height: `${layout.maximized ? bounds.height : layout.height}px`,
    zIndex: stack.value.indexOf(id) + 1,
  }
}

function frameElement(id) {
  return [...(canvas.value?.querySelectorAll('.floating-window') || [])].find(element => element.dataset.windowId === id)
}

function placeNewWindow(id, layout, savedPosition) {
  const visible = openWindowIds.value
    .filter(item => item !== id && !layouts[item]?.minimized)
    .map(item => layouts[item])
    .filter(Boolean)
    .map(other => ({ x: other.maximized ? 0 : other.x, y: other.maximized ? 0 : other.y }))
  const clear = candidate => visible.every(other => Math.abs(candidate.x - other.x) >= 24 || Math.abs(candidate.y - other.y) >= 24)
  if (visible.length && layout.maximized) layout = { ...layout, maximized: false }
  if (!visible.length || savedPosition && clear(layout)) return layout
  const active = layouts[activeWindowId.value]
  const origin = active && !active.minimized
    ? { x: active.maximized ? 0 : active.x, y: active.maximized ? 0 : active.y } : visible.at(-1)
  const cascade = fit({ ...layout, x: origin.x + 40, y: origin.y + 28 })
  if (clear(cascade)) return cascade
  const wrapped = fit({ ...layout, x: 24, y: 20 })
  if (clear(wrapped)) return wrapped
  const xs = [...new Set([0, ...Array.from({ length: Math.floor((bounds.width - layout.width) / 40) }, (_, index) => (index + 1) * 40), bounds.width - layout.width])]
  const ys = [...new Set([0, ...Array.from({ length: Math.floor((bounds.height - layout.height) / 28) }, (_, index) => (index + 1) * 28), bounds.height - layout.height])]
  for (const y of ys) for (const x of xs) if (clear({ x, y })) return { ...layout, x, y }
  // If the desktop is crowded, still avoid exact alignment whenever any offset fits.
  for (const y of ys) for (const x of xs) {
    if (visible.every(other => other.x !== x || other.y !== y)) return { ...layout, x, y }
  }
  return layout
}

async function openWindow(id, focus = true) {
  if (!contexts.value.has(id)) {
    layoutError.value = 'This work area is no longer available.'
    return
  }
  if (!ready.value) await nextTick()
  if (!ready.value || !canvas.value) return
  const newlyOpened = !openWindowIds.value.includes(id)
  const savedPosition = Object.hasOwn(layouts, id)
  frameIds[id] ??= crypto.randomUUID()
  if (newlyOpened) openWindowIds.value = [...openWindowIds.value, id]
  layouts[id] = fit(ensureLayout(id))
  if (newlyOpened) layouts[id] = placeNewWindow(id, layouts[id], savedPosition)
  layouts[id].minimized = false
  activate(id)
  saveLayout()
  await nextTick()
  if (focus) frameElement(id)?.focus({ preventScroll: true })
}

async function openLastWindow(fallbackId) {
  const id = [lastUsedWindowId.value, fallbackId, ...contexts.value.keys()].find(id => contexts.value.has(id))
  if (!id) return null
  await openWindow(id)
  return id
}

function switchWindow(sourceId, id, focus = false) {
  if (!openWindowIds.value.includes(sourceId) || !contexts.value.has(sourceId) || !contexts.value.has(id)) {
    layoutError.value = 'This window or work area is no longer available.'
    return false
  }
  if (openWindowIds.value.includes(id)) {
    openWindow(id, focus)
    return true
  }
  if (interaction?.id === sourceId) stopInteraction()
  const previousSpace = contexts.value.get(sourceId).space
  const nextSpace = contexts.value.get(id).space
  const collection = previousSpace.id !== nextSpace.id
  const animation = collection ? props.collectionSwitchingAnimation : props.switchingAnimation
  switches[frameIds[sourceId]] = {
    animation, scope: collection ? 'collection' : 'work-area',
    name: animation === 'zoom' ? 'zoom-focus' : collection ? 'collection-slide' : 'work-area-fade',
    direction: props.spaces.indexOf(nextSpace) < props.spaces.indexOf(previousSpace) ? -1 : 1,
  }
  layouts[id] = { ...layouts[sourceId] }
  frameIds[id] = frameIds[sourceId]
  delete frameIds[sourceId]
  stack.value = stack.value.map(item => item === sourceId ? id : item)
  openWindowIds.value = openWindowIds.value.map(item => item === sourceId ? id : item)
  activate(id)
  saveLayout()
  if (focus) nextTick(() => frameElement(id)?.focus({ preventScroll: true }))
  return true
}

function nextVisibleWindow(id) {
  return [...stack.value].reverse().find(item => item !== id && openWindowIds.value.includes(item) && !layouts[item]?.minimized) || null
}

function closeWindow(id) {
  if (!openWindowIds.value.includes(id)) {
    layoutError.value = 'This window is not open.'
    return
  }
  if (interaction?.id === id) stopInteraction()
  openWindowIds.value = openWindowIds.value.filter(item => item !== id)
  delete switches[frameIds[id]]
  delete frameIds[id]
  if (activeWindowId.value === id) activate(nextVisibleWindow(id))
  saveLayout()
  emit('close', id)
}

function minimize(id) {
  layouts[id].minimized = true
  activate(nextVisibleWindow(id))
  saveLayout()
  nextTick(() => {
    const target = activeWindowId.value ? frameElement(activeWindowId.value) : canvas.value?.querySelector('.floating-empty button')
    target?.focus({ preventScroll: true })
  })
}

function maximize(id) {
  layouts[id].maximized = !layouts[id].maximized
  activate(id)
  saveLayout()
}

function startInteraction(event, id, type) {
  if (event.button !== 0 || layouts[id].maximized) return
  stopInteraction()
  event.preventDefault()
  const focusTarget = type === 'move' ? frameElement(id) : event.currentTarget
  focusTarget?.focus({ preventScroll: true })
  activate(id)
  interaction = {
    id, type, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
    layout: { ...layouts[id] }, handle: event.currentTarget,
  }
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function moveInteraction(event) {
  if (!interaction || event.pointerId !== interaction.pointerId) return
  event.preventDefault()
  const { id, type, startX, startY, layout } = interaction
  const dx = event.clientX - startX, dy = event.clientY - startY
  if (type === 'move') {
    layouts[id] = fit({ ...layout, x: layout.x + dx, y: layout.y + dy })
  } else {
    layouts[id] = resizedLayout(layout, dx, dy)
  }
}

function resizedLayout(layout, dx, dy) {
  return {
    ...layout,
    width: clamp(layout.width + dx, Math.min(360, bounds.width - layout.x), bounds.width - layout.x),
    height: clamp(layout.height + dy, Math.min(280, bounds.height - layout.y), bounds.height - layout.y),
  }
}

function stopInteraction(event) {
  if (!interaction || event?.pointerId !== undefined && event.pointerId !== interaction.pointerId) return
  const { handle, pointerId } = interaction
  interaction = undefined
  if (handle.hasPointerCapture?.(pointerId)) handle.releasePointerCapture(pointerId)
  saveLayout()
}

function keyboardGeometry(event, area, resize = false) {
  const delta = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[event.key]
  if (!delta || layouts[area.id].maximized) return
  event.preventDefault()
  event.stopPropagation()
  const layout = layouts[area.id]
  const [dx, dy] = delta
  layouts[area.id] = resize || event.shiftKey
    ? resizedLayout(layout, dx, dy)
    : fit({ ...layout, x: layout.x + dx, y: layout.y + dy })
  const next = layouts[area.id]
  announcement.value = `${area.project}: position ${Math.round(next.x)}, ${Math.round(next.y)}; size ${Math.round(next.width)} by ${Math.round(next.height)}.`
  saveLayout()
}

watch(() => windows.value.map(area => area.id), ids => {
  stack.value = [...stack.value.filter(id => ids.includes(id)), ...ids.filter(id => !stack.value.includes(id))]
  if (ready.value) measure()
}, { immediate: true })
watch(openWindowIds, ids => emit('open-change', [...ids]), { immediate: true })
watch(() => [...contexts.value.keys()], ids => {
  const available = openWindowIds.value.filter(id => ids.includes(id))
  if (available.length !== openWindowIds.value.length) {
    for (const id of openWindowIds.value) {
      if (!ids.includes(id)) {
        delete switches[frameIds[id]]
        delete frameIds[id]
      }
    }
    openWindowIds.value = available
    if (!available.includes(activeWindowId.value)) activate(nextVisibleWindow(activeWindowId.value))
    if (ready.value) saveLayout()
  }
})

onMounted(() => {
  measure()
  if (globalThis.ResizeObserver) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(canvas.value)
  }
  globalThis.addEventListener('resize', measure)
  globalThis.addEventListener('pointermove', moveInteraction)
  globalThis.addEventListener('pointerup', stopInteraction)
  globalThis.addEventListener('pointercancel', stopInteraction)
  globalThis.addEventListener('blur', stopInteraction)
})
onBeforeUnmount(() => {
  stopInteraction()
  resizeObserver?.disconnect()
  globalThis.removeEventListener('resize', measure)
  globalThis.removeEventListener('pointermove', moveInteraction)
  globalThis.removeEventListener('pointerup', stopInteraction)
  globalThis.removeEventListener('pointercancel', stopInteraction)
  globalThis.removeEventListener('blur', stopInteraction)
})

defineExpose({ openWindow, openLastWindow, closeWindow, switchWindow })
</script>

<template>
  <div class="floating-desktop" role="region" aria-label="Floating work areas">
    <p :id="instructionsId" class="sr-only">Use arrow keys on a window title to move it, Shift and arrow keys to resize it, and Enter to maximize or restore it.</p>
    <div ref="canvas" class="floating-canvas">
      <template v-if="ready">
        <section v-for="(area, index) in windows" v-show="!layouts[area.id].minimized" :key="frameIds[area.id]" class="prototype-page floating-window" :data-frame-id="frameIds[area.id]" :data-theme="themeFor(area)" :data-space-id="spaceFor(area).id" :data-window-id="area.id" :data-active="area.id === activeWindowId" :style="frameStyle(area.id)" role="region" tabindex="-1" :aria-label="`${spaceFor(area).name}: ${windowCaption(area)} ${area.kind === 'agents' ? 'Agents' : 'Editor'} window ${index + 1}`" @pointerdown.capture="activate(area.id)" @focusin="activate(area.id)">
          <slot name="titlebar" :window="area" :space="spaceFor(area)" :blocked="modalWindowIds.includes(area.id)" :maximized="layouts[area.id].maximized" :move-description="instructionsId" :minimize="() => minimize(area.id)" :maximize="() => maximize(area.id)" :close-window="() => closeWindow(area.id)" :start-drag="event => startInteraction(event, area.id, 'move')" :stop-drag="stopInteraction" :geometry-key="event => keyboardGeometry(event, area)">
          <header class="floating-titlebar" :inert="modalWindowIds.includes(area.id) ? '' : null" :data-kind="area.kind">
            <button class="floating-drag-handle" :aria-label="`Move ${area.project} ${area.kind} window`" :aria-describedby="instructionsId" @pointerdown="startInteraction($event, area.id, 'move')" @lostpointercapture="stopInteraction" @dblclick="maximize(area.id)" @keydown="keyboardGeometry($event, area)" @keydown.enter.prevent="maximize(area.id)">
              <i :class="`codicon codicon-${area.kind === 'agents' ? 'agent' : 'code'}`" aria-hidden="true" />
              <span class="truncate">{{ windowCaption(area) }}</span><span class="floating-kind">{{ area.kind === 'agents' ? 'Agents' : 'Editor' }}</span>
            </button>
            <div class="floating-window-controls">
              <button class="icon-button" :aria-label="`Toggle sidebar: ${area.project} ${area.kind}`" :aria-pressed="area.sidebarVisible" @click="emit('toggle-sidebar', area.id)"><i class="codicon codicon-layout-sidebar-left" aria-hidden="true" /></button>
              <button class="icon-button" :aria-label="`Minimize window: ${area.project} ${area.kind}`" @click="minimize(area.id)"><i class="codicon codicon-chrome-minimize" aria-hidden="true" /></button>
              <button class="icon-button" :aria-label="`${layouts[area.id].maximized ? 'Restore' : 'Maximize'} window: ${area.project} ${area.kind}`" :aria-pressed="layouts[area.id].maximized" @click="maximize(area.id)"><i :class="`codicon codicon-chrome-${layouts[area.id].maximized ? 'restore' : 'maximize'}`" aria-hidden="true" /></button>
              <button class="icon-button" :aria-label="`Close window: ${area.project} ${area.kind}`" @click="closeWindow(area.id)"><i class="codicon codicon-chrome-close" aria-hidden="true" /></button>
            </div>
          </header>
          </slot>
          <div class="workbench-viewport floating-window-viewport" :inert="modalWindowIds.includes(area.id) ? '' : null" :data-switching-animation="transitionFor(area).animation" :data-switching-scope="transitionFor(area).scope">
            <Transition :name="transitionFor(area).name" :css="!reducedMotion && transitionFor(area).animation !== 'none'" @before-enter="prepareContentTransition" @before-leave="disableLeavingContent">
              <div :key="area.id" class="floating-work-area" :data-frame-id="frameIds[area.id]">
                <slot :window="area" :space="spaceFor(area)" />
              </div>
            </Transition>
          </div>
          <button v-if="!layouts[area.id].maximized" class="floating-resize-handle" :inert="modalWindowIds.includes(area.id) ? '' : null" :aria-label="`Resize window: ${area.project} ${area.kind}`" :aria-describedby="instructionsId" @pointerdown="startInteraction($event, area.id, 'resize')" @lostpointercapture="stopInteraction" @keydown="keyboardGeometry($event, area, true)" />
        </section>
        <div v-if="!windows.length" class="floating-empty"><h2>No windows open</h2><button class="primary-button" @click="emit('open-work-area', $event.currentTarget)">Open VS Code</button></div>
        <div v-else-if="allMinimized" class="floating-empty"><button class="secondary-button" @click="openWindow(activeWindowId || windows[0].id)">Restore window</button></div>
      </template>
      <p v-if="layoutError" class="floating-layout-error" role="alert">{{ layoutError }}</p>
    </div>
    <span class="sr-only" role="status" aria-live="polite">{{ announcement }}</span>
  </div>
</template>
