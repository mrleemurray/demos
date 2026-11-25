<script setup>
import { computed, useId } from 'vue'
import SpaceSwitcher from './SpaceSwitcher.vue'
import SpaceAvatar from './SpaceAvatar.vue'
import { activity, isLinkedWorktree } from '../model.js'

const props = defineProps({
  spaces: { type: Array, required: true },
  current: { type: Object, required: true },
  window: { type: Object, default: null },
  worktree: { type: Object, default: null },
  theme: { type: String, required: true },
  switcherPosition: { type: String, required: true },
  floating: { type: Boolean, default: false },
  maximized: { type: Boolean, default: false },
  collectionMenuOpen: { type: Boolean, default: false },
  moveDescription: { type: String, default: undefined },
})
const emit = defineEmits([
  'select', 'select-window', 'new-window', 'close-window', 'delete-window', 'move-window', 'float-window',
  'update-space', 'preview-theme', 'create', 'manage', 'toggle-sidebar', 'open-collections',
  'minimize', 'maximize', 'close', 'drag-start', 'drag-end', 'geometry-key',
])
const id = useId()
const hostId = `command-center-switcher-${id}`
const notified = computed(() => props.spaces.filter(space => space.id !== props.current.id && activity(space).inputRequired > 0).length)
const notificationLabel = computed(() => `${notified.value} other ${notified.value === 1 ? 'Collection has' : 'Collections have'} sessions needing input`)
const editorWorktree = computed(() => props.window?.kind === 'editor' && props.worktree && isLinkedWorktree(props.worktree) ? props.worktree : null)
const switcherEvents = Object.fromEntries([
  'select', 'select-window', 'new-window', 'close-window', 'delete-window', 'move-window', 'float-window',
  'update-space', 'preview-theme', 'create', 'manage',
].map(name => [name, value => emit(name, value)]))

function dragBackground(event) {
  if (!props.floating || event.target.closest('button, input, select, a, .command-center')) return
  emit('drag-start', event)
}

function maximizeBackground(event) {
  if (!props.floating || event.target.closest('button, input, select, a, .command-center')) return
  emit('maximize')
}
</script>

