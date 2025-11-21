<script setup>
import { ref, computed, nextTick } from 'vue'
import '@vscode/codicons/dist/codicon.css'
import CustomDropdown from './CustomDropdown.vue'

const message = ref('')
const textarea = ref(null)
const isFocused = ref(false)
const chatMode = ref('ask')
const selectedModel = ref('claude')
const contextUsed = ref(12.3)
const isContextHovered = ref(false)
const pendingContext = ref(0)
const attachedFiles = ref([])
const animationStyle = ref('instant')
const displayedContext = ref(12.3)
const floatingNumbers = ref([])
const spinnerDigits = ref([])
const isSpinning = ref(false)
const isStreaming = ref(false)
const streamedText = ref('')
const chatHistory = ref([])

let animationFrame = null

const isEmpty = computed(() => message.value.trim() === '')

const contextUsagePercent = computed(() => {
  return (contextUsed.value / contextLimit.value) * 100
})

const contextUsedColor = computed(() => {
  if (!isContextHovered.value) return ''
  const percent = contextUsagePercent.value
  if (percent > 90) return '#f48771'
  if (percent > 50) return '#cca700'
  return ''
})

const progressBarColor = computed(() => {
  const percent = contextUsagePercent.value
  if (percent > 90) return '#f48771'
  if (percent > 50) return '#cca700'
  return '#0e70c0'
})

const tooltipBackground = computed(() => {
  const percent = contextUsagePercent.value
  if (percent > 50) {
    const color = percent > 90 ? '#f48771' : '#cca700'
    return `color-mix(in srgb, ${color} 10%, #2d2d30)`
  }
  return '#2d2d30'
})

const chatModes = [
  { value: 'ask', label: 'Ask' },
  { value: 'agent', label: 'Agent' },
  { value: 'plan', label: 'Plan' },
  { value: 'edit', label: 'Edit' }
]
const models = [
  { value: 'gpt', label: 'GPT-4', contextLimit: 32 },
  { value: 'claude', label: 'Claude Sonnet 4.5', contextLimit: 64 },
  { value: 'gemini', label: 'Gemini', contextLimit: 128 },
  { value: 'llama', label: 'Llama', contextLimit: 256 }
]

const contextLimit = computed(() => {
  const model = models.find(m => m.value === selectedModel.value)
  return model ? model.contextLimit : 64
})

const handleInput = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

const animateContextIncrease = (amount) => {
  if (animationStyle.value === 'instant') {
    displayedContext.value = contextUsed.value
  } else if (animationStyle.value === 'counter') {
    const start = displayedContext.value
    const end = contextUsed.value
    const duration = 800
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuad = 1 - (1 - progress) * (1 - progress)
      
      displayedContext.value = start + (end - start) * easeOutQuad
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        displayedContext.value = end
      }
    }
    
    if (animationFrame) cancelAnimationFrame(animationFrame)
    animate()
  } else if (animationStyle.value === 'spinner') {
    const start = displayedContext.value
    const end = contextUsed.value
    const steps = Math.min(Math.ceil(amount * 10), 5) // Max 5 updates
    const duration = 150 // Duration per click in ms (matched to animation duration)
    let currentStep = 0
    
    isSpinning.value = true
    
    const tick = () => {
      const oldValue = displayedContext.value
      currentStep++
      const progress = currentStep / steps
      const newValue = start + (end - start) * progress
      
      displayedContext.value = newValue
      
      // Create rolling effect with old value going up, new coming from bottom
      spinnerDigits.value = [
        { value: oldValue.toFixed(1), position: 'old', key: `old-${currentStep}` },
        { value: newValue.toFixed(1), position: 'new', key: `new-${currentStep}` }
      ]
      
      if (currentStep < steps) {
        animationFrame = setTimeout(tick, duration)
      } else {
        // Clean up after final animation completes
        setTimeout(() => {
          isSpinning.value = false
          spinnerDigits.value = []
          displayedContext.value = end
        }, duration)
      }
    }
    
    if (animationFrame) clearTimeout(animationFrame)
    tick()
  } else if (animationStyle.value === 'rpg') {
    displayedContext.value = contextUsed.value
    floatingNumbers.value.push({
      id: Date.now(),
      value: amount,
      opacity: 1,
      y: 0
    })
    
    setTimeout(() => {
      floatingNumbers.value = floatingNumbers.value.filter(n => n.id !== Date.now())
    }, 1500)
  }
}

