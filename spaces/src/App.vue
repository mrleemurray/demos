<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import SpaceSwitcher from './components/SpaceSwitcher.vue'
import SpaceDialog from './components/SpaceDialog.vue'
import WindowView from './components/WindowView.vue'
import WindowKindPicker from './components/WindowKindPicker.vue'
import FloatingDesktop from './components/FloatingDesktop.vue'
import WorkbenchTitlebar from './components/WorkbenchTitlebar.vue'
import DialogHost from './components/DialogHost.vue'
import FeatureTour from './components/FeatureTour.vue'
import { createStateSync } from './stateSync.js'
import { collectionShortcutIndex } from './keyboard.js'
import {
  activeSessions, activeSpace, activeWindow, addSessionToCollection, addWindow, closeWindow, createState, getProjectBranches, getWorktree, isLinkedWorktree, loadExampleProjects, loadWorkstreamExamples, markSessionDone, migrationBackupKey,
  moveSession, moveWindow, openSessionInEditor, removeSpace, restoreState, saveSpace, selectSpace, selectWindow,
  sessionWorktree, sessionWorktreeMigrationBackupKey, storageKey, worktreeMigrationBackupKey,
} from './model.js'

const storageError = ref('')
const migrationNotice = ref('')
const windowError = ref('')
const route = new URLSearchParams(globalThis.location.search)
const routedWindowId = route.get('popout') || route.get('dock')
const prototypeSettingsKey = 'vscode-collections-prototype-settings-v1'
const switchingAnimations = [
  { id: 'fade', label: 'Fade and slide' },
  { id: 'none', label: 'None' },
  { id: 'zoom', label: 'Zoom focus' },
]
const switcherPosition = ref('titlebar')
const windowLayout = ref('single')
const floatingDesktop = ref()
const focusedDesktopWindowId = ref(null)
const openDesktopWindowIds = ref([])
const initialDesktopWindowIds = ref([])
const initialDesktopActiveWindowId = ref(null)
const desktopCollectionSwitcher = ref()
const collectionMenuOpen = ref(false)
const collectionWindowId = ref(null)
const switchingAnimation = ref('fade')
const collectionSwitchingAnimation = ref('fade')
const switchingCollections = ref(false)
const collectionSlideDirection = ref(1)
const activeSwitchingAnimation = computed(() => switchingCollections.value ? collectionSwitchingAnimation.value : switchingAnimation.value)
const motionPreference = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')
const reducedMotion = ref(motionPreference?.matches ?? false)
const collectionSlide = computed(() => switchingCollections.value && activeSwitchingAnimation.value === 'fade')
const switchingMotion = computed(() => !reducedMotion.value && (activeSwitchingAnimation.value === 'zoom' || collectionSlide.value))
const prototypeSettingsError = ref('')
try {
  const raw = localStorage.getItem(prototypeSettingsKey)
  if (raw !== null) {
    const settings = JSON.parse(raw)
    if (!settings || !['titlebar', 'command-center'].includes(settings.switcherPosition)) {
      throw new Error('Unsupported Collection switcher position.')
    }
    if (settings.windowLayout !== undefined && !['single', 'floating'].includes(settings.windowLayout)) {
      throw new Error('Unsupported window layout.')
    }
    for (const setting of ['switchingAnimation', 'collectionSwitchingAnimation']) {
      if (settings[setting] !== undefined && !switchingAnimations.some(option => option.id === settings[setting])) {
        throw new Error('Unsupported switching animation.')
      }
    }
    switcherPosition.value = settings.switcherPosition
    windowLayout.value = settings.windowLayout ?? 'single'
    switchingAnimation.value = settings.switchingAnimation ?? 'fade'
    collectionSwitchingAnimation.value = settings.collectionSwitchingAnimation ?? switchingAnimation.value
  }
} catch (error) {
  console.error('Unable to load prototype settings:', error)
  prototypeSettingsError.value = 'Prototype settings could not be loaded. Using the default settings.'
}
let initialState
let legacyState
let migrationKey = migrationBackupKey
let recoverCorrupt = false
try {
  const raw = localStorage.getItem(storageKey)
  initialState = restoreState(raw)
  if (raw !== null && JSON.parse(raw).version !== initialState.version) {
    legacyState = raw
    if (JSON.parse(raw).version === 3) migrationKey = worktreeMigrationBackupKey
    if (JSON.parse(raw).version === 4) migrationKey = sessionWorktreeMigrationBackupKey
  }
} catch (error) {
  console.error('Unable to restore the Collections prototype:', error)
  storageError.value = 'Saved collections could not be loaded. Showing the example collections instead.'
  initialState = createState()
  recoverCorrupt = true
}
const state = reactive(initialState)
const current = computed(() => activeSpace(state))
const previewTheme = ref(null)
const previewSpaceId = ref(null)
const displayedTheme = computed(() => themeForSpace(current.value))
const currentWindow = computed(() => windowLayout.value === 'floating'
  ? openDesktopWindowIds.value.includes(focusedDesktopWindowId.value) ? findArea(focusedDesktopWindowId.value)?.area : null
  : activeWindow(state))
watch([() => current.value.id, () => currentWindow.value?.id], ([spaceId], [previousSpaceId]) => {
  switchingCollections.value = spaceId !== previousSpaceId
  if (switchingCollections.value) {
    const previousIndex = state.spaces.findIndex(space => space.id === previousSpaceId)
    const nextIndex = state.spaces.findIndex(space => space.id === spaceId)
    collectionSlideDirection.value = previousIndex >= 0 && nextIndex < previousIndex ? -1 : 1
  }
  // Recheck before rendering a switch if the media-query change event is still queued.
  reducedMotion.value = motionPreference?.matches ?? false
})
const currentCheckout = computed(() => {
  const target = findArea(currentWindow.value?.id)
  return target ? checkoutForWindow(target.area, target.space) : null
})
const sidebarVisible = computed({
  get: () => currentWindow.value?.sidebarVisible ?? false,
  set: value => { currentWindow.value.sidebarVisible = value },
})
const dialogMode = ref(null)
const dialogTarget = shallowRef(null)
const dialogSourceId = ref(null)
const dialogSpaceId = ref(null)
const dialogSpace = computed(() => state.spaces.find(space => space.id === dialogSpaceId.value) || current.value)
const dialogState = computed(() => ({ ...state, activeSpaceId: dialogSpace.value.id }))
const dialogTheme = computed(() => {
  const source = findArea(dialogSourceId.value)
  if (source) return themeForSpace(source.space)
  return dialogMode.value === 'prototype-settings' && windowLayout.value === 'floating'
    ? 'dark' : previewTheme.value ?? themeForSpace(dialogSpace.value)
})
const prototypeSettingsTrigger = ref()
const featureTourTrigger = ref()
const featureTourOpen = ref(false)
const exampleProjectsNotice = ref('')
const modalWindowIds = computed(() => [
  dialogMode.value && dialogTarget.value ? dialogSourceId.value : null,
].filter(Boolean))
const utilityDialog = ref()
const windowKind = ref('agents')
const workAreaOpening = ref('current')
const canOpenInCurrentWindow = computed(() => windowLayout.value === 'single' ||
  Boolean(dialogSourceId.value && openDesktopWindowIds.value.includes(dialogSourceId.value)))
