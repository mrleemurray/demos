<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from 'vue'
import {
  agentRoles,
  autonomyLevels,
  inferAgentMergeAutonomyLevel,
  inferAgentMergeRole,
  resolveAgentMergeAutonomyLevel,
  resolveAgentMergeRole,
} from '../model/agentMergeHandling.js'

const props = defineProps({
  variant: {
    type: String,
    required: true,
    validator: value => ['scale', 'roles'].includes(value),
  },
  settings: {
    type: Object,
    required: true,
  },
  namePrefix: {
    type: String,
    default: '',
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:configuration'])
const roleSelect = ref()
const roleSelectTrigger = ref()
const roleOptions = ref()
const roleOptionsOpen = ref(false)
const activeRoleIndex = ref(0)
const roleOptionsPosition = ref({})
const roleListboxId = `agent-merge-role-options-${useId()}`
const autonomyLevel = computed(() =>
  inferAgentMergeAutonomyLevel(props.settings),
)
const selectedAutonomyLevel = computed(() =>
  resolveAgentMergeAutonomyLevel(autonomyLevel.value),
)
const agentRole = computed(() => inferAgentMergeRole(props.settings))
const selectedAgentRole = computed(() =>
  resolveAgentMergeRole(agentRole.value),
)
const autonomyProgress = computed(
  () => `${(autonomyLevel.value / (autonomyLevels.length - 1)) * 100}%`,
)

function getAutonomyProgress(value) {
  return `${(value / (autonomyLevels.length - 1)) * 100}%`
}

function applyConfiguration(configuration) {
  emit('update:configuration', configuration)
}

function selectAutonomyLevel(value) {
  applyConfiguration(resolveAgentMergeAutonomyLevel(value).configuration)
}

function selectAgentRole(id) {
  applyConfiguration(resolveAgentMergeRole(id).configuration)
}

function getSelectedRoleIndex() {
  return Math.max(
    agentRoles.findIndex(role => role.id === agentRole.value),
    0,
  )
}

function setActiveRole(index) {
  activeRoleIndex.value =
    (index + agentRoles.length) % agentRoles.length
}

async function positionRoleOptions() {
  const triggerBounds =
    roleSelectTrigger.value?.getBoundingClientRect()
  const targetWindow =
    roleSelectTrigger.value?.ownerDocument.defaultView
  if (!triggerBounds || !targetWindow) {
    return
  }

  const gap = 4
  const viewportPadding = 8
  roleOptionsPosition.value = {
    top: `${triggerBounds.bottom + gap}px`,
    left: `${triggerBounds.left}px`,
    width: `${triggerBounds.width}px`,
  }
  await nextTick()

  const optionsBounds = roleOptions.value?.getBoundingClientRect()
  if (
    optionsBounds &&
    optionsBounds.bottom > targetWindow.innerHeight - viewportPadding &&
    triggerBounds.top > targetWindow.innerHeight - triggerBounds.bottom
  ) {
    roleOptionsPosition.value = {
      ...roleOptionsPosition.value,
      top: `${Math.max(
        viewportPadding,
        triggerBounds.top - optionsBounds.height - gap,
      )}px`,
    }
  }
}

async function openRoleOptions(index = getSelectedRoleIndex()) {
  setActiveRole(index)
  roleOptionsOpen.value = true
  roleSelectTrigger.value?.focus()
  await positionRoleOptions()
}

async function closeRoleOptions(restoreFocus = false) {
  roleOptionsOpen.value = false
  if (restoreFocus) {
    await nextTick()
    roleSelectTrigger.value?.focus()
  }
}

async function toggleRoleOptions() {
  if (roleOptionsOpen.value) {
    await closeRoleOptions()
  } else {
    await openRoleOptions()
  }
}

async function chooseAgentRole(id) {
  selectAgentRole(id)
  await closeRoleOptions(true)
}

async function handleRoleTriggerKeydown(event) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (roleOptionsOpen.value) {
        setActiveRole(activeRoleIndex.value + 1)
      } else {
        await openRoleOptions()
      }
      return
    case 'ArrowUp':
      event.preventDefault()
      if (roleOptionsOpen.value) {
        setActiveRole(activeRoleIndex.value - 1)
      } else {
        await openRoleOptions()
      }
      return
    case 'Home':
      if (roleOptionsOpen.value) {
        event.preventDefault()
        setActiveRole(0)
      }
      return
    case 'End':
      if (roleOptionsOpen.value) {
        event.preventDefault()
        setActiveRole(agentRoles.length - 1)
      }
      return
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (roleOptionsOpen.value) {
        await chooseAgentRole(agentRoles[activeRoleIndex.value].id)
      } else {
        await openRoleOptions()
      }
      return
    case 'Escape':
      if (roleOptionsOpen.value) {
        event.preventDefault()
        event.stopPropagation()
        await closeRoleOptions(true)
      }
      return
    case 'Tab':
      roleOptionsOpen.value = false
      return
  }

  if (roleOptionsOpen.value && event.key.length === 1) {
    const search = event.key.toLocaleLowerCase()
    const candidates = [
      ...agentRoles.slice(activeRoleIndex.value + 1),
      ...agentRoles.slice(0, activeRoleIndex.value + 1),
    ]
    const nextRole = candidates.find(role =>
      role.label.toLocaleLowerCase().startsWith(search),
    )
    if (nextRole) {
      event.preventDefault()
      setActiveRole(
        agentRoles.findIndex(role => role.id === nextRole.id),
      )
    }
  }
}

function handleDocumentPointerDown(event) {
  if (
    roleOptionsOpen.value &&
    !roleSelect.value?.contains(event.target)
  ) {
    roleOptionsOpen.value = false
  }
}

function normalizeConfiguration() {
  const configuration =
    props.variant === 'scale'
      ? selectedAutonomyLevel.value.configuration
      : selectedAgentRole.value.configuration
  const differs = Object.entries(configuration).some(
    ([key, value]) => props.settings[key] !== value,
  )
  if (differs) {
    applyConfiguration(configuration)
  }
}

watch(
  () => props.variant,
  () => {
    roleOptionsOpen.value = false
    normalizeConfiguration()
  },
)
onMounted(() => {
  normalizeConfiguration()
  document.addEventListener(
    'pointerdown',
    handleDocumentPointerDown,
    true,
  )
})
onBeforeUnmount(() => {
  document.removeEventListener(
    'pointerdown',
    handleDocumentPointerDown,
    true,
  )
})
</script>

<template>
  <fieldset
    v-if="variant === 'scale'"
    class="agent-merge-handling autonomy-scale"
    :class="{ compact }"
  >
    <legend>Agent autonomy</legend>
    <p>Choose how much of the pull request lifecycle the agent owns.</p>
    <div
      class="autonomy-range"
      :style="{ '--autonomy-progress': autonomyProgress }"
    >
      <div class="autonomy-scale-track" aria-hidden="true">
        <span class="autonomy-track-complete" />
        <span class="autonomy-track-remaining" />
        <span
          v-for="level in autonomyLevels"
          :key="level.value"
          class="autonomy-stop"
          :class="{ complete: level.value <= autonomyLevel }"
          :style="{ left: getAutonomyProgress(level.value) }"
        />
      </div>
      <input
        type="range"
        :name="`${namePrefix}agentMergeAutonomy`"
        :value="autonomyLevel"
        :min="autonomyLevels[0].value"
        :max="autonomyLevels.at(-1).value"
        step="1"
        aria-label="Agent Merge autonomy"
        :aria-valuetext="selectedAutonomyLevel.label"
        @input="selectAutonomyLevel($event.target.value)"
      />
    </div>
    <div class="autonomy-scale-endpoints" aria-hidden="true">
      <span>{{ autonomyLevels[0].label }}</span>
      <span>{{ autonomyLevels.at(-1).label }}</span>
    </div>
    <div class="autonomy-level-summary" aria-live="polite">
      <strong>{{ selectedAutonomyLevel.label }}</strong>
      <span>{{ selectedAutonomyLevel.description }}</span>
    </div>
  </fieldset>

  <fieldset
    v-else
    class="agent-merge-handling agent-role-selector"
    :class="{ compact }"
  >
    <legend>Agent role</legend>
    <template v-if="compact">
      <div ref="roleSelect" class="role-select">
        <button
          ref="roleSelectTrigger"
          class="role-select-trigger"
          type="button"
          aria-haspopup="listbox"
          :aria-expanded="roleOptionsOpen"
          :aria-controls="roleOptionsOpen ? roleListboxId : undefined"
          :aria-activedescendant="
            roleOptionsOpen
              ? `${roleListboxId}-${agentRoles[activeRoleIndex].id}`
              : undefined
          "
          :aria-label="`Agent role: ${selectedAgentRole.label}. ${selectedAgentRole.description}`"
          :data-selected-role="agentRole"
          @click="toggleRoleOptions"
          @keydown="handleRoleTriggerKeydown"
        >
          <i
            class="codicon role-select-icon"
            :class="selectedAgentRole.icon"
            aria-hidden="true"
          />
          <span class="role-select-copy">
            <strong>{{ selectedAgentRole.label }}</strong>
            <span class="selected-role-description" aria-live="polite">
              {{ selectedAgentRole.description }}
            </span>
          </span>
          <i
            class="codicon codicon-chevron-down role-select-chevron"
            :class="{ open: roleOptionsOpen }"
            aria-hidden="true"
          />
        </button>

        <div
          v-if="roleOptionsOpen"
          ref="roleOptions"
          :id="roleListboxId"
          class="role-select-options"
          role="listbox"
          aria-label="Agent roles"
          :style="roleOptionsPosition"
        >
          <button
            v-for="(role, index) in agentRoles"
            :key="role.id"
            class="role-select-option"
            :class="{ active: activeRoleIndex === index }"
            type="button"
            role="option"
            tabindex="-1"
            :id="`${roleListboxId}-${role.id}`"
            :aria-selected="agentRole === role.id"
            :data-agent-role="role.id"
            @click="chooseAgentRole(role.id)"
            @pointerenter="activeRoleIndex = index"
          >
            <span class="role-option-check" aria-hidden="true">
              <i
                v-if="agentRole === role.id"
                class="codicon codicon-check"
              />
            </span>
            <i class="codicon" :class="role.icon" aria-hidden="true" />
            <span class="role-select-copy">
              <strong>{{ role.label }}</strong>
              <span>{{ role.description }}</span>
            </span>
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <p>Choose a role with a defined set of pull request abilities.</p>
      <label
        v-for="role in agentRoles"
        :key="role.id"
        :class="{ selected: agentRole === role.id }"
      >
        <input
          type="radio"
          :name="`${namePrefix}agentMergeRole`"
          :value="role.id"
          :checked="agentRole === role.id"
          @change="selectAgentRole(role.id)"
        />
        <i class="codicon" :class="role.icon" aria-hidden="true" />
        <span>
          <strong>{{ role.label }}</strong>
          <span>{{ role.description }}</span>
        </span>
      </label>
    </template>
  </fieldset>
</template>

<style scoped>
.agent-merge-handling {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size100);
  margin: var(--vscode-spacing-size200) 0 0;
  padding: 0;
  border: 0;
}

