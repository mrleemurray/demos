<script setup>
import { ref, computed, nextTick } from 'vue'
import '@vscode/codicons/dist/codicon.css'
import CustomDropdown from './CustomDropdown.vue'

// Props to make it reusable
const props = defineProps({
  initialTitle: {
    type: String,
    default: 'Build dark mode toggle'
  },
  showAnimationControls: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send', 'attach', 'newSession'])

const message = ref('')
const textarea = ref(null)
const chatHistoryContainer = ref(null)
const isFocused = ref(false)
const chatMode = ref('ask')
const selectedModel = ref('claude')
const isContextHovered = ref(false)
const pendingContext = ref(0)
const attachedFiles = ref([])
const systemPromptTokens = ref(4)
const systemToolsTokens = ref(0)
const mcpToolsTokens = ref(0)
const messagesTextTokens = ref(0)
const messagesFilesTokens = ref(0)
const contextUsed = computed(() => totalTokensUsed.value)
const animationStyle = ref('instant')
const displayedContext = ref(0)
const floatingNumbers = ref([])
const spinnerDigits = ref([])
const isSpinning = ref(false)
const isStreaming = ref(false)
const streamedText = ref('')
const chatHistory = ref([])
const widgetAnimations = ref({})
const hoveredWidget = ref(null)
const chatTitle = ref(props.initialTitle)
const isTooltipOpen = ref(false)

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
  return '#cccccc'
})

const tooltipBackground = computed(() => {
  return '#2d2d30'
})

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

const contextLimit = computed(() => {
  const model = models.find(m => m.value === selectedModel.value)
  return model ? model.contextLimit : 64
})

const totalTokensUsed = computed(() => {
  return systemPromptTokens.value + systemToolsTokens.value + mcpToolsTokens.value + messagesTextTokens.value + messagesFilesTokens.value
})

const handleInput = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistoryContainer.value) {
      chatHistoryContainer.value.scrollTop = chatHistoryContainer.value.scrollHeight
    }
  })
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
    
    if (amount > 0) {
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
}

const animateWidgetCost = (widgetId, targetCost) => {
  if (animationStyle.value === 'instant') {
    if (!widgetAnimations.value[widgetId]) {
      widgetAnimations.value[widgetId] = { displayed: 0 }
    }
    widgetAnimations.value[widgetId].displayed = targetCost
  } else if (animationStyle.value === 'counter') {
    if (!widgetAnimations.value[widgetId]) {
      widgetAnimations.value[widgetId] = { displayed: 0 }
    }
    const start = widgetAnimations.value[widgetId].displayed
    const end = targetCost
    const duration = 800
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuad = 1 - (1 - progress) * (1 - progress)
      
      widgetAnimations.value[widgetId].displayed = start + (end - start) * easeOutQuad
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  } else if (animationStyle.value === 'spinner') {
    if (!widgetAnimations.value[widgetId]) {
      widgetAnimations.value[widgetId] = { displayed: 0, digits: [] }
    }
    const start = widgetAnimations.value[widgetId].displayed
    const end = targetCost
    const amount = end - start
    const steps = Math.min(Math.ceil(amount * 10), 5)
    const duration = 150
    let currentStep = 0
    
    const tick = () => {
      currentStep++
      const progress = currentStep / steps
      const newValue = start + (end - start) * progress
      
      widgetAnimations.value[widgetId].digits = [
        { value: widgetAnimations.value[widgetId].displayed.toFixed(1), class: 'old' },
        { value: newValue.toFixed(1), class: 'new' }
      ]
      
      widgetAnimations.value[widgetId].displayed = newValue
      
      if (currentStep < steps) {
        setTimeout(tick, duration)
      } else {
        setTimeout(() => {
          widgetAnimations.value[widgetId].digits = []
        }, duration)
      }
    }
    
    tick()
  } else if (animationStyle.value === 'rpg') {
    if (!widgetAnimations.value[widgetId]) {
      widgetAnimations.value[widgetId] = { displayed: 0 }
    }
    widgetAnimations.value[widgetId].displayed = targetCost
  }
}

