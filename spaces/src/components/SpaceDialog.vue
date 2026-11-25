<script setup>
import { computed, onMounted, ref } from 'vue'
import { spaceNameError } from '../model.js'
import WindowKindPicker from './WindowKindPicker.vue'
import SpaceAvatar from './SpaceAvatar.vue'
import SpaceAppearanceFields from './SpaceAppearanceFields.vue'

const props = defineProps({
  state: { type: Object, required: true },
  mode: { type: String, required: true },
  embedded: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'save', 'remove', 'create', 'preview-theme'])
const dialog = ref()
const nameInput = ref()
const selectedId = ref(props.state.activeSpaceId)
const selected = computed(() => props.state.spaces.find(space => space.id === selectedId.value))
const name = ref(props.mode === 'create' ? '' : selected.value.name)
const description = ref(props.mode === 'create' ? '' : selected.value.description)
const color = ref(props.mode === 'create' ? 'green' : selected.value.color)
const theme = ref(props.mode === 'create' ? 'dark' : selected.value.theme)
const image = ref(props.mode === 'create' ? null : selected.value.image)
const imageLoading = ref(false)
const windowKind = ref('agents')
const error = ref('')
const confirming = ref(false)

function select(space) {
  selectedId.value = space.id
  name.value = space.name
  description.value = space.description
  color.value = space.color
  theme.value = space.theme
  image.value = space.image
  imageLoading.value = false
  error.value = ''
  confirming.value = false
}

function submit() {
  if (imageLoading.value) return
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
    image: image.value,
    theme: theme.value,
    windowKind: windowKind.value,
  })
}

onMounted(() => {
  if (props.embedded) dialog.value.show()
  else dialog.value.showModal()
  nameInput.value.focus()
})
</script>

<template>
  <dialog ref="dialog" class="prototype-dialog space-dialog native-dialog" :aria-modal="embedded ? 'true' : undefined" aria-labelledby="space-dialog-title" @cancel.prevent="emit('close')" @keydown.esc.prevent.stop="emit('close')" @click.self="emit('close')">
    <section>
      <header class="dialog-header">
        <div><h2 id="space-dialog-title">{{ mode === 'create' ? 'Create a collection' : 'Manage collections' }}</h2></div>
        <button class="icon-button" aria-label="Close dialog" @click="emit('close')"><i class="codicon codicon-close" aria-hidden="true" /></button>
      </header>
      <p v-if="mode === 'create'" class="dialog-intro">Choose the details and first work area for this collection.</p>
      <div class="space-dialog-body" :class="{ 'is-managing': mode === 'manage' }">
        <nav v-if="mode === 'manage'" class="manage-list" aria-label="Collections to manage">
          <button v-for="space in state.spaces" :key="space.id" :aria-current="selectedId === space.id ? 'true' : undefined" @click="select(space)">
            <SpaceAvatar class="small" :name="space.name" :color="space.color" :image="space.image" /><span class="truncate">{{ space.name }}</span>
          </button>
          <button class="manage-create" @click="emit('create')"><i class="codicon codicon-add" aria-hidden="true" />New collection</button>
        </nav>
        <form class="space-form" @submit.prevent="submit">
          <label for="space-name">Collection name</label>
          <input id="space-name" ref="nameInput" v-model="name" maxlength="40" placeholder="e.g. Work, Personal, Next big thing" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'space-name-error' : undefined" />
          <p v-if="error" id="space-name-error" class="field-error" role="alert">{{ error }}</p>
          <label for="space-description">Description <span class="muted">(optional)</span></label>
          <input id="space-description" v-model="description" maxlength="80" placeholder="What belongs here?" />
          <WindowKindPicker v-if="mode === 'create'" v-model="windowKind" legend="Start in" />
          <SpaceAppearanceFields :key="selectedId" v-model:color="color" v-model:image="image" v-model:theme="theme" :name="name" @preview-theme="emit('preview-theme', { spaceId: mode === 'create' && embedded ? null : selectedId, theme: $event })" @busy="imageLoading = $event" />
          <div v-if="mode === 'manage'" class="remove-space">
            <template v-if="confirming">
              <p>Remove <strong>{{ selected.name }}</strong> and its {{ selected.windows.length }} {{ selected.windows.length === 1 ? 'work area' : 'work areas' }}? This cannot be undone.</p>
              <div><button type="button" class="danger-button" @click="emit('remove', selectedId)">Confirm removal</button><button type="button" class="secondary-button" @click="confirming = false">Keep collection</button></div>
            </template>
            <template v-else>
              <button type="button" class="text-button danger-text" :disabled="state.spaces.length === 1" @click="confirming = true">Remove collection…</button>
              <span v-if="state.spaces.length === 1" class="muted">Keep at least one collection.</span>
            </template>
          </div>
          <footer class="dialog-actions">
            <button type="button" class="secondary-button" @click="emit('close')">Cancel</button>
            <button class="primary-button" type="submit" :disabled="imageLoading">{{ mode === 'create' ? 'Create collection' : 'Save changes' }}</button>
          </footer>
        </form>
      </div>
    </section>
  </dialog>
</template>
