<script setup>
import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  useId,
} from 'vue'
import AgentMergeHandlingControls from './AgentMergeHandlingControls.vue'
import FollowUpEditor from './FollowUpEditor.vue'

const props = defineProps({
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
  },
  followUpTemplate: {
    type: Object,
    default: undefined,
  },
  settingsOnly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel', 'create', 'save'])
const dialog = ref()
const dialogBody = ref()
const titleInput = ref()
const followUpEditor = ref()
const configureFollowUp = ref(false)
const followUpIsValid = ref(false)
const step = ref(props.settingsOnly ? 2 : 1)
const details = reactive({
  title: props.pullRequestDetails.title,
  description: props.pullRequestDetails.description,
  baseBranch: props.pullRequestDetails.baseBranch,
})
const mode = ref(props.settings.enabled ? 'agentMerge' : 'standard')
const permissions = reactive({
  addressReviews: props.settings.addressReviews,
  fixCI: props.settings.fixCI,
  resolveConflicts: props.settings.resolveConflicts,
  mergePullRequest: props.settings.mergePullRequest,
})
const titleId = `create-pull-request-title-${useId()}`
const descriptionId = `create-pull-request-description-${useId()}`
const dialogTitle = computed(() => {
  if (!props.settingsOnly) {
    return 'Create pull request'
  }
  return props.settings.enabled
    ? 'Update Agent Merge settings'
    : 'Configure Agent Merge'
})
const headerDescription = computed(() => {
  if (props.settingsOnly) {
    return 'Choose how Agent Merge handles this pull request.'
  }
  switch (step.value) {
    case 1:
      return 'Review the pull request details.'
    case 2:
      return 'Choose what happens after the pull request is created.'
    default:
      return 'Choose when the follow up runs and what it should do.'
  }
})
const primaryActionLabel = computed(() => {
  if (props.settingsOnly) {
    return 'Save settings'
  }
  if (step.value === 1 || (step.value === 2 && configureFollowUp.value)) {
    return 'Continue'
  }
  return 'Create pull request'
})

function applyConfiguration(configuration) {
  mode.value = configuration.enabled ? 'agentMerge' : 'standard'
  Object.assign(permissions, {
    addressReviews: configuration.addressReviews,
    fixCI: configuration.fixCI,
    resolveConflicts: configuration.resolveConflicts,
    mergePullRequest: configuration.mergePullRequest,
  })
}

const handlingSettings = computed(() => ({
  enabled: mode.value === 'agentMerge',
  addressReviews: permissions.addressReviews,
  fixCI: permissions.fixCI,
  resolveConflicts: permissions.resolveConflicts,
  mergePullRequest: permissions.mergePullRequest,
}))

function getHandlingControlSelector() {
  switch (props.handlingVariant) {
    case 'permissions':
      return 'input[name="pullRequestMode"]:checked'
    case 'scale':
      return 'input[name="agentMergeAutonomy"]'
    case 'roles':
      return 'input[name="agentMergeRole"]:checked'
    default:
      throw new Error(
        `Unsupported handling variant: ${props.handlingVariant}`,
      )
  }
}

function resetDialogBodyScroll() {
  if (dialogBody.value) {
    dialogBody.value.scrollTop = 0
  }
}

async function focusHandlingControl() {
  await nextTick()
  resetDialogBodyScroll()
  dialog.value?.querySelector(getHandlingControlSelector())?.focus()
}

function getSettings() {
  return {
    enabled: mode.value === 'agentMerge',
    addressReviews:
      mode.value === 'agentMerge' && permissions.addressReviews,
    fixCI: mode.value === 'agentMerge' && permissions.fixCI,
    resolveConflicts:
      mode.value === 'agentMerge' && permissions.resolveConflicts,
    mergePullRequest:
      mode.value === 'agentMerge' ? permissions.mergePullRequest : 'never',
  }
}

onMounted(async () => {
  if (props.settingsOnly) {
    await focusHandlingControl()
  } else {
    await nextTick()
    titleInput.value?.focus()
  }
})

async function submit() {
  if (!props.settingsOnly && step.value === 1) {
    step.value = 2
    await focusHandlingControl()
    return
  }

  if (props.settingsOnly) {
    emit('save', getSettings())
    return
  }
  if (step.value === 2 && configureFollowUp.value) {
    step.value = 3
    await focusFollowUpEditor()
    return
  }
  if (step.value === 3 && !followUpIsValid.value) {
    return
  }

  emit('create', {
    details: { ...details },
    settings: getSettings(),
    followUp: configureFollowUp.value
      ? followUpEditor.value.getDraft()
      : undefined,
  })
}

async function focusFollowUpEditor() {
  await nextTick()
  resetDialogBodyScroll()
  followUpEditor.value?.focus()
}

async function showDetailsStep() {
  step.value = 1
  await nextTick()
  resetDialogBodyScroll()
  titleInput.value?.focus()
}

async function showPreviousStep() {
  if (step.value === 2) {
    await showDetailsStep()
    return
  }

  step.value = 2
  await nextTick()
  resetDialogBodyScroll()
  dialog.value?.querySelector('input[name="configureFollowUp"]')?.focus()
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('cancel')
    return
  }
  if (event.key !== 'Tab') {
    return
  }

  const focusable = Array.from(
    dialog.value.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
  const first = focusable[0]
  const last = focusable.at(-1)
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <div class="create-pr-dialog-backdrop" @mousedown.self="emit('cancel')">
    <form
      ref="dialog"
      class="create-pr-dialog"
      :class="{ 'agent-merge-settings-dialog': settingsOnly }"
      role="dialog"
      :data-handling-variant="handlingVariant"
      :data-dialog-mode="
        settingsOnly ? 'agent-merge-settings' : 'create-pull-request'
      "
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
      tabindex="-1"
      @keydown="handleKeydown"
      @submit.prevent="submit"
    >
      <header class="create-pr-dialog-header">
        <div class="dialog-title-row">
          <div>
            <h2 :id="titleId">{{ dialogTitle }}</h2>
            <p :id="descriptionId">{{ headerDescription }}</p>
          </div>
        </div>
        <ol
          v-if="!settingsOnly"
          class="dialog-steps"
          aria-label="Pull request creation steps"
        >
          <li
            :class="{ current: step === 1, complete: step > 1 }"
            :aria-current="step === 1 ? 'step' : undefined"
          >
            <span>
              <i
                v-if="step > 1"
                class="codicon codicon-check"
                aria-hidden="true"
              />
              <template v-else>1</template>
            </span>
            Details
          </li>
          <li
            :class="{ current: step === 2, complete: step > 2 }"
            :aria-current="step === 2 ? 'step' : undefined"
          >
            <span>
              <i
                v-if="step > 2"
                class="codicon codicon-check"
                aria-hidden="true"
              />
              <template v-else>2</template>
            </span>
            Handling
          </li>
          <li
            v-if="configureFollowUp"
            :class="{ current: step === 3 }"
            :aria-current="step === 3 ? 'step' : undefined"
          >
            <span>3</span>
            Follow Up
          </li>
        </ol>
      </header>

      <div ref="dialogBody" class="create-pr-dialog-body">
        <section
          v-if="!settingsOnly && step === 1"
          class="pull-request-details"
          aria-label="Pull request details"
        >
          <label class="form-field">
            <span>Title</span>
            <input
              ref="titleInput"
              v-model="details.title"
              type="text"
              name="pullRequestTitle"
              autocomplete="off"
              required
            />
          </label>
          <label class="form-field">
            <span>Description</span>
            <textarea
              v-model="details.description"
              name="pullRequestDescription"
              rows="4"
            />
          </label>
          <label class="form-field">
            <span>Merge into</span>
            <select v-model="details.baseBranch" name="pullRequestBaseBranch">
              <option
                v-for="branch in scenario.baseBranches"
                :key="branch"
                :value="branch"
              >
                {{ branch }}
              </option>
            </select>
          </label>
          <p class="source-branch">
            <i class="codicon codicon-git-branch" aria-hidden="true" />
            From {{ scenario.branch }}
          </p>
        </section>

        <div v-else-if="settingsOnly || step === 2" class="handling-step">
          <div class="branch-summary">
            <i
              class="codicon"
              :class="
                settingsOnly
                  ? 'codicon-git-pull-request'
                  : 'codicon-git-branch'
              "
              aria-hidden="true"
            />
            <span class="branch-summary-copy">
              <strong v-if="settingsOnly">
                #{{ scenario.pullRequestNumber }} {{ details.title }}
              </strong>
              <span class="branch-path">
                {{ details.baseBranch }} ← {{ scenario.branch }}
              </span>
            </span>
          </div>

          <template v-if="handlingVariant === 'permissions'">
            <fieldset
              class="creation-mode"
              :aria-label="
                settingsOnly
                  ? 'Agent Merge behavior'
                  : 'Pull request behavior'
              "
            >
              <label :class="{ selected: mode === 'standard' }">
                <input
                  v-model="mode"
                  type="radio"
                  name="pullRequestMode"
                  value="standard"
                />
                <span>
                  <strong>
                    {{
                      settingsOnly
                        ? 'Keep Agent Merge off'
                        : 'Create the pull request'
                    }}
                  </strong>
                  <span>
                    Keep reviews, checks, conflicts, and merge under your control.
                  </span>
                </span>
              </label>
              <label :class="{ selected: mode === 'agentMerge' }">
                <input
                  v-model="mode"
                  type="radio"
                  name="pullRequestMode"
                  value="agentMerge"
                />
                <span>
                  <strong>
                    {{
                      settingsOnly
                        ? 'Use Agent Merge'
                        : 'Create with Agent Merge'
                    }}
                  </strong>
                  <span>
                    {{
                      settingsOnly
                        ? 'Let the agent monitor and act on this pull request.'
                        : 'Let the agent monitor the pull request after creation.'
                    }}
                  </span>
                </span>
              </label>
            </fieldset>

            <fieldset
              class="agent-merge-permissions"
              :disabled="mode !== 'agentMerge'"
            >
              <legend>Agent Merge permissions</legend>
              <p>Choose what the agent may handle on this pull request.</p>
              <label class="permission-checkbox">
                <input
                  v-model="permissions.addressReviews"
                  type="checkbox"
                  name="addressReviews"
                  :disabled="mode !== 'agentMerge'"
                />
                <span class="vscode-checkbox" aria-hidden="true">
                  <i class="codicon codicon-check" />
                </span>
                <span>Address review comments</span>
              </label>
              <label class="permission-checkbox">
                <input
                  v-model="permissions.fixCI"
                  type="checkbox"
                  name="fixCI"
                  :disabled="mode !== 'agentMerge'"
                />
                <span class="vscode-checkbox" aria-hidden="true">
                  <i class="codicon codicon-check" />
                </span>
                <span>Fix failing checks</span>
              </label>
              <label class="permission-checkbox">
                <input
                  v-model="permissions.resolveConflicts"
                  type="checkbox"
                  name="resolveConflicts"
                  :disabled="mode !== 'agentMerge'"
                />
                <span class="vscode-checkbox" aria-hidden="true">
                  <i class="codicon codicon-check" />
                </span>
                <span>Resolve merge conflicts</span>
              </label>
              <label class="merge-policy">
                <span>Merge pull request</span>
                <select
                  v-model="permissions.mergePullRequest"
                  name="mergePullRequest"
                  :disabled="mode !== 'agentMerge'"
                >
                  <option value="never">Off</option>
                  <option value="ifUnchanged">Only if unchanged</option>
                  <option value="always">When ready</option>
                </select>
              </label>
            </fieldset>
          </template>

          <AgentMergeHandlingControls
            v-else
            :variant="handlingVariant"
            :settings="handlingSettings"
            @update:configuration="applyConfiguration"
          />

          <section
            v-if="!settingsOnly && followUpTemplate"
            class="pull-request-follow-up"
          >
            <label class="permission-checkbox follow-up-checkbox">
              <input
                v-model="configureFollowUp"
                type="checkbox"
                name="configureFollowUp"
              />
              <span class="vscode-checkbox" aria-hidden="true">
                <i class="codicon codicon-check" />
              </span>
              <span class="follow-up-option-copy">
                <strong>Add a follow up</strong>
                <span>
                  Set up a future job on the next step.
                </span>
              </span>
            </label>
          </section>
        </div>

        <KeepAlive>
          <FollowUpEditor
            v-if="!settingsOnly && configureFollowUp && step === 3"
            ref="followUpEditor"
            :template="followUpTemplate"
            role="region"
            aria-label="Follow Up configuration"
            @update:valid="followUpIsValid = $event"
          >
            <template #context>
              <div class="branch-summary">
                <i class="codicon codicon-git-branch" aria-hidden="true" />
                <span class="branch-summary-copy">
                  <span class="branch-path">
                    {{ details.baseBranch }} ← {{ scenario.branch }}
                  </span>
                </span>
              </div>
            </template>
          </FollowUpEditor>
        </KeepAlive>
      </div>

      <footer class="create-pr-dialog-footer">
        <button
          v-if="!settingsOnly && step > 1"
          class="secondary-button back-button"
          type="button"
          @click="showPreviousStep"
        >
          Back
        </button>
        <div class="footer-actions">
          <button class="secondary-button" type="button" @click="emit('cancel')">
            Cancel
          </button>
          <button
            class="primary-button"
            type="submit"
            :disabled="
              !settingsOnly &&
              step === 3 &&
              !followUpIsValid
            "
          >
            {{ primaryActionLabel }}
          </button>
        </div>
      </footer>
    </form>
  </div>
</template>

<style scoped>
.create-pr-dialog-backdrop {
  position: absolute;
  z-index: 20;
  display: grid;
  place-items: center;
  inset: 0;
  padding: var(--vscode-spacing-size160);
  background: color-mix(
    in srgb,
    var(--vscode-agents-background) 72%,
    transparent
  );
}

.create-pr-dialog {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(520px, 100%);
  max-height: calc(100% - var(--vscode-spacing-size320));
  color: var(--vscode-foreground);
  background: var(--vscode-agentsPanel-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-window-border);
  border-radius: var(--vscode-cornerRadius-large);
  box-shadow: 0 var(--vscode-spacing-size120) var(--vscode-spacing-size320)
    var(--vscode-widget-shadow);
  overflow: hidden;
}

.create-pr-dialog-header {
  padding: var(--vscode-spacing-size200) var(--vscode-spacing-size200)
    var(--vscode-spacing-size160);
}

.dialog-title-row {
  display: flex;
  align-items: flex-start;
  gap: var(--vscode-spacing-size160);
}

.dialog-title-row > div {
  flex: 1;
  min-width: 0;
}

.create-pr-dialog h2 {
  margin: 0;
  font-size: var(--vscode-fontSize-heading2);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.create-pr-dialog-header p,
.agent-merge-permissions p {
  margin: var(--vscode-spacing-size40) 0 0;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body1);
  line-height: 1.5;
}

.dialog-steps {
  display: flex;
  gap: var(--vscode-spacing-size200);
  margin: var(--vscode-spacing-size160) 0 0;
  padding: 0;
  list-style: none;
}

.dialog-steps li {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label1);
}

.dialog-steps li > span {
  display: grid;
  place-items: center;
  width: var(--vscode-spacing-size200);
  height: var(--vscode-spacing-size200);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-circle);
  font-size: var(--vscode-fontSize-label2);
}

