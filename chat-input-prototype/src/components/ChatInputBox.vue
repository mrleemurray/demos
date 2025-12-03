<script setup>
import { ref, computed } from 'vue'
import '@vscode/codicons/dist/codicon.css'
import CustomDropdown from './CustomDropdown.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  chatMode: {
    type: String,
    default: 'ask'
  },
  selectedModel: {
    type: String,
    default: 'claude'
  },
  attachedFiles: {
    type: Array,
    default: () => []
  },
  pendingContext: {
    type: Number,
    default: 0
  },
  placeholder: {
    type: String,
    default: 'Describe what to build next'
  },
  contextUsagePercent: {
    type: Number,
    default: 0
  },
  progressBarColor: {
    type: String,
    default: '#cccccc'
  },
  totalTokensUsed: {
    type: Number,
    default: 0
  },
  contextLimit: {
    type: Number,
    default: 64
  },
  systemPromptTokens: {
    type: Number,
    default: 0
  },
  systemToolsTokens: {
    type: Number,
    default: 0
  },
  mcpToolsTokens: {
    type: Number,
    default: 0
  },
  messagesTextTokens: {
    type: Number,
    default: 0
  },
  messagesFilesTokens: {
    type: Number,
    default: 0
  },
  tooltipBackground: {
    type: String,
    default: '#2d2d30'
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:chatMode',
  'update:selectedModel',
  'send',
  'attach',
  'removeFile',
  'resetSession'
])

const textarea = ref(null)
const isFocused = ref(false)
const isContextHovered = ref(false)
const isTooltipOpen = ref(false)

const message = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentChatMode = computed({
  get: () => props.chatMode,
  set: (value) => emit('update:chatMode', value)
})

const currentModel = computed({
  get: () => props.selectedModel,
  set: (value) => emit('update:selectedModel', value)
})

const isEmpty = computed(() => message.value.trim() === '')

const chatModes = [
  { value: 'ask', label: 'Ask' },
  { value: 'agent', label: 'Agent' },
  { value: 'plan', label: 'Plan' },
  { value: 'edit', label: 'Edit' }
]

const models = [
  { value: 'gpt', label: 'GPT-4', contextLimit: 32, costMultiplier: 1.5 },
  { value: 'claude', label: 'Claude Sonnet 4.5', contextLimit: 64, costMultiplier: 1 },
  { value: 'gemini', label: 'Gemini', contextLimit: 128, costMultiplier: 0.3 },
  { value: 'llama', label: 'Llama', contextLimit: 256, costMultiplier: 0.1 }
]

const handleInput = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

