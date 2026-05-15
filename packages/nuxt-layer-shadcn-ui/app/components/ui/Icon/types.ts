import type { Component } from 'vue'

export interface IconProps {
  /** Lucide icon name in kebab-case (e.g. "arrow-left") or a Vue component. */
  name: string | Component
  class?: ClassValue
}
