<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { activity, inputRequiredCount } from '../model.js'

const props = defineProps({
  spaces: { type: Array, required: true },
  current: { type: Object, required: true },
  visible: { type: Boolean, default: true },
})
const emit = defineEmits(['select', 'select-window', 'new-window', 'close-window', 'move-window', 'create', 'manage', 'help'])
const root = ref()
const spaceTrigger = ref()
const spaceMenu = ref()
const windowMenu = ref()
const spaceMenuOpen = ref(false)
const windowMenuId = ref(null)
const windowMenuTop = ref(80)
const windowMenuTrigger = ref()
const menuWindow = computed(() => props.current.windows.find(window => window.id === windowMenuId.value))
const inputCounts = computed(() => Object.fromEntries(props.current.windows.map(window => [window.id, inputRequiredCount(window)])))
const spaceActivities = computed(() => Object.fromEntries(props.spaces.map(space => [space.id, activity(space)])))
const otherNotifiedSpaces = computed(() => props.spaces.filter(space =>
  space.id !== props.current.id && spaceActivities.value[space.id].inputRequired > 0,
))
const otherSpaceNotificationLabel = computed(() =>
  `${otherNotifiedSpaces.value.length} other ${otherNotifiedSpaces.value.length === 1 ? 'Space has' : 'Spaces have'} sessions needing input`,
)
const spaceSummary = computed(() => otherNotifiedSpaces.value.length
  ? `${props.current.name} · ${otherSpaceNotificationLabel.value}`
  : props.current.name)
const railTooltip = ref(null)
const tooltipNode = ref()
const tooltipDetail = computed(() => railTooltip.value?.detail())

function hideTooltip() {
  railTooltip.value = null
}

async function showTooltip(event, label, detail) {
  if (spaceMenuOpen.value || windowMenuId.value) return
  const anchor = event.currentTarget.getBoundingClientRect()
  railTooltip.value = { label, detail, left: root.value.getBoundingClientRect().right + 8, top: anchor.top }
  await nextTick()
  if (!tooltipNode.value || !railTooltip.value) return
  railTooltip.value.top = Math.max(8, Math.min(anchor.top, globalThis.innerHeight - tooltipNode.value.getBoundingClientRect().height - 8))
}

async function open() {
  close(false)
  spaceMenuOpen.value = true
  await nextTick()
  spaceMenu.value?.querySelector('[aria-checked="true"]')?.focus()
}

function close(restoreFocus = true) {
  hideTooltip()
  const target = windowMenuId.value ? windowMenuTrigger.value : spaceTrigger.value
  spaceMenuOpen.value = false
  windowMenuId.value = null
  windowMenuTrigger.value = undefined
  if (restoreFocus) target?.focus()
}

async function choose(id) {
  close(false)
  emit('select', id)
  await nextTick()
  spaceTrigger.value?.focus()
}

function action(name, id) {
  close()
  emit(name, id)
}

async function chooseWindow(id) {
  close(false)
  emit('select-window', id)
  await nextTick()
  windowButtons().find(button => button.dataset.windowId === id)?.focus()
}

function windowButtons() {
  return [...root.value.querySelectorAll('.rail-window')]
}

async function showWindowMenu(id, event) {
  const trigger = event.currentTarget
  close(false)
  windowMenuId.value = id
  windowMenuTrigger.value = trigger
  await nextTick()
  if (!windowMenu.value || !root.value) return
  const rail = root.value.getBoundingClientRect()
  const anchor = trigger.getBoundingClientRect()
  const height = windowMenu.value.getBoundingClientRect().height
  const bottom = Math.min(rail.bottom, globalThis.innerHeight - 8)
  windowMenuTop.value = Math.max(8, Math.min(anchor.top - rail.top, bottom - rail.top - height - 8))
  windowMenu.value.querySelector('[role="menuitem"]:not(:disabled)')?.focus()
}

function windowLabel(window) {
  return `${window.kind === 'agents' ? 'Agents' : 'Editor'} · ${window.project}${window.sessionContext ? ` · ${window.sessionContext.title}` : ''}`
}

