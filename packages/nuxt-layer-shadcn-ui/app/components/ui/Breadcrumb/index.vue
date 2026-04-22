<script setup lang="ts">
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/breadcrumb'
import type { BreadcrumbItem as BreadcrumbItemType, BreadcrumbProps } from './types'

const props = defineProps<BreadcrumbProps>()

const allItems = computed(() => {
  const items: BreadcrumbItemType[] = []
  if (props.home) items.push(props.home)
  if (props.model) items.push(...props.model)
  return items
})
</script>

<template>
  <ShadcnBreadcrumb>
    <BreadcrumbList>
      <template
        v-for="(item, index) in allItems"
        :key="index"
      >
        <BreadcrumbSeparator v-if="index > 0" />
        <BreadcrumbItem>
          <BreadcrumbLink
            v-if="item.href"
            asChild
          >
            <WebLink
              :href="item.href"
              unstyled
              class="inline-flex items-center gap-1"
            >
              <Icon
                v-if="item.icon"
                :name="item.icon"
              />
              <span>{{ item.label }}</span>
            </WebLink>
          </BreadcrumbLink>
          <BreadcrumbPage
            v-else
            class="inline-flex items-center gap-1"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
            />
            <span>{{ item.label }}</span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </ShadcnBreadcrumb>
</template>
