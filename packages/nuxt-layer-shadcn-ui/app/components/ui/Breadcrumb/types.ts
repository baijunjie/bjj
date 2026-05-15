import type { Component } from 'vue'

export interface BreadcrumbItem {
  label?: string
  icon?: string | Component
  href?: string
  target?: string
}

export interface BreadcrumbProps {
  model?: BreadcrumbItem[]
  home?: BreadcrumbItem
}