.agent-merge-handling.compact {
  margin: var(--vscode-spacing-size120) 0 0;
  padding: 0 var(--vscode-spacing-size160) var(--vscode-spacing-size160);
}

.agent-merge-handling legend {
  margin-bottom: var(--vscode-spacing-size80);
  padding: 0;
  color: var(--vscode-foreground);
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.agent-merge-handling p {
  margin: 0 0 var(--vscode-spacing-size40);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body1);
  line-height: 1.5;
}

.agent-merge-handling.compact p {
  font-size: var(--vscode-fontSize-body2);
}

.autonomy-range {
  position: relative;
  height: var(--vscode-spacing-size200);
}

.autonomy-scale-track {
  position: absolute;
  top: 50%;
  right: calc(var(--vscode-spacing-size160) / 2);
  left: calc(var(--vscode-spacing-size160) / 2);
  height: 0;
}

.autonomy-track-complete,
.autonomy-track-remaining {
  position: absolute;
  top: 0;
  height: 0;
}

.autonomy-track-complete {
  left: 0;
  width: var(--autonomy-progress);
  border-top: var(--vscode-spacing-size40) solid
    var(--vscode-button-background);
  transform: translateY(-50%);
}

.autonomy-track-remaining {
  right: 0;
  left: 0;
  height: var(--vscode-strokeThickness);
  background: repeating-linear-gradient(
    to right,
    var(--vscode-input-border) 0,
    var(--vscode-input-border) var(--vscode-spacing-size40),
    transparent var(--vscode-spacing-size40),
    transparent var(--vscode-spacing-size80)
  );
  clip-path: inset(0 0 0 var(--autonomy-progress));
  transform: translateY(-50%);
}

