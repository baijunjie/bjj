<script setup lang="ts">
import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger,
} from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/accordion'
import type { AccordionRootProps } from 'reka-ui'
import type { AccordionItem, AccordionProps } from './types'

const props = withDefaults(defineProps<AccordionProps>(), {
  items: () => [],
  type: 'single',
  modelValue: undefined,
  defaultValue: undefined,
  collapsible: true,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
}>()

defineSlots<{
  title?: (props: { item: AccordionItem, open: boolean }) => unknown
  content?: (props: { item: AccordionItem, open: boolean }) => unknown
}>()

const rootProps = computed<AccordionRootProps>(() => {
  if (props.type === 'multiple') {
    return {
      type: 'multiple',
      modelValue: props.modelValue as string[] | undefined,
      defaultValue: props.defaultValue as string[] | undefined,
      disabled: props.disabled,
    }
  }
  return {
    type: 'single',
    modelValue: props.modelValue as string | undefined,
    defaultValue: props.defaultValue as string | undefined,
    collapsible: props.collapsible,
    disabled: props.disabled,
  }
})
</script>

<template>
  <ShadcnAccordion
    v-bind="rootProps"
    @update:modelValue="value => emit('update:modelValue', value)"
  >
    <ShadcnAccordionItem
      v-for="item in items"
      :key="item.value"
      v-slot="{ open }"
      :value="item.value"
      :disabled="item.disabled"
    >
      <AccordionTrigger>
        <slot
          name="title"
          :item="item"
          :open="open"
        >
          {{ item.title }}
        </slot>
      </AccordionTrigger>
      <AccordionContent>
        <slot
          name="content"
          :item="item"
          :open="open"
        >
          {{ item.content }}
        </slot>
      </AccordionContent>
    </ShadcnAccordionItem>
  </ShadcnAccordion>
</template>
