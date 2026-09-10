<script setup>
import { computed, ref, useId, watch } from 'vue'
import { formatAgentMergeStatus } from '../model/scenarios.js'

const props = defineProps({
  scenario: {
    type: Object,
    required: true,
  },
  activity: {
    type: Object,
    required: true,
  },
  policyDescription: {
    type: String,
    required: true,
  },
})

const expanded = ref(false)
const showingAgentMessage = ref(false)
const bodyId = `agent-merge-body-${useId()}`
const feedbackSummary = computed(() => formatAgentMergeStatus(props.scenario))
const disclosureLabel = computed(
  () =>
    `${expanded.value ? 'Collapse' : 'Expand'} Agent Merge details: ${props.activity.label}. ${feedbackSummary.value}`,
)
const messageToggleLabel = computed(() =>
  showingAgentMessage.value ? 'Show merge details' : 'Show agent message',
)

watch(
  () => props.scenario.id,
  () => {
    expanded.value = false
    showingAgentMessage.value = false
  },
)

function toggleExpanded() {
  expanded.value = !expanded.value
}

function collapse() {
  expanded.value = false
  showingAgentMessage.value = false
}
</script>

<template>
  <section
    class="agent-merge"
    :class="{
      collapsed: !expanded,
      'showing-agent-message': showingAgentMessage,
    }"
    :aria-label="`Agent Merge: ${activity.label}. ${feedbackSummary}`"
    data-agent-merge-surface="session"
    :data-agent-merge-state="activity.kind"
    @keydown.esc="collapse"
  >
    <div class="agent-merge-card">
      <div class="agent-merge-header">
        <button
          class="agent-merge-disclosure"
          type="button"
          :aria-controls="bodyId"
          :aria-expanded="expanded"
          :aria-label="disclosureLabel"
          @click="toggleExpanded"
        />
        <div class="agent-merge-header-content" aria-hidden="true">
          <i
            class="agent-merge-state-icon codicon codicon-git-merge"
            :class="`status-${activity.kind}`"
          />
          <span
            class="agent-merge-title"
            data-agent-merge-status-label
            :aria-label="`Agent Merge status: ${activity.label}`"
          >
            {{ activity.label }}
          </span>
        </div>
        <button
          v-if="expanded"
          class="agent-merge-message-toggle codicon codicon-comment-discussion"
          type="button"
          :aria-label="messageToggleLabel"
          :aria-pressed="showingAgentMessage"
          @click="showingAgentMessage = !showingAgentMessage"
        />
        <i
          class="agent-merge-twistie codicon codicon-chevron-right"
          aria-hidden="true"
        />
      </div>

      <div v-if="expanded" :id="bodyId" class="agent-merge-body">
        <div v-if="!showingAgentMessage" class="agent-merge-details">
          <p class="agent-merge-policy">{{ policyDescription }}</p>

          <a
            class="pull-request-pill"
            :href="scenario.pullRequestUrl"
            target="_blank"
            rel="noreferrer"
            :title="`Open pull request #${scenario.pullRequestNumber}: ${scenario.title}`"
          >
            <i class="codicon codicon-git-pull-request" aria-hidden="true" />
            <span>#{{ scenario.pullRequestNumber }} {{ scenario.title }}</span>
          </a>

          <section v-if="scenario.comments.length" class="agent-merge-section">
            <h3 v-if="scenario.checks.length">Feedback</h3>
            <article
              v-for="comment in scenario.comments"
              :key="`${comment.path}:${comment.line}`"
              class="review-comment"
            >
              <i class="codicon codicon-comment" aria-hidden="true" />
              <div class="review-comment-content">
                <div class="review-comment-heading">
                  <strong>{{ comment.author }}</strong>
                  <span :title="comment.path">
                    {{ comment.file }}:{{ comment.line }}
                  </span>
                </div>
                <p>{{ comment.body }}</p>
              </div>
            </article>
          </section>

          <section v-if="scenario.checks.length" class="agent-merge-section">
            <h3 v-if="scenario.comments.length">Checks</h3>
            <a
              v-for="check in scenario.checks"
              :key="check"
              class="failed-check"
              :href="`${scenario.pullRequestUrl}/checks`"
              target="_blank"
              rel="noreferrer"
            >
              <i class="codicon codicon-error" aria-hidden="true" />
              <span>{{ check }}</span>
            </a>
          </section>

          <section
            v-if="scenario.conflicting || scenario.behind"
            class="agent-merge-section branch-state"
          >
            <div v-if="scenario.conflicting">
              <i class="codicon codicon-git-merge" aria-hidden="true" />
              <span>Resolve conflicts with {{ scenario.baseBranch }}</span>
            </div>
            <div v-if="scenario.behind">
              <i class="codicon codicon-git-pull-request-go-to-changes" aria-hidden="true" />
              <span>Update branch from {{ scenario.baseBranch }}</span>
            </div>
          </section>

          <p
            v-if="
              !scenario.comments.length &&
              !scenario.checks.length &&
              !scenario.conflicting &&
              !scenario.behind
            "
            class="ready-state"
          >
            <i class="codicon codicon-pass-filled" aria-hidden="true" />
            No review, check, or branch blockers remain.
          </p>
        </div>

        <div v-else class="agent-message">
          <p>{{ scenario.agentMessage }}</p>
        </div>
      </div>
    </div>

    <div class="agent-merge-metadata">
      <time tabindex="0">{{ scenario.timestamp }}</time>
      <span aria-hidden="true">•</span>
      <span>Agent Merge</span>
    </div>
  </section>
</template>

