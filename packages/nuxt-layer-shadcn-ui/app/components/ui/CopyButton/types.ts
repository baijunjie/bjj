import type { ButtonProps } from '../Button/types'

export interface CopyButtonProps extends /* @vue-ignore */ ButtonProps {
  /** The text content to copy to clipboard */
  copy?: string
  /** Custom tooltip text shown before copy action */
  beforeCopyText?: string
  /** Custom tooltip text shown after successful copy */
  afterCopyText?: string
}
