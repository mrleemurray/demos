<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
} from 'vue'
import AgentMergeHandlingControls from './AgentMergeHandlingControls.vue'

const props = defineProps({
  status: {
    type: Object,
    required: true,
  },
  scenario: {
    type: Object,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
  pullRequestDetails: {
    type: Object,
    required: true,
  },
  handlingVariant: {
    type: String,
    required: true,
    validator: value => ['permissions', 'scale', 'roles'].includes(value),
  },
  overlayOnly: {
    type: Boolean,
    default: false,
  },
  previewOnly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'update:setting'])
const root = ref()
const trigger = ref()
const open = ref(false)
const overlayId = `agent-merge-status-overlay-${useId()}`
const titleId = `agent-merge-status-title-${useId()}`
const descriptionId = `agent-merge-status-description-${useId()}`
const permissions = [
  { key: 'addressReviews', label: 'Address review comments' },
  { key: 'fixCI', label: 'Fix failing checks' },
  { key: 'resolveConflicts', label: 'Resolve merge conflicts' },
]
const statusIcon = computed(() => {
  switch (props.status.kind) {
    case 'disabled':
      return 'codicon-circle-slash'
    case 'monitoring':
      return 'codicon-eye'
    default:
      return 'codicon-loading'
  }
})
const footerDescription = computed(() => {
  if (props.settings.enabled) {
    return 'Changes apply to this pull request.'
  }
  switch (props.handlingVariant) {
    case 'permissions':
      return 'Enable Agent Merge to change permissions.'
    case 'scale':
      return 'Choose an autonomy level to enable Agent Merge.'
    case 'roles':
      return 'Choose a role to enable Agent Merge.'
    default:
      throw new Error(
        `Unsupported handling variant: ${props.handlingVariant}`,
      )
  }
})

async function toggleOpen() {
  if (open.value) {
    open.value = false
    return
  }
  await show()
}

async function show() {
  if (props.overlayOnly) {
    throw new Error('Overlay-only status widgets cannot be opened')
  }
  open.value = true
  await nextTick()
  trigger.value?.focus()
}

async function close(restoreFocus) {
  if (props.overlayOnly) {
    emit('close', restoreFocus)
    return
  }
  open.value = false
  if (restoreFocus) {
    await nextTick()
    trigger.value?.focus()
  }
}

function updateSetting(key, value) {
  emit('update:setting', { key, value })
}

function applyConfiguration(configuration) {
  for (const [key, value] of Object.entries(configuration)) {
    updateSetting(key, value)
  }
}

function handleDocumentPointerDown(event) {
  if (open.value && !root.value?.contains(event.target)) {
    close(false)
  }
}

function handleDocumentFocusIn(event) {
  if (open.value && !root.value?.contains(event.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true)
  document.addEventListener('focusin', handleDocumentFocusIn)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
  document.removeEventListener('focusin', handleDocumentFocusIn)
})
</script>

<template>
  <div
    ref="root"
    class="agent-merge-status-widget"
    :class="[
      `status-${status.kind}`,
      {
        'overlay-only': overlayOnly,
        'preview-only': previewOnly,
      },
    ]"
    @keydown.esc.stop.prevent="close(true)"
  >
    <button
      v-if="!overlayOnly"
      ref="trigger"
      class="agent-merge-status-trigger"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="open ? overlayId : undefined"
      :aria-label="`Agent Merge status: ${status.label}. Show details and controls.`"
      :data-agent-merge-state="status.kind"
      @click="toggleOpen"
    >
      <i
        class="codicon"
        :class="[
          statusIcon,
          { 'codicon-modifier-spin': status.kind === 'working' },
        ]"
        aria-hidden="true"
      />
      <span class="command-center-status">{{ status.label }}</span>
      <i
        class="status-trigger-chevron codicon codicon-chevron-down"
        :class="{ open }"
        aria-hidden="true"
      />
    </button>

    <section
      v-if="overlayOnly || open"
      :id="overlayId"
      class="agent-merge-status-overlay"
      role="dialog"
      aria-modal="false"
      :data-handling-variant="previewOnly ? 'preview' : handlingVariant"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
    >
      <header class="status-overlay-header">
        <div class="status-overlay-heading">
          <i
            class="codicon codicon-git-merge"
            :class="`status-${status.kind}`"
            aria-hidden="true"
          />
          <h2 :id="titleId">{{ status.label }}</h2>
        </div>
      </header>

      <p :id="descriptionId" class="status-overlay-description">
        {{
          previewOnly
            ? 'Open this session to view details or change Agent Merge settings.'
            : 'Control what the agent may change while it works on this pull request.'
        }}
      </p>

      <a
        class="status-overlay-pull-request"
        :href="scenario.pullRequestUrl"
        target="_blank"
        rel="noreferrer"
        :aria-label="`Open pull request #${scenario.pullRequestNumber}: ${pullRequestDetails.title}. ${pullRequestDetails.baseBranch} from ${scenario.branch}.`"
      >
        <i class="codicon codicon-git-pull-request" aria-hidden="true" />
        <span>
          <strong>#{{ scenario.pullRequestNumber }} {{ pullRequestDetails.title }}</strong>
          <small>{{ pullRequestDetails.baseBranch }} ← {{ scenario.branch }}</small>
        </span>
        <i class="codicon codicon-link-external" aria-hidden="true" />
      </a>

      <fieldset
        v-if="!previewOnly && handlingVariant === 'permissions'"
        class="status-overlay-permissions"
        :class="{ disabled: !settings.enabled }"
        :disabled="!settings.enabled"
      >
        <legend>Allowed actions</legend>
        <div class="status-overlay-permission-list">
          <label v-for="permission in permissions" :key="permission.key">
            <input
              type="checkbox"
              :name="`status-${permission.key}`"
              :checked="settings[permission.key]"
              :disabled="!settings.enabled"
              @change="updateSetting(permission.key, $event.target.checked)"
            />
            <span>{{ permission.label }}</span>
          </label>

          <label class="status-overlay-merge-policy">
            <span>Merge pull request</span>
            <select
              name="status-mergePullRequest"
              :value="settings.mergePullRequest"
              :disabled="!settings.enabled"
              @change="updateSetting('mergePullRequest', $event.target.value)"
            >
              <option value="never">Off</option>
              <option value="ifUnchanged">Only if unchanged</option>
              <option value="always">When ready</option>
            </select>
          </label>
        </div>
      </fieldset>

      <AgentMergeHandlingControls
        v-else-if="!previewOnly"
        :variant="handlingVariant"
        :settings="settings"
        name-prefix="status-"
        compact
        @update:configuration="applyConfiguration"
      />

      <footer v-if="!previewOnly" class="status-overlay-footer">
        <p>{{ footerDescription }}</p>
        <button
          class="status-overlay-toggle"
          type="button"
          @click="updateSetting('enabled', !settings.enabled)"
        >
          <i
            class="codicon"
            :class="
              settings.enabled ? 'codicon-circle-slash' : 'codicon-play'
            "
            aria-hidden="true"
          />
          {{ settings.enabled ? 'Disable Agent Merge' : 'Enable Agent Merge' }}
        </button>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.agent-merge-status-widget {
  position: relative;
  display: flex;
  align-items: stretch;
  flex: 0 1 auto;
  min-width: 0;
  height: 100%;
}

