<script setup>
import { computed } from 'vue'
import AgentMergeCard from './AgentMergeCard.vue'
import { formatAgentMergeStatus } from '../model/scenarios.js'

const props = defineProps({
  scenario: {
    type: Object,
    required: true,
  },
  scenarios: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select:scenario', 'update:setting'])

const status = computed(() => formatAgentMergeStatus(props.scenario))
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

function toggleAgentMerge() {
  emit('update:setting', { key: 'enabled', value: !props.settings.enabled })
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
          <button
            class="session-picker"
            type="button"
            :aria-label="`Show Sessions: ${scenario.title}`"
          >
            <i class="codicon codicon-folder" aria-hidden="true" />
            <span>{{ scenario.title }}</span>
          </button>
        </div>

        <div class="titlebar-right">
          <button class="open-in-vscode" type="button" aria-label="Open in VS Code">
            <i class="codicon codicon-window" aria-hidden="true" />
            <span>Open in VS Code</span>
          </button>
          <button
            type="button"
            aria-label="Toggle Details"
            aria-pressed="true"
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
              <button class="new-session-button" type="button">
                <i class="codicon codicon-add" aria-hidden="true" />
                New
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
            <section aria-labelledby="workspace-sessions-title">
              <h4 id="workspace-sessions-title" class="session-group-heading">
                <i class="codicon codicon-chevron-down" aria-hidden="true" />
                vscode
              </h4>
              <button
                v-for="session in scenarios"
                :key="session.id"
                class="session-item"
                :class="{ active: session.id === scenario.id }"
                type="button"
                :data-session-id="session.id"
                :aria-current="session.id === scenario.id ? 'page' : undefined"
                @click="emit('select:scenario', session.id)"
              >
                <span class="session-status-icon">
                  <i
                    class="codicon"
                    :class="
                      session.agentMerge.enabled
                        ? 'codicon-git-merge'
                        : 'codicon-git-pull-request'
                    "
                    aria-hidden="true"
                  />
                </span>
                <span class="session-main">
                  <span class="session-title-row">
                    <strong>{{ session.title }}</strong>
                    <time>{{ session.relativeTime }}</time>
                  </span>
                  <span class="session-details-row">
                    <i class="codicon codicon-git-pull-request" aria-hidden="true" />
                    #{{ session.pullRequestNumber }}
                    <span aria-hidden="true">·</span>
                    {{ session.agentMergeLabel }}
                  </span>
                </span>
              </button>
            </section>
          </div>

        </aside>

        <div class="agents-main-region">
          <section class="sessions-part agents-part-card" aria-label="Active session">
            <header class="session-header">
              <i class="codicon codicon-git-merge" aria-hidden="true" />
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

                <article class="chat-response">
                  <div class="response-heading">
                    <i class="codicon codicon-copilot" aria-hidden="true" />
                    <strong>GitHub Copilot</strong>
                  </div>
                  <p>
                    Pull request
                    <a :href="scenario.pullRequestUrl" target="_blank" rel="noreferrer">
                      #{{ scenario.pullRequestNumber }}
                    </a>
                    is open for <code>{{ scenario.branch }}</code>.
                  </p>
                </article>

                <article v-if="settings.enabled" class="system-notice">
                  <i class="codicon codicon-git-merge" aria-hidden="true" />
                  <div>
                    <strong>Agent Merge is monitoring this pull request.</strong>
                    <p>
                      It may handle
                      {{
                        authorizedActions.length
                          ? authorizedActions.join(', ')
                          : 'no repair actions'
                      }}.
                      {{ mergePolicy }}.
                    </p>
                  </div>
                </article>

                <AgentMergeCard v-if="settings.enabled" :scenario="scenario" />

                <article v-else class="agent-merge-disabled-note">
                  <i class="codicon codicon-circle-slash" aria-hidden="true" />
                  <div>
                    <strong>Agent Merge is off for this session.</strong>
                    <p>
                      The pull request still reports blockers, but no repair turn will start.
                    </p>
                  </div>
                </article>

                <article v-if="settings.enabled" class="chat-response latest-response">
                  <div class="response-heading">
                    <i class="codicon codicon-copilot" aria-hidden="true" />
                    <strong>GitHub Copilot</strong>
                  </div>
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

          <aside class="changes-part agents-part-card" aria-label="Pull request changes">
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
                <i class="codicon codicon-git-pull-request" aria-hidden="true" />
                <div>
                  <strong>#{{ scenario.pullRequestNumber }}</strong>
                  <span>{{ scenario.baseBranch }} ← {{ scenario.branch }}</span>
                </div>
              </div>
              <div class="pull-request-status">
                <i
                  class="codicon"
                  :class="
                    status === 'No Pending Feedback'
                      ? 'codicon-pass-filled'
                      : 'codicon-warning'
                  "
                  aria-hidden="true"
                />
                <span>{{ status }}</span>
              </div>
              <button
                class="workbench-agent-merge-toggle"
                type="button"
                :aria-pressed="settings.enabled"
                @click="toggleAgentMerge"
              >
                <i class="codicon codicon-git-merge" aria-hidden="true" />
                {{ settings.enabled ? 'Disable Agent Merge' : 'Enable Agent Merge' }}
              </button>
            </div>
            <div class="changes-list">
              <div v-for="file in scenario.changedFiles" :key="file.name">
                <i class="codicon codicon-file-code" aria-hidden="true" />
                <span>{{ file.name }}</span>
                <span class="change-count">{{ file.changeCount }}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
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
  display: grid;
  grid-template-rows: 35px minmax(0, 1fr);
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  color: var(--vscode-foreground);
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
.workbench-agent-merge-toggle:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.titlebar-center {
  min-width: 0;
}

.agents-window-titlebar .session-picker {
  display: flex;
  width: min(31vw, 600px);
  min-width: 180px;
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-commandCenter-foreground);
  border: var(--vscode-strokeThickness) solid var(--vscode-commandCenter-border);
  border-radius: var(--vscode-cornerRadius-medium);
  opacity: 0.7;
}

.agents-window-titlebar .session-picker:hover {
  color: var(--vscode-commandCenter-activeForeground);
  background: var(--vscode-commandCenter-activeBackground);
  border-color: var(--vscode-commandCenter-activeBorder);
  opacity: 1;
}

.session-picker > .codicon {
  flex: 0 0 auto;
  margin-right: var(--vscode-spacing-size60);
  font-size: var(--vscode-codiconFontSize-compact);
}

.session-picker > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.agents-window-titlebar .open-in-vscode {
  gap: var(--vscode-spacing-size40);
  padding: 0 var(--vscode-spacing-size80);
}

.open-in-vscode span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vscode-fontSize-label2);
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
  gap: var(--vscode-spacing-size20);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-agentsNewSessionButton-foreground);
  background: var(--vscode-agentsNewSessionButton-background);
  border: var(--vscode-strokeThickness) solid
    var(--vscode-agentsNewSessionButton-border);
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
  font-size: var(--vscode-fontSize-body2);
  font-weight: var(--vscode-fontWeight-semiBold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.session-group-heading > .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
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

.session-title-row time,
.session-details-row {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label2);
}

