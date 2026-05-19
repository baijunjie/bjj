import type { LucideProps } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface IconProps extends /* @vue-ignore */ Omit<LucideProps, 'class' | 'size' | 'name'> {
  /** Lucide icon name in kebab-case (e.g. "arrow-left") or a Vue component. */
  name: string | Component
  /** Numeric pixel size. When set, the default `size-4` class is skipped so SVG sizing takes effect. */
  size?: LucideProps['size']
  class?: ClassValue
}