.dialog-steps li.current {
  color: var(--vscode-foreground);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.dialog-steps li.current > span {
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
  border-color: var(--vscode-button-background);
}

.dialog-steps li.complete > span {
  color: var(--vscode-foreground);
  background: var(--vscode-editor-inactiveSelectionBackground);
  border-color: var(--vscode-input-border);
}

.dialog-steps li.complete .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
}

.create-pr-dialog-body {
  min-height: 0;
  padding: 0 var(--vscode-spacing-size200) var(--vscode-spacing-size200);
  overflow-y: auto;
}

.pull-request-details {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size160);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size60);
}

.form-field > span {
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  color: var(--vscode-input-foreground);
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-small);
}

.form-field input,
.form-field select {
  min-height: var(--prototype-button-height);
  padding: 0 var(--vscode-spacing-size80);
}

.form-field textarea {
  min-height: calc(3 * var(--vscode-spacing-size320));
  padding: var(--vscode-spacing-size60) var(--vscode-spacing-size80);
  line-height: 1.5;
  resize: vertical;
}

.source-branch {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
  margin: 0;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.source-branch > .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
}

.branch-summary {
  display: flex;
  align-items: flex-start;
  gap: var(--vscode-spacing-size100);
  padding: var(--vscode-spacing-size120);
  background: var(--vscode-chat-statusBackground);
  border-radius: var(--vscode-cornerRadius-medium);
}