const windowProjectChoice = ref('')
const windowProject = ref('')
const windowProjectInput = ref()
const otherWindowProjectInput = ref()
const windowCheckoutChoice = ref('')
const projectOptions = computed(() => [...new Set(state.spaces.flatMap(space => space.windows.map(area => area.project)))])
const selectedEditorProject = computed(() => windowProjectChoice.value === 'other' ? windowProject.value.trim()
  : projectOptions.value.find(project => `project:${project}` === windowProjectChoice.value) || '')
const projectWorktrees = computed(() => dialogSpace.value.worktrees.filter(tree => tree.project === selectedEditorProject.value))
const linkedProjectWorktrees = computed(() => projectWorktrees.value.filter(isLinkedWorktree))
const projectBranches = computed(() => getProjectBranches(dialogState.value, selectedEditorProject.value))
watch(selectedEditorProject, () => { windowCheckoutChoice.value = `branch:${projectBranches.value[0]}` })
const dialogWindowId = ref(null)
const dialogWindow = computed(() => dialogSpace.value.windows.find(window => window.id === dialogWindowId.value))
const dialogSessionId = ref(null)
const dialogSession = computed(() => dialogWindow.value?.sessions.find(session => session.id === dialogSessionId.value))
const targetSpaceId = ref('')
const formError = ref('')
const announcement = ref('')
let dialogTrigger

const stateSync = createStateSync(state, {
  recoverCorrupt,
  beforeSave() {
    if (legacyState) {
      if (localStorage.getItem(migrationKey) === null) localStorage.setItem(migrationKey, legacyState)
      legacyState = undefined
      migrationNotice.value = migrationKey === sessionWorktreeMigrationBackupKey
        ? 'Sessions now have individual worktrees. Saved content was preserved; previous data is backed up locally.'
        : 'Saved Collections were updated. Existing work areas and sessions were preserved; previous demo data is backed up locally.'
    }
  },
  onSaved() { storageError.value = '' },
  onError(error) {
    console.error('Unable to save the Collections prototype:', error)
    storageError.value = legacyState
      ? 'The browser could not back up your previous demo data. The original saved data has not been overwritten; changes will be lost on reload.'
      : 'Your browser could not save these changes. They will be lost on reload.'
  },
})
if (legacyState) stateSync.save()
if (routedWindowId) {
  const target = findArea(routedWindowId)
  if (target) {
    selectSpace(state, target.space.id)
    selectWindow(state, target.area.id)
    windowLayout.value = 'floating'
    savePrototypeSettings()
  } else {
    windowError.value = 'This work area is no longer available.'
  }
}
initialDesktopWindowIds.value = current.value.windows.map(area => area.id)
initialDesktopActiveWindowId.value = activeWindow(state)?.id ?? null

function findArea(id) {
  const space = state.spaces.find(item => item.windows.some(area => area.id === id))
  return space ? { space, area: space.windows.find(area => area.id === id) } : undefined
}

function checkoutForWindow(area, space) {
  return sessionWorktree(space, area, area.kind === 'agents'
    ? area.sessions.find(session => session.id === area.selectedSessionId) : undefined)
}

function themeForSpace(space) {
  return space.id === previewSpaceId.value && previewTheme.value !== null ? previewTheme.value : space.theme
}

function previewSpaceTheme(value) {
  previewTheme.value = value?.theme ?? null
  previewSpaceId.value = value?.spaceId ?? null
}

async function openFloatingWindow(id) {
  const target = findArea(id)
  if (!target) {
    windowError.value = 'This work area is no longer available.'
    return
  }
  windowError.value = ''
  if (windowLayout.value !== 'floating') await updateWindowLayout('floating')
  selectSpace(state, target.space.id)
  selectWindow(state, id)
  await nextTick()
  await floatingDesktop.value?.openWindow(id)
}

function workAreaElement(id = currentWindow.value?.id) {
  if (windowLayout.value === 'floating') {
    return [...document.querySelectorAll('.workbench-body:not([inert]) .floating-window')].find(element => element.dataset.windowId === id)
  }
  return document.querySelector('.workbench-body:not([inert])')
}

function focusWorkArea(selector) {
  const target = [...(workAreaElement()?.querySelectorAll(selector) || [])].find(element => !element.closest('[inert]'))
  target?.focus()
}

function toggleWindowSidebar(id) {
  const target = findArea(id)
  if (!target) {
    windowError.value = 'This work area is no longer available.'
    return
  }
  target.area.sidebarVisible = !target.area.sidebarVisible
}

function prepareWorkAreaTransition(element) {
  element.style.setProperty('--collection-slide-direction', String(collectionSlideDirection.value))
}

function disableLeavingWorkArea(element) {
  prepareWorkAreaTransition(element)
  element.setAttribute('inert', '')
  element.setAttribute('aria-hidden', 'true')
}

function updateMotionPreference(event) {
  reducedMotion.value = event.matches
}

function chooseSpace(id) {
  const sourceId = windowLayout.value === 'floating' ? collectionTargetWindowId() : null
  selectSpace(state, id)
  const area = activeWindow(state)
  if (sourceId && area) switchDesktopWindow(sourceId, area.id, !collectionMenuOpen.value)
  announcement.value = `${current.value.name} collection.${area ? ` ${area.kind === 'agents' ? 'Agents' : 'Editor'} work area. ${area.project}.` : windowLayout.value === 'single' ? ' No open work areas.' : ''}`
}

function collectionTargetWindowId() {
  return collectionMenuOpen.value ? collectionWindowId.value : focusedDesktopWindowId.value
}

function switchDesktopWindow(sourceId, id, focus = false) {
  if (floatingDesktop.value?.switchWindow(sourceId, id, focus) && collectionWindowId.value === sourceId) {
    collectionWindowId.value = id
  }
}

function chooseWindow(id) {
  const target = findArea(id)
  if (!target) {
    windowError.value = 'This work area is no longer available.'
    return
  }
  const changingCollection = target.space.id !== current.value.id
  selectSpace(state, target.space.id)
  if (windowLayout.value === 'floating') {
    const sourceId = collectionTargetWindowId()
    if (sourceId) switchDesktopWindow(sourceId, id, true)
    else floatingDesktop.value?.openWindow(id)
  }
  else {
    selectWindow(state, id)
  }
  announcement.value = `${changingCollection ? `${target.space.name} collection. ` : ''}${target.area.kind === 'agents' ? 'Agents' : 'Editor'} work area. ${target.area.project}.`
}

function activateDesktopWindow(id) {
  focusedDesktopWindowId.value = id
  if (!id) return
  const target = findArea(id)
  if (!target) {
    focusedDesktopWindowId.value = null
    windowError.value = 'This work area is no longer available.'
    return
  }
  selectWindow({ ...state, activeSpaceId: target.space.id }, id)
}

async function desktopWindowClosed(id) {
  announcement.value = `${findArea(id)?.area.project || 'Work area'} window closed.`
  await nextTick()
  if (focusedDesktopWindowId.value) await floatingDesktop.value?.openWindow(focusedDesktopWindowId.value)
  else document.querySelector('.floating-empty button')?.focus()
}

