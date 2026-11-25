<script setup>
import { onBeforeUnmount, ref, useId, watch } from 'vue'
import { colors } from '../model.js'
import { prepareSpaceImage, themes } from '../appearance.js'
import SpaceAvatar from './SpaceAvatar.vue'

const props = defineProps({
  name: { type: String, required: true },
  color: { type: String, required: true },
  theme: { type: String, required: true },
  image: { type: String, default: null },
})
const emit = defineEmits(['update:color', 'update:theme', 'update:image', 'preview-theme', 'busy'])
const id = useId()
const imageError = ref('')
const loading = ref(false)
let requestId = 0

watch(() => props.theme, theme => emit('preview-theme', theme), { immediate: true })

async function uploadImage(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  const request = ++requestId
  imageError.value = ''
  loading.value = true
  emit('busy', true)
  try {
    const image = await prepareSpaceImage(file)
    if (request === requestId) emit('update:image', image)
  } catch (error) {
    if (request === requestId) {
      console.error('Unable to prepare the Collection image:', error)
      imageError.value = error.message
    }
  } finally {
    if (request === requestId) {
      loading.value = false
      emit('busy', false)
    }
  }
}

function removeImage() {
  requestId++
  imageError.value = ''
  loading.value = false
  emit('busy', false)
  emit('update:image', null)
}

onBeforeUnmount(() => {
  requestId++
  emit('preview-theme', null)
})
</script>

<template>
  <div class="space-appearance-fields">
    <fieldset class="space-image-picker">
      <legend>Collection image</legend>
      <div class="space-image-controls">
        <SpaceAvatar class="appearance-avatar" :name="name" :color="color" :image="image" />
        <div class="space-image-actions">
          <label class="secondary-button image-upload-button">
            <input class="sr-only" type="file" accept="image/png,image/jpeg,image/webp" :aria-label="image ? 'Change Collection image' : 'Upload Collection image'" :aria-describedby="`${id}-image-help`" :disabled="loading" @change="uploadImage" />
            {{ loading ? 'Preparing…' : image ? 'Change image' : 'Upload image' }}
          </label>
          <button v-if="image" class="text-button" type="button" aria-label="Remove Collection image" @click="removeImage">Remove</button>
        </div>
      </div>
      <p :id="`${id}-image-help`" class="appearance-hint">PNG, JPEG, or WebP. Up to 2 MB. Saved only in this browser.</p>
      <p v-if="imageError" class="field-error" role="alert">{{ imageError }}</p>
      <span v-if="loading" class="sr-only" role="status">Preparing Collection image</span>
    </fieldset>
    <fieldset class="color-picker">
      <legend>Collection color</legend>
      <label v-for="option in colors" :key="option" class="color-option" :data-color="option">
        <input type="radio" name="space-color" :value="option" :checked="color === option" :aria-label="option" @change="emit('update:color', option)" />
        <span><i v-if="color === option" class="codicon codicon-check" aria-hidden="true" /></span>
      </label>
    </fieldset>
    <div class="space-theme-picker">
      <label :for="`${id}-theme`">Color theme</label>
      <select :id="`${id}-theme`" name="space-theme" :value="theme" :aria-describedby="`${id}-theme-help`" @change="emit('update:theme', $event.target.value)">
        <option v-for="option in themes" :key="option.id" :value="option.id">{{ option.label }}</option>
      </select>
      <p :id="`${id}-theme-help`" class="appearance-hint">Preview changes immediately. Save to keep the theme; Cancel restores the saved theme.</p>
    </div>
  </div>
</template>
