<script setup>
import { ref } from 'vue';
import SessionList from './components/SessionList.vue';
import ChatInputBox from './components/ChatInputBox.vue';

const message = ref('');
const chatMode = ref('agent');
const selectedModel = ref('claude');
const attachedFiles = ref([]);
const pendingContext = ref(0);

const handleSend = () => {
  console.log('Message sent:', message.value);
  console.log('Mode:', chatMode.value);
  console.log('Model:', selectedModel.value);
  console.log('Files:', attachedFiles.value);
  
  // Clear after send
  message.value = '';
  attachedFiles.value = [];
  pendingContext.value = 0;
}

const handleAttach = () => {
  // Add dummy file
  const dummyFiles = [
    { name: 'App.vue', tokens: 2.5 },
    { name: 'main.js', tokens: 1.2 },
    { name: 'SessionList.vue', tokens: 3.1 }
  ];
  
  const randomFile = dummyFiles[Math.floor(Math.random() * dummyFiles.length)];
  attachedFiles.value.push(randomFile);
  pendingContext.value += randomFile.tokens;
}

const handleRemoveFile = (index) => {
  const file = attachedFiles.value[index];
  pendingContext.value -= file.tokens;
  attachedFiles.value.splice(index, 1);
}
</script>

<template>
  <div class="app-container">
    <div class="panel-header">
      <div class="header-content">
        <h2>AGENT SESSIONS</h2>
      </div>
      <div class="header-actions">
        <vscode-icon name="refresh" class="action-icon"></vscode-icon>
        <vscode-icon name="settings-gear" class="action-icon"></vscode-icon>
      </div>
    </div>
    
    <div class="session-list-container">
      <SessionList />
    </div>
    
    <div class="chat-container">
      <ChatInputBox
        v-model="message"
        v-model:chat-mode="chatMode"
        v-model:selected-model="selectedModel"
        :attached-files="attachedFiles"
        :pending-context="pendingContext"
        placeholder="Ask a question or describe what to build..."
        @send="handleSend"
        @attach="handleAttach"
        @remove-file="handleRemoveFile"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 400px;
  background-color: #181818;
  color: var(--vscode-sideBar-foreground);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 35px;
  padding-left: 16px;
  background-color: #181818;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-content h2 {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-icon {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.action-icon:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.session-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.session-list-container::-webkit-scrollbar {
  width: 10px;
}

.session-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.session-list-container::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 5px;
}

.session-list-container::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}

.chat-container {
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
}
</style>
