// A symbol is letters / currency signs / percent; digits and separators (",.' "…)
// belong to the number and stay editable.
const LEADING_SYMBOL = /^[\p{L}\p{Sc}%]*/u
const TRAILING_SYMBOL = /[\p{L}\p{Sc}%]*$/u

/**
 * `beforeinput` handler for InputNumber-based fields (currency, percent, unit …) that
 * blocks deletions which would erase part of the value's symbol, keeping it intact.
 * The symbol is the run of symbol characters at each edge of the displayed value, so
 * it works for any currency, format, and locale. A full-selection delete that clears
 * the field is allowed. Bind via `@beforeinput`; the event bubbles up from the inner input.
 */
export function guardSymbolDeletion (event: Event) {
  const e = event as InputEvent
  const input = e.target as HTMLInputElement | null
  if (!input || !e.inputType.startsWith('delete')) return

  const { value } = input
  const start = input.selectionStart ?? 0
  const end = input.selectionEnd ?? start

  // Clearing the whole field via a full selection is always allowed.
  if (start !== end && start === 0 && end === value.length) return

  const symbolEnd = value.match(LEADING_SYMBOL)![0].length
  const symbolStart = value.length - value.match(TRAILING_SYMBOL)![0].length

  // Expand a collapsed caret to the character the deletion would remove.
  let from = start
  let to = end
  if (start === end) {
    if (e.inputType.endsWith('Forward')) to = start + 1
    else from = start - 1
  }

  const hitsPrefix = from < symbolEnd && to > 0
  const hitsSuffix = from < value.length && to > symbolStart
  if (hitsPrefix || hitsSuffix) e.preventDefault()
}
