<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AgentMergeCard from './AgentMergeCard.vue'
import AgentMergeStatusWidget from './AgentMergeStatusWidget.vue'
import CreateFollowUpDialog from './CreateFollowUpDialog.vue'
import CreatePullRequestDialog from './CreatePullRequestDialog.vue'
import FollowUpDialog from './FollowUpDialog.vue'
import FollowUpsSurface from './FollowUpsSurface.vue'
import { createFollowUp as createFollowUpModel } from '../model/followUps.js'
import {
  formatAgentMergeStatus,
  getPrePullRequestAction,
} from '../model/scenarios.js'

const props = defineProps({
  scenario: {
    type: Object,
    required: true,
  },
  scenarios: {
    type: Array,
    required: true,
  },
  sessionSummaries: {
    type: Object,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
  showChangesPullRequestSettings: {
    type: Boolean,
    required: true,
  },
  agentMergeStatus: {
    type: Object,
    required: true,
  },
  handlingVariant: {
    type: String,
    required: true,
  },
  followUps: {
    type: Array,
    required: true,
  },
  followUpTemplates: {
    type: Array,
    required: true,
  },
  pullRequestDetails: {
    type: Object,
    required: true,
  },
  pullRequestCreated: {
    type: Boolean,
    required: true,
  },
  repositoryState: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'advance:repository-state',
  'create:follow-up',
  'create:pull-request',
  'select:scenario',
  'update:setting',
])

const createPullRequestTrigger = ref()
const pullRequestCreatedMessage = ref()
const agentMergeSettingsTrigger = ref()
const showingCreatePullRequestDialog = ref(false)
const showingAgentMergeSettingsDialog = ref(false)
const showingCreateFollowUpDialog = ref(false)
const selectedFollowUp = ref()
const createFollowUpTrigger = ref()
const followUpTrigger = ref()
const detailsVisible = ref(true)
const inactiveSessionStatusId = ref()
const inactiveSessionStatusPosition = ref({})
const inactiveSessionStatusTrigger = ref()
const inactiveSessionHoverDelay = 1000
let inactiveSessionHoverTimer
const projectName = 'vscode'
const status = computed(() => formatAgentMergeStatus(props.scenario))
const prePullRequestAction = computed(() =>
  getPrePullRequestAction(props.repositoryState),
)
const agentMergeStatusIcon = computed(() =>
  getAgentMergeStatusIcon(props.agentMergeStatus.kind),
)
const pullRequestScenario = computed(() => ({
  ...props.scenario,
  title: props.pullRequestDetails.title,
  baseBranch: props.pullRequestDetails.baseBranch,
}))
const mergePolicy = computed(() => {
  switch (props.settings.mergePullRequest) {
    case 'always':
      return 'Merge automatically when ready'
    case 'ifUnchanged':
      return 'Merge only if Agent Merge makes no changes'
    default:
      return 'Leave the pull request open'
  }
})

const authorizedActions = computed(() =>
  [
    props.settings.addressReviews && 'reviews',
    props.settings.fixCI && 'CI',
    props.settings.resolveConflicts && 'conflicts',
  ].filter(Boolean),
)
const agentMergePolicyDescription = computed(() => {
  if (!props.settings.enabled) {
    return "You're in control of reviews, checks, and merging."
  }
  if (!authorizedActions.value.length) {
    return `It can monitor the pull request, but no repair actions are allowed. ${mergePolicy.value}.`
  }
  return `It may handle ${authorizedActions.value.join(', ')}. ${mergePolicy.value}.`
})
const nextFollowUpTemplate = computed(
  () =>
    props.followUpTemplates.find(
      template =>
        !props.followUps.some(
          followUp => followUp.templateId === template.id,
        ),
    ) ?? {
      id: 'follow-up-task',
      name: `Follow up on #${props.scenario.pullRequestNumber}`,
      description: 'Run future work related to this pull request.',
      fileName: 'follow-up-task.followup.md',
      triggerType: 'event',
      event: 'pull_request.merged',
      eventLabel: 'Pull request merged',
      sourceLabel: 'GitHub webhook',
      delay: '1d',
      timingLabel: '1 day after merge',
      statusLabel: 'Waiting for pull request merge',
      instructions: 'Describe the follow-up work to complete.',
    },
)

function openAgentMergeSettings(event) {
  if (!props.showChangesPullRequestSettings) {
    throw new Error('Pull request settings in Changes are hidden')
  }
  agentMergeSettingsTrigger.value = event.currentTarget
  showingAgentMergeSettingsDialog.value = true
}

function openFollowUp({ followUp, trigger }) {
  selectedFollowUp.value = followUp
  followUpTrigger.value = trigger
}

function openCreateFollowUp({ trigger }) {
  createFollowUpTrigger.value = trigger
  showingCreateFollowUpDialog.value = true
}

function getChangeCountLabel(file) {
  const additions = file.additions === 1 ? 'addition' : 'additions'
  const deletions = file.deletions === 1 ? 'deletion' : 'deletions'
  return `${file.additions} ${additions}, ${file.deletions} ${deletions}`
}

function getSessionRepositoryAction(session) {
  return getPrePullRequestAction(
    props.sessionSummaries[session.id].repositoryState,
  )
}

function getSessionListState(session) {
  const summary = props.sessionSummaries[session.id]
  if (summary.pullRequestCreated) {
    return {
      kind: summary.agentMergeStatus.kind,
      icon: getAgentMergeStatusIcon(summary.agentMergeStatus.kind),
      label: `#${session.pullRequestNumber} · ${summary.agentMergeStatus.label}`,
    }
  }

  const repositoryAction = getSessionRepositoryAction(session)
  return {
    kind: repositoryAction.kind,
    icon: repositoryAction.sessionIcon,
    label: repositoryAction.sessionLabel,
  }
}

function getAgentMergeStatusIcon(kind) {
  switch (kind) {
    case 'disabled':
      return 'codicon-circle-slash'
    case 'monitoring':
      return 'codicon-eye'
    default:
      return 'codicon-git-merge'
  }
}

function canShowInactiveSessionStatus(session) {
  const summary = props.sessionSummaries[session.id]
  return (
    session.id !== props.scenario.id &&
    summary.pullRequestCreated &&
    summary.settings.enabled
  )
}

function clearInactiveSessionHoverTimer() {
  if (inactiveSessionHoverTimer !== undefined) {
    clearTimeout(inactiveSessionHoverTimer)
    inactiveSessionHoverTimer = undefined
  }
}

function openInactiveSessionStatus(container, session) {
  if (!canShowInactiveSessionStatus(session)) {
    return
  }

  const bounds = container.getBoundingClientRect()
  const targetWindow = container.ownerDocument.defaultView
  const position = {
    left: `${bounds.right}px`,
  }

  if (bounds.top + bounds.height / 2 <= targetWindow.innerHeight / 2) {
    position.top = `${bounds.top}px`
  } else {
    position.bottom = `${targetWindow.innerHeight - bounds.bottom}px`
  }

  inactiveSessionStatusTrigger.value =
    container.querySelector('.session-item')
  inactiveSessionStatusPosition.value = position
  inactiveSessionStatusId.value = session.id
}

function showInactiveSessionStatus(event, session) {
  clearInactiveSessionHoverTimer()
  const container = event.currentTarget
  if (event.type === 'mouseenter') {
    inactiveSessionHoverTimer = setTimeout(() => {
      inactiveSessionHoverTimer = undefined
      openInactiveSessionStatus(container, session)
    }, inactiveSessionHoverDelay)
    return
  }

  openInactiveSessionStatus(container, session)
}

function hideInactiveSessionStatus(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    clearInactiveSessionHoverTimer()
    inactiveSessionStatusId.value = undefined
  }
}

