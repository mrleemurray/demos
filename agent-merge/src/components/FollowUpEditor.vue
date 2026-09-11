<script setup>
import { computed, ref, useId, watch } from 'vue'

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:valid'])
const nameInput = ref()
const fileInput = ref()
const name = ref(props.template.name)
const triggerType = ref(props.template.triggerType ?? 'event')
const source = ref(props.template.sourceLabel ?? '')
const eventName = ref(props.template.event ?? '')
const scheduledDate = ref('')
const scheduledTime = ref('')
const timeZone = ref('local')
const instructionMode = ref('manual')
const manualInstructions = ref(props.template.instructions)
const uploadedInstructions = ref('')
const uploadedFileName = ref('')
const uploadError = ref('')
const editorId = useId()
const manualTabId = `follow-up-manual-tab-${editorId}`
const manualPanelId = `follow-up-manual-panel-${editorId}`
const uploadTabId = `follow-up-upload-tab-${editorId}`
const uploadPanelId = `follow-up-upload-panel-${editorId}`
const usesTemplateName = computed(
  () => name.value.trim() === props.template.name,
)
const selectedInstructions = computed(() =>
  instructionMode.value === 'manual'
    ? manualInstructions.value.trim()
    : uploadedInstructions.value.trim(),
)
const inferredSummary = computed(() =>
  inferSummaryFromInstructions(selectedInstructions.value),
)
const triggerIsValid = computed(() =>
  triggerType.value === 'event'
    ? Boolean(source.value.trim() && eventName.value.trim())
    : Boolean(
        scheduledDate.value &&
          scheduledTime.value &&
          timeZone.value,
      ),
)
const isValid = computed(
  () =>
    Boolean(name.value.trim() && inferredSummary.value) &&
    triggerIsValid.value &&
    Boolean(selectedInstructions.value),
)

watch(
  isValid,
  valid => emit('update:valid', valid),
  { immediate: true },
)

function focus() {
  nameInput.value?.focus()
  nameInput.value?.select()
}

function selectInstructionMode(mode) {
  instructionMode.value = mode
  uploadError.value = ''
}

function handleInstructionTabKeydown(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
    return
  }

  event.preventDefault()
  const tabs = Array.from(
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]'),
  )
  const currentIndex = tabs.indexOf(event.currentTarget)
  let nextIndex
  if (event.key === 'Home') {
    nextIndex = 0
  } else if (event.key === 'End') {
    nextIndex = tabs.length - 1
  } else {
    const offset = event.key === 'ArrowRight' ? 1 : -1
    nextIndex = (currentIndex + offset + tabs.length) % tabs.length
  }

  const nextTab = tabs[nextIndex]
  selectInstructionMode(nextTab.dataset.instructionMode)
  nextTab.focus()
}

function readMarkdownFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('The selected Markdown file did not contain text.'))
        return
      }
      resolve(reader.result)
    })
    reader.addEventListener('error', () => {
      reject(reader.error ?? new Error('The selected file could not be read.'))
    })
    reader.readAsText(file)
  })
}

async function handleInstructionFile(event) {
  const file = event.target.files?.[0]
  uploadError.value = ''
  uploadedFileName.value = ''
  uploadedInstructions.value = ''

  if (!file) {
    return
  }
  if (!/\.md$/i.test(file.name)) {
    uploadError.value = 'Choose a Markdown file with a .md extension.'
    event.target.value = ''
    return
  }

  try {
    const content = await readMarkdownFile(file)
    if (!content.trim()) {
      uploadError.value = 'The selected Markdown file is empty.'
      event.target.value = ''
      return
    }
    uploadedFileName.value = file.name
    uploadedInstructions.value = content
  } catch {
    uploadError.value = 'The selected Markdown file could not be read.'
    event.target.value = ''
  }
}

function removeInstructionFile() {
  uploadedFileName.value = ''
  uploadedInstructions.value = ''
  uploadError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
    fileInput.value.focus()
  }
}

