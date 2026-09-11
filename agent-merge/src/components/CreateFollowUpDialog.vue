<script setup>
import { nextTick, onMounted, ref, useId } from 'vue'
import FollowUpEditor from './FollowUpEditor.vue'

defineProps({
  template: {
    type: Object,
    required: true,
  },
  scenario: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['cancel', 'create'])
const dialog = ref()
const editor = ref()
const editorIsValid = ref(false)
const titleId = `create-follow-up-title-${useId()}`
const descriptionId = `create-follow-up-description-${useId()}`

onMounted(async () => {
  await nextTick()
  editor.value?.focus()
})

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
  ).filter(element => element.offsetParent !== null)
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

function submit() {
  if (!editorIsValid.value) {
    return
  }
  emit('create', editor.value.getDraft())
}
</script>

<template>
  <div
    class="create-follow-up-dialog-backdrop"
    @mousedown.self="emit('cancel')"
  >
    <section
      ref="dialog"
      class="create-follow-up-dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
      @keydown="handleKeydown"
    >
      <header>
        <div>
          <span class="create-follow-up-eyebrow">
            <i class="codicon codicon-clock" aria-hidden="true" />
            Follow up
          </span>
          <h2 :id="titleId">Create Follow Up</h2>
          <p :id="descriptionId">
            Schedule a future job for pull request
            #{{ scenario.pullRequestNumber }}.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close Create Follow Up"
          @click="emit('cancel')"
        >
          <i class="codicon codicon-close" aria-hidden="true" />
        </button>
      </header>

      <form @submit.prevent="submit">
        <div class="create-follow-up-dialog-body">
          <FollowUpEditor
            ref="editor"
            :template="template"
            @update:valid="editorIsValid = $event"
          />
        </div>

        <footer>
          <button
            class="secondary-button"
            type="button"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            class="primary-button"
            type="submit"
            :disabled="!editorIsValid"
          >
            Create Follow Up
          </button>
        </footer>
      </form>
    </section>
  </div>
</template>

<style scoped>
.create-follow-up-dialog-backdrop {
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

.create-follow-up-dialog {
  display: flex;
  flex-direction: column;
  width: min(680px, 92vw);
  max-height: min(820px, 92vh);
  color: var(--vscode-foreground);
  background: var(--vscode-editor-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-window-border);
  border-radius: var(--vscode-cornerRadius-large);
  box-shadow: 0 var(--vscode-spacing-size80) var(--vscode-spacing-size320)
    var(--vscode-widget-shadow);
  overflow: hidden;
}

.create-follow-up-dialog > header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--vscode-spacing-size160);
  padding: var(--vscode-spacing-size160);
}

.create-follow-up-dialog > header > div {
  min-width: 0;
}

.create-follow-up-dialog h2 {
  margin: var(--vscode-spacing-size60) 0 var(--vscode-spacing-size40);
  font-size: var(--vscode-fontSize-heading2);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.create-follow-up-dialog header p {
  margin: 0;
  color: var(--vscode-descriptionForeground);
  line-height: 1.45;
}

.create-follow-up-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--vscode-spacing-size40);
  color: var(--vscode-textLink-foreground);
  font-size: var(--vscode-fontSize-label1);
}

.create-follow-up-dialog header button {
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

.create-follow-up-dialog header button:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.create-follow-up-dialog form {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.create-follow-up-dialog-body {
  min-height: 0;
  padding: 0 var(--vscode-spacing-size160) var(--vscode-spacing-size160);
  overflow: auto;
}

.create-follow-up-dialog header button:focus-visible,
.create-follow-up-dialog footer button:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.create-follow-up-dialog footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--vscode-spacing-size80);
  padding: var(--vscode-spacing-size120) var(--vscode-spacing-size160);
  border-top: var(--vscode-strokeThickness) solid
    var(--vscode-sideBarSectionHeader-border);
}

.create-follow-up-dialog footer button {
  min-height: var(--prototype-button-height);
  padding: 0 var(--vscode-spacing-size120);
  border-radius: var(--vscode-cornerRadius-small);
  cursor: pointer;
}

.create-follow-up-dialog .secondary-button {
  color: var(--vscode-foreground);
  background: var(--vscode-button-secondaryBackground);
  border: var(--vscode-strokeThickness) solid
    var(--vscode-button-secondaryBorder);
}

.create-follow-up-dialog .secondary-button:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

.create-follow-up-dialog .primary-button {
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-button-border);
}

.create-follow-up-dialog .primary-button:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
}

.create-follow-up-dialog .primary-button:disabled {
  cursor: default;
  opacity: 0.5;
}

@media (max-width: 560px) {
  .create-follow-up-dialog-backdrop {
    align-items: stretch;
    padding: var(--vscode-spacing-size80);
  }

  .create-follow-up-dialog {
    width: 100%;
    max-height: 100%;
  }
}
</style>
