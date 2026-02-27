<template>
  <div class="bento-app">
    <header class="titlebar">
      <div class="titlebar-left">
        <i class="codicon codicon-layout"></i>
        <span class="title">Bento Box Layout</span>
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
            {{ g.label }}
            <span class="chip-count">{{ allPanelsInGroup(g.id) }}</span>
          </button>
        </div>
      </div>
      <div class="titlebar-right">
        <div class="plus-menu-anchor">
          <button class="icon-btn" title="New Chat" @click.stop="showPlusMenu = !showPlusMenu">
            <i class="codicon codicon-add"></i>
          </button>
          <div v-if="showPlusMenu" class="plus-menu" @click.stop>
            <button class="plus-menu-item" @click="addChat(); showPlusMenu = false">
              <i class="codicon codicon-comment-discussion"></i>
              <span>New Chat Here</span>
            </button>
            <button class="plus-menu-item" @click="openChatInNewWorkspace(); showPlusMenu = false">
              <i class="codicon codicon-empty-window"></i>
              <span>New Chat in New Workspace</span>
            </button>
          </div>
        </div>
        <button class="icon-btn" title="Reset Layout" @click="resetLayout()">
          <i class="codicon codicon-refresh"></i>
        </button>
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
          'is-dragging': dragging && dragging.panel.id === panel.id,
          'is-drop-target': dropTarget && dropTarget.id === panel.id && dragging && dragging.panel.id !== panel.id,
          'is-mitosis-h': splittingPanel === panel.id && splitDirection === 'horizontal',
          'is-mitosis-v': splittingPanel === panel.id && splitDirection === 'vertical',
          'is-budding-h': spawnedPanel === panel.id && spawnDirection === 'horizontal',
          'is-budding-v': spawnedPanel === panel.id && spawnDirection === 'vertical',
          'is-spawn': spawningPanels.has(panel.id),
          'is-group-dimmed': selectedGroup && panel.group !== selectedGroup,
          'is-group-highlighted': selectedGroup && panel.group === selectedGroup,
        }"
        :style="cellStyle(panel)"
        @click.self="selectedPanel = panel.id"
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
          class="resize-handle resize-right"
          @mousedown.stop.prevent="startResize($event, panel, 'right')"
        ></div>
        <div
          class="resize-handle resize-bottom"
          @mousedown.stop.prevent="startResize($event, panel, 'bottom')"
        ></div>
        <div
          class="resize-handle resize-corner"
          @mousedown.stop.prevent="startResize($event, panel, 'corner')"
        ></div>

        <!-- Tab label (top-left corner) -->
        <div
          class="cell-tab"
          :class="{ 'is-grab': !dragging }"
          @mousedown="startDrag($event, panel)"
        >
          <i :class="'codicon codicon-' + panel.icon"></i>
          <span class="cell-title">{{ panel.title }}</span>
        </div>

        <!-- Action buttons (top-right, on hover) -->
        <div class="cell-actions">
          <button
            class="icon-btn-sm"
            :style="{ color: groupAccent(panel.group) }"
            title="Change Group"
            @click.stop="cycleGroup(panel)"
          >
            <i class="codicon codicon-symbol-color"></i>
          </button>
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
        <div class="cell-content" v-if="!panel.isChat">
          <div class="mock-content">
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

    <footer class="statusbar">
      <span>{{ panels.length }} panels</span>
      <span class="separator">·</span>
      <span>{{ workspaces.length }} workspace{{ workspaces.length > 1 ? 's' : '' }}</span>
      <span class="separator">·</span>
      <span>{{ gridCols }}×{{ gridRows }} grid</span>
      <span class="separator">·</span>
      <span>Click panel header icons to split or change group</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'

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

// ─── Grid configuration ──────────────────────────────────────────
const gridCols = ref(12)
const GAP = 6

let nextId = 1
let nextWorkspaceId = 1

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

const workspaces = ref([createWorkspace('purple')])
const activeWorkspaceId = ref(workspaces.value[0].id)
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
const selectedPanel = ref(null)
const selectedGroup = ref(null)
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