async function closeInactiveSessionStatus(restoreFocus = false) {
  clearInactiveSessionHoverTimer()
  if (restoreFocus) {
    inactiveSessionStatusTrigger.value?.focus()
  }
  inactiveSessionStatusId.value = undefined
  await nextTick()
}

watch(
  () => props.scenario.id,
  () => {
    clearInactiveSessionHoverTimer()
    showingCreatePullRequestDialog.value = false
    showingAgentMergeSettingsDialog.value = false
    showingCreateFollowUpDialog.value = false
    selectedFollowUp.value = undefined
    createFollowUpTrigger.value = undefined
    followUpTrigger.value = undefined
    inactiveSessionStatusId.value = undefined
  },
)
watch(
  () => props.showChangesPullRequestSettings,
  visible => {
    if (!visible) {
      showingAgentMergeSettingsDialog.value = false
    }
  },
)

onBeforeUnmount(clearInactiveSessionHoverTimer)

function openCreatePullRequestDialog(event) {
  createPullRequestTrigger.value = event.currentTarget
  showingCreatePullRequestDialog.value = true
}

function runRepositoryAction(event) {
  if (prePullRequestAction.value.opensPullRequest) {
    openCreatePullRequestDialog(event)
    return
  }
  emit('advance:repository-state')
}

async function cancelCreatePullRequest() {
  showingCreatePullRequestDialog.value = false
  await nextTick()
  createPullRequestTrigger.value?.focus()
}

async function createPullRequest(configuration) {
  const { followUp: followUpDraft, ...pullRequestConfiguration } =
    configuration
  emit('create:pull-request', pullRequestConfiguration)
  if (followUpDraft) {
    emit(
      'create:follow-up',
      createFollowUpModel(followUpDraft, props.followUps),
    )
  }
  showingCreatePullRequestDialog.value = false
  createPullRequestTrigger.value = undefined
  await nextTick()
  pullRequestCreatedMessage.value?.focus()
}

async function closeAgentMergeSettings() {
  showingAgentMergeSettingsDialog.value = false
  await nextTick()
  agentMergeSettingsTrigger.value?.focus()
}

async function closeFollowUp() {
  selectedFollowUp.value = undefined
  await nextTick()
  followUpTrigger.value?.focus()
  followUpTrigger.value = undefined
}

async function cancelCreateFollowUp() {
  showingCreateFollowUpDialog.value = false
  await nextTick()
  createFollowUpTrigger.value?.focus()
}