function inputLabel(count) {
  return `${count} ${count === 1 ? 'session needs' : 'sessions need'} input`
}

function windowStatus(window) {
  if (window.sessionContext) return window.sessionContext.title
  if (window.kind === 'editor') return window.branch
  const working = window.sessions.filter(session => session.status === 'working').length
  return [working && `${working} working`, inputCounts.value[window.id] && inputLabel(inputCounts.value[window.id])].filter(Boolean).join(' · ') || `${window.sessions.length} sessions`
}

function handleMenuKeys(event) {
  const activeMenu = event.target.closest('[role="menu"]')
  if (event.key === 'Escape' || event.key === 'ArrowLeft') {
    event.preventDefault()
    event.stopPropagation()
    close()
  } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    const items = [...activeMenu.querySelectorAll('[role^="menuitem"]:not(:disabled)')]
      .filter(item => item.closest('[role="menu"]') === activeMenu)
    const index = items.indexOf(document.activeElement)
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? items.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[next]?.focus()
  } else if (event.key === 'Tab') {
    close()
  }
}

function handleRailKeys(event) {
  if (!event.target.matches('.rail-window') || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const buttons = windowButtons()
  const index = buttons.indexOf(document.activeElement)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
    : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length
  buttons[next]?.focus()
}

function outside(event) {
  if ((spaceMenuOpen.value || windowMenuId.value) && !root.value.contains(event.target)) close(false)
}

watch(() => props.current.id, () => close(false))
watch(() => props.visible, visible => {
  if (!visible) close(false)
})
onMounted(() => {
  document.addEventListener('pointerdown', outside)
  globalThis.addEventListener('resize', hideTooltip)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside)
  globalThis.removeEventListener('resize', hideTooltip)
})
</script>