function inferSummaryFromInstructions(instructions) {
  const lines = instructions.split(/\r?\n/)
  const hasFrontmatter = lines[0]?.trim() === '---'
  let inFrontmatter = hasFrontmatter
  let inCodeFence = false
  let headingFallback = ''

  for (let index = hasFrontmatter ? 1 : 0; index < lines.length; index++) {
    const line = lines[index].trim()

    if (inFrontmatter) {
      if (line === '---') {
        inFrontmatter = false
      }
      continue
    }
    if (/^(?:```|~~~)/.test(line)) {
      inCodeFence = !inCodeFence
      continue
    }
    if (!line || inCodeFence) {
      continue
    }

    const isHeading = /^#{1,6}(?:\s|$)/.test(line)
    const summary = line
      .replace(/^#{1,6}\s*/, '')
      .replace(/^(?:[-*+]|\d+[.)])\s+/, '')
      .replace(/^>\s*/, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~`]/g, '')
      .trim()

    if (!summary) {
      continue
    }
    if (!isHeading) {
      return summary
    }
    headingFallback ||= summary
  }

  return headingFallback
}

function getDraft() {
  const event = eventName.value.trim()
  const waitForTemplateEvent = event === props.template.event
  const configuredDelay = props.template.delay ?? ''
  const scheduledLabel = `${scheduledDate.value} at ${scheduledTime.value}`

  return {
    id: usesTemplateName.value ? props.template.id : undefined,
    templateId: props.template.id,
    name: name.value.trim(),
    description: inferredSummary.value,
    triggerType: triggerType.value,
    sourceLabel:
      triggerType.value === 'event' ? source.value.trim() : undefined,
    event: triggerType.value === 'event' ? event : undefined,
    eventLabel:
      triggerType.value === 'event'
        ? waitForTemplateEvent
          ? props.template.eventLabel
          : event
        : undefined,
    delay:
      triggerType.value === 'event' ? configuredDelay : undefined,
    scheduledDate:
      triggerType.value === 'time' ? scheduledDate.value : undefined,
    scheduledTime:
      triggerType.value === 'time' ? scheduledTime.value : undefined,
    timeZone: triggerType.value === 'time' ? timeZone.value : undefined,
    timingLabel:
      triggerType.value === 'event'
        ? props.template.timingLabel
        : `${scheduledLabel}${timeZone.value === 'local' ? '' : ` ${timeZone.value}`}`,
    statusLabel:
      triggerType.value === 'event'
        ? waitForTemplateEvent
          ? props.template.statusLabel
          : `Waiting for ${event}`
        : 'Scheduled',
    instructionSource: instructionMode.value,
    uploadedFileName:
      instructionMode.value === 'upload'
        ? uploadedFileName.value
        : undefined,
    instructions: selectedInstructions.value,
  }
}

defineExpose({ focus, getDraft })
</script>