const handleSend = () => {
  if (!isEmpty.value) {
    const userMessage = message.value
    console.log('Sending message:', userMessage)
    console.log('Attached files:', attachedFiles.value)
    
    // Add user message to chat history
    chatHistory.value.push({
      id: Date.now(),
      type: 'user',
      text: userMessage
    })
    
    // Add pending context to total
    const addedAmount = pendingContext.value
    contextUsed.value += pendingContext.value
    pendingContext.value = 0
    
    // Animate the increase
    animateContextIncrease(addedAmount)
    
    // Clear message only
    message.value = ''
    
    nextTick(() => {
      if (textarea.value) {
        textarea.value.style.height = 'auto'
      }
    })
    
    // Simulate agent response after sending
    setTimeout(() => {
      simulateAgentResponse()
    }, 500)
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const handleAttachment = () => {
  // Add dummy files with random context amounts
  const dummyFiles = [
    { name: 'App.vue', tokens: 2.5 },
    { name: 'main.js', tokens: 1.2 },
    { name: 'utils.ts', tokens: 3.1 },
    { name: 'config.json', tokens: 0.8 }
  ]
  
  const randomFile = dummyFiles[Math.floor(Math.random() * dummyFiles.length)]
  attachedFiles.value.push(randomFile)
  pendingContext.value += randomFile.tokens
  
  console.log('Attached:', randomFile.name, `(${randomFile.tokens}k)`)
}

const removeFile = (index) => {
  const file = attachedFiles.value[index]
  pendingContext.value -= file.tokens
  attachedFiles.value.splice(index, 1)
  console.log('Removed:', file.name)
}

const simulateAgentResponse = () => {
  isStreaming.value = true
  streamedText.value = ''
  
  // Add agent message placeholder to history
  const agentMessageId = Date.now()
  chatHistory.value.push({
    id: agentMessageId,
    type: 'agent',
    text: '',
    continuationText: '',
    isStreaming: true,
    widgets: []
  })
  
  const fullResponse = "I'll help you build that feature. Let me analyze the codebase first."
  const operations = [
    { delay: 800, label: 'Reading main.js', icon: 'file-code', cost: 0.8 },
    { delay: 1200, label: 'Searching for similar patterns', icon: 'search', cost: 1.2 },
    { delay: 1500, label: 'Analyzing dependencies', icon: 'graph', cost: 0.5 }
  ]
  const finalText = '\n\nNow I can implement the changes you requested.'
  
  let currentIndex = 0
  let operationIndex = 0
  let widgetCompleteCount = 0
  
  const typeText = () => {
    if (currentIndex < fullResponse.length) {
      streamedText.value += fullResponse[currentIndex]
      currentIndex++
      
      // Update agent message in history
      const agentMsg = chatHistory.value.find(m => m.id === agentMessageId)
      if (agentMsg) agentMsg.text = streamedText.value
      
      // Add small cost for streaming response tokens
      if (currentIndex % 10 === 0) {
        const addedAmount = 0.1
        contextUsed.value += addedAmount
        animateContextIncrease(addedAmount)
      }
      
      setTimeout(typeText, 15)
    } else if (operationIndex < operations.length) {
      const operation = operations[operationIndex]
      operationIndex++
      
      setTimeout(() => {
        const agentMsg = chatHistory.value.find(m => m.id === agentMessageId)
        
        // Add widget
        if (agentMsg) {
          agentMsg.widgets = agentMsg.widgets || []
          agentMsg.widgets.push({
            id: Date.now() + operationIndex,
            label: operation.label,
            icon: operation.icon,
            status: 'loading'
          })
        }
        
        // Complete widget after delay
        setTimeout(() => {
          if (agentMsg && agentMsg.widgets) {
            const widget = agentMsg.widgets.find(w => w.label === operation.label)
            if (widget) {
              widget.status = 'complete'
              widgetCompleteCount++
              
              // If all widgets are complete, add final text
              if (widgetCompleteCount === operations.length) {
                setTimeout(() => {
                  let finalIndex = 0
                  const typeFinalText = () => {
                    if (finalIndex < finalText.length) {
                      const char = finalText[finalIndex]
                      finalIndex++
                      if (agentMsg) {
                        agentMsg.continuationText = (agentMsg.continuationText || '') + char
                      }
                      setTimeout(typeFinalText, 15)
                    } else {
                      // Add final cost
                      const addedAmount = 0.3
                      contextUsed.value += addedAmount
                      animateContextIncrease(addedAmount)
                      
                      setTimeout(() => {
                        isStreaming.value = false
                        if (agentMsg) agentMsg.isStreaming = false
                        streamedText.value = ''
                      }, 500)
                    }
                  }
                  typeFinalText()
                }, 300)
              }
            }
          }
        }, 600)
        
        // Add context cost for operation
        const addedAmount = operation.cost
        contextUsed.value += addedAmount
        animateContextIncrease(addedAmount)
        
        typeText()
      }, operation.delay)
    }
  }
  
  typeText()
}
</script>

<template>
  <div class="chat-input-container">
    <div class="chat-history">
      <div v-for="msg in chatHistory" :key="msg.id" class="chat-message" :class="msg.type">
        <div class="message-text">
          {{ msg.text }}
        </div>
        <div v-if="msg.widgets && msg.widgets.length > 0" class="widgets-container">
          <div v-for="widget in msg.widgets" :key="widget.id" class="operation-widget" :class="widget.status">
            <i class="codicon" :class="`codicon-${widget.icon}`"></i>
            <span class="widget-label">{{ widget.label }}</span>
            <div v-if="widget.status === 'loading'" class="widget-spinner">
              <i class="codicon codicon-loading codicon-modifier-spin"></i>
            </div>
            <div v-else class="widget-check">
              <i class="codicon codicon-check"></i>
            </div>
          </div>
        </div>
        <div v-if="msg.continuationText" class="message-text continuation-text">
          {{ msg.continuationText }}
        </div>
      </div>
    </div>
    
    <div class="chat-input-wrapper" :class="{ focused: isFocused }">
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
        
        <div 
          class="context-info-wrapper"
          @mouseenter="isContextHovered = true"
          @mouseleave="isContextHovered = false"
        >
          <div class="context-info">
            <span v-if="pendingContext > 0">(+{{ pendingContext.toFixed(1) }}k) </span>
            <span v-if="!isSpinning" :style="{ color: contextUsedColor }" class="context-value">
              {{ displayedContext.toFixed(1) }}k
              <span v-for="num in floatingNumbers" :key="num.id" class="floating-number">
                +{{ num.value.toFixed(1) }}k
              </span>
            </span>
            <span v-else class="spinner-container">
              <span 
                v-for="digit in spinnerDigits" 
                :key="digit.key"
                class="spinner-digit"
                :class="digit.position"
              >
                {{ digit.value }}k
              </span>
            </span>
            /{{ contextLimit }}k
          </div>
          
          <div v-if="isContextHovered" class="context-tooltip" :style="{ background: tooltipBackground }">
            <div class="progress-bar" :style="{ background: progressBarColor + '4D' }">
              <div class="progress-fill" :style="{ width: contextUsagePercent + '%', background: progressBarColor }"></div>
            </div>
            <div class="tooltip-title">
              Nearing input token limit • {{ Math.round(contextUsagePercent) }}% used
            </div>
            <div class="tooltip-subtitle">
              Start a new session or change models to increase limit.
            </div>
            <div class="tooltip-arrow" :style="{ borderTopColor: tooltipBackground }"></div>
          </div>
        </div>
      </div>
      
      <div class="input-row">
        <textarea
          ref="textarea"
          v-model="message"
          @input="handleInput"
          @keydown="handleKeyDown"
          @focus="isFocused = true"
          @blur="isFocused = false"
          placeholder="Describe what to build next"
          rows="1"
          class="chat-textarea"
        ></textarea>
      </div>
      
      <div class="footer-row">
        <div class="dropdowns">
          <CustomDropdown 
            v-model="chatMode"
            :options="chatModes"
          />
          
          <CustomDropdown 
            v-model="selectedModel"
            :options="models"
          />
        </div>
        
        <div class="action-buttons">
          <button 
            class="forward-button" 
            @click="() => console.log('Forward clicked')"
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
    
    <div class="animation-controls">
      <label class="radio-label">
        <input type="radio" value="instant" v-model="animationStyle" aria-label="No Animation" />
        <span>No Animation</span>
      </label>
      <label class="radio-label">
        <input type="radio" value="counter" v-model="animationStyle" aria-label="Counter Animation" />
        <span>Counter</span>
      </label>
      <label class="radio-label">
        <input type="radio" value="spinner" v-model="animationStyle" aria-label="Spinner Animation" />
        <span>Spinner</span>
      </label>
      <label class="radio-label">
        <input type="radio" value="rpg" v-model="animationStyle" aria-label="RPG Float Animation" />
        <span>RPG</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.chat-input-container {
  width: 600px;
  height: 600px;
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}

.chat-history {
  flex: 1;
  min-height: 0;
  margin-bottom: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chat-message {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 5px;
  max-width: 80%;
  align-self: flex-start;
}

.chat-message.user {
  background: var(--vscode-input-background, #264f784d);
  align-self: flex-end;
}

.message-text {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-foreground, #cccccc);
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chat-input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 6px;
  background: var(--vscode-input-background, #3c3c3c);
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  border-radius: 5px;
  flex-shrink: 0;
}

.chat-input-wrapper.focused {
  border-color: var(--vscode-focusBorder, #007acc);
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
  max-width: calc(100% - 80px);
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
  color: var(--vscode-input-foreground, #cccccc);
  cursor: default;
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
  min-width: 100px;
}

.context-info {
  font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-descriptionForeground, #999999);
  cursor: default;
  text-align: right;
  line-height: 13px;
}

.context-value {
  position: relative;
  display: inline-block;
}

.spinner-container {
  position: relative;
  display: inline-block;
  height: 13px;
  overflow: hidden;
  vertical-align: top;
  min-width: 30px;
  line-height: 13px;
}

.spinner-digit {
  position: absolute;
  top: 0;
  right: 0;
  white-space: nowrap;
  line-height: 13px;
  height: 13px;
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-font-smoothing: subpixel-antialiased;
}

.spinner-digit.old {
  animation: slide-up 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.spinner-digit.new {
  animation: slide-in 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slide-up {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translate3d(0, -120%, 0);
    opacity: 0;
  }
}

@keyframes slide-in {
  0% {
    transform: translate3d(0, 120%, 0);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.context-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  width: 320px;
  padding: 8px;
  background: var(--vscode-editorHoverWidget-background, #2d2d30);
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  border: none;
}

.tooltip-arrow {
  position: absolute;
  bottom: -6px;
  right: 10px;
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
  margin-bottom: 4px;
  line-height: 1.4;
  text-align: left;
}

.tooltip-subtitle {
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-descriptionForeground, #999999);
  line-height: 1.4;
  text-align: left;
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

.send-button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

.floating-number {
  position: absolute;
  top: -18px;
  left: 0;
  transform: translateX(-100%);
  font-size: 12px;
  font-weight: 600;
  color: #4ec9b0;
  pointer-events: none;
  animation: float-up 1.5s ease-out forwards;
  text-shadow: 0 0 8px rgba(78, 201, 176, 0.6);
  white-space: nowrap;
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px);
  }
}

.widgets-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.operation-widget {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: var(--vscode-editor-background, #1e1e1e);
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  border-radius: 4px;
  font-size: 12px;
  color: var(--vscode-foreground, #cccccc);
  transition: all 0.2s ease;
}

.operation-widget.loading {
  border-color: var(--vscode-focusBorder, #007acc);
  background: color-mix(in srgb, var(--vscode-focusBorder, #007acc) 5%, var(--vscode-editor-background, #1e1e1e));
}

.operation-widget.complete {
  border-color: #4ec9b0;
  background: color-mix(in srgb, #4ec9b0 5%, var(--vscode-editor-background, #1e1e1e));
}

.widget-label {
  flex: 1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.widget-spinner,
.widget-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.widget-spinner .codicon-loading {
  color: var(--vscode-focusBorder, #007acc);
}

.widget-check .codicon-check {
  color: #4ec9b0;
}

.animation-controls {
  display: flex;
  gap: 16px;
  margin-top: 64px;
  padding: 8px 12px;
  background: var(--vscode-editor-background, #1e1e1e);
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  border-radius: 5px;
  flex-shrink: 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-foreground, #cccccc);
  
}

.radio-label input[type="radio"] {
  cursor: pointer;
  accent-color: var(--vscode-focusBorder, #007acc);
  margin-top: 0px;
}

.radio-label:hover {
  color: var(--vscode-input-foreground, #ffffff);
}

/* Dark theme overrides */
@media (prefers-color-scheme: dark) {
  .chat-input-wrapper {
    background: #3c3c3c;
    border-color: #3c3c3c;
  }
  
  .chat-input-wrapper.focused {
    border-color: #007acc;
  }
}

/* Light theme overrides */
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
</style>
