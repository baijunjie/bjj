<script setup lang="ts">
import { ref } from 'vue'

const log = ref<string[]>([])

function record (name: string, ...args: unknown[]) {
  const time = new Date().toLocaleTimeString()
  const detail = args.length ? `(${args.map(formatArg).join(', ')})` : ''
  log.value.unshift(`${time} — ${name}${detail}`)
}

function formatArg (value: unknown) {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

defineSlots<{
  default(props: { record: typeof record }): unknown
}>()
</script>

<template>
  <div class="space-y-3">
    <slot :record="record" />
    <ul class="text-sm rounded-md p-3 space-y-1 max-h-40 overflow-auto border">
      <li
        v-if="!log.length"
        class="text-muted-foreground"
      >
        Trigger any event to see it logged here.
      </li>
      <li
        v-for="(line, i) in log"
        :key="i"
      >
        {{ line }}
      </li>
    </ul>
  </div>
</template>
