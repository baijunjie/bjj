<script setup lang="ts">
import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/tabs'
import type { TabsItem, TabsProps } from './types'

const props = withDefaults(defineProps<TabsProps>(), {
  items: () => [],
  modelValue: undefined,
  defaultValue: undefined,
  rounded: false,
  iconOnly: false,
  listClass: undefined,
  triggerClass: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  title?: (props: { item: TabsItem, active: boolean }) => unknown
  content?: (props: { item: TabsItem, active: boolean }) => unknown
}>()

const hasItemContent = computed(() => props.items.some(item => !!item.content))

const mergedListClass = computed(() => cn(props.rounded && 'rounded-full', props.listClass))

function getTriggerClass (item: TabsItem) {
  const showsOnlyIcon = !!item.icon && (props.iconOnly || !item.title)
  return cn(
    props.rounded && 'rounded-full',
    showsOnlyIcon && 'aspect-square flex-none px-0',
    props.triggerClass,
  )
}
</script>

<template>
  <ShadcnTabs
    v-slot="{ modelValue: activeValue }"
    :modelValue="modelValue"
    :defaultValue="defaultValue"
    @update:modelValue="value => emit('update:modelValue', String(value))"
  >
    <TabsList :class="mergedListClass">
      <TabsTrigger
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :disabled="item.disabled"
        :class="getTriggerClass(item)"
        :aria-label="item.title"
      >
        <slot
          name="title"
          :item="item"
          :active="activeValue === item.value"
        >
          <Icon
            v-if="item.icon && typeof item.icon === 'string'"
            :name="item.icon"
          />
          <component
            :is="item.icon"
            v-else-if="item.icon"
          />
          <span v-if="item.title && !iconOnly">
            {{ item.title }}
          </span>
        </slot>
      </TabsTrigger>
    </TabsList>
    <template v-if="hasItemContent || $slots.content">
      <TabsContent
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        <slot
          name="content"
          :item="item"
          :active="activeValue === item.value"
        >
          {{ item.content }}
        </slot>
      </TabsContent>
    </template>
  </ShadcnTabs>
</template>
