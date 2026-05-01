import type { BadgeVariants } from '../../shadcn/badge'

export type BadgeVariant = BadgeVariants['variant']

export interface BadgeProps {
  variant?: BadgeVariant
}