const handleSend = () => {
  if (!isEmpty.value) {
    emit('send')
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const handleAttachment = () => {
  emit('attach')
}

const removeFile = (index) => {
  emit('removeFile', index)
}

const toggleTooltip = () => {
  isTooltipOpen.value = !isTooltipOpen.value
  isContextHovered.value = isTooltipOpen.value
}

const handleClickOutside = (event) => {
  const progressArea = event.target.closest('.progress-ring-wrapper')
  const tooltipArea = event.target.closest('.context-tooltip')
  if (!progressArea && !tooltipArea && isTooltipOpen.value) {
    isTooltipOpen.value = false
    isContextHovered.value = false
  }
}

const resetSession = () => {
  emit('resetSession')
}
</script>

<template>
  <div class="chat-input-wrapper" :class="{ focused: isFocused }" @click="handleClickOutside">
    <div class="attachment-row">
      <div class="attachments-section">
        <button class="attachment-button" @click="handleAttachment" title="Attach files">
          <i class="codicon codicon-attach"></i>
          <span v-if="attachedFiles.length === 0" class="attachment-text">Add Context...</span>
        </button>
        
        <div v-for="(file, index) in attachedFiles" :key="index" class="file-chip">
          <i class="codicon codicon-file"></i>
          <span class="file-name">{{ file.name }}</span>
          <button class="remove-file" @click="removeFile(index)" title="Remove">
            <i class="codicon codicon-close"></i>
          </button>
        </div>
      </div>
      
      <div class="context-info-wrapper">
        <div class="progress-ring-wrapper"
          @mouseenter="isContextHovered = true"
          @mouseleave="() => { if (!isTooltipOpen) isContextHovered = false }">
          <svg class="progress-ring" width="20" height="20" viewBox="0 0 20 20" @click.stop="toggleTooltip" style="cursor: pointer;">
            <circle
              class="progress-ring-background"
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke-width="2"
            />
            <circle
              class="progress-ring-progress"
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke-width="2"
              :stroke="progressBarColor"
              :stroke-dasharray="50.27"
              :stroke-dashoffset="50.27 - (50.27 * Math.min(contextUsagePercent, 100)) / 100"
              transform="rotate(-90 10 10)"
            />
          </svg>
          
          <div v-if="isContextHovered || isTooltipOpen" class="tooltip-container" @mouseenter="isContextHovered = true" @mouseleave="() => { if (!isTooltipOpen) isContextHovered = false }">
            <div class="context-tooltip" :style="{ background: tooltipBackground }" @click.stop>
            <div class="progress-bar" :style="{ background: progressBarColor + '4D' }">
              <div class="progress-fill" :style="{ width: contextUsagePercent + '%', background: progressBarColor }"></div>
            </div>
            <div class="tooltip-title">
              <template v-if="contextUsagePercent >= 100">
                Token limit reached
              </template>
              <template v-else-if="contextUsagePercent > 50">
                Nearing input token limit
              </template>
            </div>
            <div class="tooltip-breakdown">
              <div class="breakdown-row">
                <span class="breakdown-label">Total usage</span>
                <span class="breakdown-value">{{ totalTokensUsed.toFixed(1) }}k / {{ contextLimit }}k • {{ Math.round(contextUsagePercent) }}%</span>
              </div>
              <div class="breakdown-separator"></div>
              <div class="breakdown-row">
                <span class="breakdown-label">System prompt</span>
                <span class="breakdown-value">{{ Math.round((systemPromptTokens / contextLimit) * 100) }}%</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">System tools</span>
                <span class="breakdown-value">{{ Math.round((systemToolsTokens / contextLimit) * 100) }}%</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">MCP tools</span>
                <span class="breakdown-value">{{ Math.round((mcpToolsTokens / contextLimit) * 100) }}%</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">Attached files</span>
                <span class="breakdown-value">{{ Math.round((messagesTextTokens / contextLimit) * 100) }}%</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">Messages</span>
                <span class="breakdown-value">{{ Math.round((messagesFilesTokens / contextLimit) * 100) }}%</span>
              </div>
            </div>
            <div class="tooltip-subtitle">
              <template v-if="contextUsagePercent >= 100">
                <a @click="resetSession" style="cursor: pointer;">Start a new session</a> to continue.
              </template>
              <template v-else-if="contextUsagePercent > 50">
                <a @click="resetSession" style="cursor: pointer;">Start a new session</a> to increase limit.
              </template>
              <template v-else>
                Adding files and large requests will consume more tokens.
              </template>
            </div>
            <div class="tooltip-arrow" :style="{ borderTopColor: tooltipBackground }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="input-row">
      <textarea
        ref="textarea"
        v-model="message"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="isFocused = true; if (message === '') message = 'Add a dark mode toggle to the header'"
        @blur="isFocused = false"
        :placeholder="placeholder"
        rows="1"
        class="chat-textarea"
      ></textarea>
    </div>
    
    <div class="footer-row">
      <div class="dropdowns">
        <CustomDropdown 
          v-model="currentChatMode"
          :options="chatModes"
        />
        
        <CustomDropdown 
          v-model="currentModel"
          :options="models"
        />
      </div>
      
      <div class="action-buttons">
        <button 
          class="forward-button"
          :class="{ disabled: isEmpty }"
          :disabled="isEmpty"
          title="Forward"
        >
          <i class="codicon codicon-forward"></i>
        </button>
        
        <button 
          class="send-button" 
          :class="{ disabled: isEmpty }"
          @click="handleSend"
          :disabled="isEmpty"
          title="Send"
        >
          <i class="codicon codicon-send"></i>
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
  padding: 6px;
  margin: 16px;
  background: var(--vscode-input-background, #3c3c3c);
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  flex-shrink: 0;
  border-radius: 5px;
}

.attachment-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 4px;
}

.attachments-section {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
}

.file-chip {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 3px;
  background: transparent;
  border: 1px solid var(--vscode-input-border, #FFFFFF22);
  border-radius: 5px;
  font-size: 11px;
  height: 16px;
  color: var(--vscode-input-foreground, #cccccc);
  cursor: default;
  user-select: none;
}

.file-chip:hover {
  background: var(--vscode-toolbar-hoverBackground, #505050);
}

.file-chip .codicon-file {
  font-size: 16px;
}

.file-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  border-radius: 2px;
}

.remove-file:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

.remove-file .codicon {
  font-size: 12px;
}

.context-info-wrapper {
  position: relative;
  margin-left: auto;
  flex-shrink: 0;
  align-self: flex-start;
  min-width: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-ring-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.progress-ring {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.progress-ring-background {
  stroke: var(--vscode-input-border, #ffffff22);
}

.progress-ring-progress {
  transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
}

.tooltip-container {
  position: absolute;
  bottom: 100%;
  right: 0px;
  bottom: 20px;
  padding-bottom: 16px;
  z-index: 1000;
}

.context-tooltip {
  width: 325px;
  padding: 8px;
  background: var(--vscode-editorHoverWidget-background, #2d2d30);
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: none;
}

.tooltip-arrow {
  position: absolute;
  bottom: 10px;
  right: 4px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid;
  border-top-color: inherit;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.progress-bar {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease, background 0.3s ease;
}

.tooltip-title {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-foreground, #cccccc);
  margin-bottom: 8px;
  line-height: 1.4;
  text-align: left;
}

.tooltip-breakdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.breakdown-label {
  color: var(--vscode-descriptionForeground, #999999);
}

.breakdown-value {
  color: var(--vscode-foreground, #cccccc);
  font-variant-numeric: tabular-nums;
}

.breakdown-separator {
  height: 1px;
  background: var(--vscode-input-border, #3c3c3c);
  margin: 4px 0;
}

.tooltip-subtitle {
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-descriptionForeground, #999999);
  line-height: 1.4;
  text-align: left;
}

.context-info {
  font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-descriptionForeground, #999999);
  cursor: default;
  text-align: right;
  line-height: 13px;
}

.pending-context {
  font-style: italic;
  opacity: 0.8;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.attachment-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: auto;
  padding: 2px 3px;
  border: 1px solid var(--vscode-input-border, #FFFFFF22);
  border-radius: 5px;
  background: transparent;
  color: var(--vscode-input-foreground, #cccccc);
  cursor: pointer;
}

.attachment-text {
  font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.forward-button,
.send-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--vscode-input-foreground, #cccccc);
  cursor: pointer;
}

.attachment-button:hover,
.forward-button:hover,
.send-button:hover:not(.disabled) {
  background: var(--vscode-toolbar-hoverBackground, #505050);
}

.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
}

.send-button.disabled,
.forward-button.disabled {
  opacity: 0.4;
}

.chat-textarea {
  flex: 1;
  height: 24px !important;
  min-height: 24px;
  max-height: 200px;
  padding: 4px 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vscode-input-foreground, #cccccc);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 13px;
  line-height: 20px;
  resize: none;
  overflow-y: auto;
}

.chat-textarea::placeholder {
  color: var(--vscode-input-placeholderForeground, #999999);
}

.chat-textarea::-webkit-scrollbar {
  width: 10px;
}

.chat-textarea::-webkit-scrollbar-track {
  background: transparent;
}

.chat-textarea::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background, #4e4e4e);
  border-radius: 5px;
}

.chat-textarea::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground, #5a5a5a);
}

.dropdowns {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Light theme */
@media (prefers-color-scheme: light) {
  .chat-input-wrapper {
    background: #ffffff;
    border-color: #d0d0d0;
  }
  
  .chat-input-wrapper.focused {
    border-color: #007acc;
  }
  
  .attachment-button {
    color: #424242;
    border-color: #d0d0d0;
  }
  
  .file-chip {
    color: #424242;
    border-color: #d0d0d0;
  }
  
  .file-chip:hover {
    background: #e8e8e8;
  }
  
  .forward-button,
  .send-button {
    color: #424242;
  }
  
  .attachment-button:hover,
  .forward-button:hover {
    background: #e8e8e8;
  }
  
  .chat-textarea {
    color: #424242;
  }
  
  .chat-textarea::placeholder {
    color: #8a8a8a;
  }

  
}
a {
  color: #4daafc;
}
</style>