<template>
  <header class="titlebar" :class="{ 'desktop-window-titlebar': floating }" :data-kind="window?.kind" :data-switcher-position="switcherPosition" @pointerdown="dragBackground" @lostpointercapture="emit('drag-end', $event)" @dblclick="maximizeBackground">
    <div class="titlebar-left">
      <div v-if="floating" class="traffic-lights window-traffic-controls" role="group" aria-label="Window controls">
        <button class="window-traffic-button window-close" :aria-label="`Close window: ${window.project} ${window.kind}`" @click="emit('close')"><i class="codicon codicon-chrome-close" aria-hidden="true" /></button>
        <button class="window-traffic-button window-minimize" :aria-label="`Minimize window: ${window.project} ${window.kind}`" @click="emit('minimize')"><i class="codicon codicon-chrome-minimize" aria-hidden="true" /></button>
        <button class="window-traffic-button window-maximize" :aria-label="`${maximized ? 'Restore' : 'Maximize'} window: ${window.project} ${window.kind}`" :aria-pressed="maximized" @click="emit('maximize')"><i :class="`codicon codicon-chrome-${maximized ? 'restore' : 'maximize'}`" aria-hidden="true" /></button>
      </div>
      <div v-else class="traffic-lights" aria-hidden="true"><span /><span /><span /></div>
      <Teleport :to="`#${hostId}`" :disabled="switcherPosition === 'titlebar'" defer>
        <div v-if="floating" class="titlebar-spaces">
          <button class="space-trigger window-collection-trigger" :aria-label="`Switch Collection, ${current.name}`" :aria-describedby="notified ? `${id}-notifications` : undefined" aria-haspopup="dialog" :aria-expanded="collectionMenuOpen" aria-controls="spaces-dropdown" @click="emit('open-collections', $event.currentTarget)" @keydown.down.prevent="emit('open-collections', $event.currentTarget)">
            <span class="space-trigger-avatar"><SpaceAvatar :name="current.name" :color="current.color" :image="current.image" /><span v-if="notified" :id="`${id}-notifications`" class="space-notification" role="img" :aria-label="notificationLabel" /></span>
            <span class="space-trigger-name truncate">{{ current.name }}</span><i class="codicon codicon-chevron-down" aria-hidden="true" />
          </button>
        </div>
        <SpaceSwitcher v-else :spaces="spaces" :current="current" :theme="theme" v-on="switcherEvents" />
      </Teleport>
      <button v-if="floating" class="floating-drag-handle" :aria-label="`Move ${window.project} ${window.kind} window`" :aria-describedby="moveDescription" @pointerdown="emit('drag-start', $event)" @lostpointercapture="emit('drag-end', $event)" @dblclick="emit('maximize')" @keydown="emit('geometry-key', $event)" @keydown.enter.prevent="emit('maximize')"><span class="sr-only">{{ window.project }}</span></button>
    </div>
    <div class="titlebar-center">
      <div class="titlebar-navigation" aria-hidden="true"><i class="codicon codicon-arrow-left" /><i class="codicon codicon-arrow-right" /></div>
      <div class="command-center" :aria-label="window ? `${window.project}, ${window.kind === 'agents' ? 'Agents' : 'Editor'} work area${editorWorktree ? `, worktree ${editorWorktree.name}` : ''}` : current.name">
        <div v-show="switcherPosition === 'command-center'" :id="hostId" class="command-center-switcher" />
        <span class="command-center-context tooltip-host">
          <i v-if="window?.kind === 'agents'" class="codicon codicon-folder" aria-hidden="true" />
          <span class="command-center-label truncate">{{ window?.project || 'No open work areas' }}</span>
          <template v-if="window?.kind === 'agents' && worktree"><span class="command-center-separator" aria-hidden="true">/</span><i class="codicon codicon-git-branch" aria-hidden="true" /><span class="command-center-branch truncate">{{ worktree.branch }}</span></template>
          <template v-if="editorWorktree"><span class="command-center-separator" aria-hidden="true">/</span><span class="command-center-worktree"><i class="codicon codicon-worktree" aria-hidden="true" /><span class="truncate">Worktree: {{ editorWorktree.name }}</span></span></template>
          <span class="tooltip" role="tooltip">{{ worktree ? `${worktree.path} · ${worktree.branch}` : 'No open work areas' }}</span>
        </span>
        <span v-if="window?.kind === 'editor'" class="command-center-chat" role="img" aria-label="Chat controls"><i class="codicon codicon-chat-sparkle" aria-hidden="true" /><i class="codicon codicon-chevron-down" aria-hidden="true" /></span>
      </div>
    </div>
    <div class="titlebar-actions">
      <template v-if="window?.kind === 'editor'">
        <span class="titlebar-layout-hint tooltip-host" role="img" aria-label="Customize Layout"><i class="codicon codicon-layout" aria-hidden="true" /><span class="tooltip" role="tooltip">Customize Layout</span></span>
        <button class="icon-button tooltip-host sidebar-toggle" aria-label="Toggle Primary Side Bar" :aria-pressed="window.sidebarVisible" @click="emit('toggle-sidebar')"><i :class="`codicon codicon-layout-sidebar-left${window.sidebarVisible ? '' : '-off'}`" aria-hidden="true" /><span class="tooltip" role="tooltip">Toggle Primary Side Bar</span></button>
        <span class="titlebar-layout-hint tooltip-host" role="img" aria-label="Panel"><i class="codicon codicon-layout-panel" aria-hidden="true" /><span class="tooltip" role="tooltip">Panel</span></span>
        <span class="titlebar-layout-hint tooltip-host" role="img" aria-label="Secondary Side Bar"><i class="codicon codicon-layout-sidebar-right-off" aria-hidden="true" /><span class="tooltip" role="tooltip">Secondary Side Bar</span></span>
      </template>
      <template v-else>
        <button v-if="window" class="icon-button tooltip-host sidebar-toggle" aria-label="Toggle Primary Side Bar" :aria-pressed="window.sidebarVisible" @click="emit('toggle-sidebar')"><i :class="`codicon codicon-layout-sidebar-left${window.sidebarVisible ? '' : '-off'}`" aria-hidden="true" /><span class="tooltip" role="tooltip">Toggle Primary Side Bar</span></button>
        <span class="titlebar-account" role="img" aria-label="Accounts"><i class="codicon codicon-account" aria-hidden="true" /></span>
      </template>
    </div>
  </header>
</template>
