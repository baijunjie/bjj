export interface BreadcrumbItem {
  label?: string
  icon?: string
  href?: string
  target?: string
}

export interface BreadcrumbProps {
  model?: BreadcrumbItem[]
  home?: BreadcrumbItem
}
