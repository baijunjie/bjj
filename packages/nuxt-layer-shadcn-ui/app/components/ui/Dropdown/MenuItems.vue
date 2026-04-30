<script setup lang="ts">
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../../shadcn/dropdown-menu'
import { cva } from 'class-variance-authority'
import ItemContent from './ItemContent.vue'
import SlotRenderer from './SlotRenderer.vue'
import type {
  DropdownActionItem,
  DropdownCustomActionItem,
  DropdownItem,
} from './types'

const actionColorVariants = cva('', {
  variants: {
    color: {
      default: '',
      primary: `
        text-primary
        focus:bg-primary/10 focus:text-primary
        data-[state=open]:bg-primary/10 data-[state=open]:text-primary
      `,
      success: `
        text-success
        focus:bg-success/10 focus:text-success
        data-[state=open]:bg-success/10 data-[state=open]:text-success
      `,
      info: `
        text-info
        focus:bg-info/10 focus:text-info
        data-[state=open]:bg-info/10 data-[state=open]:text-info
      `,
      help: `
        text-help
        focus:bg-help/10 focus:text-help
        data-[state=open]:bg-help/10 data-[state=open]:text-help
      `,
      warn: `
        text-warn
        focus:bg-warn/10 focus:text-warn
        data-[state=open]:bg-warn/10 data-[state=open]:text-warn
      `,
      danger: `
        text-danger
        focus:bg-danger/10 focus:text-danger
        data-[state=open]:bg-danger/10 data-[state=open]:text-danger
      `,
    },
  },
  defaultVariants: { color: 'default' },
})

defineProps<{
  menus: DropdownItem[]
}>()

const ctx = inject(dropdownContextKey)

const handleItemAction = (
  item: DropdownActionItem | DropdownCustomActionItem,
  event?: Event,
) => {
  if (item.disabled) {
    event?.preventDefault()
    return
  }
  item.command?.()
  ctx?.hide()
}
</script>

<template>
  <template
    v-for="(menu, index) in menus"
    :key="index"
  >
    <!-- Built-in: separator -->
    <DropdownMenuSeparator v-if="menu.type === 'separator'" />
    <!-- Built-in: group label -->
    <DropdownMenuLabel
      v-else-if="menu.type === 'label'"
      class="text-xs font-normal text-muted-foreground"
    >
      {{ menu.label }}
    </DropdownMenuLabel>
    <!-- Custom label: content via named slot -->
    <DropdownMenuLabel
      v-else-if="menu.type === 'custom-label'"
      :class="cn('p-0 font-normal', menu.class)"
    >
      <SlotRenderer
        :slotName="menu.slot"
        :item="menu"
      />
    </DropdownMenuLabel>
    <!-- Custom action: content via named slot -->
    <DropdownMenuItem
      v-else-if="menu.type === 'custom-action'"
      :disabled="menu.disabled"
      :class="cn(actionColorVariants({ color: menu.color }), menu.class)"
      @click="handleItemAction(menu, $event)"
    >
      <SlotRenderer
        :slotName="menu.slot"
        :item="menu"
      />
      <Icon
        v-if="menu.active"
        name="check"
        class="size-4 ml-auto"
      />
    </DropdownMenuItem>
    <!-- Action with sub-menu -->
    <DropdownMenuSub v-else-if="menu.subMenus?.length">
      <DropdownMenuSubTrigger
        :disabled="menu.disabled"
        :class="cn(actionColorVariants({ color: menu.color }), menu.class)"
      >
        <ItemContent :item="menu" />
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent :style="ctx?.contentStyle.value">
        <MenuItems :menus="menu.subMenus" />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <!-- Built-in: action (default). When `href` is set, asChild merges
         our props (incl. @click) onto the WebLink, so the click handler
         only needs to live here. -->
    <DropdownMenuItem
      v-else
      :disabled="menu.disabled"
      :asChild="!!menu.href"
      :class="cn(actionColorVariants({ color: menu.color }), menu.class)"
      @click="handleItemAction(menu, $event)"
    >
      <WebLink
        v-if="menu.href"
        unstyled
        :href="menu.href"
        :target="menu.target"
        class="gap-2 flex w-full items-center"
      >
        <ItemContent :item="menu" />
        <Icon
          v-if="isUrl(menu.href)"
          name="external-link"
          class="size-3.5 text-muted-foreground"
        />
      </WebLink>
      <ItemContent
        v-else
        :item="menu"
      />
    </DropdownMenuItem>
  </template>
</template>