async function openVSCode(anchor) {
  const id = await floatingDesktop.value.openLastWindow(activeWindow(state)?.id)
  if (id) {
    const target = findArea(id)
    if (!target) {
      windowError.value = 'This work area is no longer available.'
      return
    }
    announcement.value = `${target.area.project} ${target.area.kind === 'agents' ? 'Agents' : 'Editor'} work area opened.`
  } else {
    announcement.value = 'No saved work areas. Create one to get started.'
    desktopCollectionSwitcher.value?.open(anchor)
  }
}

function collectionEvents() {
  return {
    select: chooseSpace, 'select-window': chooseWindow,
    'new-window': id => showDialog('new-window', undefined, id), 'close-window': closeSpaceWindow,
    'delete-window': id => showDialog('delete-window', id, findArea(id)?.space.id),
    'move-window': id => showDialog('move', id, findArea(id)?.space.id), 'float-window': openFloatingWindow,
    'update-space': updateSpaceDetails, 'preview-theme': previewSpaceTheme,
    create: () => showDialog('create'), manage: id => showDialog('manage', undefined, id),
  }
}

function titlebarEvents(area) {
  return { ...collectionEvents(), 'toggle-sidebar': () => toggleWindowSidebar(area.id) }
}

async function openWindowCollections(anchor, id, toggle = true) {
  const target = findArea(id)
  if (!target) {
    windowError.value = 'This work area is no longer available.'
    return
  }
  selectSpace(state, target.space.id)
  selectWindow(state, id)
  activateDesktopWindow(id)
  await nextTick()
  if (toggle) desktopCollectionSwitcher.value?.toggle(anchor)
  else await desktopCollectionSwitcher.value?.open(anchor)
}

function collectionAnchor() {
  return collectionWindowId.value ? workAreaElement(collectionWindowId.value)?.querySelector('.window-collection-trigger') : undefined
}

function updateSwitcherPosition(position) {
  if (!['titlebar', 'command-center'].includes(position)) throw new Error('Choose a supported switcher position.')
  switcherPosition.value = position
  savePrototypeSettings()
}

async function updateWindowLayout(layout) {
  if (!['single', 'floating'].includes(layout)) throw new Error('Choose a supported window layout.')
  const previous = windowLayout.value
  const visible = previous === 'single' ? activeWindow(state) : null
  if (layout === 'floating' && previous === 'single') {
    initialDesktopWindowIds.value = visible ? [visible.id] : []
    initialDesktopActiveWindowId.value = visible?.id ?? null
  }
  windowLayout.value = layout
  switchingCollections.value = false
  savePrototypeSettings()
  if (layout === 'floating' && previous === 'single' && visible) {
    await nextTick()
    await floatingDesktop.value?.openWindow(visible.id, false)
  }
}

function updateSwitchingAnimation(animation) {
  if (!switchingAnimations.some(option => option.id === animation)) throw new Error('Choose a supported switching animation.')
  switchingAnimation.value = animation
  savePrototypeSettings()
}

function updateCollectionSwitchingAnimation(animation) {
  if (!switchingAnimations.some(option => option.id === animation)) throw new Error('Choose a supported switching animation.')
  collectionSwitchingAnimation.value = animation
  savePrototypeSettings()
}

function savePrototypeSettings() {
  try {
    localStorage.setItem(prototypeSettingsKey, JSON.stringify({
      switcherPosition: switcherPosition.value,
      windowLayout: windowLayout.value,
      switchingAnimation: switchingAnimation.value,
      collectionSwitchingAnimation: collectionSwitchingAnimation.value,
    }))
    prototypeSettingsError.value = ''
  } catch (error) {
    console.error('Unable to save prototype settings:', error)
    prototypeSettingsError.value = 'Your browser could not save these prototype settings. Changes will be lost on reload.'
  }
}

function addExampleProjects() {
  const count = loadExampleProjects(dialogState.value)
  exampleProjectsNotice.value = count
    ? `${count} example projects added to ${dialogSpace.value.name}. Open one from the Collection picker.`
    : `Example projects are already available in ${dialogSpace.value.name}.`
}

function addWorkstreamExamples() {
  const count = loadWorkstreamExamples(state)
  exampleProjectsNotice.value = count
    ? `${count} workstream Collections added. Explore VS Code experience and Markdown tooling from the Collection picker.`
    : 'The workstream Collections are already available.'
}

function tourElement(selectors, root = document) {
  return [...root.querySelectorAll(selectors)].find(element => {
    if (element.closest('[inert], dialog, .feature-tour')) return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  })
}

function tourWindowElement(selectors) {
  return tourElement(selectors, workAreaElement() || document) || tourElement(selectors)
}

async function raiseTourWindow(element) {
  const id = element?.closest('.floating-window')?.dataset.windowId
  if (id) await floatingDesktop.value?.openWindow(id, false)
}

function featureTourContext(id) {
  const trigger = tourWindowElement('.space-trigger') || tourElement('.floating-empty button')
  if (id === 'collections') return { element: tourElement('.collection-list') || trigger }
  if (id === 'work-areas') return { element: tourElement('.work-areas-menu') || trigger }
  if (id === 'sessions') {
    const target = tourElement('.session-context-menu [data-action="move"]') || tourWindowElement('.task-composer')
    return { element: target || trigger, hint: target ? '' : 'Create an Agents work area to explore session assignment and movement.' }
  }
  if (id === 'windows') return { element: tourElement('.work-area-actions') || tourElement('.work-area-list') || trigger }
  if (id === 'editor') {
    const menu = tourElement('.session-context-menu')
    return { element: menu || trigger, hint: menu ? '' : 'Start an Agents session to explore its Editor opening choices.' }
  }
  return { element: trigger }
}

function closeTourMenus() {
  document.querySelector('.session-context-menu')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
  if (windowLayout.value === 'floating') desktopCollectionSwitcher.value?.close(false)
  else document.querySelector('.space-trigger[aria-expanded="true"]')?.click()
}

async function openTourWorkArea(id) {
  const target = findArea(id)
  if (!target || !featureTourOpen.value || dialogMode.value) return
  selectSpace(state, target.space.id)
  selectWindow(state, id)
  if (windowLayout.value === 'floating') await floatingDesktop.value?.openWindow(id, false)
  await nextTick()
}

async function prepareTourStep(id) {
  closeTourMenus()
  await nextTick()
  if (!featureTourOpen.value || dialogMode.value) return
  try { await revealTourFeature(id) }
  finally {
    if (!featureTourOpen.value) closeTourMenus()
  }
}

