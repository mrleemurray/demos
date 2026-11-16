<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import SpaceSwitcher from './components/SpaceSwitcher.vue'
import SpaceDialog from './components/SpaceDialog.vue'
import WindowView from './components/WindowView.vue'
import WindowKindPicker from './components/WindowKindPicker.vue'
import {
  activeSpace, activeWindow, addWindow, closeWindow, createState, migrationBackupKey,
  moveWindow, openSessionInEditor, removeSpace, restoreState, saveSpace, selectSpace, selectWindow, storageKey,
} from './model.js'

const storageError = ref('')
const migrationNotice = ref('')
let initialState
let legacyState
try {
  const raw = localStorage.getItem(storageKey)
  initialState = restoreState(raw)
  if (raw !== null && JSON.parse(raw).version !== initialState.version) legacyState = raw
} catch (error) {
  console.error('Unable to restore the Spaces prototype:', error)
  storageError.value = 'Saved spaces could not be loaded. Showing the example spaces instead.'
  initialState = createState()
}
const state = reactive(initialState)
const current = computed(() => activeSpace(state))
const currentWindow = computed(() => activeWindow(state))
const sidebarVisible = computed({
  get: () => currentWindow.value?.sidebarVisible ?? false,
  set: value => { currentWindow.value.sidebarVisible = value },
})
const dialogMode = ref(null)
const utilityDialog = ref()
const windowKind = ref('agents')
const movingWindowId = ref(null)
const windowToMove = computed(() => current.value.windows.find(window => window.id === movingWindowId.value))
const targetSpaceId = ref('')
const formError = ref('')
const announcement = ref('')
let dialogTrigger

function persistState() {
  try {
    if (legacyState) {
      localStorage.setItem(migrationBackupKey, legacyState)
      legacyState = undefined
      migrationNotice.value = 'Work area management is now available. Existing work areas and sessions were preserved; previous demo data is backed up locally.'
    }
    localStorage.setItem(storageKey, JSON.stringify(state))
    storageError.value = ''
  } catch (error) {
    console.error('Unable to save the Spaces prototype:', error)
    storageError.value = legacyState
      ? 'The browser could not back up your previous demo data. The original saved data has not been overwritten; changes will be lost on reload.'
      : 'Your browser could not save these changes. They will be lost on reload.'
  }
}

if (legacyState) persistState()
watch(state, persistState, { deep: true })

function chooseSpace(id) {
  selectSpace(state, id)
  announcement.value = `${current.value.name} space. ${currentWindow.value ? `${currentWindow.value.kind === 'agents' ? 'Agents' : 'Editor'} work area. ${currentWindow.value.project}.` : 'No open work areas.'}`
}

function chooseWindow(id) {
  selectWindow(state, id)
  announcement.value = `${currentWindow.value.kind === 'agents' ? 'Agents' : 'Editor'} work area. ${currentWindow.value.project}.`
}

function toggleSpaceRail() {
  state.spaceRailVisible = !state.spaceRailVisible
  announcement.value = `Spaces sidebar ${state.spaceRailVisible ? 'shown' : 'hidden'}.`
}

async function showDialog(mode, windowId) {
  if (!dialogMode.value) dialogTrigger = document.activeElement
  dialogMode.value = mode
  formError.value = ''
  windowKind.value = current.value.startingWindowKind
  movingWindowId.value = windowId ?? null
  targetSpaceId.value = state.spaces.find(space => space.id !== current.value.id)?.id ?? ''
  await nextTick()
  if (['new-window', 'move', 'help'].includes(mode)) {
    utilityDialog.value.showModal()
    if (mode === 'new-window') utilityDialog.value.querySelector('input[name="window-kind"]:checked')?.focus()
    if (mode === 'move') utilityDialog.value.querySelector('select')?.focus()
  }
}

async function dismissDialog() {
  dialogMode.value = null
  await nextTick()
  if (dialogTrigger?.isConnected) dialogTrigger.focus()
  else document.querySelector('.space-trigger')?.focus()
}

