<script setup>
defineProps({
  target: { type: Object, default: null },
  theme: { type: String, required: true },
})
const emit = defineEmits(['cancel'])

function trapFocus(event) {
  if (event.key !== 'Tab') return
  const dialog = event.currentTarget.querySelector('dialog[open]')
  if (!dialog) return
  const controls = [...dialog.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')]
    .filter(element => !element.disabled && element.tabIndex >= 0 && !element.closest('[hidden], [inert]') &&
      getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden')
  const first = controls[0]
  const last = controls.at(-1)
  if (!first) {
    event.preventDefault()
    dialog.focus()
  } else if (event.shiftKey && document.activeElement === first || !event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    const target = event.shiftKey ? last : first
    target.focus()
  }
}
</script>

<template>
  <Teleport :to="target || 'body'" :disabled="!target">
    <div class="prototype-page dialog-theme-layer" :class="{ 'window-dialog-layer': target }" :data-theme="theme" @click.self="target && emit('cancel')" @keydown="target && trapFocus($event)">
      <slot :embedded="Boolean(target)" />
    </div>
  </Teleport>
</template>