.autonomy-stop {
  position: absolute;
  top: 0;
  width: var(--vscode-spacing-size80);
  height: var(--vscode-spacing-size80);
  background: var(--vscode-input-border);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-circle);
  transform: translate(-50%, -50%);
}

.autonomy-stop.complete {
  background: var(--vscode-button-background);
  border-color: var(--vscode-button-background);
}

.autonomy-range > input {
  position: relative;
  z-index: 1;
  width: 100%;
  height: var(--vscode-spacing-size200);
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.autonomy-range > input::-webkit-slider-runnable-track {
  height: var(--vscode-spacing-size40);
  background: transparent;
  border-radius: var(--vscode-cornerRadius-circle);
}

.autonomy-range > input::-webkit-slider-thumb {
  width: var(--vscode-spacing-size160);
  height: var(--vscode-spacing-size160);
  margin-top: calc(-1 * var(--vscode-spacing-size60));
  appearance: none;
  background: var(--vscode-button-background);
  border: 0;
  border-radius: var(--vscode-cornerRadius-circle);
}

.autonomy-range > input::-moz-range-track {
  height: var(--vscode-spacing-size40);
  background: transparent;
  border-radius: var(--vscode-cornerRadius-circle);
}

.autonomy-range > input::-moz-range-progress {
  height: var(--vscode-spacing-size40);
  background: transparent;
  border-radius: var(--vscode-cornerRadius-circle);
}

.autonomy-range > input::-moz-range-thumb {
  width: var(--vscode-spacing-size160);
  height: var(--vscode-spacing-size160);
  background: var(--vscode-button-background);
  border: 0;
  border-radius: var(--vscode-cornerRadius-circle);
}

.autonomy-scale-endpoints {
  display: flex;
  justify-content: space-between;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label2);
}

