<script setup>
import { nextTick, onMounted, ref, useId } from 'vue'
import { serializeFollowUp } from '../model/followUps.js'

const props = defineProps({
  followUp: {
    type: Object,
    required: true,
  },
  scenario: {
    type: Object,
    required: true,
  },
  pullRequestDetails: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])
const dialog = ref()
const titleId = `follow-up-title-${useId()}`
const descriptionId = `follow-up-description-${useId()}`
const instructionsId = `follow-up-instructions-${useId()}`

onMounted(async () => {
  await nextTick()
  dialog.value?.focus()
})

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }
  if (event.key !== 'Tab') {
    return
  }

  const focusable = Array.from(
    dialog.value.querySelectorAll(
      'button:not([disabled]), summary, a[href], [tabindex]:not([tabindex="-1"])',
    ),
  )
  const first = focusable[0]
  const last = focusable.at(-1)
  if (document.activeElement === dialog.value) {
    event.preventDefault()
    const nextFocus = event.shiftKey ? last : first
    nextFocus?.focus()
    return
  }
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
  <div class="follow-up-dialog-backdrop" @mousedown.self="emit('close')">
    <section
      ref="dialog"
      class="follow-up-dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <header>
        <div>
          <span class="follow-up-status">
            <i class="codicon codicon-clock" aria-hidden="true" />
            {{ followUp.statusLabel }}
          </span>
          <h2 :id="titleId">{{ followUp.name }}</h2>
          <p :id="descriptionId">{{ followUp.description }}</p>
        </div>
        <button
          type="button"
          aria-label="Close follow up details"
          @click="emit('close')"
        >
          <i class="codicon codicon-close" aria-hidden="true" />
        </button>
      </header>

      <div class="follow-up-dialog-body">
        <a
          class="follow-up-pull-request"
          :href="scenario.pullRequestUrl"
          target="_blank"
          rel="noreferrer"
          :aria-label="`Open pull request #${scenario.pullRequestNumber}: ${pullRequestDetails.title}`"
        >
          <i class="codicon codicon-git-pull-request" aria-hidden="true" />
          <span>
            <strong>
              #{{ scenario.pullRequestNumber }} {{ pullRequestDetails.title }}
            </strong>
            <span>
              {{ pullRequestDetails.baseBranch }} ← {{ scenario.branch }}
            </span>
          </span>
          <i class="codicon codicon-link-external" aria-hidden="true" />
        </a>

        <dl class="follow-up-definition">
          <div>
            <dt>Trigger</dt>
            <dd>
              <strong>
                {{
                  followUp.triggerType === 'time'
                    ? 'Time based'
                    : 'Event based'
                }}
              </strong>
              <span v-if="followUp.triggerType === 'event'">
                {{ followUp.sourceLabel }} · {{ followUp.event }}
              </span>
              <span v-else>Run at a specific date and time</span>
            </dd>
          </div>
          <div>
            <dt>
              {{
                followUp.triggerType === 'time'
                  ? 'Scheduled for'
                  : 'Run after'
              }}
            </dt>
            <dd>
              <strong>{{ followUp.timingLabel }}</strong>
              <span v-if="followUp.triggerType === 'event'">
                {{ followUp.delay }}
              </span>
              <span v-else>
                {{
                  followUp.timeZone === 'local'
                    ? 'Local time'
                    : followUp.timeZone
                }}
              </span>
            </dd>
          </div>
          <div>
            <dt>Instruction file</dt>
            <dd>
              <code>{{ followUp.path }}</code>
            </dd>
          </div>
        </dl>

        <section class="follow-up-instructions" :aria-labelledby="instructionsId">
          <div class="follow-up-instructions-heading">
            <h3 :id="instructionsId">Instructions</h3>
            <span v-if="followUp.uploadedFileName">
              Uploaded from {{ followUp.uploadedFileName }}
            </span>
          </div>
          <pre><code>{{ followUp.instructions }}</code></pre>
        </section>

        <details class="follow-up-markdown">
          <summary>View Markdown source</summary>
          <pre tabindex="0" aria-label="Follow up Markdown source"><code>{{ serializeFollowUp(followUp) }}</code></pre>
        </details>
      </div>

      <footer>
        <button class="secondary-button" type="button" @click="emit('close')">
          Done
        </button>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.follow-up-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--vscode-spacing-size200);
  background: color-mix(
    in srgb,
    var(--vscode-editor-background) 72%,
    transparent
  );
}

.follow-up-dialog {
  display: flex;
  flex-direction: column;
  width: min(620px, 92vw);
  max-height: min(760px, 88vh);
  color: var(--vscode-foreground);
  background: var(--vscode-editor-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-window-border);
  border-radius: var(--vscode-cornerRadius-large);
  box-shadow: 0 var(--vscode-spacing-size80) var(--vscode-spacing-size320)
    var(--vscode-widget-shadow);
  overflow: hidden;
}

.follow-up-dialog:focus {
  outline: none;
}