<template>
  <nav id="spaces-sidebar" v-show="visible" ref="root" class="space-rail" aria-label="Spaces and work areas">
    <button ref="spaceTrigger" class="space-trigger" :aria-label="`Switch Space, ${current.name}`" :aria-describedby="otherNotifiedSpaces.length ? 'other-space-notifications' : undefined" aria-haspopup="menu" :aria-expanded="spaceMenuOpen" aria-controls="space-menu" @click="spaceMenuOpen ? close() : open()" @keydown.down.prevent="open" @mouseenter="showTooltip($event, 'Switch Space', () => spaceSummary)" @mouseleave="hideTooltip" @focus="showTooltip($event, 'Switch Space', () => spaceSummary)" @blur="hideTooltip">
      <span class="space-avatar" :data-color="current.color" aria-hidden="true">{{ current.name.slice(0, 1).toUpperCase() }}</span>
      <span v-if="otherNotifiedSpaces.length" id="other-space-notifications" class="space-notification" role="img" :aria-label="otherSpaceNotificationLabel" />
    </button>
    <span class="rail-divider" />
    <div class="rail-windows" role="group" :aria-label="`Work areas in ${current.name}`" @keydown="handleRailKeys" @scroll="hideTooltip">
      <div v-for="window in current.windows" :key="window.id" class="rail-window-item">
        <button class="rail-window" :data-window-id="window.id" :aria-label="windowLabel(window)" :aria-describedby="inputCounts[window.id] ? `attention-${window.id}` : undefined" aria-keyshortcuts="Shift+F10" :aria-current="window.id === current.activeWindowId ? 'page' : undefined" @click="chooseWindow(window.id)" @contextmenu.prevent="showWindowMenu(window.id, $event)" @keydown.shift.f10.prevent="showWindowMenu(window.id, $event)" @mouseenter="showTooltip($event, `${window.kind === 'agents' ? 'Agents' : 'Editor'} · ${window.project}`, () => windowStatus(window))" @mouseleave="hideTooltip" @focus="showTooltip($event, `${window.kind === 'agents' ? 'Agents' : 'Editor'} · ${window.project}`, () => windowStatus(window))" @blur="hideTooltip">
          <i :class="`codicon codicon-${window.kind === 'agents' ? 'agent' : 'code'}`" aria-hidden="true" />
          <span v-if="inputCounts[window.id]" :id="`attention-${window.id}`" class="rail-attention" role="status" :aria-label="inputLabel(inputCounts[window.id])">{{ inputCounts[window.id] }}</span>
        </button>
      </div>
      <button class="rail-add icon-button" aria-label="New work area" @click="action('new-window')" @mouseenter="showTooltip($event, 'New work area', () => `In ${current.name}`)" @mouseleave="hideTooltip" @focus="showTooltip($event, 'New work area', () => `In ${current.name}`)" @blur="hideTooltip"><i class="codicon codicon-add" aria-hidden="true" /></button>
    </div>
    <div v-if="railTooltip" ref="tooltipNode" class="rail-tooltip" role="tooltip" :style="{ left: `${railTooltip.left}px`, top: `${railTooltip.top}px` }"><strong>{{ railTooltip.label }}</strong><span>{{ tooltipDetail }}</span></div>

    <div v-if="spaceMenuOpen" id="space-menu" ref="spaceMenu" class="space-menu space-switcher-menu" role="menu" aria-label="Switch Space" @keydown="handleMenuKeys">
      <div class="menu-eyebrow">YOUR SPACES</div>
      <button
        v-for="(space, index) in spaces"
        :key="space.id"
        class="space-option"
        role="menuitemradio"
        tabindex="-1"
        :aria-label="`Switch to ${space.name}`"
        :aria-describedby="space.id !== current.id && spaceActivities[space.id].inputRequired ? `space-notification-${space.id}` : undefined"
        :aria-checked="space.id === current.id"
        @click="choose(space.id)"
      >
        <span class="space-option-avatar"><span class="space-avatar" :data-color="space.color" aria-hidden="true">{{ space.name.slice(0, 1).toUpperCase() }}</span><span v-if="space.id !== current.id && spaceActivities[space.id].inputRequired" :id="`space-notification-${space.id}`" class="space-notification" role="img" :aria-label="inputLabel(spaceActivities[space.id].inputRequired)" /></span>
        <span class="space-option-label"><strong class="truncate">{{ space.name }}</strong><span>{{ space.windows.length }} {{ space.windows.length === 1 ? 'work area' : 'work areas' }}<template v-if="spaceActivities[space.id].working"> · {{ spaceActivities[space.id].working }} working</template></span></span>
        <i v-if="space.id === current.id" class="codicon codicon-check" aria-hidden="true" />
        <kbd v-if="index < 9">⌃⌥{{ index + 1 }}</kbd>
      </button>
      <div class="menu-divider" />
      <button class="menu-action" role="menuitem" tabindex="-1" @click="action('create')"><i class="codicon codicon-add" aria-hidden="true" />Create a space</button>
      <button class="menu-action" role="menuitem" tabindex="-1" @click="action('manage')"><i class="codicon codicon-settings-gear" aria-hidden="true" />Manage Spaces…</button>
      <button class="menu-action" role="menuitem" tabindex="-1" @click="action('help')"><i class="codicon codicon-question" aria-hidden="true" />About Spaces</button>
    </div>

    <div v-if="menuWindow" id="window-menu" ref="windowMenu" class="space-menu rail-window-menu" :style="{ top: `${windowMenuTop}px` }" role="menu" aria-label="Work area actions" @keydown="handleMenuKeys">
      <header class="window-menu-heading"><i :class="`codicon codicon-${menuWindow.kind === 'agents' ? 'agent' : 'code'}`" aria-hidden="true" /><div><strong>{{ menuWindow.kind === 'agents' ? 'Agents' : 'Editor' }} · {{ menuWindow.project }}</strong><p>{{ windowStatus(menuWindow) }}</p></div></header>
      <div class="menu-divider" />
      <button class="menu-action" role="menuitem" tabindex="-1" :disabled="spaces.length < 2" @click="action('move-window', menuWindow.id)"><i class="codicon codicon-arrow-swap" aria-hidden="true" />Move to another Space…</button>
      <button class="menu-action" role="menuitem" tabindex="-1" @click="action('close-window', menuWindow.id)"><i class="codicon codicon-close" aria-hidden="true" />Close work area</button>
    </div>
  </nav>
</template>
