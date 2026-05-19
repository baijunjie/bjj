import type { Component } from 'vue'

/** Render state of a single step. */
export type StepsState = 'completed' | 'active' | 'inactive'

export interface StepsItem {
  /** Title text shown next to the indicator. */
  title?: string
  /** Description text shown below the title. */
  description?: string
  /** Icon name (lucide kebab-case) or a Vue component rendered inside the indicator. */
  icon?: string | Component
  /** When true, the step is non-interactive and visually muted. */
  disabled?: boolean
  /** Force the step into the completed state regardless of the active step. */
  completed?: boolean
  /** Extra class merged onto the step item element. */
  class?: ClassValue
}

export interface StepsProps {
  /** Step items to display. */
  items?: StepsItem[]
  /** Active step (1-based). Use with `v-model` to control the value. */
  modelValue?: number
  /** Initial active step when uncontrolled. */
  defaultValue?: number
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical'
  /** Whether the steps must be completed in order. */
  linear?: boolean
  /** Extra class merged onto the stepper root. */
  class?: ClassValue
}