.session-title-row time {
  flex: 0 0 auto;
}

.session-details-row {
  gap: var(--vscode-spacing-size40);
  overflow: hidden;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-details-row .codicon {
  flex: 0 0 auto;
  color: var(--vscode-gitDecoration-addedResourceForeground);
  font-size: var(--vscode-codiconFontSize-compact);
}

.agents-main-region {
  display: grid;
  grid-template-columns: minmax(380px, 1fr) minmax(250px, 300px);
  gap: var(--vscode-agents-layout-floatingPanelGap);
  min-width: 0;
  min-height: 0;
  padding: 0 var(--vscode-agents-layout-floatingPanelGap)
    var(--vscode-agents-layout-floatingPanelGap) 0;
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

.response-heading {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
}

.response-heading strong {
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
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

.system-notice,
.agent-merge-disabled-note {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--vscode-spacing-size80);
  max-width: min(88%, 560px);
  padding: var(--vscode-spacing-size100) var(--vscode-spacing-size120);
  background: var(--vscode-chat-statusBackground);
  border: var(--vscode-strokeThickness) solid var(--vscode-widget-border);
  border-radius: var(--vscode-cornerRadius-medium);
}

.system-notice > .codicon,
.agent-merge-disabled-note > .codicon {
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-codiconFontSize);
}

.system-notice strong,
.agent-merge-disabled-note strong {
  font-weight: var(--vscode-fontWeight-semiBold);
}

.system-notice p,
.agent-merge-disabled-note p {
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
  font-size: var(--vscode-fontSize-label3);
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
  color: var(--vscode-gitDecoration-addedResourceForeground);
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

.pull-request-status {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
  min-width: 0;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label2);
}

.pull-request-status span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pull-request-status .codicon-pass-filled {
  color: var(--vscode-testing-iconPassed);
}

.pull-request-status .codicon-warning {
  color: var(--vscode-warningForeground);
}

.workbench-agent-merge-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--vscode-spacing-size60);
  min-height: var(--prototype-button-height);
  padding: 0 var(--vscode-spacing-size100);
  color: var(--vscode-button-foreground);
  background: var(--vscode-button-background);
  border: var(--vscode-strokeThickness) solid var(--vscode-button-border);
  border-radius: var(--vscode-cornerRadius-small);
  font: inherit;
  cursor: pointer;
}

.workbench-agent-merge-toggle:hover {
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
  color: var(--vscode-gitDecoration-addedResourceForeground);
  font-size: var(--vscode-fontSize-body2);
}

@media (max-width: 1180px) {
  .agents-main-region {
    grid-template-columns: minmax(0, 1fr);
  }

  .changes-part {
    display: none;
  }
}

@media (max-width: 960px) {
  .agents-window-content {
    grid-template-columns: 190px minmax(0, 1fr);
  }

  .open-in-vscode span {
    display: none;
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
  .titlebar-left button:not(:first-of-type),
  .open-in-vscode {
    display: none;
  }

  .agents-window-titlebar {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .agents-window-titlebar .session-picker {
    width: 100%;
    min-width: 0;
  }
}
</style>
