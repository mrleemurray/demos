<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { activeSessions, activity, getWorktree, inputRequiredCount, isLinkedWorktree, spaceNameError } from '../model.js'
import SpaceAvatar from './SpaceAvatar.vue'
import SpaceAppearanceFields from './SpaceAppearanceFields.vue'
import { collectionShortcutIndex } from '../keyboard.js'

const props = defineProps({
  spaces: { type: Array, required: true },
  current: { type: Object, required: true },
  floatingWindowIds: { type: Array, default: () => [] },
  floatingMode: { type: Boolean, default: false },
  selectedWindowId: { type: String, default: undefined },
  portal: { type: Boolean, default: false },
  showTrigger: { type: Boolean, default: true },
  theme: { type: String, default: null },
  resolveAnchor: { type: Function, default: null },
})
const emit = defineEmits(['select', 'select-window', 'new-window', 'close-window', 'delete-window', 'move-window', 'float-window', 'update-space', 'preview-theme', 'create', 'manage', 'open-change', 'open-anchor'])
const root = ref()
const spaceTrigger = ref()
const dropdownElement = ref()
const spaceMenu = ref()
const areasMenu = ref()
const windowMenu = ref()
const spaceMenuOpen = ref(false)
const windowMenuId = ref(null)
const windowMenuTrigger = ref()
const dropdownPosition = ref({})
const menuTooltip = ref('')
const menuTooltipElement = ref()
const menuTooltipPosition = ref({})
let tooltipAnchor
let externalTrigger
let followFrame
const editingDetails = ref(false)
const editButton = ref()
const titleInput = ref()
const draftTitle = ref('')
const draftDescription = ref('')
const draftImage = ref(null)
const draftTheme = ref('dark')
const draftColor = ref('blue')
const imageLoading = ref(false)
const detailsError = ref('')
const browsedSpaceId = ref(props.current.id)
const browsedSpace = computed(() => props.spaces.find(space => space.id === browsedSpaceId.value) || props.current)
const floatingIds = computed(() => new Set(props.floatingWindowIds))
const selectedWindowId = computed(() => props.selectedWindowId === undefined ? props.current.activeWindowId : props.selectedWindowId)
const menuWindow = computed(() => browsedSpace.value.windows.find(window => window.id === windowMenuId.value))
const inputCounts = computed(() => Object.fromEntries(browsedSpace.value.windows.map(window => [window.id, inputRequiredCount(window)])))
const spaceActivities = computed(() => Object.fromEntries(props.spaces.map(space => [space.id, activity(space)])))
const otherNotifiedSpaces = computed(() => props.spaces.filter(space =>
  space.id !== props.current.id && spaceActivities.value[space.id].inputRequired > 0,
))
const otherSpaceNotificationLabel = computed(() =>
  `${otherNotifiedSpaces.value.length} other ${otherNotifiedSpaces.value.length === 1 ? 'Collection has' : 'Collections have'} sessions needing input`,
)

function triggerElement() {
  if (externalTrigger) {
    const anchor = props.resolveAnchor?.() || externalTrigger
    if (anchor?.isConnected && !anchor.closest('[inert]') && anchor.closest('.floating-window')?.style.display !== 'none') return anchor
  }
  return spaceTrigger.value
}

function positionDropdown() {
  const trigger = triggerElement()
  if (!trigger) return
  if (externalTrigger && trigger !== spaceTrigger.value) externalTrigger = trigger
  const anchor = trigger.getBoundingClientRect()
  const width = Math.min(560, globalThis.innerWidth - 24)
  const position = {
    left: `${Math.max(12, Math.min(anchor.left, globalThis.innerWidth - width - 12))}px`,
    top: `${anchor.bottom}px`,
    width: `${width}px`,
    maxHeight: `${Math.max(0, globalThis.innerHeight - anchor.bottom - 12)}px`,
  }
  if (Object.keys(position).some(key => dropdownPosition.value[key] !== position[key])) dropdownPosition.value = position
}