.autonomy-level-summary {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size40);
  padding: var(--vscode-spacing-size120);
  background: var(--vscode-chat-statusBackground);
  border-radius: var(--vscode-cornerRadius-medium);
}

.autonomy-level-summary > span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.agent-role-selector label {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: start;
  gap: var(--vscode-spacing-size100);
  padding: var(--vscode-spacing-size100) var(--vscode-spacing-size120);
  background: transparent;
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-medium);
  cursor: pointer;
}

.agent-role-selector label:hover {
  background: var(--vscode-list-hoverBackground);
}

.agent-role-selector label.selected {
  background: var(--vscode-list-activeSelectionBackground);
  border-color: var(--vscode-focusBorder);
}

.agent-role-selector input {
  margin: var(--vscode-spacing-size20) 0 0;
  accent-color: var(--vscode-button-background);
}

.agent-role-selector label > .codicon {
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-icon-foreground);
}

.agent-role-selector label > span {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size40);
  min-width: 0;
}

.agent-role-selector label > span > span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.agent-role-selector.compact {
  position: relative;
}

.role-select {
  position: relative;
}

.role-select-trigger {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  width: 100%;
  min-height: var(--prototype-button-height);
  gap: var(--vscode-spacing-size100);
  padding: var(--vscode-spacing-size80) var(--vscode-spacing-size100);
  color: var(--vscode-input-foreground);
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-small);
  text-align: left;
  cursor: pointer;
}

.role-select-trigger:hover,
.role-select-trigger[aria-expanded='true'] {
  background: var(--vscode-list-hoverBackground);
}

.role-select-icon,
.role-select-chevron,
.role-select-option > .codicon {
  margin-top: var(--vscode-spacing-size20);
}

.role-select-icon {
  color: var(--vscode-icon-foreground);
}

.role-select-chevron {
  color: var(--vscode-descriptionForeground);
}

.role-select-chevron.open {
  transform: rotate(180deg);
}

.role-select-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size40);
}

.role-select-copy strong,
.role-select-copy > span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.role-select-copy > span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
  line-height: 1.4;
}

.role-select-options {
  position: fixed;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size20);
  max-height: min(
    calc(10 * var(--vscode-spacing-size320)),
    calc(100vh - (2 * var(--vscode-spacing-size80)))
  );
  padding: var(--vscode-spacing-size40);
  background: var(--vscode-agentsPanel-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-window-border);
  border-radius: var(--vscode-cornerRadius-large);
  box-shadow: 0 var(--vscode-spacing-size80)
    var(--vscode-spacing-size240) var(--vscode-widget-shadow);
  overflow-y: auto;
}

.role-select-option {
  display: grid;
  grid-template-columns: var(--vscode-spacing-size160)
    var(--vscode-spacing-size160) minmax(0, 1fr);
  align-items: start;
  width: 100%;
  gap: var(--vscode-spacing-size80);
  padding: var(--vscode-spacing-size80);
  color: var(--vscode-foreground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
  text-align: left;
  cursor: pointer;
}

.role-select-option:hover,
.role-select-option.active {
  background: var(--vscode-list-hoverBackground);
}

.role-select-option[aria-selected='true'] {
  color: var(--vscode-list-activeSelectionForeground);
  background: var(--vscode-list-activeSelectionBackground);
}

.role-select-option[aria-selected='true'] .role-select-copy > span {
  color: inherit;
  opacity: 0.8;
}

.role-option-check {
  display: grid;
  place-items: center;
  width: var(--vscode-spacing-size160);
  height: var(--vscode-spacing-size160);
}

.role-option-check > .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
}

.autonomy-range > input:focus-visible,
.role-select-trigger:focus-visible,
.role-select-option:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.agent-role-selector label:has(input:focus-visible) {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: var(--vscode-spacing-size20);
}
</style>