const handleSend = () => {
  if (!isEmpty.value) {
    const userMessage = message.value
    
    // Emit event for parent component
    emit('send', {
      message: userMessage,
      files: attachedFiles.value,
      mode: chatMode.value,
      model: selectedModel.value
    })
    
    // Add user message to chat history
    chatHistory.value.push({
      id: Date.now(),
      type: 'user',
      text: userMessage
    })
    
    // Add pending context to total
    const addedAmount = pendingContext.value
    messagesTextTokens.value += pendingContext.value
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

const resetSession = () => {
  // Reset all state to initial values
  message.value = ''
  chatHistory.value = []
  attachedFiles.value = []
  pendingContext.value = 0
  systemPromptTokens.value = 4
  systemToolsTokens.value = 0
  mcpToolsTokens.value = 0
  messagesTextTokens.value = 0
  messagesFilesTokens.value = 0
  displayedContext.value = 0
  isStreaming.value = false
  streamedText.value = ''
  widgetAnimations.value = {}
  hoveredWidget.value = null
  chatTitle.value = props.initialTitle
  isTooltipOpen.value = false
  isContextHovered.value = false
  floatingNumbers.value = []
  spinnerDigits.value = []
  isSpinning.value = false
  
  emit('newSession')
}

const toggleTooltip = () => {
  isTooltipOpen.value = !isTooltipOpen.value
  isContextHovered.value = isTooltipOpen.value
}

const handleClickOutside = (event) => {
  const titleArea = event.target.closest('.title-with-progress')
  const tooltipArea = event.target.closest('.context-tooltip')
  if (!titleArea && !tooltipArea && isTooltipOpen.value) {
    isTooltipOpen.value = false
    isContextHovered.value = false
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
  
  emit('attach', randomFile)
}

const removeFile = (index) => {
  const file = attachedFiles.value[index]
  pendingContext.value -= file.tokens
  attachedFiles.value.splice(index, 1)
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
    widgets: [],
    model: selectedModel.value,
    tokens: 0
  })
  
  const fullResponse = "I'll help you build that feature. Let me analyze the codebase first."
  const operations = [
    { delay: 800, label: 'Reading main.js', icon: 'file-code', cost: 0.8 },
    { delay: 1200, label: 'Searching for similar patterns', icon: 'search', cost: 1.2 },
    { delay: 1500, label: 'Analyzing dependencies', icon: 'graph', cost: 0.5 }
  ]
  const finalText = 'Now I can implement the changes you requested.'
  
  // Split into word chunks
  const responseWords = fullResponse.split(' ')
  const finalWords = finalText.split(' ')
  
  let currentWordIndex = 0
  let operationIndex = 0
  let widgetCompleteCount = 0
  
  const typeText = () => {
    if (currentWordIndex < responseWords.length) {
      streamedText.value += (currentWordIndex > 0 ? ' ' : '') + responseWords[currentWordIndex]
      currentWordIndex++
      
      // Update agent message in history
      const agentMsg = chatHistory.value.find(m => m.id === agentMessageId)
      if (agentMsg) {
        agentMsg.text = streamedText.value
        scrollToBottom()
      }
      
      // Add small cost for streaming response tokens
      if (currentWordIndex % 3 === 0) {
        const addedAmount = 0.1
        messagesTextTokens.value += addedAmount
        animateContextIncrease(addedAmount)
        if (agentMsg) agentMsg.tokens += addedAmount
      }
      
      setTimeout(typeText, 80)
    } else if (operationIndex < operations.length) {
      const operation = operations[operationIndex]
      operationIndex++
      
      setTimeout(() => {
        const agentMsg = chatHistory.value.find(m => m.id === agentMessageId)
        
        // Add widget
        if (agentMsg) {
          agentMsg.widgets = agentMsg.widgets || []
          const widgetId = Date.now() + operationIndex
          agentMsg.widgets.push({
            id: widgetId,
            label: operation.label,
            icon: operation.icon,
            status: 'loading',
            cost: operation.cost
          })
          animateWidgetCost(widgetId, operation.cost)
          scrollToBottom()
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
                  let finalWordIndex = 0
                  const typeFinalText = () => {
                    if (finalWordIndex < finalWords.length) {
                      const word = finalWords[finalWordIndex]
                      finalWordIndex++
                      if (agentMsg) {
                        agentMsg.continuationText = (agentMsg.continuationText || '') + (finalWordIndex > 1 ? ' ' : '') + word
                        scrollToBottom()
                      }
                      setTimeout(typeFinalText, 80)
                    } else {
                      // Add final cost
                      const addedAmount = 0.3
                      messagesTextTokens.value += addedAmount
                      animateContextIncrease(addedAmount)
                      if (agentMsg) agentMsg.tokens += addedAmount
                      
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
        systemToolsTokens.value += addedAmount
        animateContextIncrease(addedAmount)
        if (agentMsg) agentMsg.tokens += addedAmount
        
        typeText()
      }, operation.delay)
    }
  }
  
  typeText()
}
</script>

<template>
  <div class="chat-input-container" @click="handleClickOutside">
    <div class="chat-wrapper">
      <div class="chat-header">
        <div class="header-left">
          <div class="title-with-progress"
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
            <h2 class="chat-title" @click.stop="toggleTooltip" style="cursor: pointer;">{{ chatTitle }}</h2>
          </div>
          
          <div v-if="isContextHovered || isTooltipOpen" class="context-tooltip" :style="{ background: tooltipBackground }" @click.stop @mouseenter="isContextHovered = true" @mouseleave="() => { if (!isTooltipOpen) isContextHovered = false }">
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
                <span class="breakdown-value">{{ systemPromptTokens.toFixed(1) }}k • {{ Math.round((systemPromptTokens / contextLimit) * 100) }}%</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">System tools</span>
                <span class="breakdown-value">{{ systemToolsTokens.toFixed(1) }}k • {{ Math.round((systemToolsTokens / contextLimit) * 100) }}%</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">MCP tools</span>
                <span class="breakdown-value">{{ mcpToolsTokens.toFixed(1) }}k • {{ Math.round((mcpToolsTokens / contextLimit) * 100) }}%</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">Attached files</span>
                <span class="breakdown-value">{{ messagesTextTokens.toFixed(1) }}k • {{ Math.round((messagesTextTokens / contextLimit) * 100) }}%</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">Messages</span>
                <span class="breakdown-value">{{ messagesFilesTokens.toFixed(1) }}k • {{ Math.round((messagesFilesTokens / contextLimit) * 100) }}%</span>
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
            <div class="tooltip-arrow" :style="{ borderBottomColor: tooltipBackground }"></div>
          </div>
        </div>
        <div class="header-controls">
          <button class="header-btn" title="New session" @click="resetSession">
            <i class="codicon codicon-add"></i>
          </button>
          <button class="header-btn" title="Settings">
            <i class="codicon codicon-gear"></i>
          </button>
          <button class="header-btn" title="More actions">
            <i class="codicon codicon-ellipsis"></i>
          </button>
          <button class="header-btn" title="Full screen">
            <i class="codicon codicon-screen-full"></i>
          </button>
        </div>
      </div>
      <div ref="chatHistoryContainer" class="chat-history">
        <div v-for="msg in chatHistory" :key="msg.id" class="chat-message" :class="msg.type">
        <div class="message-text">
          {{ msg.text }}
        </div>
        <div v-if="msg.widgets && msg.widgets.length > 0" class="widgets-container">
          <div v-for="widget in msg.widgets" :key="widget.id" class="operation-widget" :class="widget.status"
            @mouseenter="hoveredWidget = widget.id"
            @mouseleave="hoveredWidget = null">
            <div v-if="widget.status === 'loading'" class="widget-spinner">
              <i class="codicon codicon-loading codicon-modifier-spin"></i>
            </div>
            <div v-else class="widget-check">
              <i class="codicon codicon-check"></i>
            </div>
            <span class="widget-label">
              <template v-if="widget.status === 'loading'">
                Working • 
                <span v-if="widgetAnimations[widget.id]?.digits?.length">
                  <span v-for="(digit, idx) in widgetAnimations[widget.id].digits" :key="idx" class="spinner-digit" :class="digit.class">{{ digit.value }}</span>
                </span>
                <span v-else>{{ (widgetAnimations[widget.id]?.displayed || widget.cost).toFixed(1) }}</span>k tokens used
              </template>
              <template v-else>
                {{ widget.label }}<span v-if="hoveredWidget === widget.id"> • {{ widget.cost }}k tokens</span>
              </template>
            </span>
          </div>
        </div>
        <div v-if="msg.continuationText" class="message-text continuation-text">
          {{ msg.continuationText }}
        </div>
        <div v-if="msg.type === 'agent'" class="message-feedback">
          <div class="feedback-actions">
            <button class="feedback-btn" title="Regenerate">
              <i class="codicon codicon-refresh"></i>
            </button>
            <button class="feedback-btn" title="Undo">
              <i class="codicon codicon-discard"></i>
            </button>
            <button class="feedback-btn" title="Helpful">
              <i class="codicon codicon-thumbsup"></i>
            </button>
            <button class="feedback-btn" title="Not helpful">
              <i class="codicon codicon-thumbsdown"></i>
            </button>
          </div>
          <div class="feedback-metadata">
            <span class="model-name">{{ models.find(m => m.value === msg.model)?.label || 'Claude Sonnet 4.5' }} • {{ models.find(m => m.value === msg.model)?.costMultiplier || 1 }}x • </span>
            <span class="token-count">{{ msg.tokens?.toFixed(1) || '0.0' }}k tokens</span>
          </div>
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
        
        <div class="context-info-wrapper">
          <div class="context-info">
            <span 
              v-if="pendingContext > 0"
              class="pending-context"
            >+{{ pendingContext.toFixed(1) }}k</span>
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
    </div>
    
    <div v-if="showAnimationControls" class="animation-controls">
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  overflow: hidden;
  gap: 8px;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px 0px 8px;
  flex-shrink: 0;
  height: 35px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.header-left {
  flex: 1;
  min-width: 0;
  position: relative;
}

.title-with-progress {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: default;
}

.progress-ring {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.progress-ring-background {
  stroke: var(--vscode-input-border, #3c3c3c);
}

.progress-ring-progress {
  transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
}

.chat-title {
  font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  color: var(--vscode-foreground, #cccccc);
  margin: 0;
  cursor: pointer;
  padding: 4px 6px;
  display: inline-flex;
  height: 35px;
  align-items: center;
}

.header-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: var(--vscode-foreground, #cccccc);
  cursor: pointer;
  opacity: 0.7;
}

.header-btn:hover {
  background: var(--vscode-toolbar-hoverBackground, #505050);
  opacity: 1;
}

.header-btn .codicon {
  font-size: 16px;
}

.chat-history {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  padding: 16px;
}

.chat-history::-webkit-scrollbar {
  width: 14px;
}

.chat-history::-webkit-scrollbar-track {
  background: transparent;
}

.chat-history::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background, #79797966);
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 7px;
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground, #646464b3);
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 7px;
}

.chat-history::-webkit-scrollbar-thumb:active {
  background: var(--vscode-scrollbarSlider-activeBackground, #bfbfbf66);
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 7px;
}

.chat-message {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 5px;
  align-self: flex-start;
}

.chat-message.user {
  background: var(--vscode-input-background, #264f784d);
  align-self: flex-end;
  max-width: 80%;
}

.chat-message.agent {
  width: 100%;
  max-width: 524px;
}

.message-text {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-foreground, #cccccc);
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-text.continuation-text {
  margin-top: 16px;
}

.message-feedback {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  opacity: 0;
}

.chat-message:hover .message-feedback {
  opacity: 1;
}

.feedback-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.feedback-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: var(--vscode-foreground, #cccccc);
  cursor: pointer;
  opacity: 0.7;
}

.feedback-btn:hover {
  background: var(--vscode-toolbar-hoverBackground, #505050);
  opacity: 1;
}

.feedback-btn .codicon {
  font-size: 14px;
}

.feedback-metadata {
  display: flex;
  gap: 2px;
  align-items: center;
  font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--vscode-descriptionForeground, #999999);
}

.model-name {
  opacity: 0.8;
}

.token-count {
  opacity: 0.6;
}

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

.context-value {
  position: relative;
  display: inline-block;
}

.header-left .context-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  width: 325px;
  padding: 8px;
  background: var(--vscode-editorHoverWidget-background, #2d2d30);
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  border: none;
}

.header-left .tooltip-arrow {
  position: absolute;
  top: -6px;
  left: 4px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid;
  border-bottom-color: inherit;
  filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.2));
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

.widgets-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  cursor: default;
}

.operation-widget {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0px;
  background: transparent;
  border: none;
  border-radius: 0;
  font-size: 13px;
  color: var(--vscode-foreground, #cccccc);
  opacity: 0.7;
}

.widget-label {
  flex: 1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 12px;
  position: relative;
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
  color: var(--vscode-foreground, #cccccc);
  font-size: 14px;
}

.widget-check .codicon-check {
  color: var(--vscode-foreground, #cccccc);
  font-size: 14px;
}

.animation-controls {
  display: flex;
  gap: 16px;
  margin-top: 16px;
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

a {
  color: #4daafc;
}
</style>