async function revealTourFeature(id) {
  if (id === 'editor' || id === 'sessions') {
    const source = currentWindow.value?.kind === 'agents' && (id === 'sessions' || activeSessions(currentWindow.value).length) ? currentWindow.value
      : state.spaces.flatMap(space => space.windows).find(area => area.kind === 'agents' && (id === 'sessions' || activeSessions(area).length))
    if (source) {
      await openTourWorkArea(source.id)
      if (featureTourOpen.value && !dialogMode.value) {
        const area = findArea(source.id)?.area
        if (area) area.sidebarVisible = true
        await nextTick()
        if (!featureTourOpen.value || dialogMode.value) return
        const root = workAreaElement(source.id)
        const row = root && (tourElement('.session-row[aria-current="page"]', root) || tourElement('.session-row', root))
        row?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
      }
    }
    return
  }
  if (!tourElement('.spaces-dropdown')) {
    let trigger = tourWindowElement('.space-trigger')
    if (!trigger && windowLayout.value === 'floating') {
      await openVSCode(tourElement('.floating-empty button'))
      await nextTick()
      trigger = tourWindowElement('.space-trigger')
    }
    if (!featureTourOpen.value || dialogMode.value) return
    await raiseTourWindow(trigger)
    if (!featureTourOpen.value || dialogMode.value) return
    const sourceId = trigger?.closest('.floating-window')?.dataset.windowId
    if (sourceId) await openWindowCollections(trigger, sourceId, false)
    else {
      trigger?.click()
      await nextTick()
    }
  }
  if (id === 'windows') tourElement('.work-area-menu-trigger')?.click()
}

async function finishFeatureTour() {
  featureTourOpen.value = false
  closeTourMenus()
  await nextTick()
  featureTourTrigger.value?.focus()
}

async function showDialog(mode, windowId, spaceId = current.value.id, sessionId) {
  if (!state.spaces.some(space => space.id === spaceId)) {
    windowError.value = 'This Collection is no longer available.'
    return
  }
  if (mode === 'prototype-settings' || !dialogMode.value || !document.activeElement?.closest('.dialog-theme-layer')) {
    dialogTrigger = mode === 'prototype-settings' ? prototypeSettingsTrigger.value : document.activeElement
    dialogTarget.value = mode !== 'prototype-settings' && windowLayout.value === 'floating'
      ? dialogTrigger?.closest('.floating-window') ?? null : null
    dialogSourceId.value = dialogTarget.value?.dataset.windowId ?? null
  }
  dialogSpaceId.value = spaceId
  dialogMode.value = mode
  formError.value = ''
  exampleProjectsNotice.value = ''
  windowKind.value = dialogSpace.value.startingWindowKind
  workAreaOpening.value = windowLayout.value === 'floating' ? 'new' : 'current'
  windowProjectChoice.value = ''
  windowProject.value = ''
  windowCheckoutChoice.value = ''
  dialogWindowId.value = windowId ?? null
  dialogSessionId.value = sessionId ?? null
  targetSpaceId.value = state.spaces.find(space => space.id !== dialogSpace.value.id)?.id ?? ''
  await nextTick()
  if (['new-window', 'move', 'move-session', 'delete-window', 'help', 'prototype-settings'].includes(mode)) {
    if (dialogTarget.value) utilityDialog.value.show()
    else utilityDialog.value.showModal()
    if (mode === 'new-window') {
      if (windowKind.value === 'editor') windowProjectInput.value?.focus()
      else utilityDialog.value.querySelector('input[name="window-kind"]:checked')?.focus()
    }
    if (mode === 'move' || mode === 'move-session') utilityDialog.value.querySelector('select')?.focus()
    if (mode === 'prototype-settings') utilityDialog.value.querySelector('select')?.focus()
    if (mode === 'delete-window') utilityDialog.value.querySelector('.secondary-button')?.focus()
  }
}

async function dismissDialog() {
  dialogMode.value = null
  dialogSpaceId.value = null
  dialogTarget.value = null
  dialogSourceId.value = null
  await nextTick()
  if (dialogTrigger?.isConnected) dialogTrigger.focus()
  else document.querySelector('.space-trigger')?.focus()
}

function updateSpaceDetails(details) {
  const space = saveSpace(state, details)
  announcement.value = `${space.name} collection ${details.id ? 'updated' : 'created'}.`
}

function commitSpace(details) {
  updateSpaceDetails(details)
  dismissDialog()
}

function deleteSpace(id) {
  const space = state.spaces.find(space => space.id === id)
  const name = space.name
  removeSpace(state, id)
  announcement.value = `${name} collection removed.`
  dismissDialog()
}

async function createWindow() {
  const context = dialogState.value
  const sourceWindowId = dialogSourceId.value
  const source = activeWindow(context)
  const checkout = source ? checkoutForWindow(source, dialogSpace.value) : null
  const project = windowKind.value === 'editor' ? selectedEditorProject.value : source?.project || dialogSpace.value.name
  if (!project) {
    formError.value = windowProjectChoice.value === 'other' ? 'Enter a project or folder.' : 'Choose a project or folder.'
    const input = windowProjectChoice.value === 'other' ? otherWindowProjectInput.value : windowProjectInput.value
    input?.focus()
    return
  }
  const choice = windowCheckoutChoice.value
  const branch = typeof choice === 'string' && choice.startsWith('branch:') ? choice.slice(7) : undefined
  const worktreeId = typeof choice === 'string' && choice.startsWith('worktree:') ? choice.slice(9) : undefined
  if (windowKind.value === 'editor' && !(branch !== undefined && projectBranches.value.includes(branch) ||
    linkedProjectWorktrees.value.some(tree => tree.id === worktreeId))) {
    formError.value = 'Choose an available branch or worktree.'
    utilityDialog.value.querySelector('#work-area-worktree')?.focus()
    return
  }
  if (!['current', 'new'].includes(workAreaOpening.value) || workAreaOpening.value === 'current' && !canOpenInCurrentWindow.value) {
    formError.value = 'Choose an available window to open this work area.'
    return
  }
  const openInCurrent = workAreaOpening.value === 'current'
  if (!openInCurrent && windowLayout.value === 'single') await updateWindowLayout('floating')
  const editorCheckout = branch !== undefined ? { branch } : { worktreeId }
  const window = addWindow(context, project, windowKind.value, windowKind.value === 'editor' ? editorCheckout
    : { worktreeId: checkout?.project === project ? checkout.id : undefined })
  selectSpace(state, dialogSpace.value.id)
  announcement.value = `${window.kind === 'agents' ? 'Agents' : 'Editor'} work area added to ${current.value.name}.`
  await dismissDialog()
  if (windowLayout.value === 'floating') {
    if (openInCurrent) switchDesktopWindow(sourceWindowId, window.id, true)
    else await floatingDesktop.value?.openWindow(window.id)
  }
}

async function openEditor({ sessionId, destination }, sourceId = currentWindow.value?.id) {
  let source = findArea(sourceId)
  if (!source || source.area.kind !== 'agents' || !source.area.sessions.some(session => session.id === sessionId)) {
    windowError.value = 'This agent session is no longer available.'
    return
  }
  if (!['here', 'new-window'].includes(destination)) {
    windowError.value = 'Choose where to open this Editor work area.'
    return
  }
  if (destination === 'new-window' && windowLayout.value === 'single') {
    await updateWindowLayout('floating')
    source = findArea(sourceId)
    if (!source || !source.area.sessions.some(session => session.id === sessionId)) {
      windowError.value = 'This agent session is no longer available.'
      return
    }
  }
  selectSpace(state, source.space.id)
  const context = { ...state, activeSpaceId: source.space.id }
  selectWindow(context, sourceId)
  const editor = openSessionInEditor(context, sessionId)
  announcement.value = `Opened ${editor.sessionContext.title} in Editor, in ${current.value.name}.`
  await nextTick()
  if (windowLayout.value === 'floating') {
    if (destination === 'here' && !openDesktopWindowIds.value.includes(editor.id)) switchDesktopWindow(sourceId, editor.id)
    else await floatingDesktop.value?.openWindow(editor.id, false)
  }
  await nextTick()
  focusWorkArea('.editor-tab[aria-selected="true"]')
}