.follow-up-dialog > header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--vscode-spacing-size160);
  padding: var(--vscode-spacing-size160);
}

.follow-up-dialog > header > div {
  min-width: 0;
}

.follow-up-dialog h2 {
  margin: var(--vscode-spacing-size60) 0 var(--vscode-spacing-size40);
  font-size: var(--vscode-fontSize-heading2);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.follow-up-dialog header p {
  margin: 0;
  color: var(--vscode-descriptionForeground);
  line-height: 1.45;
}

.follow-up-dialog header button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--vscode-spacing-size280);
  height: var(--vscode-spacing-size280);
  padding: 0;
  color: var(--vscode-icon-foreground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
  cursor: pointer;
}

.follow-up-dialog header button:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.follow-up-dialog header button:focus-visible,
.follow-up-dialog summary:focus-visible,
.follow-up-dialog footer button:focus-visible,
.follow-up-pull-request:focus-visible,
.follow-up-markdown pre:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.follow-up-status {
  display: inline-flex;
  align-items: center;
  gap: var(--vscode-spacing-size40);
  color: var(--vscode-textLink-foreground);
  font-size: var(--vscode-fontSize-label1);
}

.follow-up-dialog-body {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size160);
  min-height: 0;
  padding: 0 var(--vscode-spacing-size160) var(--vscode-spacing-size160);
  overflow: auto;
}

.follow-up-pull-request {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--vscode-spacing-size80);
  padding: var(--vscode-spacing-size120);
  color: inherit;
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-medium);
  text-decoration: none;
}

.follow-up-pull-request:hover {
  background: var(--vscode-list-hoverBackground);
}

.follow-up-pull-request > .codicon {
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-descriptionForeground);
}

.follow-up-pull-request > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size20);
}

.follow-up-pull-request strong,
.follow-up-pull-request span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.follow-up-pull-request span span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.follow-up-definition {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--vscode-spacing-size80);
  margin: 0;
}

.follow-up-definition > div {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size40);
  padding: var(--vscode-spacing-size120);
  background: var(--vscode-input-background);
  border-radius: var(--vscode-cornerRadius-medium);
}

.follow-up-definition > div:last-child {
  grid-column: 1 / -1;
}

.follow-up-definition dt {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.follow-up-definition dd {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size20);
  margin: 0;
}

.follow-up-definition dd span,
.follow-up-definition code {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
  overflow-wrap: anywhere;
}

.follow-up-instructions-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--vscode-spacing-size80);
  margin-bottom: var(--vscode-spacing-size80);
}

.follow-up-instructions h3 {
  margin: 0;
  font-size: var(--vscode-fontSize-heading3);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.follow-up-instructions-heading span {
  min-width: 0;
  overflow: hidden;
  color: var(--vscode-descriptionForeground);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vscode-fontSize-body2);
}

.follow-up-instructions pre {
  margin: 0;
  padding: var(--vscode-spacing-size120);
  color: var(--vscode-foreground);
  background: var(--vscode-input-background);
  border-radius: var(--vscode-cornerRadius-medium);
  font-family: var(--vscode-editor-font-family, monospace);
  font-size: var(--vscode-fontSize-body2);
  line-height: 1.45;
  overflow: auto;
  white-space: pre-wrap;
}

.follow-up-markdown {
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-medium);
  overflow: hidden;
}

.follow-up-markdown summary {
  padding: var(--vscode-spacing-size100) var(--vscode-spacing-size120);
  cursor: pointer;
}

.follow-up-markdown pre {
  max-height: 260px;
  margin: 0;
  padding: var(--vscode-spacing-size120);
  color: var(--vscode-textPreformat-foreground);
  background: var(--vscode-textCodeBlock-background);
  font-size: var(--vscode-fontSize-body2);
  line-height: 1.45;
  overflow: auto;
  white-space: pre-wrap;
}

.follow-up-dialog > footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--vscode-spacing-size120) var(--vscode-spacing-size160);
  border-top: var(--vscode-strokeThickness) solid
    var(--vscode-sideBarSectionHeader-border);
}

.follow-up-dialog footer button {
  min-width: 84px;
  min-height: var(--prototype-button-height);
  padding: 0 var(--vscode-spacing-size120);
  color: var(--vscode-foreground);
  background: var(--vscode-button-secondaryBackground);
  border: var(--vscode-strokeThickness) solid
    var(--vscode-button-secondaryBorder);
  border-radius: var(--vscode-cornerRadius-small);
  cursor: pointer;
}

.follow-up-dialog footer button:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

@media (max-width: 560px) {
  .follow-up-dialog-backdrop {
    align-items: stretch;
    padding: var(--vscode-spacing-size80);
  }

  .follow-up-dialog {
    width: 100%;
    max-height: 100%;
  }

  .follow-up-definition {
    grid-template-columns: minmax(0, 1fr);
  }

  .follow-up-definition > div:last-child {
    grid-column: auto;
  }
}
</style>