function commitSpace(details) {
  const space = saveSpace(state, details)
  announcement.value = `${space.name} space ${details.id ? 'updated' : 'created'}.`
  dismissDialog()
}

function deleteSpace(id) {
  const name = state.spaces.find(space => space.id === id).name
  removeSpace(state, id)
  announcement.value = `${name} space removed.`
  dismissDialog()
}

function createWindow() {
  const project = currentWindow.value?.project || current.value.name
  const window = addWindow(state, project, windowKind.value)
  announcement.value = `${window.kind === 'agents' ? 'Agents' : 'Editor'} work area added to ${current.value.name}.`
  dismissDialog()
}

async function openEditor(sessionId) {
  const editor = openSessionInEditor(state, sessionId)
  announcement.value = `Opened ${editor.sessionContext.title} in Editor, in ${current.value.name}.`
  await nextTick()
  document.querySelector('.editor-tab[aria-selected="true"]')?.focus()
}

async function closeSpaceWindow(id) {
  const window = current.value.windows.find(item => item.id === id)
  const name = window.project
  closeWindow(state, id)
  announcement.value = `${name} work area closed.`
  await nextTick()
  const target = document.querySelector('.rail-window[aria-current="page"]') || document.querySelector('.space-trigger')
  target?.focus()
}

function moveSelectedWindow() {
  const target = state.spaces.find(space => space.id === targetSpaceId.value && space.id !== current.value.id)
  if (!target) {
    formError.value = 'Choose a different Space.'
    return
  }
  const project = windowToMove.value.project
  moveWindow(state, movingWindowId.value, target.id)
  announcement.value = `${project} work area moved to ${target.name}.`
  dismissDialog()
}

function createSession(title) {
  const session = {
    id: crypto.randomUUID(), title, status: 'preview', time: 'Just now',
    detail: 'This is a local session preview. In VS Code, an agent would work on this task in this workspace. No request has been sent.',
  }
  currentWindow.value.sessions.unshift(session)
  currentWindow.value.selectedSessionId = session.id
  currentWindow.value.draft = ''
  announcement.value = `Preview session created: ${title}. No agent is connected.`
}

