export interface PageCardBackConfig {
  action: () => void
}

export type PageCardVariant = 'paper' | 'card'

export interface PageCardProps {
  title?: string
  subtitle?: string
  back?: boolean | PageCardBackConfig
  ready?: boolean
  loading?: boolean
  disabled?: boolean
  variant?: PageCardVariant
  class?: ClassValue
}