watch(() => modalWindowIds.value.filter(id => windowLayout.value !== 'floating' ||
  !openDesktopWindowIds.value.includes(id) || !findArea(id)), missing => {
  if (!missing.length) return
  windowError.value = 'The window that opened this dialog is no longer available.'
  if (missing.includes(dialogSourceId.value)) dismissDialog()
})

async function closeSpaceWindow(id) {
  if (windowLayout.value === 'floating') {
    floatingDesktop.value?.closeWindow(id)
    return
  }
  const target = findArea(id)
  if (!target) {
    windowError.value = 'This work area is no longer available.'
    return
  }
  const name = target.area.project
  closeWindow({ ...state, activeSpaceId: target.space.id }, id)
  announcement.value = `${name} work area closed.`
  await nextTick()
  document.querySelector('.space-trigger')?.focus()
}

function moveSelectedWindow() {
  const target = state.spaces.find(space => space.id === targetSpaceId.value && space.id !== dialogSpace.value.id)
  if (!target) {
    formError.value = 'Choose a different Collection.'
    return
  }
  if (!dialogWindow.value) {
    formError.value = 'This work area is no longer available.'
    return
  }
  const visible = currentWindow.value
  const project = dialogWindow.value.project
  moveWindow(dialogState.value, dialogWindowId.value, target.id)
  if (windowLayout.value === 'single' && visible && current.value.windows.some(area => area.id === visible.id)) selectWindow(state, visible.id)
  announcement.value = `${project} work area moved to ${target.name}.`
  dismissDialog()
}

async function deleteWorkArea() {
  const target = findArea(dialogWindowId.value)
  if (!target) {
    formError.value = 'This work area is no longer available.'
    return
  }
  const { area } = target
  await dismissDialog()
  const latest = findArea(area.id)
  if (!latest) {
    windowError.value = 'This work area is no longer available.'
    return
  }
  closeWindow({ ...state, activeSpaceId: latest.space.id }, area.id)
  announcement.value = `${latest.area.project} work area deleted from ${latest.space.name}.`
  await nextTick()
  if (windowLayout.value === 'floating') {
    if (focusedDesktopWindowId.value) await floatingDesktop.value?.openWindow(focusedDesktopWindowId.value)
    else document.querySelector('.floating-empty button')?.focus()
  } else document.querySelector('.space-trigger')?.focus()
}

async function completeSession(sessionId, sourceId = currentWindow.value?.id) {
  const source = findArea(sourceId)
  if (!source || source.area.kind !== 'agents' || !source.area.sessions.some(session => session.id === sessionId)) {
    windowError.value = 'This session is no longer available.'
    return
  }
  const root = workAreaElement(sourceId)
  const rows = [...(root?.querySelectorAll('.session-row') || [])]
  const index = rows.findIndex(row => row.dataset.sessionId === sessionId)
  const restoreFocus = root?.contains(document.activeElement)
  const session = markSessionDone(source.space, sourceId, sessionId)
  announcement.value = `${session.title} marked as done.`
  await nextTick()
  if (restoreFocus) {
    const remaining = root.querySelectorAll('.session-row')
    const target = remaining[Math.min(Math.max(0, index), remaining.length - 1)] || root.querySelector('.new-session-button, .task-composer textarea')
    target?.focus()
  }
}

async function requestSessionMove(sessionId, sourceId = currentWindow.value?.id) {
  const source = findArea(sourceId)
  if (!source || source.area.kind !== 'agents' || !source.area.sessions.some(session => session.id === sessionId)) {
    windowError.value = 'This session is no longer available.'
    return
  }
  await showDialog('move-session', sourceId, source.space.id, sessionId)
}

async function moveSelectedSession() {
  const source = findArea(dialogWindowId.value)
  const target = state.spaces.find(space => space.id === targetSpaceId.value && space.id !== source?.space.id)
  const session = source?.area.sessions.find(session => session.id === dialogSessionId.value)
  if (!source || !target || !session) {
    formError.value = 'Choose an existing session and a different Collection.'
    return
  }
  const tree = getWorktree(source.space, session.worktreeId)
  if (target.windows.some(area => area.kind === 'agents' && area.project === source.area.project &&
    area.sessions.some(item => getWorktree(target, item.worktreeId).path === tree.path))) {
    formError.value = 'This worktree already belongs to a session in the destination Collection.'
    return
  }
  moveSession(state, source.area.id, session.id, target.id)
  announcement.value = `${session.title} moved to ${target.name}.`
  await dismissDialog()
  const element = workAreaElement(source.area.id)
  element?.querySelector('.session-title, .task-composer textarea')?.focus()
}

function createSession({ title, spaceId }, sourceId = currentWindow.value?.id) {
  const source = findArea(sourceId)
  const target = state.spaces.find(space => space.id === spaceId)
  if (!source || source.area.kind !== 'agents' || !target) {
    windowError.value = 'This work area or Collection is no longer available.'
    return
  }
  const { area } = addSessionToCollection(state, sourceId, target.id, title)
  if (area.id !== sourceId) {
    selectSpace(state, target.id)
    if (windowLayout.value === 'floating') switchDesktopWindow(sourceId, area.id, true)
    else selectWindow(state, area.id)
  }
  announcement.value = `Session created in ${target.name}: ${title}.`
}

function keyboard(event) {
  if ((event.target instanceof Element && event.target.closest('.dialog-theme-layer')) || (dialogMode.value && !dialogTarget.value)) return
  const collectionIndex = collectionShortcutIndex(event)
  if (collectionIndex >= 0) {
    const space = state.spaces[collectionIndex]
    if (space) {
      event.preventDefault()
      chooseSpace(space.id)
    }
  }
  if (event.altKey && event.key === 'F1') {
    event.preventDefault()
    showDialog('help')
  }
}