function keyboard(event) {
  if (dialogMode.value) return
  if (event.ctrlKey && event.altKey && !event.metaKey && /^[1-9]$/.test(event.key)) {
    const space = state.spaces[Number(event.key) - 1]
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

onMounted(() => document.addEventListener('keydown', keyboard))
onBeforeUnmount(() => document.removeEventListener('keydown', keyboard))
</script>

<template>
  <div class="prototype-page">
    <header class="concept-header">
      <a class="concept-brand" href="/"><i class="codicon codicon-vscode" aria-hidden="true" /><span>VS Code <span class="brand-slash">/</span><strong>Spaces</strong></span></a>
      <span class="concept-description">A place for every kind of work.</span>
    </header>

    <p v-if="storageError" class="storage-error" role="alert"><i class="codicon codicon-warning" aria-hidden="true" />{{ storageError }}</p>
    <p v-if="migrationNotice" class="migration-notice" role="status"><i class="codicon codicon-info" aria-hidden="true" /><span>{{ migrationNotice }}</span><button class="icon-button" aria-label="Dismiss migration notice" @click="migrationNotice = ''"><i class="codicon codicon-close" aria-hidden="true" /></button></p>

    <main class="workbench" aria-label="VS Code Spaces prototype">
      <header class="titlebar">
        <div class="traffic-lights" aria-hidden="true"><span /><span /><span /></div>
        <button class="icon-button tooltip-host spaces-sidebar-toggle" :aria-label="state.spaceRailVisible ? 'Hide Spaces sidebar' : 'Show Spaces sidebar'" :aria-expanded="state.spaceRailVisible" aria-controls="spaces-sidebar" @click="toggleSpaceRail"><i class="codicon codicon-layout-activitybar-left" aria-hidden="true" /><span class="tooltip" role="tooltip">{{ state.spaceRailVisible ? 'Hide Spaces sidebar' : 'Show Spaces sidebar' }}</span></button>
        <button class="icon-button tooltip-host sidebar-toggle" aria-label="Toggle Primary Side Bar" :aria-pressed="sidebarVisible" :disabled="!currentWindow" @click="sidebarVisible = !sidebarVisible"><i class="codicon codicon-layout-sidebar-left" aria-hidden="true" /><span class="tooltip" role="tooltip">Toggle Primary Side Bar</span></button>
        <div class="titlebar-navigation" aria-hidden="true"><i class="codicon codicon-arrow-left" /><i class="codicon codicon-arrow-right" /></div>
        <div class="command-center" :aria-label="currentWindow ? `${currentWindow.project}, ${currentWindow.kind === 'agents' ? 'Agents' : 'Editor'} work area` : current.name">
          <i :class="`codicon codicon-${currentWindow?.kind === 'agents' ? 'folder' : 'search'}`" aria-hidden="true" />
          <span class="command-center-label truncate">{{ currentWindow?.project || 'No open work areas' }}</span>
          <span v-if="currentWindow" class="command-center-kind">{{ currentWindow.kind === 'agents' ? 'Agents' : 'Editor' }}</span>
        </div>
        <div class="titlebar-actions">
          <span class="titlebar-account" aria-label="Accounts (illustrative)"><i class="codicon codicon-account" aria-hidden="true" /></span>
        </div>
      </header>

      <div class="workbench-body" :class="{ 'space-rail-hidden': !state.spaceRailVisible }">
        <SpaceSwitcher :visible="state.spaceRailVisible" :spaces="state.spaces" :current="current" @select="chooseSpace" @select-window="chooseWindow" @new-window="showDialog('new-window')" @close-window="closeSpaceWindow" @move-window="showDialog('move', $event)" @create="showDialog('create')" @manage="showDialog('manage')" @help="showDialog('help')" />
        <WindowView v-if="currentWindow" :window="currentWindow" :sidebar-visible="sidebarVisible" @draft="currentWindow.draft = $event" @session="createSession" @select-session="currentWindow.selectedSessionId = $event" @file="currentWindow.activeFile = $event" @toggle-sidebar="sidebarVisible = !sidebarVisible" @open-editor="openEditor" />
        <section v-else class="empty-space" aria-labelledby="empty-space-title"><i class="codicon codicon-empty-window" aria-hidden="true" /><h1 id="empty-space-title">No open work areas in {{ current.name }}</h1><p>Your Space is still here. Open a work area to keep going.</p><button class="primary-button" @click="showDialog('new-window')"><i class="codicon codicon-add" aria-hidden="true" />New work area</button></section>
      </div>
    </main>

    <div class="sr-only" role="status" aria-live="polite">{{ announcement }}</div>

    <SpaceDialog v-if="['create', 'manage'].includes(dialogMode)" :key="dialogMode" :state="state" :mode="dialogMode" @close="dismissDialog" @save="commitSpace" @remove="deleteSpace" @create="showDialog('create')" />

    <dialog v-if="['new-window', 'move', 'help'].includes(dialogMode)" ref="utilityDialog" class="prototype-dialog utility-dialog" aria-labelledby="utility-dialog-title" @cancel.prevent="dismissDialog" @keydown.esc.prevent.stop="dismissDialog" @click.self="dismissDialog">
      <section>
        <header class="dialog-header"><div><p class="eyebrow">{{ dialogMode === 'help' ? 'THE IDEA' : current.name.toUpperCase() }}</p><h2 id="utility-dialog-title">{{ dialogMode === 'new-window' ? 'New work area' : dialogMode === 'move' ? 'Move work area to another Space' : 'Your work has different worlds.' }}</h2></div><button class="icon-button" aria-label="Close dialog" @click="dismissDialog"><i class="codicon codicon-close" aria-hidden="true" /></button></header>
        <form v-if="dialogMode === 'new-window'" class="utility-form" @submit.prevent="createWindow">
          <p class="dialog-intro">Open another work area in <strong>{{ current.name }}</strong>.</p>
          <WindowKindPicker v-model="windowKind" />
          <p class="form-note">Creates a simulated work area. No real folder or app is opened.</p>
          <footer class="dialog-actions"><button type="button" class="secondary-button" @click="dismissDialog">Cancel</button><button type="submit" class="primary-button">Open work area</button></footer>
        </form>
        <form v-else-if="dialogMode === 'move'" class="utility-form" @submit.prevent="moveSelectedWindow">
          <p class="dialog-intro">Move <strong>{{ windowToMove.project }}</strong> out of {{ current.name }}.</p>
          <label for="destination-space">Destination Space</label><select id="destination-space" v-model="targetSpaceId"><option v-for="space in state.spaces.filter(item => item.id !== current.id)" :key="space.id" :value="space.id">{{ space.name }}</option></select>
          <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>
          <footer class="dialog-actions"><button type="button" class="secondary-button" @click="dismissDialog">Cancel</button><button type="submit" class="primary-button">Move work area</button></footer>
        </form>
        <div v-else class="help-content">
          <p>A <strong>Space</strong> groups related <strong>work areas</strong>. Choose <strong>Start in Editor</strong> or <strong>Start in Agents</strong> when creating it, then open other work areas as you need them.</p>
          <div class="help-model"><span class="space-avatar" data-color="blue">W</span><span>Space<i class="codicon codicon-chevron-right" aria-hidden="true" /></span><span><i class="codicon codicon-code" aria-hidden="true" />Editor work areas<br /><i class="codicon codicon-agent" aria-hidden="true" />Agents work areas</span></div>
          <p>The only added chrome is the far-left Space rail. Your Editor work area keeps its activity bar, Explorer, tabs, and terminal; your Agents work area keeps its Sessions sidebar and chat.</p>
          <p>Use <strong>Hide Spaces sidebar</strong> in the title bar to collapse the far-left rail. The same button becomes <strong>Show Spaces sidebar</strong> to restore it. This preference is saved and is separate from the Sessions/Explorer toggle; Space-switching shortcuts still work while the rail is hidden.</p>
          <p>The <strong>top icon</strong> switches Spaces. The icons <strong>below the divider</strong> are the current Space's work areas: click one to focus it, or right-click or press Shift+F10 to close or move it. The plus button opens a new work area in this Space.</p>
          <p>A numbered badge counts <strong>sessions needing input</strong>, including sessions needing review. Each session counts once. Working, completed, and preview sessions do not count; the badge is hidden at zero.</p>
          <p>A dot on the Space switcher means <strong>another Space needs input</strong>. Matching dots in the dropdown show which Spaces need attention. Input needed only in the current Space does not show this dot.</p>
          <p>Switching Spaces replaces the work area icons below the switcher and restores that Space's last-used work area. Use Up and Down to navigate work area icons, then Enter to select one.</p>
          <p><strong>Open in Editor</strong> on an Agents session opens or focuses that session's companion Editor work area in the same Space. The Agents work area and session remain available.</p>
          <dl class="shortcut-list"><div><dt>Switch spaces</dt><dd><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>1–9</kbd></dd></div><div><dt>Navigate the switcher</dt><dd><kbd>↑</kbd> <kbd>↓</kbd> <kbd>Enter</kbd></dd></div><div><dt>Dismiss menus & dialogs</dt><dd><kbd>Esc</kbd></dd></div><div><dt>Open this help</dt><dd><kbd>Alt</kbd> + <kbd>F1</kbd></dd></div></dl>
          <p class="form-note">A local interaction prototype, not a VS Code feature. Work areas, files, sessions, and activity are simulated. A Space does not isolate accounts, permissions, or credentials.</p>
          <footer class="dialog-actions"><button class="primary-button" @click="dismissDialog">Got it</button></footer>
        </div>
      </section>
    </dialog>
  </div>
</template>
