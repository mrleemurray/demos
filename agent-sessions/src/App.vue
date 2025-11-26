<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SessionList from './components/SessionList.vue';
import ChatInputBox from './components/ChatInputBox.vue';

const message = ref('');
const chatMode = ref('agent');
const selectedModel = ref('claude');
const attachedFiles = ref([]);
const pendingContext = ref(0);
const locationFilter = ref(['All']);
const showFilterMenu = ref(false);
const isInputFocused = ref(false);
const sessionListRef = ref(null);
const compactMode = ref(false);

const toggleCompactMode = () => {
  compactMode.value = !compactMode.value;
};

const handleInputFocus = () => {
  isInputFocused.value = true;
  if (!message.value) {
    message.value = 'Sending a new message here would start a new session & move you to the chat view';
  }
}

const handleInputBlur = () => {
  isInputFocused.value = false;
  // Don't clear immediately - use timeout to allow send button click to process first
  setTimeout(() => {
    if (message.value === 'Sending a new message here would start a new session & move you to the chat view') {
      message.value = '';
    }
  }, 100);
}

const handleSend = () => {
  if (!message.value.trim()) {
    return;
  }
  
  // Create new session in the list
  if (sessionListRef.value) {
    sessionListRef.value.addNewSession(message.value);
  }
  
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

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value;
}

const toggleFilter = (filter) => {
  if (filter === 'All') {
    locationFilter.value = ['All'];
  } else {
    // Remove 'All' if it exists
    const filters = locationFilter.value.filter(f => f !== 'All');
    
    // Toggle the selected filter
    const index = filters.indexOf(filter);
    if (index > -1) {
      filters.splice(index, 1);
    } else {
      filters.push(filter);
    }
    
    // If no filters selected, default to 'All'
    locationFilter.value = filters.length === 0 ? ['All'] : filters;
  }
  
  // Always close the menu after a selection
  showFilterMenu.value = false;
}

const isFilterSelected = (filter) => {
  return locationFilter.value.includes(filter);
}

const handleClickOutside = (event) => {
  const filterContainer = document.querySelector('.filter-container');
  if (filterContainer && !filterContainer.contains(event.target)) {
    showFilterMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="app-container">
    <div class="panel-header">
      <div class="header-content">
        <h2>AGENTS</h2>
      </div>
      <div class="header-actions">
        <button class="action-icon" title="Refresh">
          <i class="codicon codicon-refresh"></i>
        </button>
        <button class="action-icon" title="Search">
          <i class="codicon codicon-search"></i>
        </button>
        <div class="filter-container">
          <button class="action-icon" @click="toggleFilterMenu" :title="`Filter: ${locationFilter.join(', ')}`">
            <i class="codicon codicon-list-filter"></i>
          </button>
          <div v-if="showFilterMenu" class="filter-menu">
            <div 
              v-for="option in ['All', 'Cloud', 'Local', 'Background']" 
              :key="option"
              class="filter-option"
              :class="{ 'selected': isFilterSelected(option) }"
              @click="toggleFilter(option)"
            >
              <i v-if="isFilterSelected(option)" class="codicon codicon-check"></i>
              <span>{{ option }}</span>
            </div>
          </div>
        </div>
        <button class="action-icon" @click="toggleCompactMode" title="More">
          <i class="codicon codicon-ellipsis"></i>
        </button>
      </div>
    </div>
    
    <div class="session-list-container">
      <SessionList ref="sessionListRef" :location-filter="locationFilter" :compact-mode="compactMode" />
    </div>
    
    <div class="chat-container">
      <ChatInputBox
        v-model="message"
        v-model:chat-mode="chatMode"
        v-model:selected-model="selectedModel"
        :attached-files="attachedFiles"
        :pending-context="pendingContext"
        placeholder="Start a new session..."
        @send="handleSend"
        @attach="handleAttach"
        @remove-file="handleRemoveFile"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  margin: 24px 0px;
  width: 100%;
  max-width: 400px;
  background-color: #181818;
  color: var(--vscode-sideBar-foreground);
  border: 1px solid #3c3c3c;
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
  font-weight: 400;
  margin: 0;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  gap: 2px;
  align-items: center;
  margin-right: 8px;
}

.filter-container {
  position: relative;
}

.action-icon {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: var(--vscode-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.action-icon i {
  font-size: 16px;
}

.filter-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background-color: var(--vscode-dropdown-background, #1b1b1b);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  min-width: 140px;
  z-index: 1000;
  overflow: hidden;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  color: var(--vscode-dropdown-foreground);
  transition: background-color 0.1s;
}

.filter-option:hover {
  background-color: var(--vscode-list-hoverBackground);
}

.filter-option.selected {
  background-color: var(--vscode-list-activeSelectionBackground);
  color: var(--vscode-list-activeSelectionForeground);
}

.filter-option i {
  font-size: 16px;
  width: 16px;
}

.filter-option span {
  flex: 1;
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