.agent-merge-status-widget.overlay-only {
  position: fixed;
  z-index: 40;
  display: block;
  width: min(360px, calc(100vw - (2 * var(--vscode-spacing-size120))));
  height: auto;
  margin-left: var(--vscode-spacing-size80);
}

.agent-merge-status-widget.overlay-only .agent-merge-status-overlay {
  position: static;
  width: 100%;
}

.agent-merge-status-widget.preview-only .status-overlay-pull-request {
  margin-bottom: var(--vscode-spacing-size120);
}

.agent-merge-status-trigger {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  gap: var(--vscode-spacing-size40);
  padding: 0 var(--vscode-spacing-size60) 0 var(--vscode-spacing-size80);
  color: var(--vscode-descriptionForeground);
  background: transparent;
  border: 0;
  border-left: var(--vscode-strokeThickness) solid
    var(--vscode-commandCenter-border);
  border-radius: 0 var(--vscode-cornerRadius-medium)
    var(--vscode-cornerRadius-medium) 0;
  cursor: pointer;
}

.agent-merge-status-trigger:hover,
.agent-merge-status-trigger[aria-expanded='true'] {
  color: var(--vscode-commandCenter-activeForeground);
  background: var(--vscode-toolbar-hoverBackground);
}

.agent-merge-status-trigger:focus-visible,
.status-overlay-pull-request:focus-visible,
.status-overlay-permissions input:focus-visible,
.status-overlay-permissions select:focus-visible,
.status-overlay-toggle:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.agent-merge-status-trigger > .codicon {
  flex: 0 0 auto;
  font-size: var(--vscode-codiconFontSize-compact);
}

.agent-merge-status-widget.status-working .agent-merge-status-trigger {
  color: var(--vscode-textLink-foreground);
}

.agent-merge-status-widget.status-monitoring .agent-merge-status-trigger {
  color: var(--vscode-testing-iconPassed);
}

.agent-merge-status-widget.status-disabled .agent-merge-status-trigger {
  color: var(--vscode-disabledForeground);
}

.command-center-status {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vscode-fontSize-label2);
}

.status-trigger-chevron {
  color: var(--vscode-descriptionForeground);
  transition: transform 100ms ease-out;
}

.status-trigger-chevron.open {
  transform: rotate(180deg);
}

