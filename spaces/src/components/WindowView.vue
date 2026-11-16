<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  window: { type: Object, required: true },
  sidebarVisible: { type: Boolean, default: true },
})
const emit = defineEmits(['draft', 'session', 'select-session', 'file', 'toggle-sidebar', 'open-editor'])
const surface = ref()
const sessionQuery = ref('')
const activeFile = computed(() => props.window.activeFile)
const selectedSession = computed(() => props.window.sessions.find(session => session.id === props.window.selectedSessionId))
const filteredSessions = computed(() => props.window.sessions.filter(session => session.title.toLowerCase().includes(sessionQuery.value.toLowerCase())))
const files = ['space.ts', 'index.ts', 'README.md', 'package.json']
const activityIcons = [
  { icon: 'search', label: 'Search' },
  { icon: 'source-control', label: 'Source Control' },
  { icon: 'debug-alt', label: 'Run and Debug' },
  { icon: 'extensions', label: 'Extensions' },
]
const statusLabels = { working: 'Working', input: 'Needs input', review: 'Needs review', done: 'Completed', preview: 'Preview' }
const code = computed(() => {
  if (activeFile.value === 'README.md') return [
    `# ${props.window.project}`, '', 'A little room for your next idea.', '',
    '## Getting started', '', 'npm install', 'npm run dev', '',
    '## Make yourself at home', '', 'Open an Agents work area in this Space to explore a task.',
  ]
  if (activeFile.value === 'package.json') return [
    '{', `  "name": "${props.window.project}",`, '  "private": true,', '  "type": "module",',
    '  "scripts": {', '    "dev": "vite",', '    "build": "vite build"', '  }', '}',
  ]
  if (activeFile.value === 'index.ts') return [
    "import { createSpace } from './space';", '', 'const personal = createSpace({',
    "  name: 'Personal',", "  description: 'Just for the joy of it',", "  startIn: 'editor',", "  color: 'peach',",
    '});', '', 'export default personal;',
  ]
  return [
    'export interface Space {', '  id: string;', '  name: string;', '  workAreas: WorkArea[];',
    '  activeWorkAreaId: string | null;',
    '}', '', 'export function createSpace(options: SpaceOptions): Space {',
    '  const area = createWorkArea(options.startIn);',
    '  return {', '    id: crypto.randomUUID(),', '    name: options.name,',
    '    workAreas: [area],', '    activeWorkAreaId: area.id,', '  };', '}', '', '// A Space brings related work areas together.',
  ]
})

function submit() {
  if (!props.window.draft.trim()) return
  emit('session', props.window.draft.trim())
}

async function selectSession(id) {
  emit('select-session', id)
  await nextTick()
  surface.value.querySelector(id ? '.session-title' : '#task-draft')?.focus()
}

async function navigateFiles(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const index = files.indexOf(activeFile.value)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? files.length - 1
    : (index + (event.key === 'ArrowRight' ? 1 : -1) + files.length) % files.length
  emit('file', files[next])
  await nextTick()
  surface.value.querySelector('.editor-tab[aria-selected="true"]')?.focus()
}

watch(() => props.window.id, () => { sessionQuery.value = '' })
</script>