function followAnchor() {
  if (!spaceMenuOpen.value || !externalTrigger) return
  positionDropdown()
  followFrame = requestAnimationFrame(followAnchor)
}

async function open(anchor) {
  close(false)
  browsedSpaceId.value = props.current.id
  externalTrigger = anchor instanceof HTMLElement ? anchor : undefined
  emit('open-anchor', externalTrigger)
  positionDropdown()
  spaceMenuOpen.value = true
  if (externalTrigger) followAnchor()
  await nextTick()
  spaceMenu.value?.querySelector('[aria-checked="true"]')?.focus()
}

function close(restoreFocus = true) {
  if (followFrame !== undefined) cancelAnimationFrame(followFrame)
  followFrame = undefined
  hideMenuTooltip()
  editingDetails.value = false
  detailsError.value = ''
  spaceMenuOpen.value = false
  windowMenuId.value = null
  windowMenuTrigger.value = undefined
  if (restoreFocus) triggerElement()?.focus()
  externalTrigger = undefined
}

function toggle(anchor) {
  if (spaceMenuOpen.value && externalTrigger === anchor) close()
  else open(anchor)
}

function closeWindowMenu() {
  windowMenuId.value = null
  windowMenuTrigger.value?.focus()
  windowMenuTrigger.value = undefined
}

function browse(id) {
  hideMenuTooltip()
  editingDetails.value = false
  detailsError.value = ''
  windowMenuId.value = null
  browsedSpaceId.value = id
}

async function choose(id) {
  browse(id)
  await nextTick()
  spaceMenu.value?.querySelector('[aria-checked="true"]')?.focus()
}

function action(name, id) {
  close()
  emit(name, id)
}

function chooseWindow(id) {
  close()
  emit('select-window', id)
}

async function showWindowMenu(id, event) {
  hideMenuTooltip()
  const trigger = event.currentTarget
  windowMenuId.value = id
  windowMenuTrigger.value = trigger
  await nextTick()
  windowMenu.value?.querySelector('[role="menuitem"]:not(:disabled)')?.focus()
}

function windowLabel(window) {
  return [window.kind === 'agents' ? 'Agents' : 'Editor', window.project, windowMeta(window), window.sessionContext?.title].filter(Boolean).join(' · ')
}

function checkoutSummary(window) {
  const tree = getWorktree(browsedSpace.value, window.worktreeId)
  return isLinkedWorktree(tree) ? tree.name : ''
}

function projectName(project) {
  return project.split(/[\\/]/).filter(Boolean).at(-1) || project
}

function windowMeta(window) {
  if (window.sessionContext) return ''
  const count = activeSessions(window).length
  return window.kind === 'editor' ? [checkoutSummary(window), getWorktree(browsedSpace.value, window.worktreeId).branch].filter(Boolean).join(' · ')
    : `${count} ${count === 1 ? 'session' : 'sessions'}`
}

async function showMenuTooltip(event) {
  const anchor = event.target.closest('[data-menu-tooltip]')
  if (!anchor || !spaceMenuOpen.value) {
    hideMenuTooltip()
    return
  }
  if (anchor === tooltipAnchor) return
  tooltipAnchor = anchor
  menuTooltip.value = anchor.dataset.menuTooltip
  menuTooltipPosition.value = { visibility: 'hidden', left: '0px', top: '0px' }
  await nextTick()
  if (tooltipAnchor !== anchor || !anchor.isConnected) return
  const target = anchor.getBoundingClientRect()
  const tooltip = menuTooltipElement.value.getBoundingClientRect()
  const below = target.bottom + 8
  const top = below + tooltip.height <= globalThis.innerHeight - 12 ? below : target.top - tooltip.height - 8
  menuTooltipPosition.value = {
    left: `${Math.max(12, Math.min(target.left, globalThis.innerWidth - tooltip.width - 12))}px`,
    top: `${Math.max(12, Math.min(top, globalThis.innerHeight - tooltip.height - 12))}px`,
  }
}

