<template>
  <div class="bento-app">
    <header class="titlebar">
      <div class="titlebar-left">
        <button class="repo-selector" @click.stop="showRepoDrawer = !showRepoDrawer">
          <i :class="'codicon codicon-' + activeRepo.icon"></i>
          <span class="repo-name">{{ activeRepo.name }}</span>
          <i class="codicon codicon-chevron-down repo-chevron" :class="{ open: showRepoDrawer }"></i>
        </button>
        <!-- Repo drawer -->
        <div v-if="showRepoDrawer" class="repo-drawer">
          <div class="repo-drawer-header">Repositories</div>
          <button
            v-for="repo in repos"
            :key="repo.id"
            class="repo-drawer-item"
            :class="{ active: repo.id === activeRepoId }"
            @click.stop="switchRepo(repo.id)"
          >
            <i :class="'codicon codicon-' + repo.icon"></i>
            <span>{{ repo.name }}</span>
            <span v-if="repo.id === activeRepoId" class="repo-active-dot"></span>
          </button>
          <div class="repo-drawer-divider"></div>
          <button class="repo-drawer-item" @click.stop="showRepoDrawer = false">
            <i class="codicon codicon-folder-opened"></i>
            <span>Add Project...</span>
          </button>
          <button class="repo-drawer-item" @click.stop="showRepoDrawer = false">
            <i class="codicon codicon-plus"></i>
            <span>New Project...</span>
          </button>
        </div>
      </div>
      <div class="titlebar-center">
        <div class="group-legend">
          <button
            v-for="g in activeGroups"
            :key="g.id"
            class="legend-chip"
            :class="{
              active: selectedGroup === g.id,
              'is-other-workspace': workspaceForGroup(g.id) && workspaceForGroup(g.id).id !== activeWorkspaceId,
            }"
            :style="{
              '--chip-color': g.accent,
              '--chip-bg': g.color,
            }"
            @click="onTagClick(g.id)"
          >
            <span class="chip-dot" :style="{ background: g.accent }"></span>
            {{ sessionLabel(g.id) }}
            <i v-if="groupHasAttention(g.id)" class="codicon codicon-warning chip-attention-icon"></i>
            <span class="chip-count">{{ allPanelsInGroup(g.id) }}</span>
          </button>
        </div>
      </div>
      <div class="titlebar-right">
        <div class="plus-menu-anchor">
          <button class="icon-btn" title="New Session" @click.stop="showPlusMenu = !showPlusMenu">
            <i class="codicon codicon-new-session"></i>
          </button>
          <div v-if="showPlusMenu" class="plus-menu" @click.stop>
            <button class="plus-menu-item" @click="addChat(); showPlusMenu = false">
              <i class="codicon codicon-comment-discussion"></i>
              <span>New Session Here</span>
            </button>
            <button class="plus-menu-item" @click="openChatInNewWorkspace(); showPlusMenu = false">
              <i class="codicon codicon-empty-window"></i>
              <span>New Session in New Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div
      class="bento-grid"
      ref="gridRef"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <div
        v-for="panel in panels"
        :key="panel.id"
        class="bento-cell"
        :class="{
          'is-selected': selectedPanel === panel.id,
          'is-unfocused': selectedPanel !== null && selectedPanel !== panel.id,
          'is-dragging': dragging && dragging.panel.id === panel.id,
          'is-drop-target': dropTarget && dropTarget.id === panel.id && dragging && dragging.panel.id !== panel.id,
          'is-mitosis-h': splittingPanel === panel.id && splitDirection === 'horizontal',
          'is-mitosis-v': splittingPanel === panel.id && splitDirection === 'vertical',
          'is-budding-h': spawnedPanel === panel.id && spawnDirection === 'horizontal',
          'is-budding-v': spawnedPanel === panel.id && spawnDirection === 'vertical',
          'is-spawn': spawningPanels.has(panel.id),
          'is-group-dimmed': selectedGroup && panel.group !== selectedGroup,
          'is-group-highlighted': selectedGroup && panel.group === selectedGroup,
          'is-attention': panel.attention,
        }"
        :style="cellStyle(panel)"
        @click="selectedPanel = panel.id"
        @animationend="onAnimEnd($event, panel.id)"
      >
        <!-- Cytoplasm glow during mitosis -->
        <div
          v-if="splittingPanel === panel.id"
          class="cytoplasm"
          :class="splitDirection === 'horizontal' ? 'cytoplasm-h' : 'cytoplasm-v'"
        ></div>
        <!-- Resize handles -->
        <div
          class="resize-handle resize-top"
          @mousedown.stop.prevent="startResize($event, panel, 'top')"
        ></div>
        <div
          class="resize-handle resize-bottom"
          @mousedown.stop.prevent="startResize($event, panel, 'bottom')"
        ></div>
        <div
          class="resize-handle resize-left"
          @mousedown.stop.prevent="startResize($event, panel, 'left')"
        ></div>
        <div
          class="resize-handle resize-right"
          @mousedown.stop.prevent="startResize($event, panel, 'right')"
        ></div>
        <div
          class="resize-handle resize-corner resize-corner-tl"
          @mousedown.stop.prevent="startResize($event, panel, 'top-left')"
        ></div>
        <div
          class="resize-handle resize-corner resize-corner-tr"
          @mousedown.stop.prevent="startResize($event, panel, 'top-right')"
        ></div>
        <div
          class="resize-handle resize-corner resize-corner-bl"
          @mousedown.stop.prevent="startResize($event, panel, 'bottom-left')"
        ></div>
        <div
          class="resize-handle resize-corner resize-corner-br"
          @mousedown.stop.prevent="startResize($event, panel, 'bottom-right')"
        ></div>

        <!-- Tab label (top-left corner) -->
        <div
          class="cell-tab"
          :class="{ 'is-grab': !dragging }"
          @mousedown="startDrag($event, panel)"
          @dblclick.stop="openModal(panel)"
        >
          <i :class="'codicon codicon-' + panel.icon"></i>
          <span class="cell-title">{{ panel.title }}</span>
          <i v-if="panel.attention" class="codicon codicon-warning cell-attention-icon"></i>
        </div>

        <!-- Action buttons (top-right, on hover) -->
        <div class="cell-actions">
          <button
            class="icon-btn-sm"
            title="Split Horizontal"
            @click.stop="splitPanel(panel, 'horizontal')"
          >
            <i class="codicon codicon-split-horizontal"></i>
          </button>
          <button
            class="icon-btn-sm"
            title="Split Vertical"
            @click.stop="splitPanel(panel, 'vertical')"
          >
            <i class="codicon codicon-split-vertical"></i>
          </button>
          <button
            class="icon-btn-sm close-btn"
            title="Close"
            @click.stop="removePanel(panel.id)"
            :disabled="panels.length <= 1"
          >
            <i class="codicon codicon-close"></i>
          </button>
        </div>

        <!-- Panel content -->
        <div class="cell-content" v-if="!panel.isChat" :class="'content-' + (panel.contentType || 'code')">
          <div v-if="panel.lines && panel.lines.length" class="code-lines">
            <div
              v-for="(line, li) in panel.lines"
              :key="li"
              class="code-line"
              :class="'line-' + (line.kind || 'default')"
            >
              <span class="line-num">{{ li + 1 }}</span>
              <span class="line-text">{{ line.text }}</span>
            </div>
          </div>
          <div v-else class="mock-content">
            <i :class="'codicon codicon-' + panel.contentIcon" class="content-icon"></i>
            <span class="content-label">{{ panel.contentLabel }}</span>
          </div>
        </div>

        <!-- Chat content -->
        <div class="chat-content" v-else>
          <div class="chat-messages" ref="chatMessagesRef">
            <div
              v-for="(msg, mi) in panel.messages"
              :key="mi"
              class="chat-msg"
              :class="msg.role"
            >
              <i class="codicon" :class="msg.role === 'user' ? 'codicon-account' : 'codicon-sparkle'"></i>
              <span>{{ msg.text }}</span>
            </div>
          </div>
          <div class="chat-input-row">
            <input
              class="chat-input"
              type="text"
              placeholder="Describe a layout…"
              @keydown.enter="onChatSubmit($event, panel)"
              @mousedown.stop
              @click.stop
            />
            <button class="chat-send" @click.stop="onChatSendClick(panel)" title="Send">
              <i class="codicon codicon-send"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Drop zone indicator -->
      <div
        v-if="dragging && dragging.started && dropZone"
        class="drop-zone-indicator"
        :style="dropZoneStyle"
      ></div>
    </div>

    <!-- Modal overlay -->
    <Transition name="modal">
      <div v-if="modalPanel" class="modal-overlay" @click.self="closeModal" @keydown.escape.window="closeModal">
        <div class="modal-cell" :style="{ '--group-accent': groupAccent(modalPanel.group) }">
          <div class="modal-header">
            <div class="cell-tab" style="pointer-events:none">
              <i :class="'codicon codicon-' + modalPanel.icon"></i>
              <span class="cell-title">{{ modalPanel.title }}</span>
              <i v-if="modalPanel.attention" class="codicon codicon-warning cell-attention-icon"></i>
            </div>
            <button class="icon-btn-sm" title="Close" @click="closeModal">
              <i class="codicon codicon-close"></i>
            </button>
          </div>
          <div class="cell-content" v-if="!modalPanel.isChat" :class="'content-' + (modalPanel.contentType || 'code')">
            <div v-if="modalPanel.lines && modalPanel.lines.length" class="code-lines">
              <div
                v-for="(line, li) in modalPanel.lines"
                :key="li"
                class="code-line"
                :class="'line-' + (line.kind || 'default')"
              >
                <span class="line-num">{{ li + 1 }}</span>
                <span class="line-text">{{ line.text }}</span>
              </div>
            </div>
            <div v-else class="mock-content">
              <i :class="'codicon codicon-' + modalPanel.contentIcon" class="content-icon"></i>
              <span class="content-label">{{ modalPanel.contentLabel }}</span>
            </div>
          </div>
          <div class="chat-content" v-else>
            <div class="chat-messages">
              <div
                v-for="(msg, mi) in modalPanel.messages"
                :key="mi"
                class="chat-msg"
                :class="msg.role"
              >
                <i class="codicon" :class="msg.role === 'user' ? 'codicon-account' : 'codicon-sparkle'"></i>
                <span>{{ msg.text }}</span>
              </div>
            </div>
            <div class="chat-input-row">
              <input
                class="chat-input"
                type="text"
                placeholder="Describe a layout…"
                @keydown.enter="onChatSubmit($event, modalPanel)"
              />
              <button class="chat-send" @click="onChatSendClick(modalPanel)" title="Send">
                <i class="codicon codicon-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Drag ghost -->
    <div
      v-if="dragging"
      class="drag-ghost"
      :style="dragGhostStyle"
    >
      <div class="cell-tab">
        <i :class="'codicon codicon-' + dragging.panel.icon"></i>
        <span class="cell-title">{{ dragging.panel.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'

// ─── Group definitions (context colors, not function) ────────────
const groups = [
  { id: 'blue',   label: 'Session 1', color: 'var(--bento-group-blue)',   accent: 'var(--bento-accent-blue)' },
  { id: 'green',  label: 'Session 2', color: 'var(--bento-group-green)',  accent: 'var(--bento-accent-green)' },
  { id: 'purple', label: 'Session 3', color: 'var(--bento-group-purple)', accent: 'var(--bento-accent-purple)' },
  { id: 'orange', label: 'Session 4', color: 'var(--bento-group-orange)', accent: 'var(--bento-accent-orange)' },
  { id: 'teal',   label: 'Session 5', color: 'var(--bento-group-teal)',   accent: 'var(--bento-accent-teal)' },
  { id: 'red',    label: 'Session 6', color: 'var(--bento-group-red)',    accent: 'var(--bento-accent-red)' },
]

const panelIcons = [
  'file-code', 'terminal', 'debug-alt', 'output', 'git-merge',
  'search', 'extensions', 'beaker', 'telescope', 'book',
]
const contentIcons = [
  'code', 'terminal-bash', 'bug', 'list-flat', 'git-commit',
  'search', 'package', 'symbol-method', 'graph', 'notebook',
]
const panelTitles = [
  'app.ts', 'Terminal 1', 'Debug Console', 'Output', 'Source Control',
  'Search Results', 'Extensions', 'Testing', 'Call Hierarchy', 'Notebook',
]
const contentLabels = [
  'TypeScript Editor', 'zsh — node', 'Breakpoints', 'Build Output', 'Changes (3)',
  '42 results', 'Installed (12)', 'All Tests Passed', 'Incoming Calls', 'Cell 1',
]

// ─── Session labels (per-repo) ───────────────────────────────────
const sessionLabels = computed(() => activeRepo.value.sessionLabels)
function sessionLabel(groupId) {
  return sessionLabels.value[groupId] || 'New Session'
}

// ─── Grid configuration ──────────────────────────────────────────
const gridCols = ref(12)
const GAP = 6

let nextId = 1
let nextWorkspaceId = 1
let nextRepoId = 1

function makePanel(col, row, colSpan, rowSpan, groupId, idx) {
  const i = idx % panelTitles.length
  return reactive({
    id: nextId++,
    col,
    row,
    colSpan,
    rowSpan,
    group: groupId || groups[i % groups.length].id,
    icon: panelIcons[i],
    title: panelTitles[i],
    contentIcon: contentIcons[i],
    contentLabel: contentLabels[i],
    isChat: false,
    messages: [],
  })
}

function makeChatPanel(col, row, colSpan, rowSpan) {
  return reactive({
    id: nextId++,
    col,
    row,
    colSpan,
    rowSpan,
    group: 'purple',
    icon: 'sparkle',
    title: 'Chat',
    contentIcon: 'comment-discussion',
    contentLabel: 'AI Chat',
    isChat: true,
    messages: [
      { role: 'assistant', text: 'Describe a layout and I\'ll build it for you.' },
    ],
  })
}

function makeCustomPanel(col, row, colSpan, rowSpan, groupId, opts) {
  return reactive({
    id: nextId++,
    col, row, colSpan, rowSpan,
    group: groupId,
    icon: opts.icon || 'file-code',
    title: opts.title || 'Untitled',
    contentIcon: opts.contentIcon || 'code',
    contentLabel: opts.contentLabel || '',
    contentType: opts.contentType || 'code',
    lines: opts.lines || [],
    isChat: false,
    messages: [],
    attention: opts.attention || false,
  })
}

function makeCustomChatPanel(col, row, colSpan, rowSpan, groupId, messages) {
  return reactive({
    id: nextId++,
    col, row, colSpan, rowSpan,
    group: groupId,
    icon: 'sparkle',
    title: 'Chat',
    contentIcon: 'comment-discussion',
    contentLabel: 'AI Chat',
    isChat: true,
    messages: messages || [{ role: 'assistant', text: 'Describe a layout and I\'ll build it for you.' }],
  })
}

// ─── Workspace model ─────────────────────────────────────────────
function createWorkspace(sessionGroup) {
  const chat = makeChatPanel(9, 1, 4, 8)
  chat.group = sessionGroup
  return reactive({
    id: nextWorkspaceId++,
    group: sessionGroup,
    panels: [chat],
    gridRows: 8,
    chatColorIndex: 0,
  })
}

function createDemoWorkspaces() {
  const demoSessionLabels = reactive({})
  // ─── Frontend Session (blue / Session 1) ───────────────────────
  const feChat = makeCustomChatPanel(9, 1, 4, 8, 'blue', [
    { role: 'assistant', text: 'What would you like to build?' },
    { role: 'user', text: 'Build a responsive dashboard with React and TypeScript' },
    { role: 'assistant', text: 'I\'ll scaffold a dashboard with reusable components, CSS modules for styling, and a custom data hook. Setting up the workspace now…' },
    { role: 'user', text: 'Add a chart component for data visualization' },
    { role: 'assistant', text: 'Spawning layout with editor, styles, data hook, terminal, and browser preview…' },
  ])
  const feWorkspace = reactive({
    id: nextWorkspaceId++,
    group: 'blue',
    panels: [
      makeCustomPanel(1, 1, 4, 4, 'blue', {
        icon: 'file-code', title: 'Dashboard.tsx',
        contentIcon: 'code', contentLabel: 'React Component',
        lines: [
          { text: 'import React from \'react\';', kind: 'keyword' },
          { text: 'import { useData } from \'./useData\';', kind: 'keyword' },
          { text: 'import styles from \'./styles.module.css\';', kind: 'keyword' },
          { text: '' },
          { text: 'export function Dashboard() {', kind: 'fn' },
          { text: '  const { metrics, loading } = useData();', kind: 'default' },
          { text: '' },
          { text: '  if (loading) return <Skeleton />;', kind: 'default' },
          { text: '' },
          { text: '  return (', kind: 'default' },
          { text: '    <div className={styles.grid}>', kind: 'tag' },
          { text: '      <MetricCard value={metrics.users} />', kind: 'tag' },
          { text: '      <MetricCard value={metrics.revenue} />', kind: 'tag' },
          { text: '      <ChartPanel data={metrics.trend} />', kind: 'tag' },
          { text: '    </div>', kind: 'tag' },
          { text: '  );', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      }),
      makeCustomPanel(5, 1, 4, 4, 'blue', {
        icon: 'file-code', title: 'styles.module.css',
        contentIcon: 'symbol-color', contentLabel: 'CSS Modules',
        lines: [
          { text: '.grid {', kind: 'fn' },
          { text: '  display: grid;', kind: 'default' },
          { text: '  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));', kind: 'default' },
          { text: '  gap: 16px;', kind: 'default' },
          { text: '  padding: 24px;', kind: 'default' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: '.card {', kind: 'fn' },
          { text: '  background: var(--surface-card);', kind: 'default' },
          { text: '  border-radius: 12px;', kind: 'default' },
          { text: '  padding: 20px;', kind: 'default' },
          { text: '  box-shadow: 0 1px 3px rgba(0,0,0,0.12);', kind: 'default' },
          { text: '  transition: transform 0.2s ease;', kind: 'default' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: '.card:hover {', kind: 'fn' },
          { text: '  transform: translateY(-2px);', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      }),
      makeCustomPanel(1, 5, 3, 4, 'blue', {
        icon: 'symbol-method', title: 'useData.ts',
        contentIcon: 'symbol-method', contentLabel: 'Custom Hook',
        lines: [
          { text: 'import { useState, useEffect } from \'react\';', kind: 'keyword' },
          { text: '' },
          { text: 'interface Metrics {', kind: 'fn' },
          { text: '  users: number;', kind: 'default' },
          { text: '  revenue: number;', kind: 'default' },
          { text: '  trend: DataPoint[];', kind: 'default' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: 'export function useData() {', kind: 'fn' },
          { text: '  const [metrics, setMetrics] = useState<Metrics>();', kind: 'default' },
          { text: '  const [loading, setLoading] = useState(true);', kind: 'default' },
          { text: '' },
          { text: '  useEffect(() => {', kind: 'keyword' },
          { text: '    fetch(\'/api/dashboard\')', kind: 'string' },
          { text: '      .then(r => r.json())', kind: 'default' },
          { text: '      .then(setMetrics)', kind: 'default' },
          { text: '      .finally(() => setLoading(false));', kind: 'default' },
          { text: '  }, []);', kind: 'keyword' },
          { text: '' },
          { text: '  return { metrics, loading };', kind: 'keyword' },
          { text: '}', kind: 'fn' },
        ],
      }),
      makeCustomPanel(4, 5, 3, 4, 'blue', {
        icon: 'terminal', title: 'Terminal',
        contentIcon: 'terminal-bash', contentLabel: 'npm run dev',
        contentType: 'terminal',
        lines: [
          { text: '$ npm run dev', kind: 'cmd' },
          { text: '' },
          { text: '  VITE v5.4.2  ready in 312 ms', kind: 'success' },
          { text: '' },
          { text: '  ➜  Local:   http://localhost:3000/', kind: 'info' },
          { text: '  ➜  Network: http://192.168.1.42:3000/', kind: 'info' },
          { text: '  ➜  press h + enter to show help', kind: 'dim' },
          { text: '' },
          { text: '[HMR] connected.', kind: 'success' },
          { text: '✓ 47 modules transformed.', kind: 'success' },
          { text: '  dist/index.html          0.42 kB │ gzip:  0.29 kB', kind: 'default' },
          { text: '  dist/assets/index.css    8.12 kB │ gzip:  2.31 kB', kind: 'default' },
          { text: '  dist/assets/index.js   142.87 kB │ gzip: 45.92 kB', kind: 'default' },
        ],
      }),
      makeCustomPanel(7, 5, 2, 4, 'blue', {
        icon: 'globe', title: 'Preview',
        contentIcon: 'globe', contentLabel: 'localhost:3000',
        contentType: 'preview',
        lines: [
          { text: '┌─────────────────────┐', kind: 'dim' },
          { text: '│  Dashboard          │', kind: 'info' },
          { text: '├────────┬────────────┤', kind: 'dim' },
          { text: '│ Users  │ Revenue    │', kind: 'default' },
          { text: '│ 12,847 │ $48,291    │', kind: 'success' },
          { text: '├────────┴────────────┤', kind: 'dim' },
          { text: '│  ▂▃▅▆▇█▇▆▅▃▂▃▅▇█  │', kind: 'info' },
          { text: '│  Trend (30 days)    │', kind: 'dim' },
          { text: '└─────────────────────┘', kind: 'dim' },
        ],
      }),
      feChat,
    ],
    gridRows: 8,
    chatColorIndex: 0,
  })

  // ─── Backend Session (green / Session 2) ───────────────────────
  const beChat = makeCustomChatPanel(9, 1, 4, 8, 'green', [
    { role: 'assistant', text: 'What would you like to build?' },
    { role: 'user', text: 'Set up a REST API with Express, Prisma, and JWT auth' },
    { role: 'assistant', text: 'I\'ll create the server scaffold with authentication middleware, route handlers, and a Prisma database schema.' },
    { role: 'user', text: 'Add rate limiting and input validation' },
    { role: 'assistant', text: 'Building API workspace with server, auth middleware, routes, and database schema…' },
  ])
  const beWorkspace = reactive({
    id: nextWorkspaceId++,
    group: 'green',
    panels: [
      makeCustomPanel(1, 1, 5, 4, 'green', {
        icon: 'file-code', title: 'server.ts',
        contentIcon: 'server', contentLabel: 'Express Server',
        lines: [
          { text: 'import express from \'express\';', kind: 'keyword' },
          { text: 'import cors from \'cors\';', kind: 'keyword' },
          { text: 'import helmet from \'helmet\';', kind: 'keyword' },
          { text: 'import { rateLimit } from \'express-rate-limit\';', kind: 'keyword' },
          { text: 'import { authRouter } from \'./routes\';', kind: 'keyword' },
          { text: 'import { authMiddleware } from \'./auth.middleware\';', kind: 'keyword' },
          { text: '' },
          { text: 'const app = express();', kind: 'fn' },
          { text: '' },
          { text: 'app.use(helmet());', kind: 'default' },
          { text: 'app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));', kind: 'default' },
          { text: 'app.use(express.json({ limit: \'10mb\' }));', kind: 'default' },
          { text: 'app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));', kind: 'default' },
          { text: '' },
          { text: 'app.use(\'/api\', authMiddleware, authRouter);', kind: 'string' },
          { text: '' },
          { text: 'app.listen(3001, () => {', kind: 'fn' },
          { text: '  console.log(\'Server running on :3001\');', kind: 'string' },
          { text: '});', kind: 'fn' },
        ],
      }),
      makeCustomPanel(6, 1, 3, 4, 'green', {
        icon: 'lock', title: 'auth.middleware.ts',
        contentIcon: 'shield', contentLabel: 'JWT Authentication',
        lines: [
          { text: 'import jwt from \'jsonwebtoken\';', kind: 'keyword' },
          { text: 'import { Request, Response, NextFunction } from \'express\';', kind: 'keyword' },
          { text: '' },
          { text: 'export function authMiddleware(', kind: 'fn' },
          { text: '  req: Request,', kind: 'default' },
          { text: '  res: Response,', kind: 'default' },
          { text: '  next: NextFunction', kind: 'default' },
          { text: ') {', kind: 'fn' },
          { text: '  const token = req.headers.authorization', kind: 'default' },
          { text: '    ?.replace(\'Bearer \', \'\');', kind: 'string' },
          { text: '' },
          { text: '  if (!token) {', kind: 'keyword' },
          { text: '    return res.status(401).json({', kind: 'default' },
          { text: '      error: \'Authentication required\'', kind: 'string' },
          { text: '    });', kind: 'default' },
          { text: '  }', kind: 'keyword' },
          { text: '' },
          { text: '  const decoded = jwt.verify(token, SECRET);', kind: 'default' },
          { text: '  req.user = decoded;', kind: 'default' },
          { text: '  next();', kind: 'fn' },
          { text: '}', kind: 'fn' },
        ],
      }),
      makeCustomPanel(1, 5, 4, 4, 'green', {
        icon: 'git-merge', title: 'routes.ts',
        contentIcon: 'list-flat', contentLabel: 'API Endpoints',
        lines: [
          { text: 'import { Router } from \'express\';', kind: 'keyword' },
          { text: 'import { validate } from \'./validator\';', kind: 'keyword' },
          { text: 'import { prisma } from \'./db\';', kind: 'keyword' },
          { text: '' },
          { text: 'export const authRouter = Router();', kind: 'fn' },
          { text: '' },
          { text: 'authRouter.get(\'/users\', async (req, res) => {', kind: 'string' },
          { text: '  const users = await prisma.user.findMany({', kind: 'default' },
          { text: '    select: { id: true, email: true, role: true },', kind: 'default' },
          { text: '    take: 50,', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '  res.json(users);', kind: 'default' },
          { text: '});', kind: 'fn' },
          { text: '' },
          { text: 'authRouter.post(\'/users\', validate, async (req, res) => {', kind: 'string' },
          { text: '  const user = await prisma.user.create({', kind: 'default' },
          { text: '    data: req.body,', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '  res.status(201).json(user);', kind: 'default' },
          { text: '});', kind: 'fn' },
        ],
      }),
      makeCustomPanel(5, 5, 4, 4, 'green', {
        icon: 'database', title: 'schema.prisma',
        contentIcon: 'database', contentLabel: 'Database Schema',
        contentType: 'code',
        lines: [
          { text: 'datasource db {', kind: 'fn' },
          { text: '  provider = "postgresql"', kind: 'string' },
          { text: '  url      = env("DATABASE_URL")', kind: 'string' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: 'model User {', kind: 'fn' },
          { text: '  id        Int      @id @default(autoincrement())', kind: 'default' },
          { text: '  email     String   @unique', kind: 'default' },
          { text: '  password  String', kind: 'default' },
          { text: '  role      Role     @default(USER)', kind: 'keyword' },
          { text: '  posts     Post[]', kind: 'default' },
          { text: '  createdAt DateTime @default(now())', kind: 'dim' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: 'model Post {', kind: 'fn' },
          { text: '  id        Int      @id @default(autoincrement())', kind: 'default' },
          { text: '  title     String', kind: 'default' },
          { text: '  content   String?', kind: 'default' },
          { text: '  author    User     @relation(fields: [authorId])', kind: 'keyword' },
          { text: '  authorId  Int', kind: 'default' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: 'enum Role {', kind: 'fn' },
          { text: '  USER', kind: 'keyword' },
          { text: '  ADMIN', kind: 'keyword' },
          { text: '}', kind: 'fn' },
        ],
      }),
      beChat,
    ],
    gridRows: 8,
    chatColorIndex: 0,
  })

  // ─── API & Docs Workspace (Session 3 + Session 4) ─────────────
  // Two sessions share this workspace: purple = API, orange = Docs
  const apiChat = makeCustomChatPanel(9, 1, 4, 4, 'purple', [
    { role: 'assistant', text: 'What would you like to build?' },
    { role: 'user', text: 'Design a REST API with OpenAPI spec and Swagger' },
    { role: 'assistant', text: 'I\'ll set up OpenAPI 3.1 with Swagger UI and route handlers. Scaffolding now…' },
  ])
  const docsChat = makeCustomChatPanel(9, 5, 4, 4, 'orange', [
    { role: 'assistant', text: 'What would you like to document?' },
    { role: 'user', text: 'Write getting-started docs with auth examples and SDK usage' },
    { role: 'assistant', text: 'I\'ll create a getting-started guide with installation, authentication, and code examples…' },
  ])
  const apiDocsWorkspace = reactive({
    id: nextWorkspaceId++,
    group: 'purple',
    panels: [
      // ── API session (purple) — top half ──
      makeCustomPanel(1, 1, 4, 4, 'purple', {
        icon: 'file-code', title: 'openapi.yaml',
        contentIcon: 'list-flat', contentLabel: 'OpenAPI 3.1 Spec',
        lines: [
          { text: 'openapi: 3.1.0', kind: 'keyword' },
          { text: 'info:', kind: 'fn' },
          { text: '  title: Acme API', kind: 'string' },
          { text: '  version: 2.0.0', kind: 'string' },
          { text: '  description: Production REST API', kind: 'string' },
          { text: '' },
          { text: 'paths:', kind: 'fn' },
          { text: '  /api/users:', kind: 'tag' },
          { text: '    get:', kind: 'keyword' },
          { text: '      summary: List users', kind: 'string' },
          { text: '      parameters:', kind: 'fn' },
          { text: '        - name: page', kind: 'default' },
          { text: '          in: query', kind: 'default' },
          { text: '          schema: { type: integer }', kind: 'default' },
          { text: '      responses:', kind: 'fn' },
          { text: '        200:', kind: 'success' },
          { text: '          description: OK', kind: 'string' },
          { text: '    post:', kind: 'keyword' },
          { text: '      summary: Create user', kind: 'string' },
          { text: '      requestBody:', kind: 'fn' },
          { text: '        content:', kind: 'default' },
          { text: '          application/json:', kind: 'default' },
          { text: '            schema: { $ref: \'#/components/schemas/User\' }', kind: 'tag' },
        ],
      }),
      makeCustomPanel(5, 1, 4, 4, 'purple', {
        icon: 'file-code', title: 'routes.controller.ts',
        contentIcon: 'server', contentLabel: 'Route Handlers',
        lines: [
          { text: 'import { Controller, Get, Post, Body } from \'@nestjs/common\';', kind: 'keyword' },
          { text: 'import { ApiTags, ApiOperation } from \'@nestjs/swagger\';', kind: 'keyword' },
          { text: 'import { UsersService } from \'./users.service\';', kind: 'keyword' },
          { text: '' },
          { text: '@ApiTags(\'users\')', kind: 'tag' },
          { text: '@Controller(\'api/users\')', kind: 'tag' },
          { text: 'export class UsersController {', kind: 'fn' },
          { text: '  constructor(private users: UsersService) {}', kind: 'default' },
          { text: '' },
          { text: '  @Get()', kind: 'tag' },
          { text: '  @ApiOperation({ summary: \'List all users\' })', kind: 'tag' },
          { text: '  findAll() {', kind: 'fn' },
          { text: '    return this.users.findAll();', kind: 'default' },
          { text: '  }', kind: 'fn' },
          { text: '' },
          { text: '  @Post()', kind: 'tag' },
          { text: '  @ApiOperation({ summary: \'Create a user\' })', kind: 'tag' },
          { text: '  create(@Body() dto: CreateUserDto) {', kind: 'fn' },
          { text: '    return this.users.create(dto);', kind: 'default' },
          { text: '  }', kind: 'fn' },
          { text: '}', kind: 'fn' },
        ],
      }),
      apiChat,
      makeCustomPanel(5, 5, 2, 4, 'purple', {
        icon: 'terminal', title: 'Terminal',
        contentIcon: 'terminal-bash', contentLabel: 'db:migrate',
        contentType: 'terminal',
        attention: true,
        lines: [
          { text: '$ npx prisma migrate deploy', kind: 'cmd' },
          { text: '' },
          { text: 'Prisma Migrate — Deploy', kind: 'info' },
          { text: '' },
          { text: '  2 migrations found in prisma/migrations/', kind: 'default' },
          { text: '' },
          { text: '  ✓  20250226_init         Applied', kind: 'success' },
          { text: '  ⚠  20250227_add_roles    Pending', kind: 'warning' },
          { text: '' },
          { text: '  1 pending migration needs to be applied.', kind: 'warning' },
          { text: '' },
          { text: '  Run `npx prisma migrate deploy` to apply.', kind: 'info' },
          { text: '' },
          { text: '  ⏎  Press ENTER to confirm, or Ctrl+C to abort.', kind: 'warning' },
        ],
      }),
      // ── Documentation session (orange) — bottom half ──
      makeCustomPanel(1, 5, 4, 4, 'orange', {
        icon: 'book', title: 'getting-started.md',
        contentIcon: 'book', contentLabel: 'Documentation',
        lines: [
          { text: '# Getting Started', kind: 'tag' },
          { text: '', kind: 'default' },
          { text: '## Installation', kind: 'tag' },
          { text: '', kind: 'default' },
          { text: '```bash', kind: 'comment' },
          { text: 'npm install @acme/sdk', kind: 'cmd' },
          { text: '```', kind: 'comment' },
          { text: '', kind: 'default' },
          { text: '## Authentication', kind: 'tag' },
          { text: '', kind: 'default' },
          { text: 'All API requests require a Bearer token:', kind: 'default' },
          { text: '', kind: 'default' },
          { text: '```typescript', kind: 'comment' },
          { text: 'const client = new AcmeClient({', kind: 'fn' },
          { text: '  apiKey: process.env.ACME_API_KEY,', kind: 'string' },
          { text: '  baseUrl: \'https://api.acme.io/v2\',', kind: 'string' },
          { text: '});', kind: 'fn' },
          { text: '```', kind: 'comment' },
          { text: '', kind: 'default' },
          { text: '## Quick Example', kind: 'tag' },
          { text: '', kind: 'default' },
          { text: '```typescript', kind: 'comment' },
          { text: 'const users = await client.users.list({ page: 1 });', kind: 'default' },
          { text: 'console.log(users.data);', kind: 'string' },
          { text: '```', kind: 'comment' },
        ],
      }),
      makeCustomPanel(7, 5, 2, 4, 'orange', {
        icon: 'globe', title: 'Swagger UI',
        contentIcon: 'globe', contentLabel: 'API Explorer',
        contentType: 'preview',
        lines: [
          { text: '┌───────────────────────────────┐', kind: 'dim' },
          { text: '│  Acme API v2.0.0   [Swagger]  │', kind: 'info' },
          { text: '├───────────────────────────────┤', kind: 'dim' },
          { text: '│                               │', kind: 'dim' },
          { text: '│  GET  /api/users       ✓ 200  │', kind: 'success' },
          { text: '│  POST /api/users       ✓ 201  │', kind: 'success' },
          { text: '│  GET  /api/users/:id   ✓ 200  │', kind: 'success' },
          { text: '│  PUT  /api/users/:id   ✓ 200  │', kind: 'success' },
          { text: '│  DEL  /api/users/:id   ✓ 204  │', kind: 'success' },
          { text: '│                               │', kind: 'dim' },
          { text: '│  Schemas: User, CreateUserDto  │', kind: 'info' },
          { text: '└───────────────────────────────┘', kind: 'dim' },
        ],
      }),
      docsChat,
    ],
    gridRows: 8,
    chatColorIndex: 0,
  })

  // ─── Session labels ──────────────────────────────────────────
  demoSessionLabels['blue'] = 'Frontend'
  demoSessionLabels['green'] = 'Backend'
  demoSessionLabels['purple'] = 'API'
  demoSessionLabels['orange'] = 'Documentation'

  return { workspaces: [feWorkspace, beWorkspace, apiDocsWorkspace], sessionLabels: demoSessionLabels }
}

// ─── Repo model ──────────────────────────────────────────────────
function createRepo(name, icon) {
  const demoData = createDemoWorkspaces()
  return reactive({
    id: nextRepoId++,
    name,
    icon: icon || 'repo',
    workspaces: demoData.workspaces,
    sessionLabels: demoData.sessionLabels,
    activeWorkspaceId: demoData.workspaces[0].id,
  })
}

// ── Lightweight repo factory (single session with a chat) ────────
function createSimpleRepo(name, icon, sessionName, sessionGroup, panelDefs) {
  const labels = reactive({})
  labels[sessionGroup] = sessionName
  const chat = makeChatPanel(9, 1, 4, 8)
  chat.group = sessionGroup
  const panels = panelDefs.map(d => {
    const p = makeCustomPanel(d.col, d.row, d.colSpan, d.rowSpan, sessionGroup, {
      icon: d.icon, title: d.title,
      contentIcon: d.contentIcon || 'code', contentLabel: d.contentLabel || d.title,
      lines: d.lines || [],
    })
    return p
  })
  panels.push(chat)
  const ws = reactive({
    id: nextWorkspaceId++,
    group: sessionGroup,
    panels,
    gridRows: 8,
    chatColorIndex: 0,
  })
  return reactive({
    id: nextRepoId++,
    name,
    icon: icon || 'repo',
    workspaces: [ws],
    sessionLabels: labels,
    activeWorkspaceId: ws.id,
  })
}

const repos = ref([
  createRepo('acme-webapp', 'repo'),
  createSimpleRepo('payments-api', 'repo-forked', 'Compiler', 'green', [
    { col: 1, row: 1, colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'checker.ts',
      lines: [
        { text: 'import { DiagnosticMessage } from \'./types\';', kind: 'keyword' },
        { text: 'import { createScanner } from \'./scanner\';', kind: 'keyword' },
        { text: '' },
        { text: 'export function createChecker(program: Program) {', kind: 'fn' },
        { text: '  const diagnostics: Diagnostic[] = [];', kind: 'default' },
        { text: '  return { checkSourceFile, getDiagnostics };', kind: 'default' },
        { text: '}', kind: 'default' },
      ] },
    { col: 5, row: 1, colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'parser.ts',
      lines: [
        { text: 'import { SyntaxKind } from \'./types\';', kind: 'keyword' },
        { text: '' },
        { text: 'export function parseSourceFile(text: string) {', kind: 'fn' },
        { text: '  const scanner = createScanner(text);', kind: 'default' },
        { text: '  return parseStatements(scanner);', kind: 'default' },
        { text: '}', kind: 'default' },
      ] },
    { col: 1, row: 5, colSpan: 4, rowSpan: 4, icon: 'terminal', title: 'Build',
      contentIcon: 'terminal-bash', contentLabel: 'tsc --watch',
      lines: [
        { text: '$ tsc --watch', kind: 'cmd' },
        { text: '[12:01:03] Starting compilation...', kind: 'info' },
        { text: '[12:01:08] Found 0 errors. Watching for changes.', kind: 'success' },
      ] },
    { col: 5, row: 5, colSpan: 4, rowSpan: 4, icon: 'beaker', title: 'tests.ts',
      lines: [
        { text: 'describe(\'Parser\', () => {', kind: 'fn' },
        { text: '  it(\'parses variable declarations\', () => {', kind: 'string' },
        { text: '    const result = parse(\'const x = 1;\');', kind: 'default' },
        { text: '    expect(result.kind).toBe(SyntaxKind.Const);', kind: 'default' },
        { text: '  });', kind: 'default' },
        { text: '});', kind: 'default' },
      ] },
  ]),
  createSimpleRepo('infra-deploy', 'repo-clone', 'Runtime', 'purple', [
    { col: 1, row: 1, colSpan: 4, rowSpan: 5, icon: 'file-code', title: 'lib/net.js',
      lines: [
        { text: '\'use strict\';', kind: 'string' },
        { text: 'const { TCP, constants } = internalBinding(\'tcp_wrap\');', kind: 'keyword' },
        { text: '' },
        { text: 'function createServer(options, connectionListener) {', kind: 'fn' },
        { text: '  return new Server(options, connectionListener);', kind: 'default' },
        { text: '}', kind: 'default' },
        { text: '' },
        { text: 'module.exports = { createServer, connect };', kind: 'keyword' },
      ] },
    { col: 5, row: 1, colSpan: 4, rowSpan: 5, icon: 'file-code', title: 'lib/http.js',
      lines: [
        { text: '\'use strict\';', kind: 'string' },
        { text: 'const { IncomingMessage } = require(\'_http_incoming\');', kind: 'keyword' },
        { text: '' },
        { text: 'function createHTTPServer(opts, requestListener) {', kind: 'fn' },
        { text: '  const server = new HTTPServer(opts);', kind: 'default' },
        { text: '  if (requestListener) server.on(\'request\', requestListener);', kind: 'default' },
        { text: '  return server;', kind: 'default' },
        { text: '}', kind: 'default' },
      ] },
    { col: 1, row: 6, colSpan: 8, rowSpan: 3, icon: 'terminal', title: 'make',
      contentIcon: 'terminal-bash', contentLabel: 'make -j4',
      lines: [
        { text: '$ make -j4', kind: 'cmd' },
        { text: 'CC  src/node_main.cc', kind: 'default' },
        { text: 'CC  src/node_platform.cc', kind: 'default' },
        { text: 'LINK node', kind: 'success' },
        { text: 'Build complete.', kind: 'success' },
      ] },
  ]),
])
const activeRepoId = ref(repos.value[0].id)
const activeRepo = computed(() => repos.value.find(r => r.id === activeRepoId.value))
const showRepoDrawer = ref(false)

function switchRepo(repoId) {
  activeRepoId.value = repoId
  showRepoDrawer.value = false
  selectedPanel.value = null
  selectedGroup.value = null
}

// Bridge: current repo's workspaces
const workspaces = computed({
  get: () => activeRepo.value.workspaces,
  set: (v) => { activeRepo.value.workspaces = v },
})
const activeWorkspaceId = computed({
  get: () => activeRepo.value.activeWorkspaceId,
  set: (v) => { activeRepo.value.activeWorkspaceId = v },
})
const activeWorkspace = computed(() => workspaces.value.find(w => w.id === activeWorkspaceId.value))

// Bind current workspace state to refs used by the rest of the code
const panels = computed({
  get: () => activeWorkspace.value.panels,
  set: (v) => { activeWorkspace.value.panels = v },
})
const gridRows = computed({
  get: () => activeWorkspace.value.gridRows,
  set: (v) => { activeWorkspace.value.gridRows = v },
})
const selectedPanel = ref(panels.value.length ? panels.value[0].id : null)
const selectedGroup = ref(null)
const modalPanel = ref(null)

function openModal(panel) {
  clearTimeout(dragDelayTimer)
  dragging.value = null
  modalPanel.value = panel
}
function closeModal() {
  modalPanel.value = null
}

// Auto-focus first panel when workspace or repo changes
watch(panels, (newPanels) => {
  if (newPanels.length && (!selectedPanel.value || !newPanels.some(p => p.id === selectedPanel.value))) {
    selectedPanel.value = newPanels[0].id
  }
})
const splittingPanel = ref(null)
const splitDirection = ref(null)
const spawnedPanel = ref(null)
const spawnDirection = ref(null)
const gridRef = ref(null)
const chatMessagesRef = ref(null)

// ─── Drag state ──────────────────────────────────────────────────
const dragging = ref(null)  // { panel, startX, startY, offsetX, offsetY, started }
const dragPos = reactive({ x: 0, y: 0 })
const dropTarget = ref(null)
const dropZone = ref(null) // { col, row, colSpan, rowSpan }
const showPlusMenu = ref(false)
const DRAG_THRESHOLD = 4

// ─── Helpers ─────────────────────────────────────────────────────
function panelsInGroup(groupId) {
  return panels.value.filter(p => p.group === groupId)
}

// Show tags for all sessions across all workspaces
const activeGroups = computed(() => {
  const usedGroups = new Set()
  for (const ws of workspaces.value) {
    for (const p of ws.panels) {
      usedGroups.add(p.group)
    }
  }
  return groups.filter(g => usedGroups.has(g.id))
})

// Count panels across all workspaces for a group
function allPanelsInGroup(groupId) {
  let count = 0
  for (const ws of workspaces.value) {
    count += ws.panels.filter(p => p.group === groupId).length
  }
  return count
}

function groupHasAttention(groupId) {
  for (const ws of workspaces.value) {
    if (ws.panels.some(p => p.group === groupId && p.attention)) return true
  }
  return false
}

// Find workspace that owns a session group (check ws.group and panel groups)
function workspaceForGroup(groupId) {
  return workspaces.value.find(ws =>
    ws.group === groupId || ws.panels.some(p => p.group === groupId)
  )
}

function onTagClick(groupId) {
  // If clicking the active filter, deselect
  if (selectedGroup.value === groupId) {
    selectedGroup.value = null
    return
  }
  // Switch to the workspace that owns this group if it's not the current one
  const ws = workspaceForGroup(groupId)
  if (ws && ws.id !== activeWorkspaceId.value) {
    activeWorkspaceId.value = ws.id
    selectedGroup.value = null
    selectedPanel.value = null
  } else {
    selectedGroup.value = groupId
  }
}

function groupAccent(groupId) {
  const g = groups.find(g => g.id === groupId)
  return g ? g.accent : 'var(--bento-accent-default)'
}

function groupColor(groupId) {
  const g = groups.find(g => g.id === groupId)
  return g ? g.color : 'var(--bento-group-default)'
}

function cellStyle(panel) {
  return {
    gridColumn: `${panel.col} / span ${panel.colSpan}`,
    gridRow: `${panel.row} / span ${panel.rowSpan}`,
    '--group-color': groupColor(panel.group),
    '--group-accent': groupAccent(panel.group),
  }
}

// ─── Close plus menu on outside click ─────────────────────────────
function onDocClick() { showPlusMenu.value = false; showRepoDrawer.value = false }
if (typeof document !== 'undefined') {
  document.addEventListener('click', onDocClick)
}

// ─── Open chat in a new workspace (same window) ─────────────────
function openChatInNewWorkspace() {
  // Pick the next unused session color
  const usedGroups = new Set(workspaces.value.map(w => w.group))
  let sessionGroup = null
  for (const g of groups) {
    if (!usedGroups.has(g.id)) { sessionGroup = g.id; break }
  }
  if (!sessionGroup) {
    // All colors used — cycle
    sessionGroup = groups[workspaces.value.length % groups.length].id
  }
  const ws = createWorkspace(sessionGroup)
  workspaces.value.push(ws)
  activeWorkspaceId.value = ws.id
  selectedGroup.value = null
}

// ─── Add new chat ─────────────────────────────────────────────────
function addChat() {
  const ws = activeWorkspace.value
  // Pick the next unused session color across all workspaces in this repo
  const usedGroups = new Set()
  for (const w of workspaces.value) {
    usedGroups.add(w.group)
    for (const p of w.panels) {
      usedGroups.add(p.group)
    }
  }
  let sessionGroup = null
  for (const g of groups) {
    if (!usedGroups.has(g.id)) { sessionGroup = g.id; break }
  }
  if (!sessionGroup) {
    // All colors used — cycle through
    sessionGroup = groups[usedGroups.size % groups.length].id
  }
  // Place new chat on the right, stacking below existing chats
  const chatCol = 9
  const chatWidth = 4
  // Find the lowest row used by existing chats in this column range
  let maxRow = 0
  for (const p of panels.value) {
    if (p.isChat && p.col >= chatCol) {
      maxRow = Math.max(maxRow, p.row + p.rowSpan - 1)
    }
  }
  const newRow = maxRow > 0 ? maxRow + 1 : gridRows.value + 1
  if (newRow + 4 > gridRows.value) {
    gridRows.value = newRow + 4
  }
  const p = makeChatPanel(chatCol, newRow, chatWidth, 5)
  p.group = sessionGroup
  // Register a session label for the new group
  const labels = activeRepo.value.sessionLabels
  if (!labels[sessionGroup]) {
    labels[sessionGroup] = 'New Session'
  }
  panels.value.push(p)
  selectedPanel.value = p.id
}

// ─── Remove panel ────────────────────────────────────────────────
function removePanel(id) {
  if (panels.value.length <= 1) return
  const idx = panels.value.findIndex(p => p.id === id)
  if (idx !== -1) {
    panels.value.splice(idx, 1)
  }
  if (selectedPanel.value === id) selectedPanel.value = null
}

// ─── Split panel (mitosis!) ──────────────────────────────────────
async function splitPanel(panel, direction) {
  if (direction === 'horizontal' && panel.colSpan < 2) return
  if (direction === 'vertical' && panel.rowSpan < 2) return

  // Phase 1 — Interphase → Metaphase: cell swells, cytoplasm glows,
  // membrane starts to constrict via clip-path pinch
  splitDirection.value = direction
  splittingPanel.value = panel.id

  await nextTick()
  // Wait for the mitosis animation
  await new Promise(r => setTimeout(r, 250))

  // Phase 2 — Cytokinesis: cleave and spawn daughter cell
  const idx = panels.value.length
  let newPanel
  if (direction === 'horizontal') {
    const newSpan = Math.floor(panel.colSpan / 2)
    const remainder = panel.colSpan - newSpan
    panel.colSpan = newSpan
    newPanel = makePanel(
      panel.col + newSpan,
      panel.row,
      remainder,
      panel.rowSpan,
      panel.group,
      idx
    )
  } else {
    const newSpan = Math.floor(panel.rowSpan / 2)
    const remainder = panel.rowSpan - newSpan
    panel.rowSpan = newSpan
    newPanel = makePanel(
      panel.col,
      panel.row + newSpan,
      panel.colSpan,
      remainder,
      panel.group,
      idx
    )
  }

  panels.value.push(newPanel)
  spawnedPanel.value = newPanel.id
  spawnDirection.value = direction
  splittingPanel.value = null
  splitDirection.value = null

  // Let the budding animation play, then clear
  await nextTick()
  await new Promise(r => setTimeout(r, 250))
  spawnedPanel.value = null
  spawnDirection.value = null
}

function onAnimEnd(e, panelId) {
  if ((e.animationName === 'bud-h' || e.animationName === 'bud-v') && spawnedPanel.value === panelId) {
    spawnedPanel.value = null
    spawnDirection.value = null
  }
}

// ─── Cycle group color ───────────────────────────────────────────
function cycleGroup(panel) {
  const currentIdx = groups.findIndex(g => g.id === panel.group)
  const nextIdx = (currentIdx + 1) % groups.length
  panel.group = groups[nextIdx].id
}

// ─── Drag helpers ────────────────────────────────────────────────
const dragGhostStyle = computed(() => {
  if (!dragging.value) return {}
  return {
    left: dragPos.x - (dragging.value.offsetX || 0) + 'px',
    top: dragPos.y - (dragging.value.offsetY || 0) + 'px',
    width: dragging.value.width + 'px',
    height: dragging.value.height + 'px',
    '--group-accent': groupAccent(dragging.value.panel.group),
  }
})

function panelAtCell(col, row) {
  return panels.value.find(p =>
    col >= p.col && col < p.col + p.colSpan &&
    row >= p.row && row < p.row + p.rowSpan
  ) || null
}

// Check if a rectangle is free of other panels (excluding a given panel)
function isAreaFree(col, row, colSpan, rowSpan, excludeId) {
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      const p = panelAtCell(c, r)
      if (p && p.id !== excludeId) return false
    }
  }
  return true
}

// Find the largest size that fits at (col, row), shrinking from (maxW x maxH) down to 1x1
function findFittingSize(col, row, maxW, maxH, excludeId) {
  // Try shrinking width first, then height, preferring largest area
  let best = null
  for (let w = maxW; w >= 1; w--) {
    for (let h = maxH; h >= 1; h--) {
      if (col + w - 1 > gridCols.value || row + h - 1 > gridRows.value) continue
      if (isAreaFree(col, row, w, h, excludeId)) {
        if (!best || w * h > best.colSpan * best.rowSpan) {
          best = { colSpan: w, rowSpan: h }
        }
      }
    }
  }
  return best
}

const dropZoneStyle = computed(() => {
  if (!dropZone.value || !gridRef.value) return {}
  const rect = gridRef.value.getBoundingClientRect()
  const cellW = rect.width / gridCols.value
  const cellH = rect.height / gridRows.value
  return {
    position: 'absolute',
    left: (dropZone.value.col - 1) * cellW + 'px',
    top: (dropZone.value.row - 1) * cellH + 'px',
    width: dropZone.value.colSpan * cellW + 'px',
    height: dropZone.value.rowSpan * cellH + 'px',
  }
})

function gridCellFromMouse(e) {
  if (!gridRef.value) return null
  const rect = gridRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cellW = rect.width / gridCols.value
  const cellH = rect.height / gridRows.value
  const col = Math.floor(x / cellW) + 1
  const row = Math.floor(y / cellH) + 1
  if (col < 1 || col > gridCols.value || row < 1 || row > gridRows.value) return null
  return { col, row }
}

let dragDelayTimer = null

function startDrag(e, panel) {
  if (e.button !== 0) return
  // Don't start drag from action buttons
  if (e.target.closest('.cell-actions')) return
  selectedPanel.value = panel.id

  // Delay drag setup so double-click can cancel it
  const cellEl = e.target.closest('.bento-cell')
  const cellRect = cellEl.getBoundingClientRect()
  const snapshot = {
    panel,
    startX: e.clientX,
    startY: e.clientY,
    offsetX: e.clientX - cellRect.left,
    offsetY: e.clientY - cellRect.top,
    width: cellRect.width,
    height: cellRect.height,
    started: false,
  }

  clearTimeout(dragDelayTimer)
  dragDelayTimer = setTimeout(() => {
    dragging.value = snapshot
    dragPos.x = snapshot.startX
    dragPos.y = snapshot.startY
  }, 200)
}

// ─── Resize logic ────────────────────────────────────────────────
const resizing = ref(null) // { panel, direction, startX, startY, startCol, startRow, startColSpan, startRowSpan }

function startResize(e, panel, direction) {
  resizing.value = {
    panel,
    direction,
    startX: e.clientX,
    startY: e.clientY,
    startCol: panel.col,
    startRow: panel.row,
    startColSpan: panel.colSpan,
    startRowSpan: panel.rowSpan,
  }
  const cursors = {
    right: 'col-resize', left: 'col-resize',
    bottom: 'row-resize', top: 'row-resize',
    'bottom-right': 'nwse-resize', 'top-left': 'nwse-resize',
    'top-right': 'nesw-resize', 'bottom-left': 'nesw-resize',
  }
  document.body.style.cursor = cursors[direction] || 'nwse-resize'
  document.body.style.userSelect = 'none'
}

function onMouseMove(e) {
  // ── Drag handling ──
  if (dragging.value) {
    const dx = e.clientX - dragging.value.startX
    const dy = e.clientY - dragging.value.startY
    if (!dragging.value.started && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return
    dragging.value.started = true
    dragPos.x = e.clientX
    dragPos.y = e.clientY
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'

    const cell = gridCellFromMouse(e)
    if (cell) {
      const dp = dragging.value.panel
      // Clamp so the panel stays within the grid
      const col = Math.max(1, Math.min(cell.col, gridCols.value - dp.colSpan + 1))
      const row = Math.max(1, Math.min(cell.row, gridRows.value - dp.rowSpan + 1))

      if (isAreaFree(col, row, dp.colSpan, dp.rowSpan, dp.id)) {
        // Free space available at full size → show placement zone
        dropTarget.value = null
        dropZone.value = { col, row, colSpan: dp.colSpan, rowSpan: dp.rowSpan }
      } else {
        // Try to fit a smaller version at the cursor position
        const fit = findFittingSize(col, row, dp.colSpan, dp.rowSpan, dp.id)
        if (fit) {
          dropTarget.value = null
          dropZone.value = { col, row, colSpan: fit.colSpan, rowSpan: fit.rowSpan }
        } else {
          // No free space at all → offer swap with the panel under the cursor
          const target = panelAtCell(cell.col, cell.row)
          if (target && target.id !== dp.id) {
            dropTarget.value = target
            dropZone.value = { col: target.col, row: target.row, colSpan: target.colSpan, rowSpan: target.rowSpan }
          } else {
            dropTarget.value = null
            dropZone.value = null
          }
        }
      }
    } else {
      dropTarget.value = null
      dropZone.value = null
    }
    return
  }

  // ── Resize handling ──
  if (!resizing.value || !gridRef.value) return

  const { panel, direction, startX, startY, startCol, startRow, startColSpan, startRowSpan } = resizing.value
  const gridRect = gridRef.value.getBoundingClientRect()
  const cellW = gridRect.width / gridCols.value
  const cellH = gridRect.height / gridRows.value

  const resizeRight = direction === 'right' || direction === 'bottom-right' || direction === 'top-right'
  const resizeLeft = direction === 'left' || direction === 'bottom-left' || direction === 'top-left'
  const resizeBottom = direction === 'bottom' || direction === 'bottom-right' || direction === 'bottom-left'
  const resizeTop = direction === 'top' || direction === 'top-left' || direction === 'top-right'

  if (resizeRight) {
    const dx = e.clientX - startX
    const colDelta = Math.round(dx / cellW)
    panel.colSpan = Math.max(1, Math.min(gridCols.value - startCol + 1, startColSpan + colDelta))
  }
  if (resizeLeft) {
    const dx = e.clientX - startX
    const colDelta = Math.round(dx / cellW)
    const newCol = Math.max(1, startCol + colDelta)
    const newSpan = startColSpan - (newCol - startCol)
    if (newSpan >= 1) {
      panel.col = newCol
      panel.colSpan = newSpan
    }
  }
  if (resizeBottom) {
    const dy = e.clientY - startY
    const rowDelta = Math.round(dy / cellH)
    panel.rowSpan = Math.max(1, Math.min(gridRows.value - startRow + 1, startRowSpan + rowDelta))
  }
  if (resizeTop) {
    const dy = e.clientY - startY
    const rowDelta = Math.round(dy / cellH)
    const newRow = Math.max(1, startRow + rowDelta)
    const newSpan = startRowSpan - (newRow - startRow)
    if (newSpan >= 1) {
      panel.row = newRow
      panel.rowSpan = newSpan
    }
  }
}

function onMouseUp() {
  // Cancel pending drag delay (prevents drag starting after a quick click-release)
  clearTimeout(dragDelayTimer)
  // ── Drop handling ──
  if (dragging.value) {
    if (dragging.value.started) {
      const src = dragging.value.panel
      if (dropTarget.value) {
        // Swap grid positions between dragged panel and drop target
        const dst = dropTarget.value
        const srcPos = { col: src.col, row: src.row, colSpan: src.colSpan, rowSpan: src.rowSpan }
        src.col = dst.col
        src.row = dst.row
        src.colSpan = dst.colSpan
        src.rowSpan = dst.rowSpan
        dst.col = srcPos.col
        dst.row = srcPos.row
        dst.colSpan = srcPos.colSpan
        dst.rowSpan = srcPos.rowSpan
      } else if (dropZone.value) {
        // Move to empty space (may also resize to fit)
        src.col = dropZone.value.col
        src.row = dropZone.value.row
        src.colSpan = dropZone.value.colSpan
        src.rowSpan = dropZone.value.rowSpan
      }
    }
    dragging.value = null
    dropTarget.value = null
    dropZone.value = null
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    return
  }

  // ── Resize handling ──
  if (resizing.value) {
    resizing.value = null
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
}

// ─── Reset ───────────────────────────────────────────────────────
function resetLayout() {
  nextId = 1
  nextWorkspaceId = 1
  const demoData = createDemoWorkspaces()
  // Reset session labels on active repo
  const labels = activeRepo.value.sessionLabels
  for (const key of Object.keys(labels)) {
    delete labels[key]
  }
  Object.assign(labels, demoData.sessionLabels)
  workspaces.value = demoData.workspaces
  activeWorkspaceId.value = workspaces.value[0].id
  selectedPanel.value = null
  selectedGroup.value = null
}

// ─── Chat spawn recipes ──────────────────────────────────────────
// Group is no longer per-panel — all panels from a chat message share one color
const spawnRecipes = [
  // ── Frontend recipes ──────────────────────────────────────────
  {
    match: /component|react|vue|widget|ui/i,
    reply: 'Spawning component workspace…',
    panels: [
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'Component.tsx', contentIcon: 'code', contentLabel: 'React Component',
        lines: [
          { text: 'import React from \'react\';', kind: 'keyword' },
          { text: '' },
          { text: 'interface Props {', kind: 'fn' },
          { text: '  title: string;', kind: 'default' },
          { text: '  children: React.ReactNode;', kind: 'default' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: 'export function Component({ title, children }: Props) {', kind: 'fn' },
          { text: '  return (', kind: 'default' },
          { text: '    <div className="wrapper">', kind: 'tag' },
          { text: '      <h2>{title}</h2>', kind: 'tag' },
          { text: '      {children}', kind: 'tag' },
          { text: '    </div>', kind: 'tag' },
          { text: '  );', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'Component.test.tsx', contentIcon: 'beaker', contentLabel: 'Unit Tests',
        lines: [
          { text: 'import { render, screen } from \'@testing-library/react\';', kind: 'keyword' },
          { text: 'import { Component } from \'./Component\';', kind: 'keyword' },
          { text: '' },
          { text: 'describe(\'Component\', () => {', kind: 'fn' },
          { text: '  it(\'renders title\', () => {', kind: 'string' },
          { text: '    render(<Component title="Hello">body</Component>);', kind: 'default' },
          { text: '    expect(screen.getByText(\'Hello\')).toBeTruthy();', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '' },
          { text: '  it(\'renders children\', () => {', kind: 'string' },
          { text: '    render(<Component title="T"><span>child</span></Component>);', kind: 'default' },
          { text: '    expect(screen.getByText(\'child\')).toBeTruthy();', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '});', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'book', title: 'Component.stories.ts', contentIcon: 'book', contentLabel: 'Storybook',
        lines: [
          { text: 'import type { Meta, StoryObj } from \'@storybook/react\';', kind: 'keyword' },
          { text: 'import { Component } from \'./Component\';', kind: 'keyword' },
          { text: '' },
          { text: 'const meta: Meta<typeof Component> = {', kind: 'fn' },
          { text: '  title: \'UI/Component\',', kind: 'string' },
          { text: '  component: Component,', kind: 'default' },
          { text: '};', kind: 'fn' },
          { text: 'export default meta;', kind: 'keyword' },
          { text: '' },
          { text: 'export const Default: StoryObj = {', kind: 'fn' },
          { text: '  args: { title: \'Hello World\' },', kind: 'string' },
          { text: '};', kind: 'fn' },
        ],
      },
      { colSpan: 8, rowSpan: 2, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'npm run storybook', contentType: 'terminal',
        lines: [
          { text: '$ npm run storybook', kind: 'cmd' },
          { text: '' },
          { text: 'storybook dev -p 6006', kind: 'dim' },
          { text: '╭─────────────────────────────────────╮', kind: 'dim' },
          { text: '│                                     │', kind: 'dim' },
          { text: '│   Storybook 8.4 started             │', kind: 'success' },
          { text: '│   http://localhost:6006/             │', kind: 'info' },
          { text: '│                                     │', kind: 'dim' },
          { text: '╰─────────────────────────────────────╯', kind: 'dim' },
        ],
      },
    ],
  },
  {
    match: /style|css|tailwind|theme|design/i,
    reply: 'Setting up styling workspace…',
    panels: [
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'tokens.css', contentIcon: 'symbol-color', contentLabel: 'Design Tokens',
        lines: [
          { text: ':root {', kind: 'fn' },
          { text: '  /* Colors */', kind: 'comment' },
          { text: '  --color-primary: #3b82f6;', kind: 'default' },
          { text: '  --color-secondary: #10b981;', kind: 'default' },
          { text: '  --color-surface: #1e1e2e;', kind: 'default' },
          { text: '' },
          { text: '  /* Spacing */', kind: 'comment' },
          { text: '  --space-xs: 4px;', kind: 'default' },
          { text: '  --space-sm: 8px;', kind: 'default' },
          { text: '  --space-md: 16px;', kind: 'default' },
          { text: '  --space-lg: 24px;', kind: 'default' },
          { text: '' },
          { text: '  /* Typography */', kind: 'comment' },
          { text: '  --font-sans: \'Inter\', system-ui, sans-serif;', kind: 'string' },
          { text: '  --font-mono: \'Fira Code\', monospace;', kind: 'string' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'layout.module.css', contentIcon: 'symbol-color', contentLabel: 'Layout Styles',
        lines: [
          { text: '.container {', kind: 'fn' },
          { text: '  max-width: 1200px;', kind: 'default' },
          { text: '  margin: 0 auto;', kind: 'default' },
          { text: '  padding: var(--space-lg);', kind: 'default' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: '.sidebar {', kind: 'fn' },
          { text: '  width: 260px;', kind: 'default' },
          { text: '  border-right: 1px solid var(--color-border);', kind: 'default' },
          { text: '  padding: var(--space-md);', kind: 'default' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: '.main {', kind: 'fn' },
          { text: '  flex: 1;', kind: 'default' },
          { text: '  min-width: 0;', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'globe', title: 'Preview', contentIcon: 'globe', contentLabel: 'Hot Reload Preview' },
      { colSpan: 8, rowSpan: 2, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'npm run dev', contentType: 'terminal',
        lines: [
          { text: '$ npm run dev', kind: 'cmd' },
          { text: '' },
          { text: '  VITE v5.4.2  ready in 248 ms', kind: 'success' },
          { text: '  ➜  Local:   http://localhost:3000/', kind: 'info' },
          { text: '  ➜  press h + enter to show help', kind: 'dim' },
        ],
      },
    ],
  },
  {
    match: /page|route|navigation|layout/i,
    reply: 'Scaffolding page routing workspace…',
    panels: [
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'router.tsx', contentIcon: 'git-merge', contentLabel: 'Route Config',
        lines: [
          { text: 'import { createBrowserRouter } from \'react-router-dom\';', kind: 'keyword' },
          { text: 'import { Layout } from \'./Layout\';', kind: 'keyword' },
          { text: '' },
          { text: 'export const router = createBrowserRouter([', kind: 'fn' },
          { text: '  { path: \'/\', element: <Layout />, children: [', kind: 'string' },
          { text: '    { index: true, element: <Home /> },', kind: 'string' },
          { text: '    { path: \'dashboard\', element: <Dashboard /> },', kind: 'string' },
          { text: '    { path: \'settings\', element: <Settings /> },', kind: 'string' },
          { text: '  ]},', kind: 'default' },
          { text: ']);', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'Layout.tsx', contentIcon: 'code', contentLabel: 'App Layout',
        lines: [
          { text: 'import { Outlet } from \'react-router-dom\';', kind: 'keyword' },
          { text: 'import { Sidebar } from \'./Sidebar\';', kind: 'keyword' },
          { text: '' },
          { text: 'export function Layout() {', kind: 'fn' },
          { text: '  return (', kind: 'default' },
          { text: '    <div className="app-shell">', kind: 'tag' },
          { text: '      <Sidebar />', kind: 'tag' },
          { text: '      <main><Outlet /></main>', kind: 'tag' },
          { text: '    </div>', kind: 'tag' },
          { text: '  );', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'Sidebar.tsx', contentIcon: 'code', contentLabel: 'Navigation',
        lines: [
          { text: 'import { NavLink } from \'react-router-dom\';', kind: 'keyword' },
          { text: '' },
          { text: 'const links = [', kind: 'fn' },
          { text: '  { to: \'/\', label: \'Home\', icon: \'home\' },', kind: 'string' },
          { text: '  { to: \'/dashboard\', label: \'Dashboard\', icon: \'chart\' },', kind: 'string' },
          { text: '  { to: \'/settings\', label: \'Settings\', icon: \'gear\' },', kind: 'string' },
          { text: '];', kind: 'fn' },
          { text: '' },
          { text: 'export function Sidebar() {', kind: 'fn' },
          { text: '  return (', kind: 'default' },
          { text: '    <nav className="sidebar">', kind: 'tag' },
          { text: '      {links.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}', kind: 'tag' },
          { text: '    </nav>', kind: 'tag' },
          { text: '  );', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 3, icon: 'globe', title: 'Preview', contentIcon: 'globe', contentLabel: 'localhost:3000' },
      { colSpan: 4, rowSpan: 3, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'npm run dev', contentType: 'terminal',
        lines: [
          { text: '$ npm run dev', kind: 'cmd' },
          { text: '' },
          { text: '  VITE v5.4.2  ready in 312 ms', kind: 'success' },
          { text: '  ➜  Local:   http://localhost:3000/', kind: 'info' },
        ],
      },
    ],
  },
  // ── Backend recipes ───────────────────────────────────────────
  {
    match: /api|endpoint|rest|graphql/i,
    reply: 'Spawning API endpoint workspace…',
    panels: [
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'handler.ts', contentIcon: 'code', contentLabel: 'Route Handler',
        lines: [
          { text: 'import { Request, Response } from \'express\';', kind: 'keyword' },
          { text: 'import { validate } from \'./validator\';', kind: 'keyword' },
          { text: 'import { prisma } from \'./db\';', kind: 'keyword' },
          { text: '' },
          { text: 'export async function getItems(req: Request, res: Response) {', kind: 'fn' },
          { text: '  const { page = 1, limit = 20 } = req.query;', kind: 'default' },
          { text: '  const items = await prisma.item.findMany({', kind: 'default' },
          { text: '    skip: (page - 1) * limit,', kind: 'default' },
          { text: '    take: limit,', kind: 'default' },
          { text: '    orderBy: { createdAt: \'desc\' },', kind: 'string' },
          { text: '  });', kind: 'default' },
          { text: '  res.json({ items, page, limit });', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'shield', title: 'validator.ts', contentIcon: 'shield', contentLabel: 'Input Validation',
        lines: [
          { text: 'import { z } from \'zod\';', kind: 'keyword' },
          { text: '' },
          { text: 'export const createItemSchema = z.object({', kind: 'fn' },
          { text: '  name: z.string().min(1).max(100),', kind: 'default' },
          { text: '  description: z.string().optional(),', kind: 'default' },
          { text: '  price: z.number().positive(),', kind: 'default' },
          { text: '  category: z.enum([\'A\', \'B\', \'C\']),', kind: 'string' },
          { text: '});', kind: 'fn' },
          { text: '' },
          { text: 'export function validate(schema: z.ZodSchema) {', kind: 'fn' },
          { text: '  return (req, res, next) => {', kind: 'default' },
          { text: '    const result = schema.safeParse(req.body);', kind: 'default' },
          { text: '    if (!result.success) return res.status(400).json(result.error);', kind: 'default' },
          { text: '    req.body = result.data;', kind: 'default' },
          { text: '    next();', kind: 'default' },
          { text: '  };', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'beaker', title: 'handler.test.ts', contentIcon: 'beaker', contentLabel: 'API Tests',
        lines: [
          { text: 'import request from \'supertest\';', kind: 'keyword' },
          { text: 'import { app } from \'./server\';', kind: 'keyword' },
          { text: '' },
          { text: 'describe(\'GET /api/items\', () => {', kind: 'fn' },
          { text: '  it(\'returns paginated items\', async () => {', kind: 'string' },
          { text: '    const res = await request(app).get(\'/api/items\');', kind: 'default' },
          { text: '    expect(res.status).toBe(200);', kind: 'default' },
          { text: '    expect(res.body.items).toBeInstanceOf(Array);', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '' },
          { text: '  it(\'validates pagination params\', async () => {', kind: 'string' },
          { text: '    const res = await request(app).get(\'/api/items?page=-1\');', kind: 'default' },
          { text: '    expect(res.status).toBe(400);', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '});', kind: 'fn' },
        ],
      },
      { colSpan: 8, rowSpan: 2, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'npm run test:watch', contentType: 'terminal',
        lines: [
          { text: '$ npm run test:watch', kind: 'cmd' },
          { text: '' },
          { text: ' PASS  src/handler.test.ts', kind: 'success' },
          { text: '  GET /api/items', kind: 'default' },
          { text: '    ✓ returns paginated items (12 ms)', kind: 'success' },
          { text: '    ✓ validates pagination params (8 ms)', kind: 'success' },
          { text: '' },
          { text: 'Tests:  2 passed, 2 total', kind: 'success' },
          { text: 'Time:   0.842 s', kind: 'dim' },
        ],
      },
    ],
  },
  {
    match: /database|schema|migration|prisma|sql/i,
    reply: 'Setting up database workspace…',
    panels: [
      { colSpan: 4, rowSpan: 4, icon: 'database', title: 'migration.sql', contentIcon: 'database', contentLabel: 'Migration Script',
        lines: [
          { text: '-- CreateTable', kind: 'comment' },
          { text: 'CREATE TABLE "User" (', kind: 'fn' },
          { text: '  "id"        SERIAL PRIMARY KEY,', kind: 'default' },
          { text: '  "email"     VARCHAR(255) UNIQUE NOT NULL,', kind: 'default' },
          { text: '  "password"  VARCHAR(255) NOT NULL,', kind: 'default' },
          { text: '  "role"      "Role" DEFAULT \'USER\',', kind: 'string' },
          { text: '  "createdAt" TIMESTAMP DEFAULT NOW()', kind: 'keyword' },
          { text: ');', kind: 'fn' },
          { text: '' },
          { text: '-- CreateIndex', kind: 'comment' },
          { text: 'CREATE UNIQUE INDEX "User_email_key" ON "User"("email");', kind: 'default' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'seed.ts', contentIcon: 'code', contentLabel: 'Seed Data',
        lines: [
          { text: 'import { prisma } from \'./db\';', kind: 'keyword' },
          { text: '' },
          { text: 'async function seed() {', kind: 'fn' },
          { text: '  await prisma.user.createMany({', kind: 'default' },
          { text: '    data: [', kind: 'default' },
          { text: '      { email: \'admin@test.com\', role: \'ADMIN\' },', kind: 'string' },
          { text: '      { email: \'user@test.com\',  role: \'USER\' },', kind: 'string' },
          { text: '    ],', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '  console.log(\'Seeded 2 users\');', kind: 'string' },
          { text: '}', kind: 'fn' },
          { text: '' },
          { text: 'seed().catch(console.error);', kind: 'default' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'prisma migrate dev', contentType: 'terminal',
        lines: [
          { text: '$ npx prisma migrate dev', kind: 'cmd' },
          { text: '' },
          { text: 'Environment variables loaded from .env', kind: 'dim' },
          { text: 'Prisma schema loaded from prisma/schema.prisma', kind: 'dim' },
          { text: '' },
          { text: '✓ Generated Prisma Client', kind: 'success' },
          { text: '✓ Applied migration: 20260227_init', kind: 'success' },
          { text: '' },
          { text: 'Database is now in sync with the schema.', kind: 'success' },
        ],
      },
    ],
  },
  {
    match: /auth|login|jwt|session|token/i,
    reply: 'Spawning authentication workspace…',
    panels: [
      { colSpan: 4, rowSpan: 4, icon: 'lock', title: 'auth.service.ts', contentIcon: 'lock', contentLabel: 'Auth Service',
        lines: [
          { text: 'import jwt from \'jsonwebtoken\';', kind: 'keyword' },
          { text: 'import bcrypt from \'bcryptjs\';', kind: 'keyword' },
          { text: '' },
          { text: 'const SECRET = process.env.JWT_SECRET!;', kind: 'default' },
          { text: '' },
          { text: 'export async function login(email: string, password: string) {', kind: 'fn' },
          { text: '  const user = await prisma.user.findUnique({ where: { email } });', kind: 'default' },
          { text: '  if (!user) throw new Error(\'User not found\');', kind: 'default' },
          { text: '' },
          { text: '  const valid = await bcrypt.compare(password, user.password);', kind: 'default' },
          { text: '  if (!valid) throw new Error(\'Invalid password\');', kind: 'default' },
          { text: '' },
          { text: '  return jwt.sign({ sub: user.id, role: user.role }, SECRET, {', kind: 'default' },
          { text: '    expiresIn: \'7d\',', kind: 'string' },
          { text: '  });', kind: 'default' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'file-code', title: 'auth.controller.ts', contentIcon: 'code', contentLabel: 'Auth Controller',
        lines: [
          { text: 'import { Router } from \'express\';', kind: 'keyword' },
          { text: 'import { login } from \'./auth.service\';', kind: 'keyword' },
          { text: '' },
          { text: 'export const authRouter = Router();', kind: 'fn' },
          { text: '' },
          { text: 'authRouter.post(\'/login\', async (req, res) => {', kind: 'string' },
          { text: '  try {', kind: 'keyword' },
          { text: '    const token = await login(req.body.email, req.body.password);', kind: 'default' },
          { text: '    res.json({ token });', kind: 'default' },
          { text: '  } catch (err) {', kind: 'keyword' },
          { text: '    res.status(401).json({ error: err.message });', kind: 'default' },
          { text: '  }', kind: 'keyword' },
          { text: '});', kind: 'fn' },
        ],
      },
      { colSpan: 4, rowSpan: 4, icon: 'beaker', title: 'auth.test.ts', contentIcon: 'beaker', contentLabel: 'Auth Tests',
        lines: [
          { text: 'import { login } from \'./auth.service\';', kind: 'keyword' },
          { text: '' },
          { text: 'describe(\'auth\', () => {', kind: 'fn' },
          { text: '  it(\'returns JWT on valid login\', async () => {', kind: 'string' },
          { text: '    const token = await login(\'admin@test.com\', \'password\');', kind: 'default' },
          { text: '    expect(token).toBeDefined();', kind: 'default' },
          { text: '    expect(typeof token).toBe(\'string\');', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '' },
          { text: '  it(\'rejects invalid password\', async () => {', kind: 'string' },
          { text: '    await expect(login(\'admin@test.com\', \'wrong\'))', kind: 'default' },
          { text: '      .rejects.toThrow(\'Invalid password\');', kind: 'string' },
          { text: '  });', kind: 'default' },
          { text: '});', kind: 'fn' },
        ],
      },
      { colSpan: 8, rowSpan: 2, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'npm run test', contentType: 'terminal',
        lines: [
          { text: '$ npm run test', kind: 'cmd' },
          { text: '' },
          { text: ' PASS  src/auth.test.ts', kind: 'success' },
          { text: '  auth', kind: 'default' },
          { text: '    ✓ returns JWT on valid login (15 ms)', kind: 'success' },
          { text: '    ✓ rejects invalid password (6 ms)', kind: 'success' },
          { text: '' },
          { text: 'Tests:  2 passed, 2 total', kind: 'success' },
        ],
      },
    ],
  },
  // ── General recipes ───────────────────────────────────────────
  {
    match: /debug|breakpoint|watch/i,
    reply: 'Spawning debug workspace…',
    panels: [
      { colSpan: 6, rowSpan: 3, icon: 'file-code', title: 'app.ts', contentIcon: 'code', contentLabel: 'Source File',
        lines: [
          { text: 'import { processQueue } from \'./queue\';', kind: 'keyword' },
          { text: '' },
          { text: 'async function main() {', kind: 'fn' },
          { text: '  const items = await fetchItems();  // ← breakpoint', kind: 'default' },
          { text: '  for (const item of items) {', kind: 'keyword' },
          { text: '    await processQueue(item);', kind: 'default' },
          { text: '  }', kind: 'keyword' },
          { text: '}', kind: 'fn' },
        ],
      },
      { colSpan: 6, rowSpan: 3, icon: 'debug-alt', title: 'Debug Console', contentIcon: 'bug', contentLabel: 'Breakpoints', contentType: 'terminal',
        lines: [
          { text: 'Debugger attached.', kind: 'success' },
          { text: '> items', kind: 'cmd' },
          { text: '  [{ id: 1, name: \'Task A\' }, { id: 2, name: \'Task B\' }]', kind: 'default' },
          { text: '> items.length', kind: 'cmd' },
          { text: '  2', kind: 'info' },
          { text: '> typeof processQueue', kind: 'cmd' },
          { text: '  \'function\'', kind: 'string' },
        ],
      },
      { colSpan: 4, rowSpan: 2, icon: 'output', title: 'Output', contentIcon: 'list-flat', contentLabel: 'Build Output', contentType: 'terminal',
        lines: [
          { text: '[info] TypeScript compilation complete', kind: 'info' },
          { text: '[info] Watching for changes…', kind: 'dim' },
        ],
      },
      { colSpan: 4, rowSpan: 2, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'node --inspect', contentType: 'terminal',
        lines: [
          { text: '$ node --inspect dist/app.js', kind: 'cmd' },
          { text: 'Debugger listening on ws://127.0.0.1:9229', kind: 'info' },
        ],
      },
      { colSpan: 4, rowSpan: 2, icon: 'search', title: 'Call Stack', contentIcon: 'search', contentLabel: 'Stack Frames', contentType: 'terminal',
        lines: [
          { text: '▶ main               app.ts:4', kind: 'info' },
          { text: '  processQueue       queue.ts:12', kind: 'default' },
          { text: '  Module._compile    node:internal', kind: 'dim' },
        ],
      },
    ],
  },
  {
    match: /test|spec|assert/i,
    reply: 'Building test workspace…',
    panels: [
      { colSpan: 6, rowSpan: 3, icon: 'file-code', title: 'app.test.ts', contentIcon: 'code', contentLabel: 'Test Suite',
        lines: [
          { text: 'import { describe, it, expect } from \'vitest\';', kind: 'keyword' },
          { text: 'import { sum, multiply } from \'./math\';', kind: 'keyword' },
          { text: '' },
          { text: 'describe(\'math\', () => {', kind: 'fn' },
          { text: '  it(\'adds numbers\', () => {', kind: 'string' },
          { text: '    expect(sum(1, 2)).toBe(3);', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '' },
          { text: '  it(\'multiplies numbers\', () => {', kind: 'string' },
          { text: '    expect(multiply(3, 4)).toBe(12);', kind: 'default' },
          { text: '  });', kind: 'default' },
          { text: '});', kind: 'fn' },
        ],
      },
      { colSpan: 6, rowSpan: 3, icon: 'beaker', title: 'Test Explorer', contentIcon: 'beaker', contentLabel: 'All Tests Passed', contentType: 'terminal',
        lines: [
          { text: '✓ math > adds numbers (2 ms)', kind: 'success' },
          { text: '✓ math > multiplies numbers (1 ms)', kind: 'success' },
          { text: '✓ utils > formats date (3 ms)', kind: 'success' },
          { text: '✓ utils > parses input (2 ms)', kind: 'success' },
          { text: '' },
          { text: 'All 4 tests passed', kind: 'success' },
        ],
      },
      { colSpan: 6, rowSpan: 3, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'npm run test', contentType: 'terminal',
        lines: [
          { text: '$ npx vitest', kind: 'cmd' },
          { text: '' },
          { text: ' ✓ src/math.test.ts (2)', kind: 'success' },
          { text: ' ✓ src/utils.test.ts (2)', kind: 'success' },
          { text: '' },
          { text: ' Tests  4 passed (4)', kind: 'success' },
          { text: ' Time   0.31s', kind: 'dim' },
        ],
      },
      { colSpan: 6, rowSpan: 3, icon: 'output', title: 'Coverage', contentIcon: 'graph', contentLabel: '94% Coverage', contentType: 'terminal',
        lines: [
          { text: '----------|---------|----------', kind: 'dim' },
          { text: 'File      | % Stmts | Uncovered', kind: 'info' },
          { text: '----------|---------|----------', kind: 'dim' },
          { text: 'math.ts   |   100.0 |          ', kind: 'success' },
          { text: 'utils.ts  |    88.2 | 24-28    ', kind: 'default' },
          { text: '----------|---------|----------', kind: 'dim' },
          { text: 'All files |    94.1 |          ', kind: 'success' },
          { text: '----------|---------|----------', kind: 'dim' },
        ],
      },
    ],
  },
  {
    match: /terminal|shell|command/i,
    reply: 'Opening terminal workspace…',
    panels: [
      { colSpan: 6, rowSpan: 4, icon: 'terminal', title: 'Terminal 1', contentIcon: 'terminal-bash', contentLabel: 'zsh — node', contentType: 'terminal',
        lines: [
          { text: '$ node -v', kind: 'cmd' },
          { text: 'v20.11.0', kind: 'default' },
          { text: '$ npm -v', kind: 'cmd' },
          { text: '10.2.4', kind: 'default' },
          { text: '$ git status', kind: 'cmd' },
          { text: 'On branch main', kind: 'info' },
          { text: 'nothing to commit, working tree clean', kind: 'success' },
          { text: '$ █', kind: 'cmd' },
        ],
      },
      { colSpan: 6, rowSpan: 4, icon: 'terminal', title: 'Terminal 2', contentIcon: 'terminal-bash', contentLabel: 'zsh — npm', contentType: 'terminal',
        lines: [
          { text: '$ npm run build', kind: 'cmd' },
          { text: '' },
          { text: '> project@1.0.0 build', kind: 'dim' },
          { text: '> tsc && vite build', kind: 'dim' },
          { text: '' },
          { text: '✓ 127 modules transformed.', kind: 'success' },
          { text: 'dist/index.html    0.42 kB │ gzip:  0.29 kB', kind: 'default' },
          { text: 'dist/index.js    142.87 kB │ gzip: 45.92 kB', kind: 'default' },
          { text: '✓ built in 1.23s', kind: 'success' },
        ],
      },
      { colSpan: 8, rowSpan: 2, icon: 'output', title: 'Output', contentIcon: 'list-flat', contentLabel: 'Build Output', contentType: 'terminal',
        lines: [
          { text: '[info] Build started…', kind: 'info' },
          { text: '[info] TypeScript compilation successful', kind: 'success' },
          { text: '[info] Assets bundled', kind: 'success' },
          { text: '[info] Build complete in 1.23s', kind: 'success' },
        ],
      },
    ],
  },
]

const defaultRecipe = {
  reply: 'Building custom layout…',
  panels: [
    { colSpan: 4, rowSpan: 3, icon: 'file-code', title: 'index.ts', contentIcon: 'code', contentLabel: 'Source File',
      lines: [
        { text: 'export function main() {', kind: 'fn' },
        { text: '  console.log(\'Hello, world!\');', kind: 'string' },
        { text: '}', kind: 'fn' },
        { text: '' },
        { text: 'main();', kind: 'default' },
      ],
    },
    { colSpan: 4, rowSpan: 3, icon: 'terminal', title: 'Terminal', contentIcon: 'terminal-bash', contentLabel: 'zsh — node', contentType: 'terminal',
      lines: [
        { text: '$ npx tsx index.ts', kind: 'cmd' },
        { text: 'Hello, world!', kind: 'success' },
        { text: '$ █', kind: 'cmd' },
      ],
    },
    { colSpan: 4, rowSpan: 3, icon: 'output', title: 'Output', contentIcon: 'list-flat', contentLabel: 'Build Output', contentType: 'terminal',
      lines: [
        { text: '[info] Compilation successful', kind: 'success' },
        { text: '[info] No errors found', kind: 'success' },
      ],
    },
    { colSpan: 6, rowSpan: 3, icon: 'beaker', title: 'Testing', contentIcon: 'beaker', contentLabel: 'Test Results', contentType: 'terminal',
      lines: [
        { text: '✓ main() works (1 ms)', kind: 'success' },
        { text: '' },
        { text: 'Tests:  1 passed, 1 total', kind: 'success' },
      ],
    },
    { colSpan: 6, rowSpan: 3, icon: 'search', title: 'Search', contentIcon: 'search', contentLabel: 'Workspace Search', contentType: 'terminal',
      lines: [
        { text: '4 results in 2 files', kind: 'info' },
        { text: '' },
        { text: 'index.ts:1  export function main() {', kind: 'default' },
        { text: 'index.ts:5  main();', kind: 'default' },
        { text: 'test.ts:3   import { main } from \'./index\';', kind: 'default' },
        { text: 'test.ts:5   main();', kind: 'default' },
      ],
    },
  ],
}

const spawningPanels = ref(new Set())

async function onChatSubmit(e, chatPanel) {
  const input = e.target
  const text = input.value.trim()
  if (!text) return
  input.value = ''
  await runChatSpawn(chatPanel, text)
}

function onChatSendClick(chatPanel) {
  const gridEl = gridRef.value
  if (!gridEl) return
  // Find the correct chat's input by matching panel order
  const chatCells = gridEl.querySelectorAll('.chat-content')
  const chatPanelsList = panels.value.filter(p => p.isChat)
  const chatIdx = chatPanelsList.findIndex(p => p.id === chatPanel.id)
  if (chatIdx >= 0 && chatCells[chatIdx]) {
    const inp = chatCells[chatIdx].querySelector('.chat-input')
    if (inp) {
      const text = inp.value.trim()
      if (!text) return
      inp.value = ''
      runChatSpawn(chatPanel, text)
    }
  }
}

async function runChatSpawn(chatPanel, text) {
  chatPanel.messages.push({ role: 'user', text })

  // Pick a recipe
  const recipe = spawnRecipes.find(r => r.match.test(text)) || defaultRecipe
  await new Promise(r => setTimeout(r, 300))
  chatPanel.messages.push({ role: 'assistant', text: recipe.reply })

  // Use the chat panel's own group color for all spawned panels
  const sessionGroup = chatPanel.group

  // Determine available columns by finding space not used by any chat panel
  const maxCols = gridCols.value
  // Find the leftmost chat column to know where free space ends
  let minChatCol = maxCols + 1
  for (const p of panels.value) {
    if (p.isChat) {
      minChatCol = Math.min(minChatCol, p.col)
    }
  }
  const wrapCol = minChatCol - 1
  if (wrapCol < 1) {
    // No room — abort
    chatPanel.messages.push({ role: 'assistant', text: 'No space available for panels.' })
    return
  }
  const startCol = 1

  // Build an occupancy grid from existing non-chat panels
  const occupied = new Set()
  for (const p of panels.value) {
    if (p.isChat) continue
    for (let r = p.row; r < p.row + p.rowSpan; r++) {
      for (let c = p.col; c < p.col + p.colSpan; c++) {
        if (c <= wrapCol) occupied.add(`${r},${c}`)
      }
    }
  }

  // Helper: check if a panel of size (w x h) fits at (r, c) without overlap
  function fits(r, c, w, h) {
    if (c + w - 1 > wrapCol) return false
    for (let rr = r; rr < r + h; rr++) {
      for (let cc = c; cc < c + w; cc++) {
        if (occupied.has(`${rr},${cc}`)) return false
      }
    }
    return true
  }

  // Helper: find next free position scanning row by row, left to right
  function findFreeSlot(w, h) {
    for (let r = 1; r < 200; r++) {
      for (let c = startCol; c <= wrapCol - w + 1; c++) {
        if (fits(r, c, w, h)) return { row: r, col: c }
      }
    }
    return null
  }

  // Helper: mark cells as occupied
  function markOccupied(r, c, w, h) {
    for (let rr = r; rr < r + h; rr++) {
      for (let cc = c; cc < c + w; cc++) {
        occupied.add(`${rr},${cc}`)
      }
    }
  }

  const newPanels = []
  for (const spec of recipe.panels) {
    // Clamp span to available width
    const span = Math.min(spec.colSpan, wrapCol - startCol + 1)
    const rowSpan = spec.rowSpan

    const slot = findFreeSlot(span, rowSpan)
    if (!slot) continue // no space at all, skip this panel

    // Expand grid if needed
    if (slot.row + rowSpan - 1 > gridRows.value) {
      gridRows.value = slot.row + rowSpan - 1
    }

    const p = makeCustomPanel(slot.col, slot.row, span, rowSpan, sessionGroup, spec)
    newPanels.push(p)
    markOccupied(slot.row, slot.col, span, rowSpan)
  }

  // Stagger spawn each panel with budding animation
  for (const p of newPanels) {
    panels.value.push(p)
    spawningPanels.value.add(p.id)
    await nextTick()
    await new Promise(r => setTimeout(r, 150))
  }

  // Clear spawn animation state after last one finishes
  await new Promise(r => setTimeout(r, 300))
  spawningPanels.value.clear()
}
</script>

<style scoped>
.bento-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* ─── Title bar ──────────────────────────────────────────────── */
.titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 12px;
  background: transparent;
  flex-shrink: 0;
  gap: 12px;
}
.titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
}

/* ─── Repo selector button ──────────────────────────────────── */
.repo-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--vscode-foreground) 15%, transparent);
  border-radius: 6px;
  padding: 3px 8px 3px 6px;
  color: var(--vscode-foreground);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: background 0.15s, border-color 0.15s;
}
.repo-selector:hover {
  background: color-mix(in srgb, var(--vscode-foreground) 8%, transparent);
  border-color: color-mix(in srgb, var(--vscode-foreground) 30%, transparent);
}
.repo-selector .codicon {
  font-size: 14px;
  opacity: 0.7;
}
.repo-name {
  white-space: nowrap;
}
.repo-chevron {
  font-size: 10px !important;
  opacity: 0.5 !important;
  transition: transform 0.2s;
}
.repo-chevron.open {
  transform: rotate(180deg);
}

/* ─── Repo drawer ───────────────────────────────────────────── */
.repo-drawer {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 200px;
  background: var(--vscode-editor-background);
  border: 1px solid color-mix(in srgb, var(--vscode-foreground) 15%, transparent);
  border-radius: 8px;
  padding: 4px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  animation: drawer-in 0.15s ease-out;
}
@keyframes drawer-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.repo-drawer-header {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--vscode-foreground) 50%, transparent);
  padding: 4px 8px 6px;
}
.repo-drawer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  background: transparent;
  border: none;
  border-radius: 5px;
  color: var(--vscode-foreground);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.1s;
}
.repo-drawer-item:hover {
  background: color-mix(in srgb, var(--vscode-foreground) 10%, transparent);
}
.repo-drawer-item.active {
  background: color-mix(in srgb, var(--vscode-foreground) 7%, transparent);
}
.repo-drawer-item .codicon {
  font-size: 14px;
  opacity: 0.7;
}
.repo-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--bento-accent-blue, #60a5fa);
  margin-left: auto;
}
.repo-drawer-divider {
  height: 1px;
  background: color-mix(in srgb, var(--vscode-foreground) 10%, transparent);
  margin: 4px 8px;
}
.titlebar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}
.titlebar-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.plus-menu-anchor {
  position: relative;
}
.plus-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--vscode-menu-background, #252526);
  border: 1px solid var(--vscode-menu-border, #454545);
  border-radius: 6px;
  padding: 4px 0;
  z-index: 200;
  min-width: 210px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
.plus-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 12px;
  background: none;
  border: none;
  color: var(--vscode-menu-foreground, #ccc);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.plus-menu-item:hover {
  background: var(--vscode-menu-selectionBackground, #04395e);
  color: var(--vscode-menu-selectionForeground, #fff);
}

/* ─── Group legend ───────────────────────────────────────────── */
.group-legend {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.legend-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 10px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: var(--chip-bg);
  color: var(--chip-color);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.legend-chip:hover {
  border-color: var(--chip-color);
}
.legend-chip.active {
  border-color: var(--chip-color);
  box-shadow: 0 0 6px color-mix(in srgb, var(--chip-color) 40%, transparent);
}
.legend-chip.is-other-workspace {
  opacity: 0.55;
  border-style: dashed;
}
.legend-chip.is-other-workspace:hover {
  opacity: 0.85;
}
.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.chip-count {
  background: rgba(255,255,255,0.1);
  padding: 0 5px;
  border-radius: 8px;
  font-size: 10px;
  min-width: 16px;
  text-align: center;
}
.chip-attention-icon {
  color: var(--vscode-editorWarning-foreground, #cca700);
  font-size: 14px;
  animation: attention-pulse-icon 2s ease-in-out infinite;
}
@keyframes attention-pulse-icon {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}

/* ─── Icon buttons ───────────────────────────────────────────── */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vscode-foreground);
  cursor: pointer;
  transition: background 0.1s;
}
.icon-btn:hover {
  background: var(--vscode-list-hoverBackground);
}
.icon-btn-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: var(--vscode-descriptionForeground);
  cursor: pointer;
  transition: all 0.1s;
  font-size: 14px;
}
.icon-btn-sm:hover {
  background: rgba(255,255,255,0.08);
  color: var(--vscode-foreground);
}
.icon-btn-sm:disabled {
  opacity: 0.3;
  cursor: default;
}
.icon-btn-sm:disabled:hover {
  background: transparent;
}

/* ─── Bento grid ─────────────────────────────────────────────── */
.bento-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(v-bind(gridCols), 1fr);
  grid-template-rows: repeat(v-bind(gridRows), 1fr);
  gap: 6px;
  padding: 6px;
  overflow: auto;
  position: relative;
}

/* ─── Bento cell ─────────────────────────────────────────────── */
.bento-cell {
  position: relative;
  background: var(--vscode-editor-background);
  border: 1px solid color-mix(in srgb, var(--vscode-foreground) 10%, transparent);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    opacity 0.25s ease,
    box-shadow 0.2s ease;
  will-change: transform, border-radius, opacity;
  min-width: 0;
  min-height: 0;
}
.bento-cell:hover {
  border-color: color-mix(in srgb, var(--group-accent) 30%, transparent);
}
.bento-cell.is-selected {
  border-color: color-mix(in srgb, var(--vscode-foreground) 25%, transparent);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  z-index: 1;
}
/* Unfocused state: dim label when another cell is focused */
.bento-cell.is-unfocused .cell-tab {
  opacity: 0.4;
}
.bento-cell.is-unfocused:hover {
  border-color: color-mix(in srgb, var(--group-accent) 30%, transparent);
}
.bento-cell.is-unfocused:hover .cell-tab {
  opacity: 0.7;
}
.bento-cell.is-group-dimmed {
  opacity: 0.3;
  filter: grayscale(0.5);
}
.bento-cell.is-group-highlighted {
  border-color: var(--group-accent);
}

/* ─── Attention state: pulsing border + warning badge ────────── */
@keyframes attention-pulse {
  0%, 100% { border-color: color-mix(in srgb, var(--vscode-editorWarning-foreground, #cca700) 70%, transparent); }
  50%      { border-color: color-mix(in srgb, var(--vscode-editorWarning-foreground, #cca700) 25%, transparent); }
}
.bento-cell.is-attention {
  animation: attention-pulse 2s ease-in-out infinite;
}
.cell-attention-icon {
  color: inherit;
  font-size: 13px;
  margin-left: 4px;
  animation: attention-pulse-icon 2s ease-in-out infinite;
}

/* ═══════════════════════════════════════════════════════════════
   MITOSIS ANIMATIONS — biological cell-splitting
   ═══════════════════════════════════════════════════════════════ */

/* ─── Cytoplasm glow (subtle shimmer during division) ────────── */
.cytoplasm {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
}
.cytoplasm::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--group-accent) 6%, transparent) 0%,
    transparent 70%
  );
  animation: cytoplasm-pulse 0.25s ease-in-out;
}
.cytoplasm-h::after {
  content: '';
  position: absolute;
  top: 15%;
  bottom: 15%;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: var(--group-accent);
  border-radius: 1px;
  opacity: 0.4;
  box-shadow: 0 0 3px var(--group-accent);
  animation: membrane-pinch-h 0.25s ease-in-out forwards;
}
.cytoplasm-v::after {
  content: '';
  position: absolute;
  left: 15%;
  right: 15%;
  top: 50%;
  height: 1px;
  transform: translateY(-50%);
  background: var(--group-accent);
  border-radius: 1px;
  opacity: 0.4;
  box-shadow: 0 0 3px var(--group-accent);
  animation: membrane-pinch-v 0.25s ease-in-out forwards;
}

@keyframes cytoplasm-pulse {
  0%   { opacity: 0; }
  50%  { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes membrane-pinch-h {
  0%   { top: 50%; bottom: 50%; opacity: 0; }
  40%  { top: 30%; bottom: 30%; opacity: 0.2; }
  70%  { top: 10%; bottom: 10%; opacity: 0.35; }
  100% { top: 0;   bottom: 0;   opacity: 0.4; }
}
@keyframes membrane-pinch-v {
  0%   { left: 50%; right: 50%; opacity: 0; }
  40%  { left: 30%; right: 30%; opacity: 0.2; }
  70%  { left: 10%; right: 10%; opacity: 0.35; }
  100% { left: 0;   right: 0;   opacity: 0.4; }
}

/* ─── Mitosis on source panel (horizontal split) ─────────────── */
.bento-cell.is-mitosis-h {
  animation: mitosis-h 0.25s ease-in-out forwards;
  z-index: 3;
}
@keyframes mitosis-h {
  0%   { border-radius: 8px;  transform: scale(1); }
  20%  { border-radius: 9px;  transform: scale(1.008); }
  40%  { border-radius: 9px 10px 10px 9px; transform: scaleX(1.012) scaleY(0.992); }
  60%  { border-radius: 9px 9px 9px 9px;   transform: scaleX(1.008) scaleY(0.995); }
  80%  { border-radius: 8px 8px 8px 8px;   transform: scale(1.002); }
  100% { border-radius: 8px;  transform: scale(1); }
}

/* ─── Mitosis on source panel (vertical split) ───────────────── */
.bento-cell.is-mitosis-v {
  animation: mitosis-v 0.25s ease-in-out forwards;
  z-index: 3;
}
@keyframes mitosis-v {
  0%   { border-radius: 8px;  transform: scale(1); }
  20%  { border-radius: 9px;  transform: scale(1.008); }
  40%  { border-radius: 10px 10px 9px 9px; transform: scaleY(1.012) scaleX(0.992); }
  60%  { border-radius: 9px 9px 9px 9px;   transform: scaleY(1.008) scaleX(0.995); }
  80%  { border-radius: 8px 8px 8px 8px;   transform: scale(1.002); }
  100% { border-radius: 8px;  transform: scale(1); }
}

/* ─── Daughter cell budding (horizontal — emerges from left) ── */
.bento-cell.is-budding-h {
  animation: bud-h 0.25s ease-out forwards;
  transform-origin: left center;
  z-index: 2;
}
@keyframes bud-h {
  0%   { opacity: 0;   transform: scaleX(0.4) scaleY(0.92); border-radius: 30%; }
  25%  { opacity: 0.6; transform: scaleX(0.7) scaleY(0.97); border-radius: 16px 12px 12px 16px; }
  50%  { opacity: 0.9; transform: scaleX(0.9) scaleY(1.0);  border-radius: 10px; }
  75%  { opacity: 1;   transform: scaleX(1.01) scaleY(1.0); border-radius: 9px; }
  100% { opacity: 1;   transform: scale(1);                 border-radius: 8px; }
}

/* ─── Daughter cell budding (vertical — emerges from top) ───── */
.bento-cell.is-budding-v {
  animation: bud-v 0.25s ease-out forwards;
  transform-origin: center top;
  z-index: 2;
}
@keyframes bud-v {
  0%   { opacity: 0;   transform: scaleY(0.4) scaleX(0.92); border-radius: 30%; }
  25%  { opacity: 0.6; transform: scaleY(0.7) scaleX(0.97); border-radius: 12px 12px 16px 16px; }
  50%  { opacity: 0.9; transform: scaleY(0.9) scaleX(1.0);  border-radius: 10px; }
  75%  { opacity: 1;   transform: scaleY(1.01) scaleX(1.0); border-radius: 9px; }
  100% { opacity: 1;   transform: scale(1);                 border-radius: 8px; }
}

/* ─── Cell tab label ─────────────────────────────────────────── */
.cell-tab {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 3px 8px;
  background: var(--group-accent);
  color: var(--vscode-editor-background);
  border-radius: 8px 0 8px 0;
  font-size: 11px;
  font-weight: 600;
  z-index: 3;
  max-width: 70%;
  overflow: hidden;
  transition: opacity 0.15s ease;
  user-select: none;
}
.cell-tab .codicon {
  font-size: 12px;
  flex-shrink: 0;
}
.cell-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Cell actions (top-right, on hover) ─────────────────────── */
.cell-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 3;
  background: color-mix(in srgb, var(--vscode-editor-background) 85%, transparent);
  border-radius: 4px;
  padding: 1px 2px;
}
.bento-cell:hover .cell-actions {
  opacity: 1;
}
.close-btn:hover {
  color: var(--bento-accent-red) !important;
}

/* ─── Cell content ───────────────────────────────────────────── */
.cell-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  padding-top: 24px;
  min-height: 0;
  overflow: hidden;
}
.mock-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 8px;
  opacity: 0.35;
  text-align: center;
}
.content-icon {
  font-size: 28px;
}
.content-label {
  font-size: 11px;
  color: var(--vscode-descriptionForeground);
}

/* ─── Code lines ─────────────────────────────────────────────── */
.code-lines {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', 'Menlo', monospace;
  font-size: 11px;
  line-height: 18px;
  padding: 4px 0;
}
.code-line {
  display: flex;
  align-items: baseline;
  padding: 0 10px 0 0;
  white-space: pre;
  min-height: 18px;
}
.code-line:hover {
  background: rgba(255, 255, 255, 0.03);
}
.line-num {
  width: 32px;
  min-width: 32px;
  text-align: right;
  padding-right: 10px;
  color: var(--vscode-editorLineNumber-foreground, rgba(255,255,255,0.2));
  user-select: none;
  flex-shrink: 0;
}
.line-text {
  flex: 1;
  min-width: 0;
}
/* Syntax coloring */
.line-keyword .line-text { color: #c586c0; }
.line-fn .line-text { color: #dcdcaa; }
.line-string .line-text { color: #ce9178; }
.line-tag .line-text { color: #569cd6; }
.line-comment .line-text { color: #6a9955; font-style: italic; }
.line-default .line-text { color: #d4d4d4; }
.line-dim .line-text { color: rgba(255,255,255,0.3); }

/* Terminal content type */
.content-terminal .code-lines {
  padding: 4px 0;
}
.content-terminal .line-num {
  display: none;
}
.content-terminal .code-line {
  padding-left: 12px;
}
.content-terminal .line-cmd .line-text { color: #4ec9b0; font-weight: 600; }
.content-terminal .line-success .line-text { color: #4ec9b0; }
.content-terminal .line-info .line-text { color: #569cd6; }
.content-terminal .line-error .line-text { color: #f14c4c; }
.content-terminal .line-dim .line-text { color: rgba(255,255,255,0.35); }
.content-terminal .line-default .line-text { color: #d4d4d4; }

/* Preview content type */
.content-preview .code-lines {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.content-preview .line-num {
  display: none;
}
.content-preview .code-line {
  padding-left: 12px;
  justify-content: center;
}
.content-preview .line-default .line-text { color: #d4d4d4; }
.content-preview .line-info .line-text { color: #569cd6; }
.content-preview .line-success .line-text { color: #4ec9b0; }
.content-preview .line-dim .line-text { color: rgba(255,255,255,0.3); }

/* ─── Resize handles ─────────────────────────────────────────── */
.resize-handle {
  position: absolute;
  z-index: 2;
}
.resize-right {
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
}
.resize-left {
  top: 0;
  left: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
}
.resize-bottom {
  bottom: -4px;
  left: 0;
  height: 8px;
  width: 100%;
  cursor: row-resize;
}
.resize-top {
  top: -4px;
  left: 0;
  height: 8px;
  width: 100%;
  cursor: row-resize;
}
.resize-corner {
  width: 14px;
  height: 14px;
}
.resize-corner-br {
  bottom: -4px;
  right: -4px;
  cursor: nwse-resize;
}
.resize-corner-tl {
  top: -4px;
  left: -4px;
  cursor: nwse-resize;
}
.resize-corner-tr {
  top: -4px;
  right: -4px;
  cursor: nesw-resize;
}
.resize-corner-bl {
  bottom: -4px;
  left: -4px;
  cursor: nesw-resize;
}
.resize-handle:hover::after {
  content: '';
  position: absolute;
  background: var(--vscode-focusBorder);
  border-radius: 2px;
}
.resize-right:hover::after {
  top: 20%;
  right: 3px;
  width: 2px;
  height: 60%;
}
.resize-left:hover::after {
  top: 20%;
  left: 3px;
  width: 2px;
  height: 60%;
}
.resize-bottom:hover::after {
  left: 20%;
  bottom: 3px;
  height: 2px;
  width: 60%;
}
.resize-top:hover::after {
  left: 20%;
  top: 3px;
  height: 2px;
  width: 60%;
}
.resize-corner:hover::after {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.resize-corner-br:hover::after {
  bottom: 2px;
  right: 2px;
}
.resize-corner-tl:hover::after {
  top: 2px;
  left: 2px;
}
.resize-corner-tr:hover::after {
  top: 2px;
  right: 2px;
}
.resize-corner-bl:hover::after {
  bottom: 2px;
  left: 2px;
}

/* ─── Drag & drop ────────────────────────────────────────────── */
.cell-tab.is-grab {
  cursor: grab;
}
.bento-cell.is-dragging {
  opacity: 0.35;
  outline: 2px dashed var(--group-accent);
  outline-offset: -2px;
}
.bento-cell.is-drop-target {
  outline: 2px solid var(--vscode-focusBorder);
  outline-offset: -2px;
  box-shadow: 0 0 16px color-mix(in srgb, var(--vscode-focusBorder) 35%, transparent);
  z-index: 1;
}
.drop-zone-indicator {
  position: absolute;
  border: 2px dashed var(--vscode-focusBorder);
  border-radius: 8px;
  background: color-mix(in srgb, var(--vscode-focusBorder) 10%, transparent);
  pointer-events: none;
  z-index: 2;
  transition: left 0.12s ease, top 0.12s ease, width 0.12s ease, height 0.12s ease;
}
.bento-cell.is-spawn {
  animation: spawn-pop 0.3s ease-out forwards;
}
@keyframes spawn-pop {
  0%   { opacity: 0; transform: scale(0.5); border-radius: 20px; }
  60%  { opacity: 1; transform: scale(1.02); border-radius: 10px; }
  100% { opacity: 1; transform: scale(1);   border-radius: 8px; }
}

/* ═══════════════════════════════════════════════════════════════
   MODAL OVERLAY — focused cell view
   ═══════════════════════════════════════════════════════════════ */
.modal-overlay {
  position: absolute;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
.modal-cell {
  width: 80%;
  max-width: 900px;
  height: 75%;
  max-height: 700px;
  background: var(--vscode-editor-background);
  border: 1px solid color-mix(in srgb, var(--vscode-foreground) 20%, transparent);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 0;
  border-bottom: 1px solid color-mix(in srgb, var(--vscode-foreground) 10%, transparent);
}
.modal-header .cell-tab {
  position: static;
  opacity: 1;
  border-radius: 0;
  max-width: none;
}
.modal-cell .cell-content,
.modal-cell .chat-content {
  flex: 1;
  overflow: auto;
}

/* Modal transition */
.modal-enter-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-cell {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.modal-leave-active {
  transition: opacity 0.15s ease;
}
.modal-leave-active .modal-cell {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from .modal-cell {
  opacity: 0;
  transform: scale(0.92);
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-to .modal-cell {
  opacity: 0;
  transform: scale(0.95);
}

.drag-ghost {
  position: fixed;
  z-index: 100;
  pointer-events: none;
  background: var(--vscode-editor-background);
  border: 1px solid var(--group-accent);
  border-radius: 8px;
  opacity: 0.85;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.drag-ghost .cell-tab {
  position: static;
  border-radius: 8px 0 8px 0;
  padding: 3px 10px 3px 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--group-accent);
  color: var(--vscode-editor-background);
  font-size: 11px;
  font-weight: 600;
}

/* ─── Chat cell ───────────────────────────────────────────────── */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 28px 8px 8px;
  min-height: 0;
  overflow: hidden;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 8px;
}
.chat-msg {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  line-height: 1.4;
  padding: 6px 8px;
  border-radius: 6px;
  max-width: 90%;
}
.chat-msg .codicon {
  flex-shrink: 0;
  font-size: 14px;
  margin-top: 1px;
}
.chat-msg.user {
  align-self: flex-end;
  background: color-mix(in srgb, var(--vscode-button-background) 25%, transparent);
  color: var(--vscode-foreground);
}
.chat-msg.assistant {
  align-self: flex-start;
  background: color-mix(in srgb, var(--group-accent) 12%, transparent);
  color: var(--vscode-foreground);
}
.chat-msg.assistant .codicon {
  color: var(--group-accent);
}
.chat-input-row {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.chat-input {
  flex: 1;
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--vscode-input-border, rgba(255,255,255,0.1));
  border-radius: 6px;
  background: var(--vscode-input-background, rgba(255,255,255,0.06));
  color: var(--vscode-input-foreground, var(--vscode-foreground));
  font-size: 12px;
  outline: none;
  font-family: inherit;
}
.chat-input:focus {
  border-color: var(--vscode-focusBorder);
}
.chat-input::placeholder {
  color: var(--vscode-input-placeholderForeground, rgba(255,255,255,0.35));
}
.chat-send {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: color-mix(in srgb, var(--vscode-foreground) 12%, transparent);
  color: var(--vscode-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.1s;
}
.chat-send:hover {
  background: color-mix(in srgb, var(--vscode-foreground) 20%, transparent);
}
</style>
