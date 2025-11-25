<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  session: {
    type: Object,
    required: true
  },
  archived: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['archive']);
const isHovered = ref(false);

const handleArchiveClick = (e) => {
  e.stopPropagation();
  emit('archive');
};

const statusIcon = computed(() => {
  // Use custom icon if provided, otherwise fall back to status-based icon
  if (props.session.icon) {
    return props.session.icon;
  }
  
  switch (props.session.status) {
    case 'Complete': return 'check';
    case 'Running': return 'loading~spin';
    case 'Failed': return 'error';
    default: return 'circle-outline';
  }
});

const statusClass = computed(() => {
  return props.session.status.toLowerCase();
});

const locationIcon = computed(() => {
  switch (props.session.location) {
    case 'Local': return 'device-desktop';
    case 'Cloud': return 'cloud';
    case 'Background': return 'server-process';
    default: return 'circle-outline';
  }
});
</script>

<template>
  <div class="session-item" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <button 
      v-if="isHovered" 
      class="archive-button" 
      @click="handleArchiveClick"
      :title="archived ? 'Unarchive' : 'Archive'"
    >
      <i :class="archived ? 'codicon codicon-inbox' : 'codicon codicon-archive'"></i>
    </button>
    <div class="session-header">
      <div class="session-icon">
        <i :class="`codicon codicon-${statusIcon} ${statusClass}`"></i>
      </div>
      <div class="session-title-wrapper">
        <div class="session-title">{{ session.title }}</div>
        <div class="session-footer">
          <div v-if="session.changes" class="session-changes">
            <span class="changes-added">+{{ session.changes.added }}</span>
            <span class="changes-removed">-{{ session.changes.removed }}</span>
          </div>
          <div v-else class="session-status">
            {{ session.status }}
          </div>
          <div class="session-metadata">
            <span class="session-location">{{ session.location }}</span>
            <span class="separator">•</span>
            <span class="session-time">{{ session.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  cursor: pointer;
  background-color: #1f1f1f;
  position: relative;
}

.session-item:hover {
  background-color: #2b2d2e;
}

.archive-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vscode-foreground);
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: 10;
}

.archive-button:hover {
  opacity: 1;
  background-color: var(--vscode-toolbar-hoverBackground);
  border-radius: 4px;
}

.archive-button i {
  font-size: 16px;
}

.session-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.session-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  flex-shrink: 0;
}

.session-icon i {
  font-size: 16px;
  color: var(--vscode-foreground);
}

.session-item:hover .session-icon .complete {
  color: var(--vscode-testing-iconPassed, #73c991);
}

.session-item:hover .session-icon .running {
  color: var(--vscode-progressBar-background, #0e70c0);
}

.session-item:hover .session-icon .failed {
  color: var(--vscode-testing-iconFailed, #f48771);
}

.session-title-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.session-title {
  font-size: 13px;
  line-height: 1.4;
  color: var(--vscode-foreground);
  font-weight: 400;
}

.session-changes {
  display: flex;
  gap: 6px;
  font-size: 12px;
  /* font-family: var(--vscode-editor-font-family, 'SF Mono', Monaco, 'Courier New', monospace); */
  font-weight: 500;
}

.changes-added {
  color: var(--vscode-gitDecoration-addedResourceForeground, #73c991);
}

.changes-removed {
  color: var(--vscode-gitDecoration-deletedResourceForeground, #f48771);
}

.session-status {
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
}

.session-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
}

.session-metadata {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.session-location {
  color: var(--vscode-descriptionForeground);
}

.separator {
  color: var(--vscode-descriptionForeground);
  opacity: 0.6;
}

.session-time {
  color: var(--vscode-descriptionForeground);
}
</style>