onMounted(async () => {
  document.addEventListener('keydown', keyboard)
  motionPreference?.addEventListener('change', updateMotionPreference)
  if (routedWindowId) {
    const url = new URL(globalThis.location.href)
    url.searchParams.delete('dock')
    url.searchParams.delete('popout')
    globalThis.history.replaceState(null, '', url.href)
    await nextTick()
    if (findArea(routedWindowId)) await floatingDesktop.value?.openWindow(routedWindowId, false)
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', keyboard)
  motionPreference?.removeEventListener('change', updateMotionPreference)
  stateSync.dispose()
})
</script>

<template>
  <div class="prototype-page" :class="{ 'desktop-page': windowLayout === 'floating' }" :data-theme="windowLayout === 'floating' ? 'dark' : displayedTheme">
    <header class="concept-header">
      <a class="concept-brand" href="/"><i class="codicon codicon-vscode" aria-hidden="true" /><span>VS Code <span class="brand-slash">/</span><strong>Collections</strong></span></a>
      <button ref="featureTourTrigger" class="secondary-button feature-tour-trigger" aria-label="Feature tour" :disabled="Boolean(dialogMode)" @click="featureTourOpen = true"><i class="codicon codicon-lightbulb" aria-hidden="true" /><span>Feature tour</span></button>
      <button ref="prototypeSettingsTrigger" class="secondary-button prototype-settings-trigger" aria-label="Prototype settings" @click="showDialog('prototype-settings')"><i class="codicon codicon-settings-gear" aria-hidden="true" /><span>Prototype settings</span></button>
    </header>

    <SpaceSwitcher v-if="windowLayout === 'floating'" ref="desktopCollectionSwitcher" :spaces="state.spaces" :current="current" :theme="displayedTheme" :show-trigger="false" :floating-window-ids="openDesktopWindowIds" :selected-window-id="focusedDesktopWindowId" :resolve-anchor="collectionAnchor" floating-mode portal v-on="collectionEvents()" @open-change="collectionMenuOpen = $event" @open-anchor="collectionWindowId = $event?.closest('.floating-window')?.dataset.windowId ?? null" />

    <p v-if="prototypeSettingsError && dialogMode !== 'prototype-settings'" class="storage-error" role="alert">{{ prototypeSettingsError }}</p>
    <p v-if="storageError" class="storage-error" role="alert"><i class="codicon codicon-warning" aria-hidden="true" />{{ storageError }}</p>
    <p v-if="windowError" class="storage-error" role="alert"><i class="codicon codicon-warning" aria-hidden="true" /><span>{{ windowError }}</span><button class="icon-button" aria-label="Dismiss window error" @click="windowError = ''"><i class="codicon codicon-close" aria-hidden="true" /></button></p>
    <p v-if="migrationNotice" class="migration-notice" role="status"><i class="codicon codicon-info" aria-hidden="true" /><span>{{ migrationNotice }}</span><button class="icon-button" aria-label="Dismiss migration notice" @click="migrationNotice = ''"><i class="codicon codicon-close" aria-hidden="true" /></button></p>

    <main :class="windowLayout === 'floating' ? 'desktop-workspace' : 'workbench'" :data-switching-animation="activeSwitchingAnimation" :data-switching-scope="switchingCollections ? 'collection' : 'work-area'" :aria-label="windowLayout === 'floating' ? 'Collections desktop' : 'VS Code Collections'">
      <WorkbenchTitlebar v-if="windowLayout === 'single'" :spaces="state.spaces" :current="current" :window="currentWindow" :worktree="currentCheckout" :theme="displayedTheme" :switcher-position="switcherPosition" v-on="titlebarEvents(currentWindow)" />

      <div class="workbench-viewport">
      <Transition :name="collectionSlide ? 'collection-slide' : 'zoom-focus'" :css="switchingMotion" @before-enter="prepareWorkAreaTransition" @before-leave="disableLeavingWorkArea">
      <div :key="windowLayout === 'floating' ? 'desktop' : `${current.id}:${currentWindow?.id || 'empty'}`" class="workbench-body">
        <FloatingDesktop v-if="windowLayout === 'floating'" ref="floatingDesktop" :spaces="state.spaces" :initial-window-ids="initialDesktopWindowIds" :initial-active-window-id="initialDesktopActiveWindowId" :preview-space-id="previewSpaceId" :preview-theme="previewTheme" :switching-animation="switchingAnimation" :collection-switching-animation="collectionSwitchingAnimation" :reduced-motion="reducedMotion" :modal-window-ids="modalWindowIds" @select="activateDesktopWindow" @open-change="openDesktopWindowIds = $event" @close="desktopWindowClosed" @open-work-area="openVSCode" @toggle-sidebar="toggleWindowSidebar">
          <template #titlebar="{ window: area, space, blocked, maximized, moveDescription, minimize, maximize, closeWindow: closeFrame, startDrag, stopDrag, geometryKey }">
            <WorkbenchTitlebar :inert="blocked ? '' : null" :spaces="state.spaces" :current="space" :window="area" :worktree="checkoutForWindow(area, space)" :theme="themeForSpace(space)" :switcher-position="switcherPosition" :maximized="maximized" :move-description="moveDescription" :collection-menu-open="collectionMenuOpen && area.id === collectionWindowId" floating v-on="titlebarEvents(area)" @open-collections="openWindowCollections($event, area.id)" @minimize="minimize" @maximize="maximize" @close="closeFrame" @drag-start="startDrag" @drag-end="stopDrag" @geometry-key="geometryKey" />
          </template>
          <template #default="{ window: area, space }">
            <WindowView :key="area.id" :window="area" :space="space" :spaces="state.spaces" :sidebar-visible="area.sidebarVisible" :theme="themeForSpace(space)" :worktrees="space.worktrees" :worktree="checkoutForWindow(area, space)" unique-ids @draft="area.draft = $event" @session="createSession($event, area.id)" @select-session="area.selectedSessionId = $event" @complete-session="completeSession($event, area.id)" @file="area.activeFile = $event" @toggle-sidebar="toggleWindowSidebar(area.id)" @open-editor="openEditor($event, area.id)" @move-session="requestSessionMove($event, area.id)" />
          </template>
        </FloatingDesktop>
        <WindowView v-else-if="currentWindow" :window="currentWindow" :space="current" :spaces="state.spaces" :sidebar-visible="sidebarVisible" :theme="displayedTheme" :worktrees="current.worktrees" :worktree="currentCheckout" @draft="currentWindow.draft = $event" @session="createSession" @select-session="currentWindow.selectedSessionId = $event" @complete-session="completeSession" @file="currentWindow.activeFile = $event" @toggle-sidebar="sidebarVisible = !sidebarVisible" @open-editor="openEditor" @move-session="requestSessionMove" />
        <section v-else class="empty-space" aria-labelledby="empty-space-title"><i class="codicon codicon-empty-window" aria-hidden="true" /><h1 id="empty-space-title">No open work areas in {{ current.name }}</h1><p>Your Collection is still here. Open a work area to keep going.</p><button class="primary-button" @click="showDialog('new-window')"><i class="codicon codicon-add" aria-hidden="true" />New work area</button></section>
      </div>
      </Transition>
      </div>
    </main>

    <div class="sr-only" role="status" aria-live="polite">{{ announcement }}</div>

    <DialogHost v-if="dialogMode" :target="dialogTarget" :theme="dialogTheme" @cancel="dismissDialog">
    <SpaceDialog v-if="['create', 'manage'].includes(dialogMode)" :key="dialogMode" :state="dialogState" :mode="dialogMode" :embedded="Boolean(dialogTarget)" @close="dismissDialog" @save="commitSpace" @remove="deleteSpace" @preview-theme="previewSpaceTheme" @create="showDialog('create')" />

    <dialog v-if="['new-window', 'move', 'move-session', 'delete-window', 'help', 'prototype-settings'].includes(dialogMode)" :key="dialogMode" ref="utilityDialog" class="prototype-dialog utility-dialog" :class="{ 'new-work-area-dialog': dialogMode === 'new-window' || dialogMode === 'move-session', 'delete-work-area-dialog': dialogMode === 'delete-window', 'prototype-settings-dialog': dialogMode === 'prototype-settings', 'native-dialog': ['new-window', 'move-session', 'delete-window', 'prototype-settings'].includes(dialogMode) }" :aria-modal="dialogTarget ? 'true' : undefined" aria-labelledby="utility-dialog-title" @cancel.prevent="dismissDialog" @keydown.esc.prevent.stop="dismissDialog" @click.self="dismissDialog">
      <section>
        <header class="dialog-header"><div><p v-if="!['new-window', 'move-session', 'delete-window', 'prototype-settings'].includes(dialogMode)" class="eyebrow">{{ dialogMode === 'help' ? 'THE IDEA' : dialogSpace.name.toUpperCase() }}</p><h2 id="utility-dialog-title">{{ dialogMode === 'prototype-settings' ? 'Prototype settings' : dialogMode === 'new-window' ? 'New work area' : dialogMode === 'move-session' ? 'Move session' : dialogMode === 'delete-window' ? 'Delete work area?' : dialogMode === 'move' ? 'Move work area to another Collection' : 'Your work has different worlds.' }}</h2></div><button class="icon-button" aria-label="Close dialog" @click="dismissDialog"><i class="codicon codicon-close" aria-hidden="true" /></button></header>
        <form v-if="dialogMode === 'prototype-settings'" class="utility-form prototype-settings-form" @submit.prevent="dismissDialog">
          <label for="prototype-switcher-position">Switcher position</label>
          <select id="prototype-switcher-position" :value="switcherPosition" @change="updateSwitcherPosition($event.target.value)">
            <option value="titlebar">Left title bar</option>
            <option value="command-center">Command center</option>
          </select>
          <label for="prototype-window-layout">Window layout</label>
          <select id="prototype-window-layout" :value="windowLayout" @change="updateWindowLayout($event.target.value)">
            <option value="single">Single work area</option>
            <option value="floating">Floating windows</option>
          </select>
          <label for="prototype-switching-animation">Work-area switching animation</label>
          <select id="prototype-switching-animation" :value="switchingAnimation" @change="updateSwitchingAnimation($event.target.value)">
            <option v-for="animation in switchingAnimations" :key="animation.id" :value="animation.id">{{ animation.label }}</option>
          </select>
          <label for="prototype-collection-switching-animation">Collection switching animation</label>
          <select id="prototype-collection-switching-animation" :value="collectionSwitchingAnimation" @change="updateCollectionSwitchingAnimation($event.target.value)">
            <option v-for="animation in switchingAnimations" :key="animation.id" :value="animation.id">{{ animation.label }}</option>
          </select>
          <p v-if="prototypeSettingsError" class="field-error" role="alert">{{ prototypeSettingsError }}</p>
          <div class="prototype-examples">
            <span>Example projects</span>
            <button type="button" class="secondary-button" @click="addExampleProjects">Load example projects</button>
            <button type="button" class="secondary-button" @click="addWorkstreamExamples">Load workstream examples</button>
            <p v-if="exampleProjectsNotice" class="field-help" role="status">{{ exampleProjectsNotice }}</p>
          </div>
          <footer class="dialog-actions"><button type="submit" class="primary-button">Done</button></footer>
        </form>
        <form v-else-if="dialogMode === 'new-window'" class="utility-form" @submit.prevent="createWindow">
          <p class="dialog-intro">Open another work area in <strong>{{ dialogSpace.name }}</strong>.</p>
          <WindowKindPicker v-model="windowKind" @update:model-value="formError = ''" />
          <div v-if="windowKind === 'editor'" class="work-area-project-field">
            <label for="work-area-project">Project or folder</label>
            <select id="work-area-project" ref="windowProjectInput" v-model="windowProjectChoice" :aria-invalid="Boolean(formError && windowProjectChoice !== 'other')" :aria-describedby="formError && windowProjectChoice !== 'other' ? 'work-area-project-help work-area-project-error' : 'work-area-project-help'" @change="formError = ''">
              <option value="" disabled>Select a project or folder</option>
              <option v-for="project in projectOptions" :key="project" :value="`project:${project}`">{{ project }}</option>
              <option value="other">Other project or folder…</option>
            </select>
            <template v-if="windowProjectChoice === 'other'">
              <label for="work-area-project-other">New project or folder</label>
              <input id="work-area-project-other" ref="otherWindowProjectInput" v-model="windowProject" autocomplete="off" spellcheck="false" placeholder="e.g. ~/Projects/storefront" :aria-invalid="Boolean(formError)" :aria-describedby="formError ? 'work-area-project-help work-area-project-error' : 'work-area-project-help'" @input="formError = ''" />
            </template>
            <template v-if="selectedEditorProject">
              <label for="work-area-worktree">Branch or worktree</label>
              <select id="work-area-worktree" v-model="windowCheckoutChoice" :aria-invalid="Boolean(formError)" :aria-describedby="formError ? 'work-area-worktree-help work-area-project-error' : 'work-area-worktree-help'" @change="formError = ''">
                <optgroup label="Branches"><option v-for="branch in projectBranches" :key="branch" :value="`branch:${branch}`">{{ branch }}</option></optgroup>
                <optgroup v-if="linkedProjectWorktrees.length" label="Worktrees"><option v-for="tree in linkedProjectWorktrees" :key="tree.id" :value="`worktree:${tree.id}`">{{ tree.name }} · {{ tree.branch }}</option></optgroup>
              </select>
              <p id="work-area-worktree-help" class="field-help">Branches switch the shared project folder. Linked worktrees keep their own branch.</p>
            </template>
            <p id="work-area-project-help" class="field-help">Choose an existing project, or select Other to enter a name or path.</p>
            <p v-if="formError" id="work-area-project-error" class="field-error" role="alert">{{ formError }}</p>
          </div>
          <fieldset class="window-kind-picker work-area-opening-picker">
            <legend>Open in</legend>
            <label v-for="opening in ['current', 'new']" :key="opening" :class="{ selected: workAreaOpening === opening }">
              <input v-model="workAreaOpening" type="radio" name="work-area-opening" :value="opening" :disabled="opening === 'current' && !canOpenInCurrentWindow" @change="formError = ''" />
              <i :class="`codicon codicon-${opening === 'current' ? 'device-desktop' : 'open-in-window'}`" aria-hidden="true" />
              <strong>{{ opening === 'current' ? 'Current window' : 'New window' }}</strong>
              <span>{{ opening === 'current' ? "Replace this window's work area." : 'Open a separate window.' }}</span>
              <i v-if="workAreaOpening === opening" class="codicon codicon-check window-kind-check" aria-hidden="true" />
            </label>
          </fieldset>
          <p v-if="formError && windowKind !== 'editor'" class="field-error" role="alert">{{ formError }}</p>
          <footer class="dialog-actions"><button type="button" class="secondary-button" @click="dismissDialog">Cancel</button><button type="submit" class="primary-button">Open work area</button></footer>
        </form>
        <form v-else-if="dialogMode === 'move'" class="utility-form" @submit.prevent="moveSelectedWindow">
          <p class="dialog-intro">Move <strong>{{ dialogWindow.project }}</strong> out of {{ dialogSpace.name }}.</p>
          <label for="destination-space">Destination Collection</label><select id="destination-space" v-model="targetSpaceId"><option v-for="space in state.spaces.filter(item => item.id !== dialogSpace.id)" :key="space.id" :value="space.id">{{ space.name }}</option></select>
          <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>
          <footer class="dialog-actions"><button type="button" class="secondary-button" @click="dismissDialog">Cancel</button><button type="submit" class="primary-button">Move work area</button></footer>
        </form>
        <form v-else-if="dialogMode === 'move-session'" class="utility-form move-session-form" @submit.prevent="moveSelectedSession">
          <p class="dialog-intro">Move <strong>{{ dialogSession?.title || 'this session' }}</strong> from <strong>{{ dialogSpace.name }}</strong>.</p>
          <label for="session-destination">Destination Collection</label>
          <select id="session-destination" v-model="targetSpaceId"><option v-for="space in state.spaces.filter(item => item.id !== dialogSpace.id)" :key="space.id" :value="space.id">{{ space.name }}</option></select>
          <p class="session-move-detail">The project, worktree, and linked Editor work areas stay with this session. Other sessions and open windows stay in place. Files on disk are not changed.</p>
          <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>
          <footer class="dialog-actions"><button type="button" class="secondary-button" @click="dismissDialog">Cancel</button><button type="submit" class="primary-button">Move session</button></footer>
        </form>
        <form v-else-if="dialogMode === 'delete-window'" class="utility-form" @submit.prevent="deleteWorkArea">
          <p class="dialog-intro">Delete <strong>{{ dialogWindow?.project || 'this work area' }}</strong> from <strong>{{ dialogSpace.name }}</strong>?</p>
          <p class="work-area-delete-warning">Saved sessions, drafts, and work-area settings will be removed. Files on disk will not be changed. This cannot be undone.</p>
          <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>
          <footer class="dialog-actions"><button type="button" class="secondary-button" @click="dismissDialog">Cancel</button><button type="submit" class="danger-button">Delete work area</button></footer>
        </form>
        <div v-else class="help-content">
          <p>A workstream can span several repositories, Agent sessions, and Editors. A <strong>Collection</strong> keeps that related work together above session groups, so unrelated tasks do not build up in one mixed session tree. Session groups organize conversations within Agents; profiles configure the editor. Collections group the ongoing work, not user accounts or settings isolation, and do not require multiple windows.</p>
          <div class="help-model"><span class="space-avatar" data-color="blue">W</span><span>Collection<i class="codicon codicon-chevron-right" aria-hidden="true" /></span><span><i class="codicon codicon-code" aria-hidden="true" />Editor work areas<br /><i class="codicon codicon-agent" aria-hidden="true" />Agents work areas</span></div>
          <p>Use the <strong>Collection dropdown in the title bar</strong> to navigate. In <strong>Prototype settings</strong> above the workbench, choose <strong>Left title bar</strong> or <strong>Command center</strong> to compare switcher positions. <strong>Work-area switching animation</strong> and <strong>Collection switching animation</strong> independently offer <strong>Fade and slide</strong>, <strong>None</strong>, or <strong>Zoom focus</strong>, which zooms and blurs between views while keeping the title bar still. Reduced-motion preferences disable animations. Your Editor work area keeps its activity bar, Explorer, tabs, and terminal; your Agents work area keeps its Sessions sidebar and chat.</p>
          <p>Choose a Collection on the left of the dropdown, then a work area on the right. You can also create a Collection or add a new work area. Use a work area's ellipsis button, right-click it, or press Shift+F10 for Close, Move, and Delete actions. Delete work area asks for confirmation before removing its saved sessions and settings; closing a desktop window keeps the saved work area.</p>
          <p>Each Agents session automatically gets its own worktree. Editors show their worktree name and path as read-only context, not a breadcrumb switcher. Open in Editor uses the session's exact folder. Standalone Editor work areas can use the project folder or an existing worktree. Use <strong>Load example projects</strong> in Prototype settings for more projects and linked locations.</p>
          <p>New sessions use the project and <strong>Collection</strong> of their current Agents work area. Right-click a session and choose <strong>Move session…</strong> to transfer just that session, its worktree, and its linked Editors to another Collection; unrelated sessions and window positions are unchanged. <strong>Load workstream examples</strong> in Prototype settings adds multi-repository VS Code experience and Markdown tooling Collections without opening them automatically.</p>
          <p>Choose <strong>Floating windows</strong> in Prototype settings to use the desktop. Choosing a Collection only browses its saved work areas; it never opens or closes desktop windows. Open a work area explicitly to show its window. Windows from different Collections can stay open together, keeping their own themes and content. Close closes only the window, not its saved work area. Drag window titles and resize using the lower-right handle. Use <strong>Focus window</strong> in the Collection picker to restore a minimized window. If all windows are minimized, use <strong>Restore window</strong> on the desktop. Arrow keys move a focused window title; Shift and arrow keys resize it.</p>
          <p>Use the <strong>edit pencil beside the Collection heading</strong> to update its title and description in place. Save applies the changes; Cancel or Escape discards the draft. From the work area list, press Home to reach the edit control.</p>
          <p>In the same editor, upload or remove a <strong>Collection image</strong>, choose its <strong>Collection color</strong>, and use the <strong>Color theme</strong> dropdown to select <strong>2026 Dark</strong> or <strong>2026 Light</strong>. Theme changes preview immediately in this window; Save applies the theme to every Editor and Agents work area in that Collection, while Cancel restores the saved theme. Images are cropped to a small square and stored locally; nothing is uploaded to a server.</p>
          <p>A numbered badge counts <strong>sessions needing input</strong>, including sessions needing review. Each session counts once. Working, completed, and preview sessions do not count; the badge is hidden at zero.</p>
          <p>A dot on the Collection switcher means <strong>another Collection needs input</strong>. Matching dots in the dropdown show which Collections need attention. Input needed only in the current Collection does not show this dot.</p>
          <p>Switching Collections restores that Collection's last-used work area. Use Up and Down within each list, Right to move to work areas, Left to return to Collections, and Enter to select. Escape closes the dropdown and returns focus to the title-bar button.</p>
          <p>Right-click any session row, or press Shift+F10 on it, for <strong>Open in Editor</strong>, <strong>Open in Editor in new window</strong>, and <strong>Move session…</strong>. Each session keeps its own Editor, reused when that session is opened again. Drafts and file selection are kept. If the matching Editor is already open, its window is focused rather than duplicated; otherwise the chosen destination opens it here or in a separate window.</p>
          <dl class="shortcut-list"><div><dt>Switch collections</dt><dd><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>1–9</kbd></dd></div><div><dt>Navigate the switcher</dt><dd><kbd>↑</kbd> <kbd>↓</kbd> <kbd>Enter</kbd></dd></div><div><dt>Dismiss menus & dialogs</dt><dd><kbd>Esc</kbd></dd></div><div><dt>Open this help</dt><dd><kbd>Alt</kbd> + <kbd>F1</kbd></dd></div></dl>
          <footer class="dialog-actions"><button class="primary-button" @click="dismissDialog">Got it</button></footer>
        </div>
      </section>
    </dialog>
    </DialogHost>
  </div>
  <FeatureTour v-if="featureTourOpen" :resolve-target="featureTourContext" :prepare-step="prepareTourStep" :theme="windowLayout === 'floating' ? 'dark' : displayedTheme" :paused="Boolean(dialogMode)" @close="finishFeatureTour" />
</template>
