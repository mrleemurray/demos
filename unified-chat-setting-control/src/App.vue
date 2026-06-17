<script setup>
import { ref } from 'vue'
import ChatInput from './components/ChatInput.vue'

const variants = [
  { value: 'original', label: 'Original', description: 'Selecting an option closes the whole control.' },
  { value: 'persistent', label: 'Persistent', description: 'Selecting an option keeps the control open.' },
  { value: 'progressive', label: 'Progressive', description: 'Selecting an option opens the next category, until the end.' },
]

const variant = ref('original')
</script>

<template>
  <div class="app-container">
    <div class="app-intro">
      <h1>Unified Chat Setting Control</h1>
      <p>
        The chat input's configuration controls shown inline, always visible. Click any
        of <em>Mode</em>, <em>Model</em> or <em>Effort</em>, then hover across them like a
        desktop file menu. Hold <em>⌘</em> while selecting to keep a menu open. The
        <em>+</em> button attaches context and is separate from the menu system.
      </p>
    </div>

    <ChatInput :variant="variant" />

    <fieldset class="variant-picker">
      <legend>Interaction variant</legend>
      <label
        v-for="v in variants"
        :key="v.value"
        class="variant-option"
        :class="{ active: variant === v.value }"
      >
        <input type="radio" name="variant" :value="v.value" v-model="variant" />
        <span class="variant-text">
          <span class="variant-label">{{ v.label }}</span>
          <span class="variant-description">{{ v.description }}</span>
        </span>
      </label>
    </fieldset>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200px 20px 40px;
  gap: 24px;
}

.app-intro {
  width: 600px;
  max-width: 100%;
}

.app-intro h1 {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px;
}

.app-intro p {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vscode-descriptionForeground, #999999);
  margin: 0;
}

.app-intro em {
  font-style: normal;
  color: var(--vscode-foreground, #cccccc);
}

.variant-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 600px;
  max-width: 100%;
  margin: 0;
  padding: 12px 14px 14px;
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  border-radius: 8px;
}

.variant-picker legend {
  padding: 0 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vscode-descriptionForeground, #999999);
}

.variant-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.variant-option:hover {
  background: var(--vscode-list-hoverBackground, #2a2d2e);
}

.variant-option.active {
  background: rgba(255, 255, 255, 0.05);
}

.variant-option input {
  margin: 2px 0 0;
  accent-color: var(--vscode-focusBorder, #0078d4);
}

.variant-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.variant-label {
  font-size: 13px;
  color: var(--vscode-foreground, #cccccc);
}

.variant-description {
  font-size: 12px;
  color: var(--vscode-descriptionForeground, #999999);
}
</style>
