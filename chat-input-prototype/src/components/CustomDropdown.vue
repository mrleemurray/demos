<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: String,
  options: Array
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.custom-dropdown')) {
    isOpen.value = false
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<template>
  <div class="custom-dropdown">
    <button 
      class="dropdown-trigger" 
      @click.stop="toggleDropdown"
      :class="{ open: isOpen }"
    >
      <span>{{ selectedOption?.label }}</span>
      <i class="codicon codicon-chevron-down"></i>
    </button>
    
    <div v-if="isOpen" class="dropdown-menu">
      <div 
        v-for="option in options" 
        :key="option.value"
        class="dropdown-item"
        :class="{ selected: option.value === modelValue }"
        @click="selectOption(option)"
      >
        <i v-if="option.value === modelValue" class="codicon codicon-check"></i>
        <span class="item-spacer" v-else></span>
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--vscode-foreground, #cccccc);
  font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-trigger:hover {
  background: var(--vscode-toolbar-hoverBackground, #505050);
}

.dropdown-trigger .codicon {
  font-size: 16px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 200px;
  width: max-content;
  background: var(--vscode-dropdown-background, #3c3c3c);
  border: 1px solid var(--vscode-dropdown-border, #454545);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  color: var(--vscode-dropdown-foreground, #cccccc);
  font-size: 13px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--vscode-list-hoverBackground, #2a2d2e);
}

.dropdown-item.selected {
  background: var(--vscode-list-activeSelectionBackground, #04395e);
}

.dropdown-item .codicon {
  font-size: 14px;
  width: 16px;
  flex-shrink: 0;
}

.item-spacer {
  width: 16px;
  flex-shrink: 0;
}

/* Light theme */
@media (prefers-color-scheme: light) {
  .dropdown-trigger {
    color: #424242;
  }
  
  .dropdown-trigger:hover {
    background: #e8e8e8;
  }
  
  .dropdown-menu {
    background: #ffffff;
    border-color: #d0d0d0;
  }
  
  .dropdown-item {
    color: #424242;
  }
  
  .dropdown-item:hover {
    background: #f0f0f0;
  }
  
  .dropdown-item.selected {
    background: #e0e8f0;
  }
}
</style>
