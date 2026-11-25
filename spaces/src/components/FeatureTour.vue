<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

const props = defineProps({
  resolveTarget: { type: Function, required: true },
  prepareStep: { type: Function, required: true },
  theme: { type: String, required: true },
  paused: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])
const steps = [
  { id: 'collections', title: 'Keep related work together', description: 'A workstream can span several repositories, Agent sessions, and Editors. Mixing every task into one session tree makes it hard to return to the right work. Collections keep the related projects and work areas together without requiring a window for every context.' },
  { id: 'work-areas', title: 'A context above session groups', description: 'A Collection contains related projects and their Editor and Agents work areas. Session groups organize conversations within an Agents view; a Collection provides the wider work context. Profiles configure the editor rather than group ongoing work.', hierarchy: ['Collection', 'Projects and work areas', 'Session groups and sessions'] },
  { id: 'sessions', title: 'Choose where sessions belong', description: 'New sessions belong to the Collection of their Agents work area and get their own worktree. Started in the wrong context? Right-click its session row and choose Move session to transfer it and its linked Editors without moving the whole project or opening more windows.' },
  { id: 'windows', title: 'Windows, your way', description: 'Switch work areas in place when you want one surface. Use Open in new window to keep both available, or Focus window for a work area already open elsewhere. Collections do not require multiple windows. Closing a window keeps its saved work area.' },
  { id: 'editor', title: 'From session to Editor', description: "Right-click a session row to open it in Editor here or in a new window. Every Agents session has its own worktree and Editor. Reopening a session reuses its Editor; an already-open Editor is focused, not duplicated." },
]
const index = ref(0)
const step = computed(() => steps[index.value])
const panel = ref()
const nextButton = ref()
const headingId = `feature-tour-title-${useId()}`
const descriptionId = `${headingId}-description`
const targetHint = ref('')
const preparing = ref(false)
const spotlight = ref(null)
const panelPosition = ref({})
let frame
let disposed = false

function update() {
  if (props.paused || !panel.value) return
  const context = props.resolveTarget(step.value.id)
  targetHint.value = context.hint || ''
  const target = context.element
  const rect = target?.isConnected ? target.getBoundingClientRect() : null
  let nextSpotlight = null
  if (rect?.width > 0 && rect.height > 0) {
    const left = Math.max(4, rect.left - 6)
    const top = Math.max(4, rect.top - 6)
    const right = Math.min(globalThis.innerWidth - 4, rect.right + 6)
    const bottom = Math.min(globalThis.innerHeight - 4, rect.bottom + 6)
    if (right > left && bottom > top) nextSpotlight = { left, top, width: right - left, height: bottom - top }
  }
  if (JSON.stringify(nextSpotlight) !== JSON.stringify(spotlight.value)) spotlight.value = nextSpotlight
  const width = panel.value.getBoundingClientRect().width
  const height = panel.value.getBoundingClientRect().height
  const maxLeft = Math.max(12, globalThis.innerWidth - width - 12)
  const maxTop = Math.max(12, globalThis.innerHeight - height - 12)
  let left = maxLeft
  let top = maxTop
  if (nextSpotlight) {
    const targetRight = nextSpotlight.left + nextSpotlight.width
    const targetBottom = nextSpotlight.top + nextSpotlight.height
    if (targetRight + width + 24 <= globalThis.innerWidth) {
      left = targetRight + 12
      top = nextSpotlight.top
    } else if (nextSpotlight.left >= width + 24) {
      left = nextSpotlight.left - width - 12
      top = nextSpotlight.top
    } else if (targetBottom + height + 24 <= globalThis.innerHeight) {
      left = nextSpotlight.left
      top = targetBottom + 12
    } else if (nextSpotlight.top >= height + 24) {
      left = nextSpotlight.left
      top = nextSpotlight.top - height - 12
    }
  }
  const position = { left: `${Math.min(maxLeft, Math.max(12, left))}px`, top: `${Math.min(maxTop, Math.max(12, top))}px` }
  if (position.left !== panelPosition.value.left || position.top !== panelPosition.value.top) panelPosition.value = position
}

function track() {
  update()
  frame = requestAnimationFrame(track)
}

async function navigate(next) {
  if (preparing.value || props.paused) return
  index.value = next
  await prepare()
}

async function prepare(initial = false) {
  if (preparing.value || props.paused || disposed) return
  preparing.value = true
  try {
    await props.prepareStep(step.value.id)
  } finally {
    if (!disposed) {
      preparing.value = false
      await nextTick()
      if (!disposed && !props.paused) {
        update()
        const control = initial ? panel.value : nextButton.value
        control?.focus()
      }
    }
  }
}

function advance() {
  if (preparing.value || props.paused) return
  if (index.value === steps.length - 1) emit('close')
  else navigate(index.value + 1)
}

function escape(event) {
  if (event.key === 'Escape' && !event.defaultPrevented && !props.paused) {
    event.preventDefault()
    emit('close')
  }
}

watch(() => props.paused, async paused => {
  if (!paused) {
    await prepare()
  }
})
onMounted(async () => {
  track()
  panel.value.focus()
  document.addEventListener('keydown', escape)
  await prepare(true)
})
onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(frame)
  document.removeEventListener('keydown', escape)
})
</script>

<template>
  <Teleport to="body">
    <div v-show="!paused" class="prototype-page feature-tour" :data-theme="theme">
      <div v-if="spotlight" class="feature-tour-spotlight" :style="{ left: `${spotlight.left}px`, top: `${spotlight.top}px`, width: `${spotlight.width}px`, height: `${spotlight.height}px` }" aria-hidden="true" />
      <section ref="panel" class="feature-tour-panel" :style="panelPosition" role="dialog" aria-modal="false" :aria-busy="preparing" :aria-labelledby="headingId" :aria-describedby="descriptionId" tabindex="-1" @pointerdown.stop>
        <header><span class="feature-tour-progress" role="status" aria-live="polite">Feature tour · {{ index + 1 }} of {{ steps.length }}</span><button class="icon-button" aria-label="End feature tour" @click="emit('close')"><i class="codicon codicon-close" aria-hidden="true" /></button></header>
        <h2 :id="headingId" aria-live="polite">{{ step.title }}</h2>
        <p :id="descriptionId">{{ step.description }}</p>
        <ol v-if="step.hierarchy" class="feature-tour-hierarchy"><li v-for="level in step.hierarchy" :key="level">{{ level }}</li></ol>
        <p v-if="targetHint" class="feature-tour-hint">{{ targetHint }}</p>
        <footer><button class="text-button" :disabled="index === 0 || preparing" @click="navigate(index - 1)">Back</button><button ref="nextButton" class="primary-button" :disabled="preparing" @click="advance">{{ index === steps.length - 1 ? 'Finish' : 'Next' }}</button></footer>
      </section>
    </div>
  </Teleport>
</template>
