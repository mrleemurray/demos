<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SessionItem from './SessionItem.vue';

const props = defineProps({
  locationFilter: {
    type: Array,
    default: () => ['All']
  }
});

const now = Date.now();

const activeSessions = ref([
  {
    id: 1,
    title: 'Commenting code for clarity and readability',
    status: 'Complete',
    icon: 'issue-closed',
    location: 'Background',
    timestamp: now - 60 * 60 * 1000, // 1 hour ago
    unread: false
  },
  {
    id: 2,
    title: 'Replacing placeholder text for inline chat',
    status: 'Complete',
    icon: 'issue-closed',
    location: 'Cloud',
    timestamp: now - 30 * 60 * 1000, // 30 min ago
    changes: { added: 150, removed: 10 },
    unread: true
  },
  {
    id: 3,
    title: 'Refining preview layout and icons',
    status: 'Complete',
    icon: 'git-merge',
    location: 'Local',
    timestamp: now - 1 * 60 * 1000, // 1 min ago
    unread: false
  },
  {
    id: 4,
    title: 'Implementing authentication middleware',
    status: 'Running',
    icon: 'git-pull-request',
    location: 'Cloud',
    timestamp: now - 2 * 60 * 1000, // 2 min ago
    changes: { added: 45, removed: 5 },
    unread: true
  },
  {
    id: 5,
    title: 'Optimizing database queries',
    status: 'Failed',
    icon: 'error',
    location: 'Local',
    timestamp: now - 5 * 60 * 1000, // 5 min ago
    unread: false
  },
  {
    id: 6,
    title: 'Adding unit tests for API endpoints',
    status: 'Complete',
    icon: 'issue-closed',
    location: 'Cloud',
    timestamp: now - 15 * 60 * 1000, // 15 min ago
    changes: { added: 230, removed: 12 },
    unread: true
  },
  {
    id: 7,
    title: 'Refactoring component structure',
    status: 'Complete',
    icon: 'issue-closed',
    location: 'Local',
    timestamp: now - 45 * 60 * 1000, // 45 min ago
    changes: { added: 78, removed: 134 },
    unread: false
  },
  {
    id: 8,
    title: 'Building user dashboard components',
    status: 'Running',
    icon: 'loading codicon-modifier-spin',
    location: 'Local',
    timestamp: now,
    unread: false
  },
  {
    id: 9,
    title: 'Setting up CI/CD pipeline configuration',
    status: 'Running',
    icon: 'loading codicon-modifier-spin',
    location: 'Background',
    timestamp: now,
    unread: true
  },
  {
    id: 10,
    title: 'Draft: Experimental feature flag implementation',
    status: 'Draft',
    icon: 'git-pull-request-draft',
    location: 'Cloud',
    timestamp: now - 3 * 60 * 1000, // 3 min ago
    unread: false
  },
  {
    id: 11,
    title: 'Updating documentation for API changes',
    status: 'Complete',
    icon: 'git-pull-request-closed',
    location: 'Local',
    timestamp: now - 20 * 60 * 1000, // 20 min ago
    unread: false
  }
]);

const archivedSessions = ref([]);
const isArchivedExpanded = ref(false);
const showAllSessions = ref(false);
const currentTime = ref(Date.now());