function hideMenuTooltip() {
  tooltipAnchor = undefined
  menuTooltip.value = ''
}

function leaveMenuTooltip(event) {
  const anchor = event.target.closest('[data-menu-tooltip]')
  if (anchor === tooltipAnchor && !anchor?.contains(event.relatedTarget)) hideMenuTooltip()
}

function inputLabel(count) {
  return `${count} ${count === 1 ? 'session needs' : 'sessions need'} input`
}

function windowDescription(window) {
  return [
    inputCounts.value[window.id] ? `attention-${window.id}` : null,
  ].filter(Boolean).join(' ') || undefined
}

function showWindowAction(id) {
  return id !== selectedWindowId.value || !floatingIds.value.has(id)
}

function windowActionLabel(id) {
  return floatingIds.value.has(id) ? 'Focus window' : 'Open in new window'
}

function windowActionIcon(id) {
  return floatingIds.value.has(id) ? 'multiple-windows' : 'open-in-window'
}

async function editDetails() {
  hideMenuTooltip()
  draftTitle.value = browsedSpace.value.name
  draftDescription.value = browsedSpace.value.description
  draftImage.value = browsedSpace.value.image
  draftTheme.value = browsedSpace.value.theme
  draftColor.value = browsedSpace.value.color
  imageLoading.value = false
  detailsError.value = ''
  editingDetails.value = true
  await nextTick()
  titleInput.value?.focus()
  titleInput.value?.select()
}

async function cancelEditing() {
  editingDetails.value = false
  detailsError.value = ''
  await nextTick()
  editButton.value?.focus()
}

function saveDetails() {
  if (imageLoading.value) return
  detailsError.value = spaceNameError({ spaces: props.spaces }, draftTitle.value, browsedSpace.value.id)
  if (detailsError.value) {
    titleInput.value?.focus()
    return
  }
  emit('update-space', {
    id: browsedSpace.value.id,
    name: draftTitle.value,
    description: draftDescription.value,
    color: draftColor.value,
    image: draftImage.value,
    theme: draftTheme.value,
  })
  cancelEditing()
}

function handleEditorTab(event) {
  const controls = [...event.currentTarget.querySelectorAll('input, button')].filter(control => !control.disabled)
  const boundary = event.shiftKey ? controls[0] : controls.at(-1)
  if (document.activeElement === boundary) {
    event.preventDefault()
    spaceMenu.value?.querySelector('[aria-checked="true"]')?.focus()
  }
}

function handleMenuKeys(event) {
  const collectionIndex = collectionShortcutIndex(event)
  if (collectionIndex >= 0) {
    const space = props.spaces[collectionIndex]
    if (space) {
      event.preventDefault()
      event.stopPropagation()
      choose(space.id)
    }
    return
  }
  if (event.target.closest('.space-details-form')) return
  const activeMenu = event.target.closest('[role="menu"]')
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    if (windowMenuId.value) closeWindowMenu()
    else close()
  } else if (event.key === 'ArrowRight' && activeMenu === spaceMenu.value) {
    event.preventDefault()
    const target = editingDetails.value ? titleInput.value
      : areasMenu.value?.querySelector('[aria-checked="true"]') || areasMenu.value?.querySelector('[data-last-used="true"]') || areasMenu.value?.querySelector('.work-area-option') || areasMenu.value?.querySelector('[role="menuitem"]')
    target?.focus()
  } else if (event.key === 'ArrowRight' && activeMenu === areasMenu.value) {
    const actions = [...(event.target.closest('.work-area-row')?.querySelectorAll('.work-area-popout, .work-area-menu-trigger') || [])]
    if (actions.length) {
      event.preventDefault()
      actions[Math.min(actions.indexOf(event.target) + 1, actions.length - 1)].focus()
    }
  } else if (event.key === 'ArrowLeft' && activeMenu !== spaceMenu.value) {
    event.preventDefault()
    if (windowMenuId.value) closeWindowMenu()
    else if (event.target.closest('.work-area-menu-trigger')) {
      const row = event.target.closest('.work-area-row')
      const target = row.querySelector('.work-area-popout') || row.querySelector('.work-area-option')
      target.focus()
    } else if (event.target.closest('.work-area-popout')) event.target.closest('.work-area-row').querySelector('.work-area-option').focus()
    else spaceMenu.value?.querySelector('[aria-checked="true"]')?.focus()
  } else if (activeMenu && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    const items = [...activeMenu.querySelectorAll('[role^="menuitem"]')]
      .filter(item => !item.disabled && !item.matches('.work-area-popout, .work-area-menu-trigger') && item.closest('[role="menu"]') === activeMenu)
    const focused = document.activeElement.closest('.work-area-row')?.querySelector('.work-area-option') || document.activeElement
    const index = items.indexOf(focused)
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? items.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[next]?.focus()
  } else if (event.key === 'Tab') {
    close()
  }
}

