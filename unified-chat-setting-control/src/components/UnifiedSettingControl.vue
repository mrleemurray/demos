<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  // Interaction model for selecting an option:
  //  - 'original':    selecting closes the whole control
  //  - 'persistent':  selecting keeps the control open
  //  - 'progressive': selecting advances to the next category, until the end
  variant: {
    type: String,
    default: 'original',
  },
})

const emit = defineEmits(['update:modelValue'])

const cfg = computed(() => props.modelValue)

// --- Option data ----------------------------------------------------------
const modeOptions = [
  { value: 'agent', label: 'Agent', icon: 'agent', shortcut: '⇧⌘I' },
  { value: 'ask', label: 'Ask', icon: 'question' },
  { value: 'plan', label: 'Plan', icon: 'checklist' },
  { value: 'edit', label: 'Edit', icon: 'edit' },
]

const modelOptions = [
  { value: 'opus', label: 'Claude Opus 4.8' },
  { value: 'sonnet', label: 'Claude Sonnet 4.6' },
  { value: 'gemini', label: 'Gemini 2.5 Pro' },
  { value: 'gpt', label: 'GPT-5.5' },
]

const effortOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High', default: true },
  { value: 'xhigh', label: 'Extra High' },
  { value: 'max', label: 'Max' },
]

const contextOptions = [
  { value: '200k', label: '200K', default: true },
  { value: '1m', label: '1M' },
]

// --- Top-level item display ----------------------------------------------
const modeLabel = computed(() => modeOptions.find(o => o.value === cfg.value.mode)?.label ?? '—')
const modelLabel = computed(() => {
  if (cfg.value.model === 'auto') {
    return 'Auto'
  }
  return modelOptions.find(o => o.value === cfg.value.model)?.label ?? '—'
})
const effortLabel = computed(() => effortOptions.find(o => o.value === cfg.value.effort)?.label ?? '—')
const contextLabel = computed(() => contextOptions.find(o => o.value === cfg.value.context)?.label ?? '')
const effortDisplay = computed(() => `${effortLabel.value} ${contextLabel.value}`.trim())

// --- Model search ---------------------------------------------------------
const modelSearch = ref('')
const modelInput = ref(null)
const filteredModels = computed(() => {
  const q = modelSearch.value.trim().toLowerCase()
  return modelOptions.filter(o => !q || o.label.toLowerCase().includes(q))
})
const showAuto = computed(() => {
  const q = modelSearch.value.trim().toLowerCase()
  return !q || 'auto'.includes(q)
})

// --- Menubar interaction state -------------------------------------------
// Category order used by the 'progressive' variant to advance through menus.
const menuOrder = ['mode', 'model', 'effort']
const fieldMenu = { mode: 'mode', model: 'model', effort: 'effort', context: 'effort' }

const activeMenu = ref(null)
// Once one menu is opened, hovering siblings switches to them (file-menu feel).
const engaged = ref(false)
const root = ref(null)

function openMenu(id) {
  activeMenu.value = id
  engaged.value = true
  if (id === 'model') {
    modelSearch.value = ''
    nextTick(() => modelInput.value?.focus())
  }
}

function clickTopItem(id) {
  if (activeMenu.value === id) {
    closeMenu()
  } else {
    openMenu(id)
  }
}

function hoverTopItem(id) {
  if (engaged.value && activeMenu.value !== id) {
    openMenu(id)
  }
}

function closeMenu() {
  activeMenu.value = null
  engaged.value = false
}

// --- Mutations ------------------------------------------------------------
// Selecting applies the value, then resolves what happens to the open menu
// based on the active variant. Holding ⌘ always keeps the menu open.
function setField(field, value, event) {
  emit('update:modelValue', { ...cfg.value, [field]: value })

  if (event && event.metaKey) {
    return
  }

  if (props.variant === 'persistent') {
    return
  }

  if (props.variant === 'progressive') {
    const next = menuOrder[menuOrder.indexOf(fieldMenu[field]) + 1]
    if (next) {
      openMenu(next)
    } else {
      closeMenu()
    }
    return
  }

  // 'original'
  closeMenu()
}