// Format relative time
const formatRelativeTime = (timestamp) => {
  const diff = currentTime.value - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return 'now';
  if (seconds < 60) return `${seconds} sec`;
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} hr`;
  return `${days} day${days > 1 ? 's' : ''}`;
};

// Computed sorted sessions - unread items first, then by time
const sortedActiveSessions = computed(() => {
  // First filter by location
  let filtered = activeSessions.value;
  if (!props.locationFilter.includes('All')) {
    filtered = filtered.filter(s => props.locationFilter.includes(s.location));
  }
  
  const sorted = [...filtered].map(session => ({
    ...session,
    time: formatRelativeTime(session.timestamp)
  })).sort((a, b) => {
    // First sort by unread status
    if (a.unread !== b.unread) {
      return a.unread ? -1 : 1;
    }
    // Then sort by timestamp (most recent first)
    return b.timestamp - a.timestamp;
  });

  // If not showing all, return only the 3 most recent or unread items
  if (!showAllSessions.value) {
    const unreadItems = sorted.filter(s => s.unread);
    const readItems = sorted.filter(s => !s.unread);
    
    // Show all unread items plus enough read items to reach 3 total
    if (unreadItems.length >= 3) {
      return unreadItems.slice(0, 3);
    } else {
      return [...unreadItems, ...readItems.slice(0, 3 - unreadItems.length)];
    }
  }
  
  return sorted;
});

const sortedArchivedSessions = computed(() => {
  // First filter by location
  let filtered = archivedSessions.value;
  if (!props.locationFilter.includes('All')) {
    filtered = filtered.filter(s => props.locationFilter.includes(s.location));
  }
  
  return [...filtered].map(session => ({
    ...session,
    time: formatRelativeTime(session.timestamp)
  })).sort((a, b) => {
    // First sort by unread status
    if (a.unread !== b.unread) {
      return a.unread ? -1 : 1;
    }
    // Then sort by timestamp (most recent first)
    return b.timestamp - a.timestamp;
  });
});

const draggedIndex = ref(null);
const dragOverIndex = ref(null);
const dragOverList = ref(null);
const sourceList = ref(null);

const handleSessionClick = (session) => {
  console.log('Session clicked:', session);
  // Find the original session in the array and mark as read
  const originalSession = activeSessions.value.find(s => s.id === session.id) || 
                          archivedSessions.value.find(s => s.id === session.id);
  if (originalSession) {
    originalSession.unread = false;
  }
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

const simulateNewMessage = () => {
  // Pick a random read session to make unread
  const readSessions = activeSessions.value.filter(s => !s.unread);
  if (readSessions.length > 0) {
    const randomSession = readSessions[Math.floor(Math.random() * readSessions.length)];
    randomSession.unread = true;
    randomSession.timestamp = Date.now(); // Update to now
    console.log('Simulated new message for:', randomSession.title);
  }
};

const completeRunningSession = (sessionId, completionTime) => {
  const session = activeSessions.value.find(s => s.id === sessionId);
  if (session && session.status === 'Running') {
    session.status = 'Complete';
    session.icon = 'issue-closed';
    session.timestamp = Date.now();
    session.unread = true; // Mark as unread when completed
    session.changes = { 
      added: Math.floor(Math.random() * 200) + 50, 
      removed: Math.floor(Math.random() * 50) + 5 
    };
    console.log(`Session ${sessionId} completed after ${completionTime}ms`);
  }
};

const addNewSession = (messageText) => {
  const newId = Math.max(...activeSessions.value.map(s => s.id)) + 1;
  const locations = ['Local', 'Cloud', 'Background'];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  
  const newSession = {
    id: newId,
    title: messageText.substring(0, 50) + (messageText.length > 50 ? '...' : ''),
    status: 'Running',
    icon: 'loading codicon-modifier-spin',
    location: randomLocation,
    timestamp: Date.now(),
    unread: true
  };
  
  activeSessions.value.unshift(newSession);
  
  // Schedule completion after 8-15 seconds
  const completionTime = Math.floor(Math.random() * 7000) + 8000;
  const timeout = setTimeout(() => completeRunningSession(newId, completionTime), completionTime);
  sessionCompletionTimeouts.push(timeout);
  
  console.log(`New session ${newId} created, will complete in ${completionTime}ms`);
};

defineExpose({
  addNewSession
});

let timeUpdateInterval;
let sessionCompletionTimeouts = [];

onMounted(() => {
  // Update time every 10 seconds
  timeUpdateInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 10000);
  
  // Schedule completion for running sessions
  const runningSession1 = activeSessions.value.find(s => s.id === 8);
  const runningSession2 = activeSessions.value.find(s => s.id === 9);
  
  if (runningSession1) {
    const timeout1 = setTimeout(() => completeRunningSession(8, 12000), 12000); // 12 seconds
    sessionCompletionTimeouts.push(timeout1);
  }
  
  if (runningSession2) {
    const timeout2 = setTimeout(() => completeRunningSession(9, 18000), 18000); // 18 seconds
    sessionCompletionTimeouts.push(timeout2);
  }
});

onUnmounted(() => {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
  }
  // Clear all session completion timeouts
  sessionCompletionTimeouts.forEach(timeout => clearTimeout(timeout));
});
</script>

<template>
  <div class="sessions-container">
    <div class="list-section">
      <div class="session-list">
        <div 
          v-for="(session, index) in sortedActiveSessions" 
          :key="session.id"
          :class="{ 'drag-over': dragOverIndex === index && dragOverList === 'active' }"
          draggable="true"
          @dragstart="handleDragStart(index, 'active')"
          @dragover="handleDragOver($event, index, 'active')"
          @dragleave="handleDragLeave"
          @dragend="handleDragEnd"
          @click="handleSessionClick(session)"
        >
          <SessionItem :session="session" :unread="session.unread" @archive="handleArchive(session.id, 'active')" />
        </div>
      </div>
      
      <button 
        v-if="!showAllSessions && sortedActiveSessions.length >= 3" 
        class="show-all-button"
        @click="showAllSessions = true"
      >
        Show all sessions
      </button>
    </div>

    <div class="list-section" v-if="archivedSessions.length > 0">
      <div class="list-header collapsible" @click="toggleArchived">
        <i :class="`codicon codicon-chevron-${isArchivedExpanded ? 'down' : 'right'}`"></i>
        Archived
      </div>
      <div v-if="isArchivedExpanded" class="session-list">
        <div 
          v-for="(session, index) in sortedArchivedSessions" 
          :key="session.id"
          :class="{ 'drag-over': dragOverIndex === index && dragOverList === 'archived' }"
          draggable="true"
          @dragstart="handleDragStart(index, 'archived')"
          @dragover="handleDragOver($event, index, 'archived')"
          @dragleave="handleDragLeave"
          @dragend="handleDragEnd"
          @click="handleSessionClick(session)"
        >
          <SessionItem :session="session" :archived="true" :unread="session.unread" @archive="handleArchive(session.id, 'archived')" />
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

.show-all-button {
  margin: 0px 8px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: var(--vscode-textLink-foreground, #3794ff);
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  border-radius: 4px;
}
</style>
