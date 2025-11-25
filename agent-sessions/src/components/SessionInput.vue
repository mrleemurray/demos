<script setup>
import { ref } from 'vue';

const inputText = ref('');
const selectedLocation = ref('Local');
const selectedAgent = ref('Agent');
const selectedModel = ref('GPT-5');

const locations = ['Local', 'Cloud', 'Background'];
const agents = ['Agent', 'Copilot', 'Custom'];
const models = ['GPT-5', 'GPT-4', 'Claude'];

const handleSubmit = () => {
  if (inputText.value.trim()) {
    console.log('Starting session:', {
      text: inputText.value,
      location: selectedLocation.value,
      agent: selectedAgent.value,
      model: selectedModel.value
    });
    inputText.value = '';
  }
};
</script>

<template>
  <div class="session-input-container">
    <div class="input-wrapper">
      <vscode-icon name="attach" class="attach-icon"></vscode-icon>
      <textarea
        v-model="inputText"
        placeholder="Start a new session..."
        class="session-input"
        rows="1"
        @keydown.enter.exact.prevent="handleSubmit"
      ></textarea>
      <button 
        class="submit-button"
        @click="handleSubmit"
        :disabled="!inputText.trim()"
      >
        <vscode-icon name="send"></vscode-icon>
      </button>
    </div>
    <div class="input-controls">
      <vscode-dropdown class="control-dropdown">
        <vscode-option 
          v-for="loc in locations" 
          :key="loc"
          :selected="loc === selectedLocation"
          @click="selectedLocation = loc"
        >
          {{ loc }}
        </vscode-option>
      </vscode-dropdown>
      
      <vscode-dropdown class="control-dropdown">
        <vscode-option 
          v-for="agent in agents" 
          :key="agent"
          :selected="agent === selectedAgent"
          @click="selectedAgent = agent"
        >
          {{ agent }}
        </vscode-option>
      </vscode-dropdown>
      
      <vscode-dropdown class="control-dropdown">
        <vscode-option 
          v-for="model in models" 
          :key="model"
          :selected="model === selectedModel"
          @click="selectedModel = model"
        >
          {{ model }}
        </vscode-option>
      </vscode-dropdown>
    </div>
  </div>
</template>

<style scoped>
.session-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: var(--vscode-input-background);
  border-top: 1px solid var(--vscode-panel-border);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  padding: 8px;
}

.input-wrapper:focus-within {
  border-color: var(--vscode-focusBorder);
}

.attach-icon {
  color: var(--vscode-descriptionForeground);
  cursor: pointer;
  flex-shrink: 0;
}

.attach-icon:hover {
  color: var(--vscode-foreground);
}

.session-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--vscode-input-foreground);
  font-family: var(--vscode-font-family);
  font-size: 13px;
  resize: none;
  min-height: 20px;
  max-height: 120px;
}

.session-input::placeholder {
  color: var(--vscode-input-placeholderForeground);
}

.submit-button {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--vscode-descriptionForeground);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--vscode-toolbar-hoverBackground);
  color: var(--vscode-foreground);
}

.submit-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.input-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.control-dropdown {
  font-size: 11px;
}
</style>