<template>
  <div class="follow-up-editor">
    <slot name="context" />
    <label class="follow-up-editor-field">
      <span>Task name</span>
      <input
        ref="nameInput"
        v-model="name"
        name="followUpName"
        type="text"
        required
      />
    </label>

    <fieldset class="follow-up-trigger">
      <legend>Trigger</legend>
      <p>Choose what should start this task.</p>
      <div class="follow-up-trigger-types">
        <label :class="{ selected: triggerType === 'event' }">
          <input
            v-model="triggerType"
            type="radio"
            name="followUpTriggerType"
            value="event"
          />
          <i class="codicon codicon-zap" aria-hidden="true" />
          <span>
            <strong>Event based</strong>
            <span>Run after an external event arrives.</span>
          </span>
        </label>
        <label :class="{ selected: triggerType === 'time' }">
          <input
            v-model="triggerType"
            type="radio"
            name="followUpTriggerType"
            value="time"
          />
          <i class="codicon codicon-calendar" aria-hidden="true" />
          <span>
            <strong>Time based</strong>
            <span>Run at a specific date and time.</span>
          </span>
        </label>
      </div>

      <div
        v-if="triggerType === 'event'"
        class="follow-up-trigger-fields"
        data-trigger-fields="event"
      >
        <label class="follow-up-editor-field">
          <span>Webhook source</span>
          <input
            v-model="source"
            name="followUpSource"
            type="text"
            required
          />
        </label>
        <label class="follow-up-editor-field">
          <span>Event</span>
          <input
            v-model="eventName"
            name="followUpEvent"
            type="text"
            required
            spellcheck="false"
          />
        </label>
      </div>

      <div
        v-else
        class="follow-up-trigger-fields"
        data-trigger-fields="time"
      >
        <label class="follow-up-editor-field">
          <span>Run on</span>
          <input
            v-model="scheduledDate"
            name="followUpDate"
            type="date"
            required
          />
        </label>
        <label class="follow-up-editor-field">
          <span>At</span>
          <input
            v-model="scheduledTime"
            name="followUpTime"
            type="time"
            required
          />
        </label>
        <label class="follow-up-editor-field">
          <span>Time zone</span>
          <select v-model="timeZone" name="followUpTimeZone">
            <option value="local">Local time</option>
            <option value="UTC">UTC</option>
          </select>
        </label>
      </div>
    </fieldset>

    <section class="follow-up-instruction-input">
      <h3>Instructions</h3>
      <div
        class="follow-up-instruction-tabs"
        role="tablist"
        aria-label="Instruction input"
      >
        <button
          :id="manualTabId"
          type="button"
          role="tab"
          data-instruction-mode="manual"
          :aria-selected="instructionMode === 'manual'"
          :aria-controls="manualPanelId"
          :tabindex="instructionMode === 'manual' ? 0 : -1"
          @click="selectInstructionMode('manual')"
          @keydown="handleInstructionTabKeydown"
        >
          Write Instructions
        </button>
        <button
          :id="uploadTabId"
          type="button"
          role="tab"
          data-instruction-mode="upload"
          :aria-selected="instructionMode === 'upload'"
          :aria-controls="uploadPanelId"
          :tabindex="instructionMode === 'upload' ? 0 : -1"
          @click="selectInstructionMode('upload')"
          @keydown="handleInstructionTabKeydown"
        >
          Upload Markdown
        </button>
      </div>

      <div
        v-if="instructionMode === 'manual'"
        :id="manualPanelId"
        class="follow-up-instruction-panel"
        role="tabpanel"
        :aria-labelledby="manualTabId"
      >
        <label class="follow-up-editor-field">
          <span class="sr-only">Markdown instructions</span>
          <textarea
            v-model="manualInstructions"
            name="followUpInstructions"
            rows="8"
            required
            aria-label="Markdown instructions"
            placeholder="Describe the work the agent should complete."
          />
        </label>
        <small>Write the complete instructions using Markdown.</small>
      </div>

      <div
        v-else
        :id="uploadPanelId"
        class="follow-up-instruction-panel"
        role="tabpanel"
        :aria-labelledby="uploadTabId"
      >
        <p>Choose a Markdown file containing the complete instructions.</p>
        <div class="follow-up-file-row">
          <label class="follow-up-file-picker">
            <input
              ref="fileInput"
              type="file"
              name="followUpFile"
              accept=".md,text/markdown"
              @change="handleInstructionFile"
            />
            <span>
              <i class="codicon codicon-cloud-upload" aria-hidden="true" />
              Choose Markdown File
            </span>
          </label>
          <div v-if="uploadedFileName" class="follow-up-uploaded-file">
            <code :title="uploadedFileName">{{ uploadedFileName }}</code>
            <button
              type="button"
              aria-label="Remove uploaded Markdown file"
              @click="removeInstructionFile"
            >
              <i class="codicon codicon-close" aria-hidden="true" />
            </button>
          </div>
        </div>
        <p v-if="uploadError" class="follow-up-upload-error" role="alert">
          {{ uploadError }}
        </p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.follow-up-editor,
.follow-up-editor-field {
  display: flex;
  flex-direction: column;
}

.follow-up-editor {
  gap: var(--vscode-spacing-size120);
}

.follow-up-editor-field {
  gap: var(--vscode-spacing-size40);
  min-width: 0;
}

.follow-up-editor-field > span {
  color: var(--vscode-foreground);
  font-size: var(--vscode-fontSize-label1);
}

.follow-up-editor input[type='text'],
.follow-up-editor input[type='date'],
.follow-up-editor input[type='time'],
.follow-up-editor select,
.follow-up-editor textarea {
  width: 100%;
  padding: var(--vscode-spacing-size60) var(--vscode-spacing-size80);
  color: var(--vscode-input-foreground);
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-small);
  outline: none;
}

.follow-up-editor textarea {
  min-height: 140px;
  resize: vertical;
  font-family: var(--vscode-editor-font-family, monospace);
  line-height: 1.45;
}

.follow-up-editor input:focus-visible,
.follow-up-editor select:focus-visible,
.follow-up-editor textarea:focus-visible,
.follow-up-trigger-types label:has(input:focus-visible),
.follow-up-instruction-tabs button:focus-visible,
.follow-up-file-picker:has(input:focus-visible),
.follow-up-uploaded-file button:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.follow-up-trigger {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size80);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.follow-up-trigger legend,
.follow-up-instruction-input h3 {
  margin: 0;
  padding: 0;
  font-size: var(--vscode-fontSize-heading3);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.follow-up-trigger > p,
.follow-up-instruction-panel > p,
.follow-up-instruction-panel small {
  margin: 0;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
  line-height: 1.45;
}

.follow-up-trigger-types {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--vscode-spacing-size80);
}