<template>
  <section ref="surface" class="window-view" :class="`${window.kind}-window`" :aria-label="`${window.project} ${window.kind} work area`">
    <div v-if="window.kind === 'agents'" class="agents-view">
      <aside v-if="sidebarVisible" class="sessions-sidebar" aria-label="Sessions">
        <header class="sessions-header"><h2>Sessions</h2><button class="new-session-button" @click="selectSession(null)">New<i class="codicon codicon-edit" aria-hidden="true" /></button></header>
        <label class="session-search"><i class="codicon codicon-search" aria-hidden="true" /><input v-model="sessionQuery" aria-label="Search sessions" placeholder="Search sessions" /></label>
        <nav class="sessions-list" aria-label="Agent sessions">
          <details class="session-group" open>
            <summary><i class="codicon codicon-chevron-down" aria-hidden="true" /><span class="truncate">{{ window.project }}</span><span class="session-count">{{ filteredSessions.length }}</span></summary>
            <button v-for="session in filteredSessions" :key="session.id" class="session-row" :data-session-id="session.id" :aria-current="session.id === window.selectedSessionId ? 'page' : undefined" @click="selectSession(session.id)">
              <span class="session-symbol" :data-status="session.status"><i :class="`codicon codicon-${session.status === 'input' ? 'question' : session.status === 'review' ? 'git-pull-request' : session.status === 'working' ? 'loading' : session.status === 'preview' ? 'comment-discussion' : 'check'}`" aria-hidden="true" /></span>
              <span class="session-row-copy"><strong class="truncate">{{ session.title }}</strong><span><span class="session-state" :data-status="session.status">{{ statusLabels[session.status] }}</span><span class="list-separator">·</span>{{ session.time }}</span></span>
            </button>
            <p v-if="!filteredSessions.length" class="empty-sessions">{{ sessionQuery ? 'No matching sessions.' : 'No sessions yet.' }}</p>
          </details>
        </nav>
        <footer class="sessions-footer"><i class="codicon codicon-device-desktop" aria-hidden="true" />Local sessions<span>{{ window.sessions.length }}</span></footer>
      </aside>
      <section class="agent-session-panel" aria-label="Active session">
        <header class="session-toolbar"><h1 class="session-title truncate" tabindex="-1">{{ selectedSession?.title || 'New session' }}</h1><span class="session-location"><i class="codicon codicon-device-desktop" aria-hidden="true" />Local</span><button v-if="selectedSession" class="open-editor-button" aria-label="Open session in Editor" @click="emit('open-editor', selectedSession.id)"><i class="codicon codicon-code" aria-hidden="true" /><span>Open in Editor</span><i class="codicon codicon-link-external" aria-hidden="true" /></button></header>
        <div class="chat-transcript">
          <template v-if="selectedSession">
            <div class="user-request"><p>{{ selectedSession.title }}</p></div>
            <article class="sample-response" aria-label="Example Copilot response">
              <div class="response-author"><i class="codicon codicon-copilot" aria-hidden="true" /><strong>Copilot</strong><span class="muted">{{ selectedSession.time }}</span></div>
              <p>{{ selectedSession.detail }}</p>
              <div v-if="!['input', 'preview'].includes(selectedSession.status)" class="sample-changes">
                <h2>Changed files <span>3</span><span class="change-additions">+42</span><span class="change-deletions">-18</span></h2>
                <div v-for="(file, index) in files.slice(0, 3)" :key="file"><span class="file-symbol">{{ file.endsWith('.ts') ? 'TS' : 'M↓' }}</span><span>{{ file }}</span><span class="change-additions">+{{ [28, 10, 4][index] }}</span><span class="change-deletions">-{{ [8, 6, 4][index] }}</span></div>
              </div>
              <p class="response-status"><i class="codicon codicon-info" aria-hidden="true" />{{ statusLabels[selectedSession.status] }} · Simulated session, no agent connected.</p>
            </article>
          </template>
          <div v-else class="agent-empty-state"><i class="codicon codicon-copilot" aria-hidden="true" /><h2>What would you like to build?</h2><p>Start a new session in {{ window.project }}.</p></div>
        </div>
        <div class="chat-input-area">
          <form class="task-composer" @submit.prevent="submit">
            <label class="sr-only" for="task-draft">Describe a task</label>
            <textarea id="task-draft" :value="window.draft" placeholder="Ask a question, or describe what to build" rows="3" @input="emit('draft', $event.target.value)" @keydown.meta.enter.prevent="submit" @keydown.ctrl.enter.prevent="submit" />
            <div class="composer-footer"><span>Agent<i class="codicon codicon-chevron-down" aria-hidden="true" /><span class="composer-separator" />Auto<i class="codicon codicon-chevron-down" aria-hidden="true" /></span><span class="composer-model">Preview only</span><button class="send-button" type="submit" aria-label="Create preview session" :disabled="!window.draft.trim()"><i class="codicon codicon-arrow-up" aria-hidden="true" /></button></div>
          </form>
          <p class="chat-input-note">AI responses are illustrative. No requests are sent.</p>
        </div>
      </section>
    </div>

    <div v-else class="editor-view">
      <nav class="editor-activity-bar" aria-label="Editor activity bar">
        <button class="activity-item" aria-label="Explorer" :aria-pressed="sidebarVisible" @click="emit('toggle-sidebar')"><i class="codicon codicon-files" aria-hidden="true" /></button>
        <span v-for="item in activityIcons" :key="item.icon" class="activity-item tooltip-host" :aria-label="`${item.label} (illustrative)`"><i :class="`codicon codicon-${item.icon}`" aria-hidden="true" /><span class="tooltip" role="tooltip">{{ item.label }} (illustrative)</span></span>
        <div class="activity-bar-bottom" aria-hidden="true"><i class="codicon codicon-account" /><i class="codicon codicon-settings-gear" /></div>
      </nav>
      <aside v-if="sidebarVisible" class="file-explorer" aria-label="Explorer">
        <header class="explorer-header"><h2>EXPLORER</h2><i class="codicon codicon-ellipsis" aria-hidden="true" /></header>
        <details class="folder-tree" open><summary><i class="codicon codicon-chevron-down" aria-hidden="true" /><strong class="truncate">{{ window.project.toUpperCase() }}</strong></summary>
          <div class="tree-folder"><i class="codicon codicon-chevron-down" aria-hidden="true" /><i class="codicon codicon-folder-opened" aria-hidden="true" />src</div>
          <button v-for="file in files" :key="file" :class="{ 'source-file': file.endsWith('.ts') }" :aria-current="activeFile === file ? 'page' : undefined" @click="emit('file', file)"><span class="file-symbol" :class="{ markdown: file.endsWith('.md') }">{{ file.endsWith('.ts') ? 'TS' : file.endsWith('.md') ? 'M↓' : '{}' }}</span>{{ file }}</button>
        </details>
        <div class="explorer-sections"><details><summary>OUTLINE</summary><p>Read-only example files.</p></details><details><summary>TIMELINE</summary><p>No file history in this preview.</p></details></div>
      </aside>
      <div class="code-area">
        <div class="editor-tabs" role="tablist" aria-label="Open files" @keydown="navigateFiles"><button v-for="file in files" :id="`tab-${file}`" :key="file" class="editor-tab" role="tab" :aria-selected="activeFile === file" aria-controls="example-code" :tabindex="activeFile === file ? 0 : -1" @click="emit('file', file)"><span class="file-symbol">{{ file.endsWith('.ts') ? 'TS' : file.endsWith('.md') ? 'M↓' : '{}' }}</span>{{ file }}<i class="codicon codicon-close" aria-hidden="true" /></button></div>
        <div class="file-breadcrumb">{{ window.project }}<template v-if="window.sessionContext"><i class="codicon codicon-chevron-right" aria-hidden="true" /><span class="session-context-label truncate">{{ window.sessionContext.title }}</span></template><i class="codicon codicon-chevron-right" aria-hidden="true" />src<i class="codicon codicon-chevron-right" aria-hidden="true" />{{ activeFile }}</div>
        <div id="example-code" class="code-lines" role="tabpanel" :aria-labelledby="`tab-${activeFile}`" tabindex="0"><div v-for="(line, index) in code" :key="index" class="code-line"><span class="line-number" aria-hidden="true">{{ index + 1 }}</span><code :class="{ 'code-comment': line.startsWith('//'), 'code-keyword': /^(export|import)/.test(line) }">{{ line || ' ' }}</code></div></div>
        <div class="terminal-panel"><div class="terminal-heading"><span class="terminal-active">TERMINAL</span><span>OUTPUT</span><span>PROBLEMS <span class="terminal-count">0</span></span><i class="codicon codicon-terminal" aria-hidden="true" /></div><p><span class="terminal-path">{{ window.project }}</span> <span class="muted">on</span> <span class="terminal-branch">main</span></p><p><span class="terminal-prompt">❯</span> <span class="terminal-cursor" aria-hidden="true" /></p><p class="terminal-hint">Terminal output is illustrative.</p></div>
      </div>
    </div>
    <footer v-if="window.kind === 'editor'" class="window-statusbar"><span><i class="codicon codicon-source-control" aria-hidden="true" />{{ window.branch }}<i class="codicon codicon-sync" aria-hidden="true" /><i class="codicon codicon-error" aria-hidden="true" />0<i class="codicon codicon-warning" aria-hidden="true" />0</span><span>Ln 1, Col 1<span class="statusbar-divider" />Spaces: 2<span class="statusbar-divider" />UTF-8<span class="statusbar-divider" />{{ activeFile.endsWith('.ts') ? 'TypeScript' : activeFile.endsWith('.md') ? 'Markdown' : 'JSON' }}<i class="codicon codicon-bell" aria-hidden="true" /></span></footer>
  </section>
</template>
