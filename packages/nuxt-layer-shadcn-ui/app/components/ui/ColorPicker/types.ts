import type { ControlSize } from '../../../types/control'

export interface ColorPickerProps {
  /** id of the hex text input; the label of an enclosing FormItem points at it */
  id?: string
  /**
   * The color. Picked colors come as lowercase `#rrggbb`, and typed ones are
   * normalized to the same form; a value set from outside is passed on as is
   * and only shown in capitals.
   */
  modelValue?: string
  /**
   * Text shown on the swatch (e.g. `A`) in the foreground color, to preview
   * text set on it. Decorative: hidden from assistive technology.
   */
  swatchText?: string
  /**
   * Hex colors to pick the foreground from: the one with the highest WCAG
   * contrast against the color wins, the first on a tie, and non-hex entries
   * are skipped. Defaults to `['#000000', '#ffffff']`, which always reaches AA
   * (≥ 4.5:1); custom candidates may not.
   */
  foregroundCandidates?: string[]
  /**
   * The foreground color: the candidate contrasting most with the color, as
   * written in `foregroundCandidates` (unset when the value isn't a hex color).
   * Computed by the component and reported through `update:foreground`, for
   * `v-model:foreground`; a value passed in is only compared against, never shown.
   */
  foreground?: string
  /** Size tier. Unset follows the nearest ancestor's `data-control-size`, else `default`. */
  size?: ControlSize
  /** Fully rounded (pill) corners, as on Button */
  rounded?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