<style scoped>
.agent-merge {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size40);
  width: 100%;
  max-width: 100%;
  font-size: var(--vscode-fontSize-label1);
}

.agent-merge-card {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  width: min(100%, 560px);
  max-width: 100%;
  background: var(--vscode-chat-statusBackground);
  border: var(--vscode-strokeThickness) solid var(--vscode-widget-border);
  border-radius: var(--vscode-cornerRadius-medium);
  overflow: hidden;
}

.collapsed .agent-merge-card {
  width: fit-content;
}

.agent-merge-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size40);
  min-height: var(--prototype-agent-merge-header-height);
  padding: var(--vscode-spacing-size60) var(--vscode-spacing-size80)
    var(--vscode-spacing-size60) var(--vscode-spacing-size120);
  overflow: hidden;
}

.agent-merge-header:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.agent-merge-disclosure {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: inherit;
  cursor: pointer;
}

.agent-merge-disclosure:focus-visible,
.agent-merge-message-toggle:focus-visible,
time:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.agent-merge-header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  min-width: 0;
  gap: var(--vscode-spacing-size60);
  pointer-events: none;
}

.agent-merge-state-icon {
  flex: 0 0 auto;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-codiconFontSize-compact);
}

.agent-merge-state-icon.status-working {
  color: var(--vscode-textLink-foreground);
}

.agent-merge-state-icon.status-monitoring {
  color: var(--vscode-testing-iconPassed);
}

.agent-merge-title {
  min-width: 0;
  overflow: hidden;
  color: var(--vscode-foreground);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--vscode-fontWeight-semiBold);
}

.agent-merge-message-toggle {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: var(--vscode-spacing-size200);
  height: var(--vscode-spacing-size200);
  margin-left: auto;
  padding: 0;
  color: var(--vscode-descriptionForeground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
  font-size: var(--vscode-codiconFontSize-compact);
  cursor: pointer;
}

.agent-merge-message-toggle:hover,
.agent-merge-message-toggle[aria-pressed='true'] {
  color: var(--vscode-foreground);
  background: var(--vscode-toolbar-activeBackground);
}

.agent-merge-twistie {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  margin-left: auto;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-codiconFontSize-compact);
  pointer-events: none;
  transition: transform 100ms ease-out;
}

.agent-merge:not(.collapsed) .agent-merge-twistie {
  margin-left: 0;
  transform: rotate(90deg);
}

.agent-merge-body {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size80);
  padding: var(--vscode-spacing-size40) var(--vscode-spacing-size120)
    var(--vscode-spacing-size120);
}

.agent-merge-details {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size120);
  min-width: 0;
}

.agent-merge-policy {
  margin: 0;
  color: var(--vscode-descriptionForeground);
  line-height: 1.45;
}

.pull-request-pill {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: var(--vscode-spacing-size60);
  max-width: 100%;
  min-height: var(--vscode-spacing-size240);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-foreground);
  background: var(--vscode-button-secondaryBackground);
  border: var(--vscode-strokeThickness) solid var(--vscode-button-secondaryBorder);
  border-radius: var(--vscode-cornerRadius-circle);
  text-decoration: none;
}

.pull-request-pill:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

.pull-request-pill:focus-visible,
.failed-check:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: var(--vscode-spacing-size20);
}

.pull-request-pill > span,
.failed-check > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.agent-merge-section {
  display: flex;
  flex-direction: column;
  gap: var(--vscode-spacing-size80);
  min-width: 0;
}

.agent-merge-section h3 {
  margin: 0;
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
}

.review-comment {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--vscode-spacing-size60);
}

.review-comment > .codicon {
  margin-top: var(--vscode-spacing-size20);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-codiconFontSize-compact);
}

.review-comment-content {
  min-width: 0;
}

.review-comment-heading {
  display: flex;
  align-items: baseline;
  gap: var(--vscode-spacing-size60);
  min-width: 0;
  line-height: var(--vscode-spacing-size200);
}

.review-comment-heading strong {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-comment-heading span {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--vscode-descriptionForeground);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vscode-fontSize-label2);
}

.review-comment p,
.agent-message p,
.ready-state {
  margin: var(--vscode-spacing-size20) 0 0;
  line-height: 1.45;
}

.failed-check {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
  min-width: 0;
  color: var(--vscode-textLink-foreground);
  text-decoration: none;
}

.failed-check:hover {
  color: var(--vscode-textLink-activeForeground);
  text-decoration: underline;
}

.failed-check .codicon {
  flex: 0 0 auto;
  color: var(--vscode-errorForeground);
  font-size: var(--vscode-codiconFontSize-compact);
}

.branch-state {
  color: var(--vscode-descriptionForeground);
}

.branch-state > div,
.ready-state {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
}

.branch-state .codicon,
.ready-state .codicon {
  color: var(--vscode-warningForeground);
  font-size: var(--vscode-codiconFontSize-compact);
}

.ready-state .codicon {
  color: var(--vscode-testing-iconPassed);
}

.agent-message {
  color: var(--vscode-descriptionForeground);
  overflow-wrap: anywhere;
}

.agent-merge-metadata {
  display: flex;
  align-items: center;
  align-self: flex-end;
  gap: var(--vscode-spacing-size40);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-body2);
  opacity: 0;
  pointer-events: none;
  transition: opacity 100ms ease-out;
}

.agent-merge:hover .agent-merge-metadata,
.agent-merge:focus-within .agent-merge-metadata {
  opacity: 0.8;
  pointer-events: auto;
}

@media (prefers-reduced-motion: reduce) {
  .agent-merge-twistie,
  .agent-merge-metadata {
    transition: none;
  }
}
</style>
