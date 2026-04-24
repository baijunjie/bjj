import type { BadgeVariants } from '../../shadcn/badge'

export type BadgeVariant = NonNullable<BadgeVariants['variant']>

export interface BadgeProps extends /* @vue-ignore */ BadgeVariants {}
