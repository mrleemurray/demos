<script setup>
import { ref } from 'vue';
import SessionItem from './SessionItem.vue';

const activeSessions = ref([
  {
    id: 1,
    title: 'Commenting code for clarity and readability',
    status: 'Complete',
    icon: 'check',
    location: 'Background',
    time: '1 hr'
  },
  {
    id: 2,
    title: 'Replacing placeholder text for inline chat',
    status: 'Complete',
    icon: 'issue-closed',
    location: 'Cloud',
    time: '30 min',
    changes: { added: 150, removed: 10 }
  },
  {
    id: 3,
    title: 'Refining preview layout and icons',
    status: 'Complete',
    icon: 'git-pull-request-closed',
    location: 'Local',
    time: '1 min'
  },
  {
    id: 4,
    title: 'Implementing authentication middleware',
    status: 'Running',
    icon: 'git-pull-request',
    location: 'Cloud',
    time: '2 min',
    changes: { added: 45, removed: 5 }
  },
  {
    id: 5,
    title: 'Optimizing database queries',
    status: 'Failed',
    icon: 'error',
    location: 'Local',
    time: '5 min'
  },
  {
    id: 6,
    title: 'Adding unit tests for API endpoints',
    status: 'Complete',
    icon: 'check',
    location: 'Cloud',
    time: '15 min',
    changes: { added: 230, removed: 12 }
  },
  {
    id: 7,
    title: 'Refactoring component structure',
    status: 'Complete',
    icon: 'issue-closed',
    location: 'Local',
    time: '45 min',
    changes: { added: 78, removed: 134 }
  }
]);

const archivedSessions = ref([]);
const isArchivedExpanded = ref(true);

const draggedIndex = ref(null);
const dragOverIndex = ref(null);
const dragOverList = ref(null);
const sourceList = ref(null);

const handleSessionClick = (session) => {
  console.log('Session clicked:', session);
};

const toggleArchived = () => {
  isArchivedExpanded.value = !isArchivedExpanded.value;
};

const handleArchive = (sessionId, listType) => {
  if (listType === 'active') {
    const index = activeSessions.value.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      const [session] = activeSessions.value.splice(index, 1);
      archivedSessions.value.push(session);
    }
  } else {
    const index = archivedSessions.value.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      const [session] = archivedSessions.value.splice(index, 1);
      activeSessions.value.push(session);
    }
  }
};

const handleDragStart = (index, listType) => {
  draggedIndex.value = index;
  sourceList.value = listType;
};

const handleDragOver = (e, index, listType) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Only update if it's actually different to reduce jitter
  if (dragOverIndex.value !== index || dragOverList.value !== listType) {
    dragOverIndex.value = index;
    dragOverList.value = listType;
  }
};

const handleDragEnd = () => {
  if (draggedIndex.value !== null && dragOverIndex.value !== null && sourceList.value && dragOverList.value) {
    // Same list reordering
    if (sourceList.value === dragOverList.value && draggedIndex.value !== dragOverIndex.value) {
      const items = sourceList.value === 'active' ? [...activeSessions.value] : [...archivedSessions.value];
      const [draggedItem] = items.splice(draggedIndex.value, 1);
      items.splice(dragOverIndex.value, 0, draggedItem);
      if (sourceList.value === 'active') {
        activeSessions.value = items;
      } else {
        archivedSessions.value = items;
      }
    }
    // Cross-list movement
    else if (sourceList.value !== dragOverList.value) {
      const sourceItems = sourceList.value === 'active' ? activeSessions.value : archivedSessions.value;
      const targetItems = dragOverList.value === 'active' ? activeSessions.value : archivedSessions.value;
      
      const [draggedItem] = sourceItems.splice(draggedIndex.value, 1);
      targetItems.splice(dragOverIndex.value, 0, draggedItem);
    }
  }
  draggedIndex.value = null;
  dragOverIndex.value = null;
  dragOverList.value = null;
  sourceList.value = null;
};

const handleDragLeave = (e) => {
  // Only clear if we're actually leaving the element (not entering a child)
  if (!e.currentTarget.contains(e.relatedTarget)) {
    dragOverIndex.value = null;
    dragOverList.value = null;
  }
};
</script>

<template>
  <div class="sessions-container">
    <div class="list-section">
      <div class="session-list">
        <div 
          v-for="(session, index) in activeSessions" 
          :key="session.id"
          :class="{ 'drag-over': dragOverIndex === index && dragOverList === 'active' }"
          draggable="true"
          @dragstart="handleDragStart(index, 'active')"
          @dragover="handleDragOver($event, index, 'active')"
          @dragleave="handleDragLeave"
          @dragend="handleDragEnd"
          @click="handleSessionClick(session)"
        >
          <SessionItem :session="session" @archive="handleArchive(session.id, 'active')" />
        </div>
      </div>
    </div>

    <div class="list-section" v-if="archivedSessions.length > 0">
      <div class="list-header collapsible" @click="toggleArchived">
        <i :class="`codicon codicon-chevron-${isArchivedExpanded ? 'down' : 'right'}`"></i>
        Archived
      </div>
      <div v-if="isArchivedExpanded" class="session-list">
        <div 
          v-for="(session, index) in archivedSessions" 
          :key="session.id"
          :class="{ 'drag-over': dragOverIndex === index && dragOverList === 'archived' }"
          draggable="true"
          @dragstart="handleDragStart(index, 'archived')"
          @dragover="handleDragOver($event, index, 'archived')"
          @dragleave="handleDragLeave"
          @dragend="handleDragEnd"
          @click="handleSessionClick(session)"
        >
          <SessionItem :session="session" :archived="true" @archive="handleArchive(session.id, 'archived')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sessions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-header {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--vscode-descriptionForeground);
  padding: 0 16px;
  letter-spacing: 0.5px;
}

.list-header.collapsible {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
  transition: color 0.1s;
}

.list-header.collapsible:hover {
  color: var(--vscode-foreground);
}

.list-header.collapsible i {
  font-size: 16px;
}

.session-list {
  display: flex;
  flex-direction: column;
  margin: 0px 8px;
  background-color: #181818;
  border-radius: 5px;
  overflow: hidden;
}

.session-list > div {
  transition: opacity 0.2s;
  position: relative;
}

.session-list > div[draggable="true"] {
  cursor: grab;
}

.session-list > div[draggable="true"]:active {
  cursor: grabbing;
}

.drag-over {
  border-top: 2px solid var(--vscode-focusBorder, #007acc);
  margin-top: -2px;
}
</style>