.follow-up-trigger-types label {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--vscode-spacing-size80);
  padding: var(--vscode-spacing-size100);
  background: transparent;
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-medium);
  cursor: pointer;
}

.follow-up-trigger-types label.selected {
  background: var(--vscode-list-activeSelectionBackground);
  border-color: var(--vscode-focusBorder);
}

.follow-up-trigger-types input {
  position: absolute;
  width: var(--vscode-strokeThickness);
  height: var(--vscode-strokeThickness);
  opacity: 0;
  pointer-events: none;
}

.follow-up-trigger-types > label > .codicon {
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-descriptionForeground);
}

.follow-up-trigger-types label.selected > .codicon {
  color: var(--vscode-textLink-foreground);
}

.follow-up-trigger-types label > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size20);
}

.follow-up-trigger-types strong {
  font-weight: var(--vscode-fontWeight-semiBold);
}

.follow-up-trigger-types label > span > span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
  line-height: 1.4;
}

.follow-up-trigger-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--vscode-spacing-size80);
  padding: var(--vscode-spacing-size100);
  background: var(--vscode-input-background);
  border-radius: var(--vscode-cornerRadius-medium);
}

.follow-up-trigger-fields[data-trigger-fields='time'] > label:last-child {
  grid-column: 1 / -1;
}

.follow-up-instruction-input {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size60);
}

.follow-up-instruction-tabs {
  display: flex;
  align-items: center;
  align-self: flex-start;
  gap: var(--vscode-spacing-size80);
}

.follow-up-instruction-tabs button {
  min-height: var(--vscode-spacing-size280);
  padding: 0 var(--vscode-spacing-size40);
  color: var(--vscode-descriptionForeground);
  background: transparent;
  border: 0;
  border-bottom: var(--vscode-strokeThickness) solid transparent;
  border-radius: 0;
  cursor: pointer;
}

.follow-up-instruction-tabs button:hover {
  color: var(--vscode-foreground);
}

.follow-up-instruction-tabs button[aria-selected='true'] {
  color: var(--vscode-foreground);
  border-bottom-color: var(--vscode-focusBorder);
}

.follow-up-instruction-panel {
  min-width: 0;
}

.follow-up-instruction-panel > p {
  margin-bottom: var(--vscode-spacing-size80);
}

.follow-up-file-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--vscode-spacing-size80);
  min-width: 0;
}

.follow-up-file-picker {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  border-radius: var(--vscode-cornerRadius-small);
  cursor: pointer;
}

.follow-up-file-picker input {
  position: absolute;
  width: var(--vscode-strokeThickness);
  height: var(--vscode-strokeThickness);
  opacity: 0;
  pointer-events: none;
}

.follow-up-file-picker > span {
  display: inline-flex;
  align-items: center;
  gap: var(--vscode-spacing-size40);
  min-height: var(--vscode-spacing-size240);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-button-border);
  border-radius: var(--vscode-cornerRadius-small);
}

.follow-up-file-picker:hover > span {
  background: var(--vscode-button-hoverBackground);
}

.follow-up-uploaded-file {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  gap: var(--vscode-spacing-size40);
  min-width: 0;
  color: var(--vscode-foreground);
}

.follow-up-uploaded-file code {
  min-width: 0;
  color: var(--vscode-textPreformat-foreground);
  font-size: var(--vscode-fontSize-body2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.follow-up-uploaded-file button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--vscode-spacing-size240);
  height: var(--vscode-spacing-size240);
  padding: 0;
  color: var(--vscode-icon-foreground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
  cursor: pointer;
}

.follow-up-uploaded-file button:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.follow-up-upload-error {
  margin-top: var(--vscode-spacing-size80);
  color: var(--vscode-errorForeground);
}

@media (max-width: 560px) {
  .follow-up-trigger-types,
  .follow-up-trigger-fields {
    grid-template-columns: minmax(0, 1fr);
  }

  .follow-up-trigger-fields[data-trigger-fields='time'] > label:last-child {
    grid-column: auto;
  }
}
</style>
