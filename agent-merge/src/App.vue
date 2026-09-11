<script setup>
import { computed, reactive, ref } from 'vue'
import AgentMergeWorkbench from './components/AgentMergeWorkbench.vue'
import {
  createScenarioPullRequestDetails,
  createScenarioSettings,
  getAgentMergeStatus,
  getPrePullRequestAction,
  getScenario,
  repositoryStates,
  scenarios,
} from './model/scenarios.js'
import { createScenarioFollowUpTemplates } from './model/followUps.js'

const handlingVariants = [
  { id: 'permissions', label: 'Permissions' },
  { id: 'scale', label: 'Autonomy scale' },
  { id: 'roles', label: 'Roles' },
]
const handlingVariant = ref(handlingVariants[0].id)
const showChangesPullRequestSettings = ref(true)
const activeScenarioId = ref(scenarios[0].id)
const sessionStates = reactive(
  Object.fromEntries(
    scenarios.map(scenario => [
      scenario.id,
      {
        settings: createScenarioSettings(scenario.id),
        pullRequestDetails: createScenarioPullRequestDetails(scenario.id),
        followUps: [],
        followUpTemplates: createScenarioFollowUpTemplates(scenario.id),
        repositoryState: scenario.repositoryState,
        pullRequestCreated: false,
      },
    ]),
  ),
)
const activeSessionState = computed(
  () => sessionStates[activeScenarioId.value],
)
const settings = computed(() => activeSessionState.value.settings)
const pullRequestDetails = computed(
  () => activeSessionState.value.pullRequestDetails,
)
const followUps = computed(() => activeSessionState.value.followUps)
const followUpTemplates = computed(
  () => activeSessionState.value.followUpTemplates,
)
const repositoryState = computed({
  get: () => activeSessionState.value.repositoryState,
  set: value => {
    activeSessionState.value.repositoryState = value
  },
})
const pullRequestCreated = computed({
  get: () => activeSessionState.value.pullRequestCreated,
  set: value => {
    activeSessionState.value.pullRequestCreated = value
  },
})
const activeScenario = computed(() => getScenario(activeScenarioId.value))
const prePullRequestAction = computed(() =>
  getPrePullRequestAction(repositoryState.value),
)
const agentMergeStatus = computed(() =>
  getAgentMergeStatus(
    activeScenario.value,
    settings.value,
    pullRequestCreated.value,
  ),
)
const sessionSummaries = computed(() =>
  Object.fromEntries(
    scenarios.map(scenario => {
      const sessionState = sessionStates[scenario.id]
      return [
        scenario.id,
        {
          repositoryState: sessionState.repositoryState,
          pullRequestCreated: sessionState.pullRequestCreated,
          settings: sessionState.settings,
          pullRequestDetails: sessionState.pullRequestDetails,
          agentMergeStatus: getAgentMergeStatus(
            scenario,
            sessionState.settings,
            sessionState.pullRequestCreated,
          ),
        },
      ]
    }),
  ),
)
const announcement = computed(() => {
  if (!pullRequestCreated.value) {
    return `Previewing ${activeScenario.value.label}. ${prePullRequestAction.value.announcement}`
  }
  return `Pull request ${activeScenario.value.pullRequestNumber} created. Agent Merge status: ${agentMergeStatus.value.label}.`
})

function updateSetting({ key, value }) {
  settings.value[key] = value
}

function selectScenario(id) {
  if (!sessionStates[id]) {
    throw new Error(`Unknown scenario: ${id}`)
  }
  activeScenarioId.value = id
}

function advanceRepositoryState() {
  const nextState = prePullRequestAction.value.nextState
  if (!nextState) {
    throw new Error(`No repository state follows ${repositoryState.value}`)
  }
  repositoryState.value = nextState
}

function createPullRequest({ details, settings: configuration }) {
  if (repositoryState.value !== repositoryStates.published) {
    throw new Error('The branch must be published before creating a pull request')
  }
  Object.assign(settings.value, configuration)
  Object.assign(pullRequestDetails.value, details)
  pullRequestCreated.value = true
}

function createFollowUp(followUp) {
  if (!pullRequestCreated.value) {
    throw new Error('A pull request is required before creating a follow up')
  }
  followUps.value.push(followUp)
}
</script>

