<script setup lang="ts">
import type { PageCardProps } from './types'

const props = withDefaults(defineProps<PageCardProps>(), {
  title: undefined,
  subtitle: undefined,
  back: undefined,
  ready: true,
  variant: 'paper',
  class: undefined,
})

const route = useRoute()
const router = useRouter()
const { isMobile } = useDevice()

const hasBack = computed(() => {
  if (!isMobile.value && route.query.back !== undefined) {
    return route.query.back !== 'false'
  }
  if (!props.back) return false
  if (isMobile.value && !(typeof props.back === 'object' && props.back.action)) return false
  return true
})

function handleBack () {
  if (typeof props.back === 'object' && props.back.action) {
    props.back.action()
  } else {
    router.back()
  }
}

const hasTitle = computed(() => !!props.title)
</script>

<template>
  <Card
    :class="cn('min-h-full', variant === 'paper' && `rounded-none border-none`, props.class)"
  >
    <template
      v-if="!ready || hasTitle || !!$slots.title || !!$slots.subtitle || !!subtitle || hasBack || !!$slots.actions"
      #header
    >
      <!-- Skeleton title -->
      <Skeleton
        v-if="!ready"
        height="1.5rem"
        width="40%"
      />
      <!-- Real title -->
      <div
        v-else
        class="
          flex items-center gap-2
          sm:gap-3
        "
      >
        <Button
          v-if="hasBack"
          variant="ghost"
          size="icon"
          icon="arrow-left"
          @click="handleBack"
        />
        <div class="flex-1">
          <h3
            v-if="!!$slots.title || !!title"
            class="text-lg leading-none font-semibold tracking-tight"
          >
            <slot name="title">
              {{ title }}
            </slot>
          </h3>
          <div
            v-if="!!$slots.subtitle || !!subtitle"
            class="mt-1 text-base text-muted-foreground"
          >
            <slot name="subtitle">
              {{ subtitle }}
            </slot>
          </div>
        </div>
        <div
          v-if="!!$slots.actions"
          class="
            flex items-center gap-2
            sm:gap-3
          "
        >
          <slot name="actions" />
        </div>
      </div>
    </template>

    <!-- Skeleton content -->
    <div
      v-if="!ready"
      class="flex flex-col gap-2"
    >
      <Skeleton height="1rem" />
      <Skeleton
        height="1rem"
        width="85%"
      />
      <Skeleton
        height="1rem"
        width="60%"
      />
    </div>

    <!-- Real content with loading overlay -->
    <div
      v-else
      class="relative"
    >
      <div
        v-if="loading"
        class="absolute inset-0 z-50 flex items-center justify-center"
      >
        <Loading class="size-8" />
      </div>
      <div :class="disabled || loading ? 'pointer-events-none opacity-50' : undefined">
        <slot />
      </div>
    </div>

    <template
      v-if="ready && !!$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </Card>
</template>
