<script setup>
import { computed, onMounted, ref } from 'vue'
import { colors, spaceNameError } from '../model.js'
import WindowKindPicker from './WindowKindPicker.vue'

const props = defineProps({
  state: { type: Object, required: true },
  mode: { type: String, required: true },
})
const emit = defineEmits(['close', 'save', 'remove', 'create'])
const dialog = ref()
const nameInput = ref()
const selectedId = ref(props.state.activeSpaceId)
const selected = computed(() => props.state.spaces.find(space => space.id === selectedId.value))
const name = ref(props.mode === 'create' ? '' : selected.value.name)
const description = ref(props.mode === 'create' ? '' : selected.value.description)
const color = ref(props.mode === 'create' ? 'green' : selected.value.color)
const windowKind = ref('agents')
const error = ref('')
const confirming = ref(false)

function select(space) {
  selectedId.value = space.id
  name.value = space.name
  description.value = space.description
  color.value = space.color
  error.value = ''
  confirming.value = false
}

function submit() {
  error.value = spaceNameError(props.state, name.value, props.mode === 'manage' ? selectedId.value : undefined)
  if (error.value) {
    nameInput.value.focus()
    return
  }
  emit('save', {
    id: props.mode === 'manage' ? selectedId.value : undefined,
    name: name.value,
    description: description.value,
    color: color.value,
    windowKind: windowKind.value,
  })
}

onMounted(() => {
  dialog.value.showModal()
  nameInput.value.focus()
})
</script>

<template>
  <dialog ref="dialog" class="prototype-dialog space-dialog" aria-labelledby="space-dialog-title" @cancel.prevent="emit('close')" @keydown.esc.prevent.stop="emit('close')" @click.self="emit('close')">
    <section>
      <header class="dialog-header">
        <div><p class="eyebrow">A LITTLE CONTEXT GOES A LONG WAY</p><h2 id="space-dialog-title">{{ mode === 'create' ? 'Create a space' : 'Manage spaces' }}</h2></div>
        <button class="icon-button" aria-label="Close dialog" @click="emit('close')"><i class="codicon codicon-close" aria-hidden="true" /></button>
      </header>
      <p class="dialog-intro">A context for your work. Choose where to start; open other work areas as you need them.</p>
      <div class="space-dialog-body" :class="{ 'is-managing': mode === 'manage' }">
        <nav v-if="mode === 'manage'" class="manage-list" aria-label="Spaces to manage">
          <button v-for="space in state.spaces" :key="space.id" :aria-current="selectedId === space.id ? 'true' : undefined" @click="select(space)">
            <span class="space-avatar small" :data-color="space.color" aria-hidden="true">{{ space.name.slice(0, 1).toUpperCase() }}</span><span class="truncate">{{ space.name }}</span>
          </button>
          <button class="manage-create" @click="emit('create')"><i class="codicon codicon-add" aria-hidden="true" />New space</button>
        </nav>
        <form class="space-form" @submit.prevent="submit">
          <span class="space-avatar preview-avatar" :data-color="color" aria-hidden="true">{{ name.trim().slice(0, 1).toUpperCase() || 'S' }}</span>
          <label for="space-name">Space name</label>
          <input id="space-name" ref="nameInput" v-model="name" maxlength="40" placeholder="e.g. Work, Personal, Next big thing" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'space-name-error' : undefined" />
          <p v-if="error" id="space-name-error" class="field-error" role="alert">{{ error }}</p>
          <label for="space-description">A few words about it <span class="muted">(optional)</span></label>
          <input id="space-description" v-model="description" maxlength="80" placeholder="What belongs here?" />
          <WindowKindPicker v-if="mode === 'create'" v-model="windowKind" legend="Start in" />
          <p v-else class="managed-window-type"><i :class="`codicon codicon-${selected.startingWindowKind === 'agents' ? 'agent' : 'code'}`" aria-hidden="true" />Starts in {{ selected.startingWindowKind === 'agents' ? 'Agents' : 'Editor' }} · {{ selected.windows.length }} open {{ selected.windows.length === 1 ? 'work area' : 'work areas' }}</p>
          <fieldset class="color-picker">
            <legend>Space color</legend>
            <label v-for="option in colors" :key="option" class="color-option" :data-color="option">
              <input v-model="color" type="radio" name="space-color" :value="option" :aria-label="option" />
              <span><i v-if="color === option" class="codicon codicon-check" aria-hidden="true" /></span>
            </label>
          </fieldset>
          <div v-if="mode === 'manage'" class="remove-space">
            <template v-if="confirming">
              <p>Remove <strong>{{ selected.name }}</strong> and its {{ selected.windows.length }} demo {{ selected.windows.length === 1 ? 'work area' : 'work areas' }}? This cannot be undone.</p>
              <div><button type="button" class="danger-button" @click="emit('remove', selectedId)">Confirm removal</button><button type="button" class="secondary-button" @click="confirming = false">Keep space</button></div>
            </template>
            <template v-else>
              <button type="button" class="text-button danger-text" :disabled="state.spaces.length === 1" @click="confirming = true">Remove space…</button>
              <span v-if="state.spaces.length === 1" class="muted">Keep at least one space.</span>
            </template>
          </div>
          <footer class="dialog-actions">
            <button type="button" class="secondary-button" @click="emit('close')">Cancel</button>
            <button class="primary-button" type="submit">{{ mode === 'create' ? 'Create space' : 'Save changes' }}</button>
          </footer>
        </form>
      </div>
    </section>
  </dialog>
</template>