<template>
  <div
    class="prototype-app"
    data-theme="dark"
    data-density="comfortable"
  >
    <aside
      class="prototype-variant-controls"
      aria-label="Prototype controls"
    >
      <label
        v-if="pullRequestCreated"
        class="prototype-settings-toggle"
      >
        <input
          v-model="showChangesPullRequestSettings"
          type="checkbox"
          name="showChangesPullRequestSettings"
          role="switch"
        />
        <span>PR settings in Changes</span>
        <span class="prototype-toggle-track" aria-hidden="true">
          <span />
        </span>
      </label>

      <div class="handling-variant-control">
        <span id="handling-variant-label">Handling design</span>
        <div
          class="variant-switcher"
          role="radiogroup"
          aria-labelledby="handling-variant-label"
        >
          <label
            v-for="variant in handlingVariants"
            :key="variant.id"
            :class="{ selected: handlingVariant === variant.id }"
          >
            <input
              v-model="handlingVariant"
              type="radio"
              name="handlingVariant"
              :value="variant.id"
            />
            <span>{{ variant.label }}</span>
          </label>
        </div>
      </div>

    </aside>

    <main class="prototype-layout">
      <AgentMergeWorkbench
        :scenario="activeScenario"
        :scenarios="scenarios"
        :session-summaries="sessionSummaries"
        :settings="settings"
        :show-changes-pull-request-settings="
          showChangesPullRequestSettings
        "
        :agent-merge-status="agentMergeStatus"
        :handling-variant="handlingVariant"
        :follow-ups="followUps"
        :follow-up-templates="followUpTemplates"
        :pull-request-details="pullRequestDetails"
        :pull-request-created="pullRequestCreated"
        :repository-state="repositoryState"
        @advance:repository-state="advanceRepositoryState"
        @create:pull-request="createPullRequest"
        @create:follow-up="createFollowUp"
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

.prototype-variant-controls {
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex: 0 0 auto;
  gap: var(--vscode-spacing-size120);
  min-height: var(--vscode-spacing-size360);
  padding: var(--vscode-spacing-size60) var(--vscode-spacing-size120);
  background: var(--lab-background);
  border-bottom: var(--vscode-strokeThickness) solid
    var(--vscode-window-border);
}

.handling-variant-control {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size120);
}

.handling-variant-control > span,
.prototype-settings-toggle {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label1);
}

.prototype-settings-toggle {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size80);
  cursor: pointer;
}

.prototype-settings-toggle > input {
  position: absolute;
  width: var(--vscode-strokeThickness);
  height: var(--vscode-strokeThickness);
  opacity: 0;
  pointer-events: none;
}

.prototype-toggle-track {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: var(--vscode-spacing-size320);
  height: var(--vscode-spacing-size200);
  padding: var(--vscode-spacing-size40);
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-circle);
}

.prototype-toggle-track > span {
  width: var(--vscode-spacing-size120);
  height: var(--vscode-spacing-size120);
  background: var(--vscode-descriptionForeground);
  border-radius: var(--vscode-cornerRadius-circle);
}

.prototype-settings-toggle > input:checked ~ .prototype-toggle-track {
  background: var(--vscode-button-background);
  border-color: var(--vscode-button-background);
}

.prototype-settings-toggle
  > input:checked
  ~ .prototype-toggle-track
  > span {
  background: var(--vscode-button-foreground);
  transform: translateX(var(--vscode-spacing-size120));
}

.prototype-settings-toggle:has(input:focus-visible) {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: var(--vscode-spacing-size20);
}

.variant-switcher {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size20);
  padding: var(--vscode-spacing-size20);
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-medium);
}

.variant-switcher label {
  position: relative;
  display: flex;
  align-items: center;
  min-height: var(--vscode-spacing-size240);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-descriptionForeground);
  border-radius: var(--vscode-cornerRadius-small);
  font-size: var(--vscode-fontSize-label1);
  cursor: pointer;
}

.variant-switcher label:hover {
  color: var(--vscode-foreground);
  background: var(--vscode-toolbar-hoverBackground);
}

.variant-switcher label.selected {
  color: var(--vscode-list-activeSelectionForeground);
  background: var(--vscode-list-activeSelectionBackground);
}

.variant-switcher input {
  position: absolute;
  width: var(--vscode-strokeThickness);
  height: var(--vscode-strokeThickness);
  opacity: 0;
  pointer-events: none;
}

.variant-switcher label:has(input:focus-visible) {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

@media (max-width: 560px) {
  .prototype-variant-controls {
    align-items: stretch;
    flex-direction: column;
    gap: var(--vscode-spacing-size40);
  }

  .handling-variant-control {
    align-items: stretch;
    flex-direction: column;
    gap: var(--vscode-spacing-size40);
  }

  .handling-variant-control > span {
    text-align: center;
  }

  .variant-switcher {
    justify-content: center;
  }
}
</style>
