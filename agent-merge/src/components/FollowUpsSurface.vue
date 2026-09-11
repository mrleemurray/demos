<script setup>
import { ref } from 'vue'

let followUpsSurfaceId = 0

const props = defineProps({
  followUps: {
    type: Array,
    required: true,
  },
  canCreate: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['create', 'open'])
const headingId = `follow-ups-title-${++followUpsSurfaceId}`
const contentId = `follow-ups-content-${followUpsSurfaceId}`
const expanded = ref(true)

function getAccessibleLabel(followUp) {
  return `${followUp.name}. ${followUp.statusLabel}. ${followUp.timingLabel}.`
}

function getIcon(followUp) {
  return followUp.triggerType === 'time'
    ? 'codicon-calendar'
    : 'codicon-zap'
}
</script>

<template>
  <section
    class="follow-ups-surface"
    :aria-labelledby="headingId"
  >
    <h4 class="follow-ups-heading">
      <button
        type="button"
        class="follow-ups-heading-button"
        :aria-expanded="expanded"
        :aria-controls="contentId"
        @click="expanded = !expanded"
      >
        <i
          :class="[
            'codicon',
            expanded ? 'codicon-chevron-down' : 'codicon-chevron-right',
          ]"
          aria-hidden="true"
        ></i>
        <i
          class="codicon codicon-calendar"
          aria-hidden="true"
        ></i>
        <span :id="headingId">Automations</span>
      </button>
    </h4>

    <div
      :id="contentId"
      class="follow-ups-content"
      :hidden="!expanded"
    >
      <div
        v-if="props.followUps.length"
        class="follow-up-automations"
      >
        <button
          v-for="followUp in props.followUps"
          :key="followUp.id"
          type="button"
          class="follow-up-automation"
          :data-follow-up-id="followUp.id"
          :aria-label="getAccessibleLabel(followUp)"
          @click="
            emit('open', {
              followUp,
              trigger: $event.currentTarget,
            })
          "
        >
          <span
            class="follow-up-automation-icon"
            aria-hidden="true"
          >
            <i :class="['codicon', getIcon(followUp)]"></i>
          </span>
          <span class="follow-up-automation-content">
            <strong :title="followUp.name">{{ followUp.name }}</strong>
            <span :title="followUp.statusLabel">
              {{ followUp.statusLabel }}
            </span>
          </span>
        </button>
      </div>

      <button
        v-if="props.canCreate"
        type="button"
        class="follow-ups-create-action"
        @click="emit('create', { trigger: $event.currentTarget })"
      >
        <i
          class="codicon codicon-add"
          aria-hidden="true"
        ></i>
        <span>
          {{ props.followUps.length ? 'New Follow Up' : 'Create Follow Up' }}
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.follow-ups-surface {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.follow-ups-heading {
  margin: var(--vscode-spacing-size40) 0 0;
}

.follow-ups-heading-button {
  display: flex;
  align-items: center;
  gap: var(--vscode-spacing-size60);
  width: 100%;
  min-height: var(--vscode-spacing-size280);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-sideBarSectionHeader-foreground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
  font-size: var(--vscode-fontSize-label1);
  font-weight: var(--vscode-fontWeight-semiBold);
  text-align: left;
  cursor: pointer;
}

.follow-ups-heading-button:hover {
  background: var(--vscode-list-hoverBackground);
}

.follow-ups-heading-button:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.follow-ups-heading-button > .codicon {
  font-size: var(--vscode-codiconFontSize-compact);
}

.follow-ups-content {
  min-width: 0;
}

.follow-up-automations {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.follow-up-automation,
.follow-ups-create-action {
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  color: var(--vscode-sideBar-foreground);
  background: transparent;
  border: 0;
  border-radius: var(--vscode-cornerRadius-small);
  text-align: left;
  cursor: pointer;
}

.follow-up-automation {
  padding: var(--vscode-spacing-size60);
  padding-left: var(--vscode-spacing-size80);
}

.follow-up-automation:hover,
.follow-ups-create-action:hover {
  background: var(--vscode-list-hoverBackground);
}

.follow-up-automation:focus-visible,
.follow-ups-create-action:focus-visible {
  outline: var(--vscode-strokeThickness) solid var(--vscode-focusBorder);
  outline-offset: calc(-1 * var(--vscode-strokeThickness));
}

.follow-up-automation-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--vscode-codiconFontSize);
  height: var(--vscode-codiconFontSize);
  color: var(--vscode-descriptionForeground);
}

.follow-up-automation-icon > .codicon {
  font-size: var(--vscode-codiconFontSize);
}

.follow-up-automation-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: var(--vscode-spacing-size40);
  padding-left: var(--vscode-spacing-size60);
}

.follow-up-automation-content > strong,
.follow-up-automation-content > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.follow-up-automation-content > strong {
  color: var(--vscode-foreground);
  font-size: var(--vscode-fontSize-body1);
  font-weight: var(--vscode-fontWeight-regular);
  line-height: 17px;
}

.follow-up-automation-content > span {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label2);
  line-height: 15px;
}

.follow-ups-create-action {
  align-items: center;
  gap: var(--vscode-spacing-size60);
  min-height: var(--vscode-spacing-size280);
  padding: 0 var(--vscode-spacing-size80);
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-fontSize-label1);
}

.follow-ups-create-action > .codicon {
  font-size: var(--vscode-codiconFontSize);
}
</style>