async function createFollowUp(draft) {
  const targetDocument = createFollowUpTrigger.value?.ownerDocument
  const followUp = createFollowUpModel(draft, props.followUps)
  emit('create:follow-up', followUp)
  showingCreateFollowUpDialog.value = false
  createFollowUpTrigger.value = undefined
  await nextTick()
  targetDocument
    ?.querySelector(`[data-follow-up-id="${followUp.id}"]`)
    ?.focus()
}

async function saveAgentMergeSettings(settings) {
  for (const [key, value] of Object.entries(settings)) {
    emit('update:setting', { key, value })
  }
  await closeAgentMergeSettings()
}
</script>

<template>
  <section class="prototype-stage" aria-label="Agent Merge preview">
    <div class="agents-window-frame">
      <header class="agents-window-titlebar">
        <div class="titlebar-left">
          <div class="traffic-lights" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <button type="button" aria-label="Toggle Primary Side Bar" aria-pressed="true">
            <i class="codicon codicon-layout-sidebar-left" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Go Back">
            <i class="codicon codicon-arrow-left" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Go Forward">
            <i class="codicon codicon-arrow-right" aria-hidden="true" />
          </button>
        </div>

        <div class="titlebar-center">
          <div class="command-center">
            <button
              class="project-picker"
              type="button"
              :aria-label="`Show Workspace: ${projectName}`"
            >
              <i class="codicon codicon-folder" aria-hidden="true" />
              <span class="project-picker-title">{{ projectName }}</span>
            </button>
            <AgentMergeStatusWidget
              v-if="pullRequestCreated"
              :status="agentMergeStatus"
              :scenario="scenario"
              :settings="settings"
              :handling-variant="handlingVariant"
              :pull-request-details="pullRequestDetails"
              @update:setting="emit('update:setting', $event)"
            />
          </div>
        </div>

        <div class="titlebar-right">
          <button
            class="details-toggle"
            type="button"
            :aria-label="detailsVisible ? 'Hide Details' : 'Show Details'"
            :aria-pressed="detailsVisible"
            aria-controls="changes-part"
            @click="detailsVisible = !detailsVisible"
          >
            <i class="codicon codicon-layout-sidebar-right" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Accounts">
            <i class="codicon codicon-account" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div class="agents-window-content">
        <aside class="sessions-sidebar" aria-label="Sessions">
          <header class="sessions-header">
            <h3>Sessions</h3>
            <div class="sessions-header-actions">
              <button
                class="new-session-button"
                type="button"
                aria-label="New Session, Command N"
              >
                <span class="new-session-label">New</span>
                <kbd class="new-session-shortcut" aria-hidden="true">⌘ N</kbd>
              </button>
              <button type="button" aria-label="Search Sessions">
                <i class="codicon codicon-search" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Filter Sessions">
                <i class="codicon codicon-filter" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div class="sessions-list">
            <FollowUpsSurface
              :follow-ups="followUps"
              :can-create="pullRequestCreated"
              @create="openCreateFollowUp"
              @open="openFollowUp"
            />
            <section aria-labelledby="workspace-sessions-title">
              <h4 id="workspace-sessions-title" class="session-group-heading">
                <i class="codicon codicon-chevron-down" aria-hidden="true" />
                {{ projectName }}
              </h4>
              <div
                v-for="session in scenarios"
                :key="session.id"
                class="session-item-container"
                :class="{
                  'showing-status-overlay':
                    inactiveSessionStatusId === session.id,
                }"
                @mouseenter="showInactiveSessionStatus($event, session)"
                @mouseleave="hideInactiveSessionStatus"
                @focusin="showInactiveSessionStatus($event, session)"
                @focusout="hideInactiveSessionStatus"
              >
                <button
                  class="session-item"
                  :class="{ active: session.id === scenario.id }"
                  type="button"
                  :data-session-id="session.id"
                  :data-agent-merge-state="
                    sessionSummaries[session.id].pullRequestCreated
                      ? sessionSummaries[session.id].agentMergeStatus.kind
                      : undefined
                  "
                  :data-repository-state="
                    sessionSummaries[session.id].repositoryState
                  "
                  :aria-current="
                    session.id === scenario.id ? 'page' : undefined
                  "
                  :aria-haspopup="
                    canShowInactiveSessionStatus(session)
                      ? 'dialog'
                      : undefined
                  "
                  :aria-expanded="
                    canShowInactiveSessionStatus(session)
                      ? inactiveSessionStatusId === session.id
                      : undefined
                  "
                  @click="emit('select:scenario', session.id)"
                >
                  <span
                    class="session-status-icon"
                    :class="`status-${getSessionListState(session).kind}`"
                  >
                    <i
                      class="codicon"
                      :class="getSessionListState(session).icon"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="session-main">
                    <span class="session-title-row">
                      <strong>{{ session.title }}</strong>
                    </span>
                    <span class="session-details-row">
                      <span class="session-state-label">
                        {{ getSessionListState(session).label }}
                      </span>
                      <span aria-hidden="true">·</span>
                      <time>{{ session.relativeTime }}</time>
                    </span>
                  </span>
                </button>
                <AgentMergeStatusWidget
                  v-if="
                    inactiveSessionStatusId === session.id &&
                    canShowInactiveSessionStatus(session)
                  "
                  class="session-status-hover-widget"
                  :style="inactiveSessionStatusPosition"
                  :status="sessionSummaries[session.id].agentMergeStatus"
                  :scenario="session"
                  :settings="sessionSummaries[session.id].settings"
                  :handling-variant="handlingVariant"
                  :pull-request-details="
                    sessionSummaries[session.id].pullRequestDetails
                  "
                  overlay-only
                  preview-only
                  @close="closeInactiveSessionStatus"
                />
              </div>
            </section>
          </div>

        </aside>

        <div
          class="agents-main-region"
          :class="{ 'details-visible': detailsVisible }"
        >
          <section class="sessions-part agents-part-card" aria-label="Active session">
            <header class="session-header">
              <i
                class="codicon"
                :class="pullRequestCreated ? 'codicon-git-merge' : 'codicon-check'"
                aria-hidden="true"
              />
              <strong :title="scenario.title">{{ scenario.title }}</strong>
              <div class="session-header-actions">
                <button type="button" aria-label="Split Chat">
                  <i class="codicon codicon-split-horizontal" aria-hidden="true" />
                </button>
                <button type="button" aria-label="More Session Actions">
                  <i class="codicon codicon-ellipsis" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div class="session-content">
              <div class="chat-transcript" aria-label="Agent conversation">
                <article class="chat-request">
                  <p>{{ scenario.request }}</p>
                </article>

                <article class="chat-response" aria-label="Agent response">
                  <p>{{ scenario.completion }}</p>
                  <p
                    v-if="prePullRequestAction.opensPullRequest"
                    class="repository-action-question"
                  >
                    {{ prePullRequestAction.chatPrompt }}
                  </p>
                  <button
                    v-if="
                      !pullRequestCreated &&
                      prePullRequestAction.opensPullRequest
                    "
                    class="repository-action"
                    type="button"
                    :data-repository-action="prePullRequestAction.kind"
                    @click="openCreatePullRequestDialog"
                  >
                    <i
                      class="codicon"
                      :class="prePullRequestAction.icon"
                      aria-hidden="true"
                    />
                    {{ prePullRequestAction.label }}
                  </button>
                </article>

                <article
                  v-if="pullRequestCreated"
                  ref="pullRequestCreatedMessage"
                  class="chat-response pull-request-created-message"
                  aria-label="Agent response"
                  tabindex="-1"
                >
                  <p class="pull-request-created-status">
                    <i
                      class="codicon codicon-git-pull-request"
                      aria-hidden="true"
                    />
                    <span>
                      Created pull request
                      <a :href="scenario.pullRequestUrl" target="_blank" rel="noreferrer">
                        #{{ scenario.pullRequestNumber }}
                      </a>
                      from <code>{{ scenario.branch }}</code> into
                      <code>{{ pullRequestDetails.baseBranch }}</code>.
                    </span>
                  </p>
                </article>

                <article
                  v-if="pullRequestCreated && !settings.enabled"
                  class="agent-merge-session-status"
                  :class="`status-${agentMergeStatus.kind}`"
                  data-agent-merge-surface="session"
                  :data-agent-merge-state="agentMergeStatus.kind"
                >
                  <i
                    class="codicon"
                    :class="agentMergeStatusIcon"
                    aria-hidden="true"
                  />
                  <div>
                    <div class="agent-merge-session-status-heading">
                      <strong
                        data-agent-merge-status-label
                        :aria-label="`Agent Merge status: ${agentMergeStatus.label}`"
                        :title="agentMergeStatus.label"
                      >
                        {{ agentMergeStatus.label }}
                      </strong>
                      <span aria-hidden="true">Agent Merge</span>
                    </div>
                    <p>{{ agentMergePolicyDescription }}</p>
                  </div>
                </article>

                <AgentMergeCard
                  v-if="pullRequestCreated && settings.enabled"
                  :scenario="pullRequestScenario"
                  :activity="agentMergeStatus"
                  :policy-description="agentMergePolicyDescription"
                />

                <article
                  v-if="pullRequestCreated && settings.enabled"
                  class="chat-response latest-response"
                  aria-label="Agent response"
                >
                  <p>{{ scenario.response }}</p>
                </article>

              </div>

              <div class="chat-input">
                <input type="text" aria-label="Chat Input" placeholder="Ask anything" />
                <div class="chat-input-footer">
                  <span>
                    <i class="codicon codicon-sparkle" aria-hidden="true" />
                    Agent
                  </span>
                  <button type="button" aria-label="Send Message" disabled>
                    <i class="codicon codicon-send" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside
            v-if="detailsVisible"
            id="changes-part"
            class="changes-part agents-part-card"
            :aria-label="pullRequestCreated ? 'Pull request changes' : 'Feature changes'"
          >
            <div class="pane-title">
              <span>Changes</span>
              <div>
                <button type="button" aria-label="Refresh Changes">
                  <i class="codicon codicon-refresh" aria-hidden="true" />
                </button>
                <button type="button" aria-label="More Change Actions">
                  <i class="codicon codicon-ellipsis" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div class="pull-request-summary">
              <div class="pull-request-heading">
                <i
                  class="codicon"
                  :class="
                    pullRequestCreated
                      ? 'codicon-git-pull-request'
                      : 'codicon-git-branch'
                  "
                  aria-hidden="true"
                />
                <div>
                  <strong>
                    {{
                      pullRequestCreated
                        ? `#${scenario.pullRequestNumber}`
                        : scenario.branch
                    }}
                  </strong>
                  <span v-if="pullRequestCreated">
                    {{ `${pullRequestDetails.baseBranch} ← ${scenario.branch}` }}
                  </span>
                </div>
              </div>
              <button
                v-if="!pullRequestCreated"
                class="changes-repository-action"
                type="button"
                :data-repository-action="prePullRequestAction.kind"
                @click="runRepositoryAction"
              >
                <i
                  class="codicon"
                  :class="prePullRequestAction.icon"
                  aria-hidden="true"
                />
                {{ prePullRequestAction.label }}
              </button>
              <button
                v-else-if="showChangesPullRequestSettings"
                ref="agentMergeSettingsTrigger"
                class="workbench-agent-merge-settings"
                type="button"
                aria-haspopup="dialog"
                :aria-expanded="showingAgentMergeSettingsDialog"
                :aria-label="`${
                  settings.enabled
                    ? 'Update Agent Merge settings'
                    : 'Configure Agent Merge'
                } for this session`"
                @click="openAgentMergeSettings"
              >
                <i class="codicon codicon-settings-gear" aria-hidden="true" />
                {{
                  settings.enabled
                    ? 'Update Agent Merge Settings'
                    : 'Configure Agent Merge'
                }}
              </button>
            </div>
            <div class="changes-list">
              <div v-for="file in scenario.changedFiles" :key="file.name">
                <i class="codicon codicon-file-code" aria-hidden="true" />
                <span>{{ file.name }}</span>
                <span
                  class="change-count"
                  :aria-label="getChangeCountLabel(file)"
                >
                  <span class="change-count-additions" aria-hidden="true">
                    +{{ file.additions }}
                  </span>
                  <span class="change-count-deletions" aria-hidden="true">
                    −{{ file.deletions }}
                  </span>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CreatePullRequestDialog
        v-if="showingCreatePullRequestDialog"
        :pull-request-details="pullRequestDetails"
        :scenario="scenario"
        :settings="settings"
        :handling-variant="handlingVariant"
        :follow-up-template="nextFollowUpTemplate"
        @cancel="cancelCreatePullRequest"
        @create="createPullRequest"
      />
      <CreatePullRequestDialog
        v-if="
          showingAgentMergeSettingsDialog &&
          showChangesPullRequestSettings
        "
        :pull-request-details="pullRequestDetails"
        :scenario="scenario"
        :settings="settings"
        :handling-variant="handlingVariant"
        settings-only
        @cancel="closeAgentMergeSettings"
        @save="saveAgentMergeSettings"
      />
      <FollowUpDialog
        v-if="selectedFollowUp"
        :follow-up="selectedFollowUp"
        :scenario="scenario"
        :pull-request-details="pullRequestDetails"
        @close="closeFollowUp"
      />
      <CreateFollowUpDialog
        v-if="showingCreateFollowUpDialog"
        :template="nextFollowUpTemplate"
        :scenario="scenario"
        @cancel="cancelCreateFollowUp"
        @create="createFollowUp"
      />
    </div>
  </section>
</template>

<style scoped>
.prototype-stage {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: var(--vscode-spacing-size200);
  background:
    linear-gradient(
      var(--lab-grid-line) var(--vscode-strokeThickness),
      transparent var(--vscode-strokeThickness)
    ),
    linear-gradient(
      90deg,
      var(--lab-grid-line) var(--vscode-strokeThickness),
      transparent var(--vscode-strokeThickness)
    ),
    var(--lab-stage-background);
  background-size: var(--vscode-spacing-size320) var(--vscode-spacing-size320);
  overflow: hidden;
}

.agents-window-frame {
  position: relative;
  display: grid;
  grid-template-rows: 35px minmax(0, 1fr);
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  color: var(--vscode-foreground);
  font-size: var(--vscode-fontSize-body1);
  line-height: 1.4;
  background:
    radial-gradient(
      ellipse 125% 105% at 100% 100%,
      color-mix(in srgb, var(--vscode-agentsGradient-tintColor) 12%, transparent),
      transparent 60%
    ),
    var(--vscode-agents-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-window-border);
  border-radius: var(--vscode-cornerRadius-large);
  box-shadow: 0 var(--vscode-spacing-size120) var(--vscode-spacing-size320)
    var(--vscode-widget-shadow);
  overflow: hidden;
}

.agents-window-titlebar {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: var(--vscode-spacing-size80);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-icon-foreground);
}

.titlebar-left,
.titlebar-right {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: var(--vscode-spacing-size40);
}

.titlebar-right {
  justify-content: flex-end;
}

.traffic-lights {
  display: flex;
  gap: var(--vscode-spacing-size60);
  margin-right: var(--vscode-spacing-size80);
}

.traffic-lights span {
  width: var(--vscode-spacing-size120);
  height: var(--vscode-spacing-size120);
  background: var(--vscode-descriptionForeground);
  border-radius: var(--vscode-cornerRadius-circle);
  opacity: 0.45;
}

.agents-window-titlebar button,
.sessions-header button,
.session-header button,
.pane-title button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--vscode-spacing-size240);
  height: var(--vscode-spacing-size240);
  padding: 0 var(--vscode-spacing-size40);
  color: var(--vscode-icon-foreground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
  cursor: pointer;
}

.agents-window-titlebar button:hover,
.sessions-header button:hover,
.session-header button:hover,
.pane-title button:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.agents-window-titlebar button:focus-visible,
.sessions-header button:focus-visible,
.session-header button:focus-visible,
.pane-title button:focus-visible,
.session-item:focus-visible,
.chat-input input:focus-visible,
.repository-action:focus-visible,
.changes-repository-action:focus-visible,
.workbench-agent-merge-settings:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.titlebar-center {
  min-width: 0;
}

.command-center {
  position: relative;
  display: flex;
  align-items: stretch;
  width: min(42vw, 680px);
  height: var(--prototype-button-height);
  min-width: 180px;
  color: var(--vscode-commandCenter-foreground);
  border: var(--vscode-strokeThickness) solid var(--vscode-commandCenter-border);
  border-radius: var(--vscode-cornerRadius-medium);
  font-size: var(--vscode-fontSize-label1);
}

.command-center:hover,
.command-center:focus-within {
  color: var(--vscode-commandCenter-activeForeground);
  background: var(--vscode-commandCenter-activeBackground);
  border-color: var(--vscode-commandCenter-activeBorder);
}

.agents-window-titlebar .project-picker {
  display: flex;
  justify-content: flex-start;
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  height: 100%;
  padding: 0 var(--vscode-spacing-size80);
  color: inherit;
  border: 0;
  border-radius: var(--vscode-cornerRadius-medium) 0 0
    var(--vscode-cornerRadius-medium);
  text-align: left;
}

.agents-window-titlebar .project-picker:hover {
  color: var(--vscode-commandCenter-activeForeground);
  background: var(--vscode-toolbar-hoverBackground);
}

.project-picker > .codicon {
  flex: 0 0 auto;
  margin-right: var(--vscode-spacing-size60);
  font-size: var(--vscode-codiconFontSize-compact);
}

.project-picker-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-status-icon.status-working {
  color: var(--vscode-textLink-foreground);
}

.session-status-icon.status-monitoring {
  color: var(--vscode-testing-iconPassed);
}

.session-status-icon.status-disabled,
.agent-merge-session-status.status-disabled > .codicon {
  color: var(--vscode-disabledForeground);
}

.session-status-icon.status-commit {
  color: var(--vscode-gitDecoration-modifiedResourceForeground);
}

.session-status-icon.status-publish {
  color: var(--vscode-descriptionForeground);
}

.session-status-icon.status-create-pull-request {
  color: var(--vscode-gitDecoration-addedResourceForeground);
}

.agents-window-content {
  display: grid;
  grid-template-columns: var(--prototype-sessions-sidebar-width) minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
}

.sessions-sidebar {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  color: var(--vscode-sideBar-foreground);
  background: transparent;
}

.sessions-header {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size80);
  height: var(--vscode-spacing-size320);
  padding: 0 var(--vscode-spacing-size100);
}

.sessions-header h3 {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: var(--vscode-sideBar-foreground);
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.sessions-header-actions {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size20);
  flex: 0 0 auto;
}

.sessions-header .new-session-button {
  width: auto;
  gap: var(--vscode-spacing-size60);
  padding: 0 var(--vscode-spacing-size60);
  color: var(--vscode-agentsNewSessionButton-foreground);
  background: var(--vscode-agentsNewSessionButton-background);
  border: var(--vscode-strokeThickness) solid
    var(--vscode-agentsNewSessionButton-border);
  font-size: var(--vscode-fontSize-label1);
}

.new-session-shortcut {
  display: inline-flex;
  align-items: center;
  height: var(--vscode-spacing-size160);
  padding: 0 var(--vscode-spacing-size20);
  color: var(--vscode-descriptionForeground);
  background: var(--vscode-toolbar-activeBackground);
  border-radius: var(--vscode-cornerRadius-xSmall);
  font-family: inherit;
  font-size: var(--vscode-fontSize-label3);
  font-weight: var(--vscode-fontWeight-regular);
  line-height: 1;
}

.sessions-header .new-session-button:hover {
  background: var(--vscode-agentsNewSessionButton-hoverBackground);
}

.sessions-list {
  min-height: 0;
  padding: var(--vscode-spacing-size40) var(--vscode-spacing-size40)
    var(--vscode-spacing-size80);
  overflow-y: auto;
}

.session-group-heading {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size40);
  min-height: var(--vscode-spacing-size280);
  margin: var(--vscode-spacing-size40) 0 0;
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-sideBarSectionHeader-foreground);
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.session-group-heading > .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
}

.session-item-container {
  position: relative;
}

.session-item {
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  padding: var(--prototype-session-row-padding) var(--vscode-spacing-size60)
    var(--prototype-session-row-padding) var(--vscode-spacing-size80);
  color: var(--vscode-sideBar-foreground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
  text-align: left;
  cursor: pointer;
}

.session-item:hover {
  background: var(--vscode-list-hoverBackground);
}

.session-item-container.showing-status-overlay > .session-item {
  background: var(--vscode-list-hoverBackground);
}

.session-item.active {
  color: var(--vscode-list-activeSelectionForeground);
  background: var(--vscode-list-activeSelectionBackground);
}

.session-status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--vscode-codiconFontSize);
  height: var(--vscode-codiconFontSize);
  color: var(--vscode-descriptionForeground);
}

.session-status-icon .codicon {
  font-size: var(--vscode-codiconFontSize);
}

.session-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding-left: var(--vscode-spacing-size60);
}

.session-title-row,
.session-details-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.session-title-row {
  gap: var(--vscode-spacing-size60);
  padding-bottom: var(--vscode-spacing-size40);
  line-height: 17px;
}

.session-title-row strong {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--vscode-foreground);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vscode-fontSize-body1);
  font-weight: var(--vscode-fontWeight-regular);
}

.session-details-row {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label2);
}

.session-details-row time {
  flex: 0 0 auto;
}

.session-details-row {
  gap: var(--vscode-spacing-size40);
  line-height: 15px;
}

.session-state-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.agents-main-region {
  position: relative;
  display: grid;
  grid-template-columns: minmax(380px, 1fr) minmax(250px, 300px);
  gap: var(--vscode-agents-layout-floatingPanelGap);
  min-width: 0;
  min-height: 0;
  padding: 0 var(--vscode-agents-layout-floatingPanelGap)
    var(--vscode-agents-layout-floatingPanelGap) 0;
}

.agents-main-region:not(.details-visible) {
  grid-template-columns: minmax(0, 1fr);
}

.agents-part-card {
  min-width: 0;
  min-height: 0;
  background: var(--vscode-agentsPanel-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-agentsPanel-border);
  border-radius: var(--vscode-cornerRadius-large);
  overflow: hidden;
}

.sessions-part {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.session-header {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
  height: var(--vscode-spacing-size320);
  max-width: var(--prototype-session-content-max-width);
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--prototype-session-content-padding);
}

.session-header > .codicon {
  flex: 0 0 auto;
  color: var(--vscode-gitDecoration-addedResourceForeground);
  font-size: var(--vscode-codiconFontSize);
}

.session-header > strong {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--vscode-foreground);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vscode-fontSize-heading3);
  font-weight: var(--vscode-fontWeight-regular);
}

.session-header-actions {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size20);
  margin-left: auto;
}

.session-content {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.chat-transcript {
  display: flex;
  flex-direction: column;
  gap: var(--prototype-transcript-gap);
  width: 100%;
  min-height: 0;
  max-width: var(--prototype-session-content-max-width);
  margin: 0 auto;
  padding: var(--prototype-transcript-padding)
    var(--prototype-session-content-padding);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.chat-transcript p {
  margin: 0;
  line-height: 1.5;
}

.chat-request {
  align-self: flex-end;
  max-width: min(78%, 480px);
  padding: var(--vscode-spacing-size80) var(--vscode-spacing-size120);
  color: var(--vscode-chat-requestBubbleForeground);
  background: var(--vscode-chat-requestBubbleBackground);
  border: var(--vscode-strokeThickness) solid var(--vscode-chat-requestBorder);
  border-radius: var(--vscode-cornerRadius-medium);
}

.chat-response {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size60);
  max-width: min(88%, 560px);
}

.chat-response a {
  color: var(--vscode-textLink-foreground);
}

.chat-response code {
  padding: 0 var(--vscode-spacing-size20);
  color: var(--vscode-textPreformat-foreground);
  background: var(--vscode-textCodeBlock-background);
  border-radius: var(--vscode-cornerRadius-xSmall);
}

.repository-action-question {
  margin-top: var(--vscode-spacing-size40);
  color: var(--vscode-foreground);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.repository-action {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: var(--vscode-spacing-size60);
  min-height: var(--vscode-spacing-size240);
  margin-top: var(--vscode-spacing-size40);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-button-border);
  border-radius: var(--vscode-cornerRadius-small);
  font-size: var(--vscode-fontSize-label1);
  cursor: pointer;
}

.repository-action > .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
}

.repository-action:hover {
  background: var(--vscode-button-hoverBackground);
}

.pull-request-created-status {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
}

.pull-request-created-status > .codicon {
  flex: 0 0 auto;
  color: var(--vscode-icon-foreground);
  font-size: var(--vscode-codiconFontSize);
}

.agent-merge-session-status {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--vscode-spacing-size80);
  max-width: min(88%, 560px);
  padding: var(--vscode-spacing-size100) var(--vscode-spacing-size120);
  background: var(--vscode-chat-statusBackground);
  border: var(--vscode-strokeThickness) solid var(--vscode-widget-border);
  border-radius: var(--vscode-cornerRadius-medium);
}

.agent-merge-session-status > .codicon {
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-codiconFontSize);
}

.agent-merge-session-status-heading {
  display: flex;
  align-items: baseline;
  gap: var(--vscode-spacing-size60);
  min-width: 0;
}

.agent-merge-session-status-heading strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--vscode-fontWeight-semiBold);
}

.agent-merge-session-status-heading > span {
  flex: 0 0 auto;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.agent-merge-session-status p {
  margin-top: var(--vscode-spacing-size40);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.latest-response {
  margin-bottom: var(--vscode-spacing-size120);
}

.chat-input {
  width: calc(100% - (2 * var(--prototype-session-content-padding)));
  max-width: calc(
    var(--prototype-session-content-max-width) -
      (2 * var(--prototype-session-content-padding))
  );
  margin: 0 auto var(--prototype-session-content-padding);
  padding: var(--vscode-spacing-size60) var(--vscode-spacing-size80);
  background: var(--vscode-input-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-input-border);
  border-radius: var(--vscode-cornerRadius-medium);
}

.chat-input input {
  width: 100%;
  min-height: var(--vscode-spacing-size240);
  padding: 0 var(--vscode-spacing-size40);
  color: var(--vscode-input-foreground);
  background: transparent;
  border: 0;
  outline: 0;
}

.chat-input input::placeholder {
  color: var(--vscode-input-placeholderForeground);
}

.chat-input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-input-footer > span {
  display: inline-flex;
  align-items: center;
  gap: var(--vscode-spacing-size40);
  min-height: var(--vscode-spacing-size240);
  padding: 0 var(--vscode-spacing-size60);
  color: var(--vscode-descriptionForeground);
  border-radius: var(--vscode-cornerRadius-small);
  font-size: var(--vscode-fontSize-label2);
}

.chat-input-footer button {
  display: grid;
  place-items: center;
  width: var(--vscode-spacing-size240);
  height: var(--vscode-spacing-size240);
  padding: 0;
  color: var(--vscode-disabledForeground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
}

.changes-part {
  display: flex;
  flex-direction: column;
}

.pane-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--vscode-spacing-size320);
  padding: 0 var(--vscode-spacing-size80) 0 var(--vscode-spacing-size120);
  color: var(--vscode-sideBarTitle-foreground);
  font-size: var(--vscode-fontSize-label2);
  font-weight: var(--vscode-fontWeight-semiBold);
  text-transform: uppercase;
}

.pane-title > div {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size20);
}

.pull-request-summary {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size120);
  padding: var(--vscode-spacing-size120);
  border-top: var(--vscode-strokeThickness) solid
    var(--vscode-sideBarSectionHeader-border);
  border-bottom: var(--vscode-strokeThickness) solid
    var(--vscode-sideBarSectionHeader-border);
}

.pull-request-heading {
  display: flex;
  align-items: flex-start;
  gap: var(--vscode-spacing-size80);
  min-width: 0;
}

.pull-request-heading > .codicon {
  flex: 0 0 auto;
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-descriptionForeground);
}

.pull-request-heading > div {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size20);
}

.pull-request-heading strong,
.pull-request-heading span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pull-request-heading span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
}

.changes-repository-action,
.workbench-agent-merge-settings {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  gap: var(--vscode-spacing-size60);
  margin-left: calc(
    var(--vscode-codiconFontSize) + var(--vscode-spacing-size80)
  );
  min-height: var(--vscode-spacing-size240);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-button-border);
  border-radius: var(--vscode-cornerRadius-small);
  font-size: var(--vscode-fontSize-label1);
  cursor: pointer;
}

.changes-repository-action > .codicon,
.workbench-agent-merge-settings > .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
}

.changes-repository-action:hover,
.workbench-agent-merge-settings:hover {
  background: var(--vscode-button-hoverBackground);
}

.changes-list {
  padding: var(--vscode-spacing-size80) 0;
}

.changes-list > div {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--vscode-spacing-size60);
  min-height: var(--prototype-change-row-height);
  padding: 0 var(--vscode-spacing-size120);
}

.changes-list > div:hover {
  background: var(--vscode-list-hoverBackground);
}

.changes-list span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.change-count {
  display: inline-flex;
  gap: var(--vscode-spacing-size40);
  font-size: var(--vscode-fontSize-body2);
}

.change-count-additions {
  color: var(--vscode-gitDecoration-addedResourceForeground);
}

.change-count-deletions {
  color: var(--vscode-gitDecoration-deletedResourceForeground);
}

@media (max-width: 680px) {
  .agents-main-region.details-visible {
    grid-template-columns: minmax(0, 1fr);
  }

  .changes-part {
    position: absolute;
    inset: 0 0 var(--vscode-agents-layout-floatingPanelGap) auto;
    z-index: 1;
    width: min(300px, 100%);
  }
}

@media (max-width: 960px) {
  .agents-window-content {
    grid-template-columns: 190px minmax(0, 1fr);
  }
}

@media (max-width: 820px) {
  .prototype-stage {
    height: 100vh;
    height: 100dvh;
    padding: var(--vscode-spacing-size160);
  }

  .agents-window-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .sessions-sidebar {
    display: none;
  }
}

@media (max-width: 560px) {
  .prototype-stage {
    padding: var(--vscode-spacing-size120);
  }

  .traffic-lights,
  .titlebar-left button:not(:first-of-type) {
    display: none;
  }

  .agents-window-titlebar {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .command-center {
    width: 100%;
    min-width: 0;
  }

  .agents-window-titlebar .project-picker {
    min-width: 0;
  }
}
</style>
