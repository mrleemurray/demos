<script setup>
defineProps({
  modelValue: { type: String, required: true },
  legend: { type: String, default: 'Work area type' },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <fieldset class="window-kind-picker">
    <legend>{{ legend }}</legend>
    <label v-for="kind in ['agents', 'editor']" :key="kind" :class="{ selected: modelValue === kind }">
      <input type="radio" name="window-kind" :value="kind" :checked="modelValue === kind" @change="emit('update:modelValue', kind)" />
      <i :class="`codicon codicon-${kind === 'agents' ? 'agent' : 'code'}`" aria-hidden="true" />
      <strong>{{ kind === 'agents' ? 'Agents' : 'Editor' }}</strong>
      <span>{{ kind === 'agents' ? 'Delegate, explore, and review.' : 'Get hands-on with your code.' }}</span>
      <i v-if="modelValue === kind" class="codicon codicon-check window-kind-check" aria-hidden="true" />
    </label>
  </fieldset>
</template>