.branch-summary > .codicon {
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-icon-foreground);
  font-size: var(--vscode-codiconFontSize);
}

.branch-summary-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size20);
}

.branch-summary-copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.creation-mode label > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size40);
}

.branch-path {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.creation-mode label > span > span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

fieldset {
  min-width: 0;
  margin: var(--vscode-spacing-size200) 0 0;
  padding: 0;
  border: 0;
}

legend {
  margin-bottom: var(--vscode-spacing-size80);
  padding: 0;
  color: var(--vscode-foreground);
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.creation-mode {
  display: grid;
  gap: var(--vscode-spacing-size80);
}

.creation-mode label {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--vscode-spacing-size100);
  padding: var(--vscode-spacing-size120);
  background: transparent;
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-medium);
  cursor: pointer;
}

.creation-mode label:hover {
  background: var(--vscode-list-hoverBackground);
}

.creation-mode label.selected {
  background: var(--vscode-list-activeSelectionBackground);
  border-color: var(--vscode-focusBorder);
}

.creation-mode input {
  margin: var(--vscode-spacing-size20) 0 0;
  accent-color: var(--vscode-button-background);
}

.agent-merge-permissions {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size100);
  padding-top: var(--vscode-spacing-size160);
}

.agent-merge-permissions[disabled] {
  opacity: 0.5;
}

