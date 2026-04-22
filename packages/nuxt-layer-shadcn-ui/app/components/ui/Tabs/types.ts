import type { Component } from 'vue'

export interface TabsItem {
  value: string
  title?: string
  icon?: string | Component
  content?: string
  disabled?: boolean
}

export interface TabsProps {
  items?: TabsItem[]
  modelValue?: string
  defaultValue?: string
  rounded?: boolean
  iconOnly?: boolean
  listClass?: ClassValue
  triggerClass?: ClassValue
}
