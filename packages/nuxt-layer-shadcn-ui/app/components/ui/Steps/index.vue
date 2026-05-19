<script setup lang="ts">
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '../../shadcn/stepper'
import type { StepsItem, StepsProps, StepsState } from './types'

const props = withDefaults(defineProps<StepsProps>(), {
  items: () => [],
  modelValue: undefined,
  defaultValue: 1,
  orientation: 'horizontal',
  linear: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

defineSlots<{
  title?: (props: { item: StepsItem, step: number, state: StepsState }) => unknown
  description?: (props: { item: StepsItem, step: number, state: StepsState }) => unknown
}>()

const isVertical = computed(() => props.orientation === 'vertical')

const itemList = computed<StepsItem[]>(() => props.items ?? [])

const rootClass = computed(() => cn(
  'flex w-full',
  isVertical.value ? 'gap-6 flex-col' : 'gap-2 items-start',
  props.class,
))

const itemClass = (item: StepsItem) => cn(
  'group relative flex',
  isVertical.value
    ? 'gap-4 w-full items-start'
    : 'min-w-0 flex-1 flex-col items-center justify-center',
  item.class,
)

const separatorClass = computed(() => isVertical.value
  ? 'absolute left-5 top-10 block h-[calc(100%-1rem)] w-0.5 shrink-0 -translate-x-1/2 rounded-full'
  : 'absolute top-5 right-[calc(-50%+12px)] left-[calc(50%+20px)] block h-0.5 shrink-0 -translate-y-1/2 rounded-full')

const triggerClass = computed(() => isVertical.value ? 'shrink-0' : '')

const contentClass = computed(() => isVertical.value
  ? 'flex flex-col gap-0.5'
  : 'flex flex-col items-center gap-0.5 text-center')
</script>

<template>
  <Stepper
    :modelValue="modelValue"
    :defaultValue="defaultValue"
    :orientation="orientation"
    :linear="linear"
    :class="rootClass"
    @update:modelValue="value => emit('update:modelValue', value)"
  >
    <StepperItem
      v-for="(item, index) in itemList"
      v-slot="{ state }"
      :key="index"
      :step="index + 1"
      :disabled="item.disabled"
      :completed="item.completed"
      :class="itemClass(item)"
    >
      <StepperSeparator
        v-if="index !== itemList.length - 1"
        :class="separatorClass"
      />
      <StepperTrigger :class="triggerClass">
        <StepperIndicator class="bg-muted/60 relative z-10">
          <Icon
            v-if="state === 'completed' && !item.icon"
            name="check"
            class="size-4"
          />
          <Icon
            v-else-if="item.icon"
            :name="item.icon"
            class="size-4"
          />
          <span v-else>
            {{ index + 1 }}
          </span>
        </StepperIndicator>
      </StepperTrigger>
      <div
        v-if="item.title || item.description || $slots.title || $slots.description"
        :class="contentClass"
      >
        <StepperTitle
          v-if="item.title || $slots.title"
          class="text-sm font-semibold"
        >
          <slot
            name="title"
            :item="item"
            :step="index + 1"
            :state="(state as StepsState)"
          >
            {{ item.title }}
          </slot>
        </StepperTitle>
        <StepperDescription v-if="item.description || $slots.description">
          <slot
            name="description"
            :item="item"
            :step="index + 1"
            :state="(state as StepsState)"
          >
            {{ item.description }}
          </slot>
        </StepperDescription>
      </div>
    </StepperItem>
  </Stepper>
</template>