.agent-merge-status-overlay {
  position: absolute;
  z-index: 30;
  top: calc(100% + var(--vscode-spacing-size60));
  right: 0;
  display: flex;
  flex-direction: column;
  width: min(360px, calc(100vw - (2 * var(--vscode-spacing-size120))));
  max-height: calc(
    100vh - var(--vscode-spacing-size320) - var(--vscode-spacing-size320)
  );
  color: var(--vscode-foreground);
  background: var(--vscode-agentsPanel-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-window-border);
  border-radius: var(--vscode-cornerRadius-large);
  box-shadow: 0 var(--vscode-spacing-size80) var(--vscode-spacing-size240)
    var(--vscode-widget-shadow);
  overflow-y: auto;
}

.status-overlay-header {
  position: sticky;
  z-index: 2;
  top: 0;
  display: flex;
  align-items: flex-start;
  gap: var(--vscode-spacing-size120);
  padding: var(--vscode-spacing-size160) var(--vscode-spacing-size160)
    var(--vscode-spacing-size80);
  background: var(--vscode-agentsPanel-background);
}

.status-overlay-heading {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size100);
  min-width: 0;
}

.status-overlay-heading > .codicon {
  flex: 0 0 auto;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-codiconFontSize);
}

.status-overlay-heading > .codicon.status-working {
  color: var(--vscode-textLink-foreground);
}

.status-overlay-heading > .codicon.status-monitoring {
  color: var(--vscode-testing-iconPassed);
}

.status-overlay-heading > .codicon.status-disabled {
  color: var(--vscode-disabledForeground);
}

.status-overlay-heading h2 {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vscode-fontSize-heading3);
  font-weight: var(--vscode-fontWeight-semiBold);
  line-height: 1.4;
}

.status-overlay-description {
  margin: 0;
  padding: 0 var(--vscode-spacing-size160)
    var(--vscode-spacing-size120);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
  line-height: 1.45;
}

.status-overlay-pull-request {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--vscode-spacing-size80);
  margin: 0 var(--vscode-spacing-size120);
  padding: var(--vscode-spacing-size80);
  color: var(--vscode-foreground);
  background: var(--vscode-chat-statusBackground);
  border: var(--vscode-strokeThickness) solid var(--vscode-widget-border);
  border-radius: var(--vscode-cornerRadius-medium);
  text-decoration: none;
}

.status-overlay-pull-request:hover {
  background: var(--vscode-list-hoverBackground);
}

.status-overlay-pull-request > .codicon {
  flex: 0 0 auto;
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-codiconFontSize-compact);
}

.status-overlay-pull-request > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size20);
}

.status-overlay-pull-request strong,
.status-overlay-pull-request small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-overlay-pull-request strong {
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.status-overlay-pull-request small {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.status-overlay-permissions {
  min-width: 0;
  margin: var(--vscode-spacing-size120) 0 0;
  padding: 0 var(--vscode-spacing-size160) var(--vscode-spacing-size160);
  border: 0;
}

.status-overlay-permissions.disabled {
  opacity: 0.5;
}

.status-overlay-permissions legend {
  padding: 0;
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.status-overlay-permission-list {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size40);
  margin-top: var(--vscode-spacing-size80);
}

.status-overlay-permission-list > label {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size80);
  min-height: var(--vscode-spacing-size240);
  font-size: var(--vscode-fontSize-label1);
}

.status-overlay-permissions input {
  flex: 0 0 auto;
  margin: 0;
  accent-color: var(--vscode-button-background);
}

.status-overlay-merge-policy {
  justify-content: space-between;
  margin-top: var(--vscode-spacing-size80);
}

.status-overlay-merge-policy > span {
  min-width: 0;
}

.status-overlay-merge-policy select {
  flex: 0 1 148px;
  min-width: 0;
  min-height: var(--vscode-spacing-size240);
  padding: 0 var(--vscode-spacing-size60);
  color: var(--vscode-input-foreground);
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-small);
}

.status-overlay-footer {
  position: sticky;
  z-index: 2;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vscode-spacing-size120);
  padding: var(--vscode-spacing-size120) var(--vscode-spacing-size160);
  background: var(--vscode-agentsPanel-background);
  border-radius: 0 0 var(--vscode-cornerRadius-large)
    var(--vscode-cornerRadius-large);
}

.status-overlay-footer p {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label3);
  line-height: 1.4;
}

.status-overlay-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-height: var(--vscode-spacing-size240);
  gap: var(--vscode-spacing-size60);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-foreground);
  background: var(--vscode-button-secondaryBackground);
  border: var(--vscode-strokeThickness) solid
    var(--vscode-button-secondaryBorder);
  border-radius: var(--vscode-cornerRadius-small);
  font-size: var(--vscode-fontSize-label1);
  cursor: pointer;
}

.status-overlay-toggle > .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
}

.status-overlay-toggle:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

@media (max-width: 700px) {
  .command-center-status,
  .status-trigger-chevron {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .agent-merge-status-trigger .codicon-modifier-spin {
    animation: none;
  }

  .status-trigger-chevron {
    transition: none;
  }
}
</style>