// Find workspace that owns a session group
function workspaceForGroup(groupId) {
  return workspaces.value.find(ws => ws.group === groupId)
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
function onDocClick() { showPlusMenu.value = false }
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
  const sessionGroup = groups[ws.chatColorIndex % groups.length].id
  ws.chatColorIndex++
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

function startDrag(e, panel) {
  if (e.button !== 0) return
  // Don't start drag from action buttons
  if (e.target.closest('.cell-actions')) return
  selectedPanel.value = panel.id

  const cellEl = e.target.closest('.bento-cell')
  const cellRect = cellEl.getBoundingClientRect()

  dragging.value = {
    panel,
    startX: e.clientX,
    startY: e.clientY,
    offsetX: e.clientX - cellRect.left,
    offsetY: e.clientY - cellRect.top,
    width: cellRect.width,
    height: cellRect.height,
    started: false,
  }
  dragPos.x = e.clientX
  dragPos.y = e.clientY
}

// ─── Resize logic ────────────────────────────────────────────────
const resizing = ref(null) // { panel, direction, startX, startY, startColSpan, startRowSpan }

function startResize(e, panel, direction) {
  resizing.value = {
    panel,
    direction,
    startX: e.clientX,
    startY: e.clientY,
    startColSpan: panel.colSpan,
    startRowSpan: panel.rowSpan,
  }
  document.body.style.cursor =
    direction === 'right' ? 'col-resize' :
    direction === 'bottom' ? 'row-resize' : 'nwse-resize'
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

  const { panel, direction, startX, startY, startColSpan, startRowSpan } = resizing.value
  const gridRect = gridRef.value.getBoundingClientRect()
  const cellW = gridRect.width / gridCols.value
  const cellH = gridRect.height / gridRows.value

  if (direction === 'right' || direction === 'corner') {
    const dx = e.clientX - startX
    const colDelta = Math.round(dx / cellW)
    panel.colSpan = Math.max(1, Math.min(gridCols.value - panel.col + 1, startColSpan + colDelta))
  }
  if (direction === 'bottom' || direction === 'corner') {
    const dy = e.clientY - startY
    const rowDelta = Math.round(dy / cellH)
    panel.rowSpan = Math.max(1, Math.min(gridRows.value - panel.row + 1, startRowSpan + rowDelta))
  }
}

function onMouseUp() {
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
  const ws = createWorkspace('purple')
  workspaces.value = [ws]
  activeWorkspaceId.value = ws.id
  selectedPanel.value = null
  selectedGroup.value = null
}

// ─── Chat spawn recipes ──────────────────────────────────────────
// Group is no longer per-panel — all panels from a chat message share one color
const spawnRecipes = [
  {
    match: /debug|breakpoint|watch/i,
    reply: 'Spawning debug workspace…',
    panels: [
      { colSpan: 6, rowSpan: 3, idx: 0 },
      { colSpan: 6, rowSpan: 3, idx: 2 },
      { colSpan: 4, rowSpan: 2, idx: 3 },
      { colSpan: 4, rowSpan: 2, idx: 1 },
      { colSpan: 4, rowSpan: 2, idx: 5 },
    ],
  },
  {
    match: /terminal|shell|command/i,
    reply: 'Opening terminal workspace…',
    panels: [
      { colSpan: 6, rowSpan: 4, idx: 1 },
      { colSpan: 6, rowSpan: 4, idx: 1 },
      { colSpan: 12, rowSpan: 2, idx: 3 },
    ],
  },
  {
    match: /editor|code|file/i,
    reply: 'Setting up editor layout…',
    panels: [
      { colSpan: 4, rowSpan: 4, idx: 0 },
      { colSpan: 4, rowSpan: 4, idx: 9 },
      { colSpan: 4, rowSpan: 4, idx: 0 },
      { colSpan: 12, rowSpan: 2, idx: 4 },
    ],
  },
  {
    match: /test|spec|assert/i,
    reply: 'Building test workspace…',
    panels: [
      { colSpan: 6, rowSpan: 3, idx: 0 },
      { colSpan: 6, rowSpan: 3, idx: 7 },
      { colSpan: 6, rowSpan: 3, idx: 1 },
      { colSpan: 6, rowSpan: 3, idx: 3 },
    ],
  },
  {
    match: /search|find|grep/i,
    reply: 'Launching search workspace…',
    panels: [
      { colSpan: 8, rowSpan: 5, idx: 0 },
      { colSpan: 4, rowSpan: 5, idx: 5 },
      { colSpan: 12, rowSpan: 2, idx: 3 },
    ],
  },
]

const defaultRecipe = {
  reply: 'Building custom layout…',
  panels: [
    { colSpan: 6, rowSpan: 3, idx: 0 },
    { colSpan: 6, rowSpan: 3, idx: 1 },
    { colSpan: 4, rowSpan: 3, idx: 2 },
    { colSpan: 4, rowSpan: 3, idx: 3 },
    { colSpan: 4, rowSpan: 3, idx: 4 },
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

    const p = makePanel(slot.col, slot.row, span, rowSpan, sessionGroup, spec.idx)
    newPanels.push(p)
    markOccupied(slot.row, slot.col, span, rowSpan)
  }

  // Keep chat panels spanning the full grid height
  for (const p of panels.value) {
    if (p.isChat) {
      p.rowSpan = gridRows.value - p.row + 1
    }
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
  background: var(--vscode-titleBar-background);
  border-bottom: 1px solid var(--vscode-panel-border);
  flex-shrink: 0;
  gap: 12px;
}
.titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.titlebar-left .title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
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
  border: 1px solid var(--group-accent);
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
  border-color: var(--group-accent);
}
.bento-cell.is-selected {
  border-color: var(--group-accent);
  box-shadow:
    0 0 0 1px var(--group-accent),
    0 4px 16px rgba(0,0,0,0.3);
  z-index: 1;
}
.bento-cell.is-group-dimmed {
  opacity: 0.3;
  filter: grayscale(0.5);
}
.bento-cell.is-group-highlighted {
  box-shadow: 0 0 12px color-mix(in srgb, var(--group-accent) 30%, transparent);
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
  align-items: center;
  justify-content: center;
  padding: 8px;
  padding-top: 28px;
  min-height: 0;
}
.mock-content {
  display: flex;
  flex-direction: column;
  align-items: center;
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
.resize-bottom {
  bottom: -4px;
  left: 0;
  height: 8px;
  width: 100%;
  cursor: row-resize;
}
.resize-corner {
  bottom: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
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
.resize-bottom:hover::after {
  left: 20%;
  bottom: 3px;
  height: 2px;
  width: 60%;
}
.resize-corner:hover::after {
  bottom: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border-radius: 2px;
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

/* ─── Status bar ─────────────────────────────────────────────── */
.statusbar {
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 12px;
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  font-size: 11px;
  gap: 6px;
  flex-shrink: 0;
}
.separator {
  opacity: 0.5;
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
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.1s;
}
.chat-send:hover {
  background: var(--vscode-button-hoverBackground);
}
</style>