function outside(event) {
  if ((spaceMenuOpen.value || windowMenuId.value) && !root.value.contains(event.target) &&
    !dropdownElement.value?.contains(event.target) && !triggerElement()?.contains(event.target)) close(false)
}

watch(spaceMenuOpen, value => emit('open-change', value))
watch(() => props.current.id, async () => {
  browsedSpaceId.value = props.current.id
  hideMenuTooltip()
  editingDetails.value = false
  detailsError.value = ''
  windowMenuId.value = null
  if (spaceMenuOpen.value) {
    await nextTick()
    positionDropdown()
    spaceMenu.value?.querySelector('[aria-checked="true"]')?.focus()
  }
})
function resize() {
  hideMenuTooltip()
  if (spaceMenuOpen.value) positionDropdown()
}
onMounted(() => {
  document.addEventListener('pointerdown', outside)
  globalThis.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  if (followFrame !== undefined) cancelAnimationFrame(followFrame)
  emit('open-change', false)
  hideMenuTooltip()
  document.removeEventListener('pointerdown', outside)
  globalThis.removeEventListener('resize', resize)
})

defineExpose({ open, close, toggle })
</script>

<template>
  <div ref="root" class="titlebar-spaces">
    <button v-if="showTrigger" ref="spaceTrigger" class="space-trigger" :aria-label="`Switch Collection, ${current.name}`" :aria-describedby="otherNotifiedSpaces.length ? 'other-space-notifications' : undefined" aria-haspopup="dialog" :aria-expanded="spaceMenuOpen" aria-controls="spaces-dropdown" @click="spaceMenuOpen ? close() : open()" @keydown.down.prevent="open">
      <span class="space-trigger-avatar"><SpaceAvatar :name="current.name" :color="current.color" :image="current.image" /><span v-if="otherNotifiedSpaces.length" id="other-space-notifications" class="space-notification" role="img" :aria-label="otherSpaceNotificationLabel" /></span>
      <span class="space-trigger-name truncate">{{ current.name }}</span><i class="codicon codicon-chevron-down" aria-hidden="true" />
    </button>

    <Teleport to="body" :disabled="!portal">
    <div v-if="spaceMenuOpen" id="spaces-dropdown" ref="dropdownElement" class="spaces-dropdown" :class="{ 'prototype-page': portal }" :data-theme="editingDetails ? draftTheme : theme || current.theme" :style="dropdownPosition" role="dialog" aria-label="Collections" @keydown="handleMenuKeys" @pointerover="showMenuTooltip" @pointerout="leaveMenuTooltip" @pointerleave="hideMenuTooltip" @focusin="showMenuTooltip" @focusout="leaveMenuTooltip" @scroll.capture="hideMenuTooltip">
      <nav id="space-menu" ref="spaceMenu" class="space-menu space-switcher-menu" role="menu" aria-label="Browse Collections">
        <div class="collection-list" role="none">
        <button v-for="(space, index) in spaces" :key="space.id" class="space-option" role="menuitemradio" tabindex="-1" :aria-label="`Browse ${space.name}`" :aria-describedby="space.id !== current.id && spaceActivities[space.id].inputRequired ? `space-notification-${space.id}` : undefined" :aria-checked="space.id === browsedSpace.id" :aria-keyshortcuts="index < 9 ? `Control+Alt+${index + 1}` : undefined" @click="choose(space.id)">
          <span class="space-option-avatar"><SpaceAvatar :name="space.name" :color="space.color" :image="space.image" /><span v-if="space.id !== current.id && spaceActivities[space.id].inputRequired" :id="`space-notification-${space.id}`" class="space-notification" role="img" :aria-label="inputLabel(spaceActivities[space.id].inputRequired)" /></span>
          <span class="space-option-label"><strong class="truncate">{{ space.name }}</strong><span>{{ space.windows.length }} {{ space.windows.length === 1 ? 'work area' : 'work areas' }}</span></span>
          <kbd v-if="index < 9">⌃⌥{{ index + 1 }}</kbd>
        </button>
        </div>
        <div class="collection-actions" role="none">
        <div class="menu-divider" role="separator" />
        <button class="menu-action" role="menuitem" tabindex="-1" @click="action('create')"><i class="codicon codicon-add" aria-hidden="true" />Create a collection</button>
        <button class="menu-action" role="menuitem" tabindex="-1" @click="action('manage', browsedSpace.id)"><i class="codicon codicon-settings-gear" aria-hidden="true" />Manage collections…</button>
        </div>
      </nav>

      <section :key="browsedSpace.id" ref="areasMenu" class="space-menu work-areas-menu" :class="{ 'is-editing': editingDetails }" :role="editingDetails ? 'region' : 'menu'" :aria-label="`Work areas in ${browsedSpace.name}`">
        <header class="work-areas-heading">
          <form v-if="editingDetails" class="space-details-form" aria-label="Edit Collection details" @submit.prevent="saveDetails" @keydown.esc.prevent.stop="cancelEditing" @keydown.tab="handleEditorTab">
            <label for="space-details-title">Collection title</label>
            <input id="space-details-title" ref="titleInput" v-model="draftTitle" maxlength="40" :aria-invalid="Boolean(detailsError)" :aria-describedby="detailsError ? 'space-details-error' : undefined" />
            <p v-if="detailsError" id="space-details-error" class="field-error" role="alert">{{ detailsError }}</p>
            <label for="space-details-description">Description <span class="muted">(optional)</span></label>
            <input id="space-details-description" v-model="draftDescription" maxlength="80" placeholder="What belongs here?" />
            <SpaceAppearanceFields v-model:color="draftColor" v-model:image="draftImage" v-model:theme="draftTheme" :name="draftTitle" @preview-theme="emit('preview-theme', { spaceId: browsedSpace.id, theme: $event })" @busy="imageLoading = $event" />
            <div class="space-details-actions"><button type="button" class="secondary-button" @click="cancelEditing">Cancel</button><button type="submit" class="primary-button" :disabled="imageLoading">Save</button></div>
          </form>
          <div v-else class="space-details-heading">
            <div><h2 class="truncate">{{ browsedSpace.name }}</h2><p>{{ browsedSpace.description || 'Your work, in context' }}</p></div>
            <button ref="editButton" class="icon-button edit-space-details" role="menuitem" tabindex="-1" aria-label="Edit Collection details" data-menu-tooltip="Edit Collection details" @click="editDetails"><i class="codicon codicon-edit" aria-hidden="true" /></button>
          </div>
        </header>
        <template v-if="!editingDetails">
        <div class="work-area-list" role="none">
        <div v-for="window in browsedSpace.windows" :key="window.id" class="work-area-row" role="none">
        <button class="work-area-option" role="menuitemradio" tabindex="-1" :data-window-id="window.id" :data-last-used="window.id === browsedSpace.activeWindowId" :aria-label="`${windowLabel(window)}${floatingMode && !floatingIds.has(window.id) ? ', closed' : ''}`" :aria-describedby="windowDescription(window)" :aria-checked="window.id === selectedWindowId" aria-keyshortcuts="Shift+F10" @click="chooseWindow(window.id)" @contextmenu.prevent="showWindowMenu(window.id, $event)" @keydown.shift.f10.prevent="showWindowMenu(window.id, $event)">
          <i :class="`codicon codicon-${window.kind === 'agents' ? 'agent' : 'code'}`" aria-hidden="true" />
          <span class="work-area-copy"><span class="work-area-title"><strong class="work-area-project-name truncate">{{ projectName(window.project) }}</strong><span v-if="inputCounts[window.id]" :id="`attention-${window.id}`" class="work-area-attention" role="status" :aria-label="inputLabel(inputCounts[window.id])">{{ inputCounts[window.id] }}</span></span><span v-if="windowMeta(window)" class="work-area-meta"><span class="work-area-stat truncate">{{ windowMeta(window) }}</span></span><span v-if="window.sessionContext" class="work-area-description">{{ window.sessionContext.title }}</span></span>
        </button>
        <button v-if="showWindowAction(window.id)" class="icon-button work-area-popout" role="menuitem" tabindex="-1" :data-menu-tooltip="windowActionLabel(window.id)" :aria-label="`${windowActionLabel(window.id)}: ${windowLabel(window)}`" @click="action('float-window', window.id)"><i :class="`codicon codicon-${windowActionIcon(window.id)}`" aria-hidden="true" /></button>
        <button class="icon-button work-area-menu-trigger" role="menuitem" tabindex="-1" aria-haspopup="menu" :aria-expanded="windowMenuId === window.id" aria-controls="window-menu" data-menu-tooltip="Work area actions" :aria-label="`Work area actions: ${windowLabel(window)}`" @click="showWindowMenu(window.id, $event)"><i class="codicon codicon-ellipsis" aria-hidden="true" /></button>
        </div>
        <p v-if="!browsedSpace.windows.length" class="work-areas-empty">No open work areas.</p>
        </div>
        <button class="menu-action" role="menuitem" tabindex="-1" @click="action('new-window', browsedSpace.id)"><i class="codicon codicon-add" aria-hidden="true" />New work area</button>
        </template>
      </section>

      <div v-if="menuWindow" id="window-menu" ref="windowMenu" class="work-area-actions" role="menu" aria-label="Work area actions">
        <button v-if="showWindowAction(menuWindow.id)" class="menu-action" role="menuitem" tabindex="-1" @click="action('float-window', menuWindow.id)"><i :class="`codicon codicon-${windowActionIcon(menuWindow.id)}`" aria-hidden="true" />{{ windowActionLabel(menuWindow.id) }}</button>
        <button class="menu-action" role="menuitem" tabindex="-1" :disabled="spaces.length < 2" @click="action('move-window', menuWindow.id)"><i class="codicon codicon-arrow-swap" aria-hidden="true" />Move to another Collection…</button>
        <button v-if="!floatingMode" class="menu-action" role="menuitem" tabindex="-1" @click="action('close-window', menuWindow.id)"><i class="codicon codicon-close" aria-hidden="true" />Close work area</button>
        <div class="menu-divider" role="separator" />
        <button class="menu-action danger-text" role="menuitem" tabindex="-1" @click="action('delete-window', menuWindow.id)"><i class="codicon codicon-trash" aria-hidden="true" />Delete work area…</button>
      </div>
    </div>
    <span v-if="menuTooltip" ref="menuTooltipElement" class="tooltip collection-menu-tooltip" :class="{ 'prototype-page': portal }" :data-theme="theme || current.theme" :style="menuTooltipPosition" role="tooltip">{{ menuTooltip }}</span>
    </Teleport>
  </div>
</template>
