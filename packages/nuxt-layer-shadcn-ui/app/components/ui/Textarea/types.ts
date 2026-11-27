import type { ControlSize } from '../../../types/control'

export interface TextareaProps {
  /** id of the textarea element; the label of an enclosing FormItem points at it */
  id?: string
  modelValue?: string
  /** Set to enable browser/password-manager autofill. Defaults to 'off'. */
  autocomplete?: string
  /** Fixed height in rows; one row is as tall as a single-line input of the same size tier */
  rows?: number
  /**
   * Without `rows` the textarea grows with its content: at least this many
   * rows (one row as tall as a single-line input of the same size tier).
   * Unset keeps the base minimum height (4rem).
   */
  minRows?: number
  /** Without `rows`, the textarea grows with its content up to this many rows, then scrolls */
  maxRows?: number
  /** Maximum number of characters allowed */
  maxlength?: number
  /** Maximum number of lines allowed: extra line breaks are blocked and pasted overflow is trimmed */
  maxLines?: number
  /**
   * Show line and character count below the textarea, rendered as `lines · count`.
   * Each part gains a ` / limit` suffix when `maxLines` / `maxlength` is set.
   */
  showCount?: boolean
  /** Size tier. Unset follows the nearest ancestor's `data-control-size`, else `default`. */
  size?: ControlSize
  /**
   * Rounded corners matching a single-line input's pill ends: the radius stays
   * half a single-line control's height however many lines the content takes.
   */
  rounded?: boolean
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
