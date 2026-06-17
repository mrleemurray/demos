<script setup>
import { ref, computed } from 'vue'
import '@vscode/codicons/dist/codicon.css'
import UnifiedSettingControl from './UnifiedSettingControl.vue'

defineProps({
  variant: {
    type: String,
    default: 'original',
  },
})

const message = ref('')
const textarea = ref(null)
const isFocused = ref(false)

// Configuration state owned by the chat input, mutated by the unified control.
const config = ref({
  mode: 'agent',
  model: 'opus',
  effort: 'high',
  context: '200k',
})

const isEmpty = computed(() => message.value.trim() === '')

const handleInput = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

const handleSend = () => {
  if (isEmpty.value) {
    return
  }
  console.log('Sending message:', message.value)
  console.log('Config:', JSON.parse(JSON.stringify(config.value)))
  message.value = ''
  handleInput()
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="chat-input-wrapper" :class="{ focused: isFocused }">
    <div class="input-row">
      <textarea
        ref="textarea"
        v-model="message"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="isFocused = true"
        @blur="isFocused = false"
        placeholder="Describe what to build"
        rows="1"
        class="chat-textarea"
      ></textarea>
    </div>

    <div class="footer-row">
      <!-- The + button attaches context; it is NOT part of the menu system. -->
      <button class="add-button" title="Add Context...">
        <i class="codicon codicon-add"></i>
      </button>
      <div class="footer-sep" aria-hidden="true"></div>

      <UnifiedSettingControl v-model="config" :variant="variant" />

      <div class="footer-spacer"></div>

      <div class="action-buttons">
        <button class="mic-button" title="Dictate">
          <i class="codicon codicon-mic"></i>
        </button>
        <button
          class="send-button"
          :class="{ disabled: isEmpty }"
          @click="handleSend"
          :disabled="isEmpty"
          title="Send"
        >
          <i class="codicon codicon-newline"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 600px;
  max-width: 100%;
  padding: 6px;
  background: var(--vscode-input-background, #2b2b2b);
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  border-radius: 6px;
}

.chat-input-wrapper.focused {
  border-color: var(--vscode-focusBorder, #007fd4);
}

.input-row {
  padding: 2px 4px 6px;
}

.chat-textarea {
  width: 100%;
  min-height: 36px;
  max-height: 200px;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vscode-input-foreground, #cccccc);
  font-size: 13px;
  font-family: inherit;
  line-height: 1.5;
}

.chat-textarea::placeholder {
  color: var(--vscode-input-placeholderForeground, #989898);
}

.footer-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--vscode-foreground, #cccccc);
  cursor: pointer;
}

.add-button:hover {
  background: var(--vscode-toolbar-hoverBackground, #ffffff14);
}

.add-button .codicon {
  font-size: 16px;
}

.footer-sep {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: var(--vscode-input-border, #3c3c3c);
  opacity: 0.8;
}

.footer-spacer {
  flex: 1;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--vscode-foreground, #cccccc);
  cursor: pointer;
}

.mic-button:hover {
  background: var(--vscode-toolbar-hoverBackground, #ffffff14);
}

.mic-button .codicon {
  font-size: 16px;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--vscode-button-background, #0e639c);
  color: var(--vscode-button-foreground, #ffffff);
  cursor: pointer;
}

.send-button:hover {
  background: var(--vscode-button-hoverBackground, #1177bb);
}

.send-button.disabled {
  opacity: 0.4;
  cursor: default;
  background: var(--vscode-button-secondaryBackground, #3a3d41);
}

.send-button .codicon {
  font-size: 16px;
}
</style>