.agent-merge-permissions legend {
  margin-bottom: 0;
}

.agent-merge-permissions p {
  margin: calc(-1 * var(--vscode-spacing-size60)) 0
    var(--vscode-spacing-size40);
  font-size: var(--vscode-fontSize-body2);
}

.permission-checkbox {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--vscode-spacing-size80);
  cursor: pointer;
}

.permission-checkbox > input {
  position: absolute;
  width: var(--vscode-strokeThickness);
  height: var(--vscode-strokeThickness);
  opacity: 0;
  pointer-events: none;
}

.vscode-checkbox {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: var(--vscode-spacing-size160);
  height: var(--vscode-spacing-size160);
  color: var(--vscode-checkbox-foreground);
  background: var(--vscode-checkbox-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-checkbox-border);
  border-radius: var(--vscode-cornerRadius-xSmall);
}

.vscode-checkbox > .codicon {
  visibility: hidden;
  font-size: var(--vscode-codiconFontSize-compact);
}

.permission-checkbox > input:checked + .vscode-checkbox {
  background: var(--vscode-button-background);
  border-color: var(--vscode-button-background);
}

.permission-checkbox > input:checked + .vscode-checkbox > .codicon {
  visibility: visible;
}

.permission-checkbox > input:disabled + .vscode-checkbox {
  cursor: default;
}

