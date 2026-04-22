<script setup lang="ts">
import { icons } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { IconProps } from './types'

const props = defineProps<IconProps>()

// Convert kebab-case to PascalCase: "alarm-clock" -> "AlarmClock"
function toPascalCase (str: string): string {
  return str
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

const iconComponent = computed<Component | undefined>(() => {
  const pascalName = toPascalCase(props.name)
  return (icons as Record<string, Component>)[pascalName]
})

const mergedClass = computed(() => cn('size-4', props.class))
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :class="mergedClass"
  />
</template>