// --- Outside click / escape ----------------------------------------------
function onDocClick(e) {
  if (activeMenu.value && root.value && !root.value.contains(e.target)) {
    closeMenu()
  }
}
function onKeyDown(e) {
  if (e.key === 'Escape' && activeMenu.value) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKeyDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div ref="root" class="setting-control" :class="{ engaged }" role="menubar">
    <!-- Mode -->
    <div class="menu" @mouseenter="hoverTopItem('mode')">
      <button
        class="menu-top"
        :class="{ active: activeMenu === 'mode' }"
        role="menuitem"
        @click.stop="clickTopItem('mode')"
      >
        <i class="codicon menu-top-icon codicon-agent"></i>
        <span class="menu-top-value">{{ modeLabel }}</span>
      </button>

      <transition name="submenu">
        <div v-if="activeMenu === 'mode'" class="submenu mode-menu" role="menu" @click.stop>
          <button
            v-for="opt in modeOptions"
            :key="opt.value"
            class="row"
            :class="{ selected: cfg.mode === opt.value }"
            role="menuitemradio"
            @click="setField('mode', opt.value, $event)"
          >
            <i class="codicon row-icon" :class="`codicon-${opt.icon}`"></i>
            <span class="row-label">{{ opt.label }}</span>
            <span v-if="opt.shortcut" class="row-kbd">{{ opt.shortcut }}</span>
          </button>
        </div>
      </transition>
    </div>

    <!-- Model -->
    <div class="menu-sep" aria-hidden="true"></div>

    <div class="menu" @mouseenter="hoverTopItem('model')">
      <button
        class="menu-top"
        :class="{ active: activeMenu === 'model' }"
        role="menuitem"
        @click.stop="clickTopItem('model')"
      >
        <span class="menu-top-value">{{ modelLabel }}</span>
      </button>

      <transition name="submenu">
        <div v-if="activeMenu === 'model'" class="submenu model-menu" role="menu" @click.stop>
          <div class="search-box">
            <input
              ref="modelInput"
              v-model="modelSearch"
              class="search-input"
              type="text"
              placeholder="Search models"
              @keydown.stop
            />
          </div>

          <button
            v-if="showAuto"
            class="row"
            :class="{ selected: cfg.model === 'auto' }"
            role="menuitemradio"
            @click="setField('model', 'auto', $event)"
          >
            <span class="row-check">
              <i v-if="cfg.model === 'auto'" class="codicon codicon-check"></i>
            </span>
            <span class="row-label">Auto</span>
            <span class="row-badge">10% discount</span>
          </button>

          <div class="row-sep" aria-hidden="true"></div>

          <button
            v-for="opt in filteredModels"
            :key="opt.value"
            class="row"
            :class="{ selected: cfg.model === opt.value }"
            role="menuitemradio"
            @click="setField('model', opt.value, $event)"
          >
            <span class="row-check">
              <i v-if="cfg.model === opt.value" class="codicon codicon-check"></i>
            </span>
            <span class="row-label">{{ opt.label }}</span>
            <i v-if="cfg.model === opt.value" class="codicon row-pin codicon-pin"></i>
          </button>

          <div class="row-sep" aria-hidden="true"></div>

          <button class="row" @click.stop>
            <span class="row-check"><i class="codicon codicon-chevron-right"></i></span>
            <span class="row-label">Other Models</span>
            <i class="codicon row-gear codicon-gear"></i>
          </button>
        </div>
      </transition>
    </div>

    <!-- Effort + Context -->
    <div class="menu" @mouseenter="hoverTopItem('effort')">
      <button
        class="menu-top"
        :class="{ active: activeMenu === 'effort' }"
        role="menuitem"
        @click.stop="clickTopItem('effort')"
      >
        <span class="menu-top-value">{{ effortDisplay }}</span>
      </button>

      <transition name="submenu">
        <div v-if="activeMenu === 'effort'" class="submenu effort-menu" role="menu" @click.stop>
          <div class="info-banner">
            <i class="codicon codicon-info"></i>
            <span>Non-default options may increase cost</span>
          </div>

          <div class="submenu-header">Thinking Effort</div>
          <button
            v-for="opt in effortOptions"
            :key="opt.value"
            class="row"
            :class="{ selected: cfg.effort === opt.value }"
            role="menuitemradio"
            @click="setField('effort', opt.value, $event)"
          >
            <span class="row-check">
              <i v-if="cfg.effort === opt.value" class="codicon codicon-check"></i>
            </span>
            <span class="row-label">{{ opt.label }}</span>
            <span v-if="opt.default" class="row-default">Default</span>
          </button>

          <div class="row-sep" aria-hidden="true"></div>

          <div class="submenu-header">Context Size</div>
          <button
            v-for="opt in contextOptions"
            :key="opt.value"
            class="row"
            :class="{ selected: cfg.context === opt.value }"
            role="menuitemradio"
            @click="setField('context', opt.value, $event)"
          >
            <span class="row-check">
              <i v-if="cfg.context === opt.value" class="codicon codicon-check"></i>
            </span>
            <span class="row-label">{{ opt.label }}</span>
            <span v-if="opt.default" class="row-default">Default</span>
          </button>

          <div v-if="variant !== 'persistent'" class="tip">Tip: Hold ⌘ to keep open</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.setting-control {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: inherit;
}

/* --- Top-level menu items ------------------------------------------------ */
.menu {
  position: relative;
  display: flex;
}

.menu-sep {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: var(--vscode-input-border, #3c3c3c);
  opacity: 0.8;
}

.menu-top {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 7px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--vscode-foreground, #cccccc);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s ease;
}

.menu-top:hover {
  background: var(--vscode-toolbar-hoverBackground, #ffffff14);
}

/* Once a menu is engaged, every top item reads as armed so it is clear that
   hovering any sibling switches to it (desktop file-menu behaviour). */
.setting-control.engaged .menu-top {
  background: var(--vscode-toolbar-hoverBackground, #ffffff0d);
  color: var(--vscode-foreground, #ffffff);
}

.setting-control.engaged .menu-top:hover,
.setting-control.engaged .menu-top.active,
.menu-top.active {
  background: var(--vscode-toolbar-activeBackground, #ffffff29);
  color: var(--vscode-foreground, #ffffff);
}

.menu-top-icon {
  font-size: 14px;
  opacity: 0.8;
}

.menu-top-value {
  font-weight: 400;
}

/* --- Dropdown shell (drops upward above the bar) ------------------------- */
.submenu {
  position: absolute;
  bottom: calc(100% + 8px);
  left: -2px;
  padding: 4px;
  background: var(--vscode-menu-background, var(--vscode-dropdown-background, #1f1f1f));
  border: 1px solid var(--vscode-menu-border, var(--vscode-dropdown-border, #454545));
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

.mode-menu {
  min-width: 250px;
}

.model-menu {
  min-width: 290px;
}

.effort-menu {
  min-width: 280px;
}

/* --- Rows ---------------------------------------------------------------- */
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  color: var(--vscode-menu-foreground, #cccccc);
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.row:hover,
.row:focus-visible {
  background: var(--vscode-list-activeSelectionBackground, #04395e);
  color: var(--vscode-list-activeSelectionForeground, #ffffff);
  outline: none;
}

.row:hover .row-icon,
.row:focus-visible .row-icon,
.row:hover .row-check,
.row:focus-visible .row-check,
.row:hover .row-pin,
.row:focus-visible .row-pin,
.row:hover .row-gear,
.row:focus-visible .row-gear {
  opacity: 1;
}

.row:hover .row-kbd,
.row:focus-visible .row-kbd,
.row:hover .row-badge,
.row:focus-visible .row-badge,
.row:hover .row-default,
.row:focus-visible .row-default {
  color: inherit;
  opacity: 0.85;
}

.row.selected {
  background: rgba(255, 255, 255, 0.05);
}

.row-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  flex-shrink: 0;
  opacity: 0.9;
}

.row-check .codicon {
  font-size: 14px;
}

.row-icon {
  font-size: 16px;
  width: 16px;
  flex-shrink: 0;
  opacity: 0.85;
}

.row-label {
  flex: 1;
  white-space: nowrap;
}

.row-kbd {
  margin-left: auto;
  font-size: 12px;
  color: var(--vscode-descriptionForeground, #999999);
  opacity: 0.9;
}

.row-badge,
.row-default {
  margin-left: auto;
  font-size: 12px;
  color: var(--vscode-descriptionForeground, #999999);
}

.row-pin {
  margin-left: auto;
  font-size: 14px;
  opacity: 0.75;
}

.row-gear {
  margin-left: auto;
  font-size: 15px;
  opacity: 0.8;
}

/* --- Section headers ----------------------------------------------------- */
.submenu-header {
  padding: 6px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vscode-descriptionForeground, #999999);
}

/* --- Separator ----------------------------------------------------------- */
.row-sep {
  height: 1px;
  margin: 4px 6px;
  background: var(--vscode-menu-separatorBackground, #ffffff1f);
}

/* --- Model search -------------------------------------------------------- */
.search-box {
  padding: 4px 4px 6px;
}

.search-input {
  width: 100%;
  padding: 5px 8px;
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  border-radius: 5px;
  background: var(--vscode-input-background, #2b2b2b);
  color: var(--vscode-input-foreground, #cccccc);
  font-size: 13px;
  font-family: inherit;
  outline: none;
}

.search-input::placeholder {
  color: var(--vscode-input-placeholderForeground, #989898);
}

.search-input:focus {
  border-color: var(--vscode-focusBorder, #0078d4);
}

/* --- Effort info banner -------------------------------------------------- */
.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 2px 2px 6px;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 12px;
  line-height: 1.35;
  color: var(--vscode-foreground, #cccccc);
}

.info-banner .codicon-info {
  font-size: 16px;
  flex-shrink: 0;
  color: var(--vscode-editorInfo-foreground, #3794ff);
}

/* --- Effort footer tip --------------------------------------------------- */
.tip {
  margin-top: 4px;
  padding: 8px 10px 4px;
  border-top: 1px solid var(--vscode-menu-separatorBackground, #ffffff1f);
  font-size: 12px;
  color: var(--vscode-descriptionForeground, #999999);
}

/* --- Submenu transition -------------------------------------------------- */
.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