.pull-request-follow-up {
  margin-top: var(--vscode-spacing-size200);
  padding-top: var(--vscode-spacing-size160);
  border-top: var(--vscode-strokeThickness) solid
    var(--vscode-sideBarSectionHeader-border);
}

.follow-up-option-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size20);
}

.follow-up-option-copy strong {
  font-weight: var(--vscode-fontWeight-semiBold);
}

.follow-up-option-copy > span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
  line-height: 1.4;
}

.merge-policy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vscode-spacing-size120);
  margin-top: var(--vscode-spacing-size40);
}

.merge-policy select {
  min-width: 160px;
  height: var(--prototype-button-height);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-input-foreground);
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-small);
}

.create-pr-dialog-footer {
  display: flex;
  justify-content: space-between;
  gap: var(--vscode-spacing-size80);
  padding: var(--vscode-spacing-size160) var(--vscode-spacing-size200);
}

.footer-actions {
  display: flex;
  gap: var(--vscode-spacing-size80);
  margin-left: auto;
}

.create-pr-dialog-footer button {
  min-width: 92px;
  min-height: var(--prototype-button-height);
  padding: 0 var(--vscode-spacing-size120);
  border-radius: var(--vscode-cornerRadius-small);
  cursor: pointer;
}

.secondary-button {
  color: var(--vscode-foreground);
  background: var(--vscode-button-secondaryBackground);
  border: var(--vscode-strokeThickness) solid
    var(--vscode-button-secondaryBorder);
}

.secondary-button:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

.primary-button {
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-button-border);
}

.primary-button:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
}

.primary-button:disabled {
  cursor: default;
  opacity: 0.5;
}

.form-field input:focus-visible,
.form-field textarea:focus-visible,
.form-field select:focus-visible,
.merge-policy select:focus-visible,
.create-pr-dialog-footer button:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.creation-mode label:has(input:focus-visible),
.agent-merge-permissions label:has(input:focus-visible),
.follow-up-checkbox:has(input:focus-visible) {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: var(--vscode-spacing-size20);
}

@media (max-width: 560px) {
  .create-pr-dialog-backdrop {
    padding: var(--vscode-spacing-size80);
  }

  .create-pr-dialog {
    max-height: 100%;
  }

  .merge-policy {
    align-items: stretch;
    flex-direction: column;
  }

  .merge-policy select {
    width: 100%;
  }
}
</style>
