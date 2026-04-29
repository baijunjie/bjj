<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../shadcn/dropdown-menu'
import { cva } from 'class-variance-authority'
import type {
  DropdownActionItem,
  DropdownCustomActionItem,
  DropdownProps,
} from './types'

const actionColorVariants = cva('', {
  variants: {
    color: {
      default: '',
      primary: `
        text-primary
        focus:bg-primary/10 focus:text-primary
      `,
      success: `
        text-success
        focus:bg-success/10 focus:text-success
      `,
      info: `
        text-info
        focus:bg-info/10 focus:text-info
      `,
      help: `
        text-help
        focus:bg-help/10 focus:text-help
      `,
      warn: `
        text-warn
        focus:bg-warn/10 focus:text-warn
      `,
      danger: `
        text-danger
        focus:bg-danger/10 focus:text-danger
      `,
    },
  },
  defaultVariants: { color: 'default' },
})

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DropdownProps>(), {
  menus: () => [],
  trigger: 'hover',
  class: undefined,
})

defineSlots<{
  default?: () => unknown
  popup?: (props: { hide: () => void }) => unknown
  [key: string]: ((props?: any) => unknown) | undefined
}>()

const { isMobile } = useDevice()

// Force click trigger on mobile devices for better touch experience
const effectiveTrigger = computed(() => {
  return isMobile.value ? 'click' : props.trigger
})

const isOpen = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const clearHideTimeout = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

const hide = () => {
  isOpen.value = false
}

const handleTriggerEnter = () => {
  if (effectiveTrigger.value === 'hover') {
    clearHideTimeout()
    isOpen.value = true
  }
}

const handleTriggerLeave = () => {
  if (effectiveTrigger.value === 'hover') {
    hideTimeout = setTimeout(hide, 100)
  }
}

const handleMenuEnter = () => {
  if (effectiveTrigger.value === 'hover') {
    clearHideTimeout()
  }
}

const handleMenuLeave = () => {
  if (effectiveTrigger.value === 'hover') {
    hideTimeout = setTimeout(hide, 100)
  }
}

const handleItemAction = (
  item: DropdownActionItem | DropdownCustomActionItem,
  event?: Event,
) => {
  if (item.disabled) {
    event?.preventDefault()
    return
  }
  item.command?.()
  hide()
}

onBeforeUnmount(() => {
  clearHideTimeout()
})
</script>

<template>
  <DropdownMenu
    v-model:open="isOpen"
    :modal="effectiveTrigger !== 'hover'"
  >
    <DropdownMenuTrigger
      asChild
      @mouseenter="handleTriggerEnter"
      @mouseleave="handleTriggerLeave"
    >
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      v-bind="$attrs"
      :class="props.class"
      @mouseenter="handleMenuEnter"
      @mouseleave="handleMenuLeave"
    >
      <!-- Custom popup content -->
      <template v-if="$slots.popup">
        <slot
          name="popup"
          :hide="hide"
        />
      </template>

      <!-- Default menu dropdown -->
      <template v-else>
        <template
          v-for="(item, index) in menus"
          :key="index"
        >
          <!-- Built-in: separator -->
          <DropdownMenuSeparator v-if="item.type === 'separator'" />
          <!-- Built-in: group label -->
          <DropdownMenuLabel
            v-else-if="item.type === 'label'"
            class="text-xs font-normal text-muted-foreground"
          >
            {{ item.label }}
          </DropdownMenuLabel>
          <!-- Custom label: content via named slot -->
          <DropdownMenuLabel
            v-else-if="item.type === 'custom-label'"
            :class="cn('p-0 font-normal', item.class)"
          >
            <slot
              :name="item.slot"
              :item="item"
            />
          </DropdownMenuLabel>
          <!-- Custom action: content via named slot -->
          <DropdownMenuItem
            v-else-if="item.type === 'custom-action'"
            :disabled="item.disabled"
            :class="cn(actionColorVariants({ color: item.color }), item.class)"
            @click="handleItemAction(item, $event)"
          >
            <slot
              :name="item.slot"
              :item="item"
            />
            <Icon
              v-if="item.active"
              name="check"
              class="size-4 ml-auto"
            />
          </DropdownMenuItem>
          <!-- Built-in: action (default) -->
          <DropdownMenuItem
            v-else
            :disabled="item.disabled"
            :asChild="!!item.href"
            :class="cn(actionColorVariants({ color: item.color }), item.class)"
            @click="!item.href && handleItemAction(item, $event)"
          >
            <template v-if="item.href">
              <WebLink
                unstyled
                :href="item.href"
                :target="item.target"
                class="gap-2 flex w-full items-center"
                @click="handleItemAction(item, $event)"
              >
                <Icon
                  v-if="typeof item.icon === 'string'"
                  :name="item.icon"
                />
                <component
                  :is="item.icon"
                  v-else-if="item.icon"
                  class="size-4"
                />
                <span class="flex-1">
                  {{ item.label }}
                </span>
                <Icon
                  v-if="isUrl(item.href)"
                  name="external-link"
                  class="size-3.5 text-muted-foreground"
                />
                <Icon
                  v-if="item.active"
                  name="check"
                  class="size-4"
                />
              </WebLink>
            </template>
            <template v-else>
              <Icon
                v-if="typeof item.icon === 'string'"
                :name="item.icon"
              />
              <component
                :is="item.icon"
                v-else-if="item.icon"
                class="size-4"
              />
              <span class="flex-1">
                {{ item.label }}
              </span>
              <Icon
                v-if="item.active"
                name="check"
                class="size-4"
              />
            </template>
          </DropdownMenuItem>
        </template>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
