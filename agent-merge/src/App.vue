<script setup>
import { computed, reactive } from 'vue'
import AgentMergeWorkbench from './components/AgentMergeWorkbench.vue'
import {
  createDefaultSettings,
  createScenarioSettings,
  formatAgentMergeStatus,
  getScenario,
  scenarios,
} from './model/scenarios.js'

const settings = reactive(createDefaultSettings())
const activeScenario = computed(() => getScenario(settings.scenarioId))
const announcement = computed(
  () =>
    `Previewing ${activeScenario.value.label}. ${formatAgentMergeStatus(
      activeScenario.value,
    )}. Agent Merge is ${settings.enabled ? 'enabled' : 'disabled'}.`,
)

function updateSetting({ key, value }) {
  settings[key] = value
}

function selectScenario(id) {
  Object.assign(settings, createScenarioSettings(id))
}
</script>

<template>
  <div
    class="prototype-app"
    data-theme="dark"
    data-density="comfortable"
  >
    <main class="prototype-layout">
      <AgentMergeWorkbench
        :scenario="activeScenario"
        :scenarios="scenarios"
        :settings="settings"
        @select:scenario="selectScenario"
        @update:setting="updateSetting"
      />
    </main>

    <p class="sr-only" aria-live="polite">{{ announcement }}</p>
  </div>
</template>

<style scoped>
.prototype-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  color: var(--vscode-foreground);
  background: var(--lab-background);
  overflow: hidden;
}

.prototype-layout {
  flex: 1;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
