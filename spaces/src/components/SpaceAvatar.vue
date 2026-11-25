<script setup>
defineProps({
  name: { type: String, required: true },
  color: { type: String, required: true },
  image: { type: String, default: null },
})
</script>

<template>
  <span class="space-avatar" :data-color="color" aria-hidden="true">
    <img v-if="image" :src="image" alt="" />
    <template v-else>{{ name.trim().slice(0, 1).toUpperCase() || 'S' }}</template>
  </span>
</template>
