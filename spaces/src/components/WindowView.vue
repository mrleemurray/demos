<script setup>
import { computed, nextTick, ref, useId, watch } from 'vue'
import SessionMenu from './SessionMenu.vue'
import { activeSessions, isLinkedWorktree } from '../model.js'
import { getProjectContent } from '../projectContent.js'

const props = defineProps({
  window: { type: Object, required: true },
  space: { type: Object, required: true },
  spaces: { type: Array, required: true },
  sidebarVisible: { type: Boolean, default: true },
  theme: { type: String, default: 'dark' },
  worktrees: { type: Array, default: () => [] },
  worktree: { type: Object, default: null },
  uniqueIds: { type: Boolean, default: false },
})
const emit = defineEmits(['draft', 'session', 'select-session', 'complete-session', 'file', 'toggle-sidebar', 'open-editor', 'move-session'])
const surface = ref()
const instanceId = useId()
function controlId(name) {
  return props.uniqueIds ? `${instanceId}-${name}` : name
}
const sessionQuery = ref('')
const sessionSearchVisible = ref(false)
const sessionSearchInput = ref()
const sessionMenu = ref()
const contextSessionId = ref(null)
const projectContent = computed(() => getProjectContent(props.window.project, props.worktree?.branch))
const files = computed(() => projectContent.value.files)
// Older saved tabs can still reference the shared placeholder files.
const selectedFile = computed(() => files.value.find(file => file.name === props.window.activeFile) || files.value[0])
const activeFile = computed(() => selectedFile.value.name)
const sessions = computed(() => activeSessions(props.window))
const selectedSession = computed(() => sessions.value.find(session => session.id === props.window.selectedSessionId))
const linkedWorktreeIds = computed(() => new Set(props.worktrees.filter(isLinkedWorktree).map(tree => tree.id)))
const filteredSessions = computed(() => sessions.value.filter(session => session.title.toLowerCase().includes(sessionQuery.value.toLowerCase())))
const changedFiles = computed(() => files.value.filter(file => file.additions !== undefined))
const changeTotals = computed(() => changedFiles.value.reduce((totals, file) => ({
  additions: totals.additions + file.additions, deletions: totals.deletions + file.deletions,
}), { additions: 0, deletions: 0 }))
function fileIconClass(file) {
  if (file.language === 'Markdown') return 'file-symbol codicon codicon-markdown'
  if (file.language === 'JSON') return 'file-symbol codicon codicon-json'
  if (file.language === 'CSS') return 'file-symbol file-css codicon codicon-symbol-color'
  return file.language === 'TypeScript React' ? 'file-symbol file-react' : 'file-symbol'
}
function fileIconLabel(file) {
  return { 'TypeScript React': 'TSX', TypeScript: 'TS', Python: 'PY', Go: 'GO' }[file.language] || ''
}
const activityIcons = [
  { icon: 'search', label: 'Search' },
  { icon: 'source-control', label: 'Source Control' },
  { icon: 'debug-alt', label: 'Run and Debug' },
  { icon: 'extensions', label: 'Extensions' },
]
const statusLabels = { working: 'Working', input: 'Needs input', review: 'Needs review', done: 'Completed', preview: 'Preview' }
const sessionIcons = { working: 'loading', input: 'question', review: 'git-pull-request', done: 'circle-small-filled', preview: 'comment-discussion' }
const customizationItems = [
  { icon: 'home', label: 'Overview' },
  { icon: 'plug', label: 'Plugins' },
  { icon: 'server', label: 'MCP Servers' },
  { icon: 'lightbulb', label: 'Skills' },
  { icon: 'book', label: 'Instructions' },
]
const sessionTools = [
  { icon: 'new-file', label: 'New chat' },
  { icon: 'files', label: 'Files' },
  { icon: 'globe', label: 'Browser' },
  { icon: 'server', label: 'MCP Servers' },
  { icon: 'terminal', label: 'Terminal' },
]
const code = computed(() => selectedFile.value.content.split('\n'))
const highlightedCode = computed(() => code.value.map(line => {
  if (selectedFile.value.language === 'Markdown') return [{ text: line, kind: /^#{1,6}\s/.test(line) ? 'heading' : undefined }]
  const tokens = []
  const pattern = /\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:export|interface|function|const|let|return|null|true|false|string|number|readonly|import|from|default|package|type|struct|func|nil|class|def|for|in)\b|\b[A-Z][\w]*\b|\b[a-zA-Z_$][\w$]*(?=\()|\b\d+\b/g
  let cursor = 0
  for (const match of line.matchAll(pattern)) {
    if (match.index > cursor) tokens.push({ text: line.slice(cursor, match.index) })
    const text = match[0]
    const kind = text.startsWith('//') ? 'comment'
      : /^["']/.test(text) ? (line.slice(match.index + text.length).trimStart().startsWith(':') ? 'property' : 'string')
        : /^\d/.test(text) ? 'number'
          : /^[A-Z]/.test(text) ? 'type'
            : ['export', 'return', 'import', 'from', 'default'].includes(text) ? 'control'
              : line[match.index + text.length] === '(' ? 'function' : 'keyword'
    tokens.push({ text, kind })
    cursor = match.index + text.length
  }
  if (cursor < line.length) tokens.push({ text: line.slice(cursor) })
  return tokens
}))

function submit() {
  if (!props.window.draft.trim()) return
  emit('session', { title: props.window.draft.trim(), spaceId: props.space.id })
}

async function selectSession(id) {
  emit('select-session', id)
  await nextTick()
  surface.value.querySelector(id ? '.session-title' : '.task-composer textarea')?.focus()
}

function showSessionMenu(event, id) {
  contextSessionId.value = id
  sessionMenu.value.open(event)
}

function sessionKeyboard(event, id) {
  if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
    event.preventDefault()
    event.stopPropagation()
    showSessionMenu(event, id)
  }
}

async function showSessionSearch() {
  sessionSearchVisible.value = true
  await nextTick()
  sessionSearchInput.value?.focus()
}

async function closeSessionSearch() {
  sessionQuery.value = ''
  sessionSearchVisible.value = false
  await nextTick()
  surface.value.querySelector('.session-find-button')?.focus()
}

async function navigateFiles(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const index = files.value.findIndex(file => file.name === activeFile.value)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? files.value.length - 1
    : (index + (event.key === 'ArrowRight' ? 1 : -1) + files.value.length) % files.value.length
  emit('file', files.value[next].name)
  await nextTick()
  surface.value.querySelector('.editor-tab[aria-selected="true"]')?.focus()
}

watch(() => filteredSessions.value.some(session => session.id === contextSessionId.value), available => {
  if (!available) sessionMenu.value?.close(false)
})
watch(() => props.window.id, () => {
  sessionQuery.value = ''
  sessionSearchVisible.value = false
})
</script>

<template>
  <section ref="surface" class="window-view" :class="`${window.kind}-window`" :aria-label="`${window.project} ${window.kind} work area`">
    <div v-if="window.kind === 'agents'" class="agents-view">
      <aside v-if="sidebarVisible" class="sessions-sidebar" aria-label="Sessions">
        <header class="sessions-header">
          <div v-if="sessionSearchVisible" class="session-search" @keydown.esc.prevent.stop="closeSessionSearch"><i class="codicon codicon-search" aria-hidden="true" /><input ref="sessionSearchInput" v-model="sessionQuery" aria-label="Search sessions" placeholder="Find session" /><button class="icon-button" aria-label="Close session search" @click="closeSessionSearch"><i class="codicon codicon-close" aria-hidden="true" /></button></div>
          <template v-else>
            <h2>Sessions</h2>
            <div class="sessions-header-actions">
              <button class="new-session-button" @click="selectSession(null)">New</button>
              <span class="icon-button tooltip-host" role="img" aria-label="Filter Sessions"><i class="codicon codicon-filter" aria-hidden="true" /><span class="tooltip" role="tooltip">Filter Sessions</span></span>
              <button class="icon-button session-find-button tooltip-host" aria-label="Find Session" @click="showSessionSearch"><i class="codicon codicon-search" aria-hidden="true" /><span class="tooltip" role="tooltip">Find Session</span></button>
              <span class="icon-button tooltip-host" role="img" aria-label="More Actions"><i class="codicon codicon-ellipsis" aria-hidden="true" /><span class="tooltip" role="tooltip">More Actions</span></span>
            </div>
          </template>
        </header>
        <div class="sessions-shortcuts"><span class="session-shortcut tooltip-host" role="img" aria-label="Automations"><i class="codicon codicon-calendar" aria-hidden="true" />Automations<span class="tooltip" role="tooltip">Automations</span></span><span class="session-shortcut"><i class="codicon codicon-comment-discussion" aria-hidden="true" />Chats</span></div>
        <nav class="sessions-list" aria-label="Agent sessions">
          <details class="session-group" open>
            <summary><i class="codicon codicon-chevron-down" aria-hidden="true" /><i class="codicon codicon-folder" aria-hidden="true" /><span class="truncate">{{ window.project }}</span></summary>
            <div v-for="session in filteredSessions" :key="session.id" class="session-list-item">
            <button class="session-row" :data-session-id="session.id" :aria-current="session.id === window.selectedSessionId ? 'page' : undefined" aria-haspopup="menu" @click="selectSession(session.id)" @contextmenu.prevent.stop="showSessionMenu($event, session.id)" @keydown="sessionKeyboard($event, session.id)">
              <span class="session-symbol" :data-status="session.status"><i :class="`codicon codicon-${sessionIcons[session.status]}`" aria-hidden="true" /></span>
              <span class="session-row-copy"><strong class="truncate">{{ session.title }}</strong><span><i :class="`codicon codicon-${linkedWorktreeIds.has(session.worktreeId) ? 'worktree' : 'device-desktop'}`" role="img" :aria-label="linkedWorktreeIds.has(session.worktreeId) ? 'Worktree' : 'Local'" /><span class="session-state" :data-status="session.status">{{ statusLabels[session.status] }}</span><span class="list-separator">·</span>{{ session.time }}</span></span>
            </button>
            <button class="icon-button session-done-button tooltip-host" :aria-label="`Mark as done: ${session.title}`" @click="emit('complete-session', session.id)"><i class="codicon codicon-check" aria-hidden="true" /><span class="tooltip" role="tooltip">Mark as done</span></button>
            </div>
            <p v-if="!filteredSessions.length" class="empty-sessions">{{ sessionQuery ? 'No matching sessions.' : window.sessions.length ? 'No active sessions.' : 'No sessions yet.' }}</p>
          </details>
        </nav>
        <SessionMenu ref="sessionMenu" :theme="theme" :can-move="spaces.length > 1" @create="emit('open-editor', { sessionId: contextSessionId, destination: $event })" @move="emit('move-session', contextSessionId)" />
        <details class="session-customizations" open><summary>Customizations</summary><div class="customization-items"><span v-for="item in customizationItems" :key="item.label" class="session-shortcut tooltip-host" role="img" :aria-label="item.label"><i :class="`codicon codicon-${item.icon}`" aria-hidden="true" />{{ item.label }}<span class="tooltip" role="tooltip">{{ item.label }}</span></span></div></details>
      </aside>
      <section class="agent-session-panel" :class="{ 'new-session': !selectedSession }" aria-label="Active session">
        <header class="session-toolbar"><div class="session-header-content"><span class="session-header-status" :data-status="selectedSession?.status"><i :class="`codicon codicon-${selectedSession ? sessionIcons[selectedSession.status] : 'comment-discussion'}`" aria-hidden="true" /></span><h1 class="session-title truncate" tabindex="-1">{{ selectedSession?.title || 'New session' }}</h1></div></header>
        <div class="chat-transcript">
          <div class="chat-conversation">
          <template v-if="selectedSession">
            <div class="user-request"><p>{{ selectedSession.title }}</p></div>
            <article v-if="selectedSession.status !== 'preview'" class="sample-response" aria-label="Copilot response">
              <span class="sr-only">Copilot · {{ selectedSession.time }}</span>
              <p>{{ selectedSession.detail }}</p>
              <section v-if="projectContent.products" class="storefront-preview" aria-label="Storefront collection preview">
                <h2>Everyday essentials</h2>
                <div class="storefront-products">
                  <article v-for="product in projectContent.products" :key="product.name">
                    <div class="storefront-product-visual" :data-color="product.color"><i :class="`codicon codicon-${product.icon}`" aria-hidden="true" /></div>
                    <h3>{{ product.name }}</h3><span>${{ product.price.toFixed(2) }}</span>
                  </article>
                </div>
              </section>
              <div v-if="!['input', 'preview'].includes(selectedSession.status)" class="sample-changes">
                <h2>Changed files <span>{{ changedFiles.length }}</span><span class="change-additions">+{{ changeTotals.additions }}</span><span class="change-deletions">-{{ changeTotals.deletions }}</span></h2>
                <div v-for="file in changedFiles" :key="file.name"><span :class="fileIconClass(file)" aria-hidden="true">{{ fileIconLabel(file) }}</span><span>{{ file.name }}</span><span class="change-additions">+{{ file.additions }}</span><span v-if="file.deletions" class="change-deletions">-{{ file.deletions }}</span></div>
              </div>
            </article>
          </template>
          <div v-else class="agent-empty-state"><h2>What can I help you with?</h2></div>
          </div>
        </div>
        <div class="chat-input-area">
          <form class="task-composer" @submit.prevent="submit">
            <label class="sr-only" :for="controlId('task-draft')">Describe a task</label>
            <textarea :id="controlId('task-draft')" :value="window.draft" placeholder="Chat with Copilot" rows="3" @input="emit('draft', $event.target.value)" @keydown.meta.enter.prevent="submit" @keydown.ctrl.enter.prevent="submit" />
            <div class="composer-footer">
              <span class="composer-control tooltip-host" role="img" aria-label="Add Context"><i class="codicon codicon-add" aria-hidden="true" /><span class="tooltip" role="tooltip">Add Context</span></span>
              <span class="composer-control tooltip-host" role="img" aria-label="Agent mode"><i class="codicon codicon-agent" aria-hidden="true" />Agent<i class="codicon codicon-chevron-down" aria-hidden="true" /><span class="tooltip" role="tooltip">Agent mode</span></span>
              <span class="composer-control composer-interaction tooltip-host" role="img" aria-label="Interactive mode"><i class="codicon codicon-comment" aria-hidden="true" />Interactive<span class="tooltip" role="tooltip">Interactive mode</span></span>
              <span class="composer-model composer-control tooltip-host" role="img" aria-label="Auto model selection"><i class="codicon codicon-copilot" aria-hidden="true" />Auto<i class="codicon codicon-chevron-down" aria-hidden="true" /><span class="tooltip" role="tooltip">Auto model selection</span></span>
              <button class="send-button" type="submit" aria-label="Create preview session" :disabled="!window.draft.trim()"><i class="codicon codicon-arrow-up" aria-hidden="true" /></button>
            </div>
          </form>
        </div>
      </section>
      <nav class="session-activity-bar" aria-label="Session tools"><span v-for="item in sessionTools" :key="item.label" class="session-tool tooltip-host" role="img" :aria-label="item.label"><i :class="`codicon codicon-${item.icon}`" aria-hidden="true" /><span class="tooltip" role="tooltip">{{ item.label }}</span></span></nav>
    </div>

    <div v-else class="editor-view modern-editor" :class="{ 'sidebar-visible': sidebarVisible }">
      <div class="editor-sidebar-cluster floating-part">
      <nav class="editor-activity-bar" aria-label="Editor activity bar">
        <button class="activity-item" aria-label="Explorer" :aria-pressed="sidebarVisible" @click="emit('toggle-sidebar')"><i class="codicon codicon-files" aria-hidden="true" /></button>
        <span v-for="item in activityIcons" :key="item.icon" class="activity-item tooltip-host" :aria-label="item.label"><i :class="`codicon codicon-${item.icon}`" aria-hidden="true" /><span class="tooltip" role="tooltip">{{ item.label }}</span></span>
        <div class="activity-bar-bottom" aria-hidden="true"><i class="codicon codicon-account" /><i class="codicon codicon-settings-gear" /></div>
      </nav>
      <aside v-if="sidebarVisible" class="file-explorer" aria-label="Explorer">
        <header class="explorer-header"><h2>Explorer</h2><i class="codicon codicon-ellipsis" aria-hidden="true" /></header>
        <details class="folder-tree" open><summary><i class="codicon codicon-chevron-down" aria-hidden="true" /><strong class="truncate">{{ window.project }}</strong></summary>
          <div class="tree-folder"><i class="codicon codicon-chevron-down" aria-hidden="true" /><i class="codicon codicon-folder-opened" aria-hidden="true" /><span class="truncate">{{ projectContent.folder }}</span></div>
          <button v-for="file in files" :key="file.name" :class="{ 'source-file': file.inFolder }" :aria-current="activeFile === file.name ? 'page' : undefined" @click="emit('file', file.name)"><span :class="fileIconClass(file)" aria-hidden="true">{{ fileIconLabel(file) }}</span>{{ file.name }}</button>
        </details>
        <div class="explorer-sections"><details><summary>Outline</summary></details><details><summary>Timeline</summary></details></div>
      </aside>
      </div>
      <div class="editor-main-stack">
      <section class="code-area editor-surface floating-part" aria-label="Editor">
        <div class="editor-tabs connected-tabs" role="tablist" aria-label="Open files" @keydown="navigateFiles"><button v-for="file in files" :id="controlId(`tab-${file.name}`)" :key="file.name" class="editor-tab" role="tab" :aria-selected="activeFile === file.name" :aria-controls="controlId('example-code')" :tabindex="activeFile === file.name ? 0 : -1" @click="emit('file', file.name)"><span :class="fileIconClass(file)" aria-hidden="true">{{ fileIconLabel(file) }}</span>{{ file.name }}<i class="codicon codicon-close" aria-hidden="true" /></button></div>
        <div class="file-breadcrumb"><span>{{ worktree?.path || window.project }}</span><template v-if="window.sessionContext"><i class="codicon codicon-chevron-right" aria-hidden="true" /><span class="session-context-label truncate">{{ window.sessionContext.title }}</span></template><i class="codicon codicon-chevron-right" aria-hidden="true" /><template v-if="selectedFile.inFolder">{{ projectContent.folder }}<i class="codicon codicon-chevron-right" aria-hidden="true" /></template>{{ activeFile }}</div>
        <div :id="controlId('example-code')" class="code-lines" role="tabpanel" :aria-labelledby="controlId(`tab-${activeFile}`)" tabindex="0"><div v-for="(tokens, index) in highlightedCode" :key="index" class="code-line"><span class="line-number" aria-hidden="true">{{ index + 1 }}</span><code><template v-if="tokens.length"><span v-for="(token, tokenIndex) in tokens" :key="tokenIndex" :class="token.kind ? `token-${token.kind}` : undefined">{{ token.text }}</span></template><template v-else> </template></code></div></div>
      </section>
      <section class="terminal-panel floating-part" aria-label="Terminal">
        <header class="terminal-heading"><span class="terminal-active">Terminal</span><span>Output</span><span>Problems <span class="terminal-count">0</span></span><div class="terminal-tools" aria-hidden="true"><i class="codicon codicon-terminal" /><span>zsh</span><i class="codicon codicon-add" /><i class="codicon codicon-split-horizontal" /><i class="codicon codicon-ellipsis" /></div></header>
        <div class="terminal-content"><p><span class="terminal-path">{{ worktree?.path || window.project }}</span> <span class="muted">on</span> <span class="terminal-branch">{{ worktree?.branch || window.branch }}</span></p><p v-if="projectContent.command"><span class="terminal-prompt">❯</span> {{ projectContent.command }}</p><p v-for="line in projectContent.output" :key="line" class="terminal-log">{{ line }}</p><p><span class="terminal-prompt">❯</span> <span class="terminal-cursor" aria-hidden="true" /></p></div>
      </section>
      </div>
    </div>
    <footer v-if="window.kind === 'editor'" class="window-statusbar"><span><i class="codicon codicon-source-control" aria-hidden="true" />{{ window.branch }}<i class="codicon codicon-sync" aria-hidden="true" /><i class="codicon codicon-error" aria-hidden="true" />0<i class="codicon codicon-warning" aria-hidden="true" />0</span><span>Ln 1, Col 1<span class="statusbar-divider" />Spaces: 2<span class="statusbar-divider" />UTF-8<span class="statusbar-divider" />{{ selectedFile.language }}<i class="codicon codicon-bell" aria-hidden="true" /></span></footer>
  </section>
</template>
