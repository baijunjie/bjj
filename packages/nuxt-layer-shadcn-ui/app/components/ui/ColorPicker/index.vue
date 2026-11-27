<script setup lang="ts">
import type { ColorPickerProps } from './types'

/**
 * A pill holding a round swatch and the hex value. The swatch opens the
 * platform color picker (no picker library); the value is a text input taking
 * `#rgb` / `#rrggbb`, with or without the `#`. Values are shown in capitals.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps<ColorPickerProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  /** A color is settled: the platform picker closed on it, or a typed value was committed */
  'change': [value: string]
  /** The swatch's contrasting text color changed (also on mount when `foreground` differs) */
  'update:foreground': [value: string | undefined]
}>()

defineSlots<{
  /**
   * Replaces the round swatch; fill the slot box with `size-full`.
   * `foreground` is the candidate contrasting most with the color (see
   * `foregroundCandidates`; unset when the value isn't a hex color).
   */
  swatch?: (props: { value: string | undefined, foreground: string | undefined }) => any
}>()

const T = useTranslations('components.ui.ColorPicker')

const isInvalid = useFormItemInvalid(() => props.invalid)
// The hex text input is the labelled control: a click on the FormItem label
// focuses it rather than opening the platform picker, and the pill's own text
// stays out of the name.
const formItemAttrs = useFormItemControl({ labelable: true, id: () => props.id })

const HEX_PATTERN = /^#?([\da-f]{3}|[\da-f]{6})$/i

/** `#rrggbb` in lowercase, the form the platform picker gives, or undefined when not a hex color */
function normalize (value: string | undefined) {
  const digits = value?.trim().match(HEX_PATTERN)?.[1]
  if (!digits) return undefined
  const full = digits.length === 3 ? [ ...digits ].map(digit => digit + digit).join('') : digits
  return `#${full.toLowerCase()}`
}

// The platform picker only takes `#rrggbb`; anything else would open it at black.
const pickerValue = computed(() => normalize(props.modelValue))

/** WCAG relative luminance of a `#rrggbb` color */
function relativeLuminance (hex: string) {
  const [ r, g, b ] = [ 1, 3, 5 ].map(offset => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const DEFAULT_FOREGROUND_CANDIDATES = [ '#000000', '#ffffff' ]

function contrastRatio (first: number, second: number) {
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

// The candidate with the highest WCAG contrast against the color; the first
// wins a tie. Black or white by default, one of which always reaches AA
// (≥ 4.5:1). Unset for a value that isn't a hex color.
const contrastColor = computed(() => {
  if (!pickerValue.value) return undefined
  const luminance = relativeLuminance(pickerValue.value)
  let best: { color: string, ratio: number } | undefined
  for (const color of props.foregroundCandidates ?? DEFAULT_FOREGROUND_CANDIDATES) {
    const hex = normalize(color)
    if (!hex) continue
    const ratio = contrastRatio(luminance, relativeLuminance(hex))
    if (!best || ratio > best.ratio) best = { color, ratio }
  }
  return best?.color
})

// Keeps `v-model:foreground` in step with the color, including a value that
// was stored out of step before mount.
watch(contrastColor, value => {
  if (value?.toLowerCase() !== props.foreground?.toLowerCase()) emit('update:foreground', value)
}, { immediate: true })

// What the text input shows. Held apart from the model while typing so an
// unfinished value isn't overwritten; back to the model on blur.
const draft = ref(props.modelValue ?? '')
const editing = ref(false)

watch(() => props.modelValue, value => {
  if (!editing.value) draft.value = value ?? ''
})

function update (value: string) {
  if (value !== props.modelValue?.toLowerCase()) emit('update:modelValue', value)
}

function handlePickerInput (event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function handlePickerChange (event: Event) {
  emit('change', (event.target as HTMLInputElement).value)
}

function handleTextInput (event: Event) {
  draft.value = (event.target as HTMLInputElement).value
  // Only six digits apply while typing: three could still be the start of six.
  const value = normalize(draft.value)
  if (value && draft.value.trim().replace(/^#/, '').length === 6) update(value)
}

// Native `change` fires on Enter and on blur after an edit.
function handleTextChange () {
  const value = normalize(draft.value)
  if (!value) {
    draft.value = props.modelValue ?? ''
    return
  }
  draft.value = value
  update(value)
  emit('change', value)
}

// Back to showing the model: a value just emitted arrives through the watcher,
// and one the parent refused, or a change from outside while typing, shows as is.
function handleTextBlur () {
  editing.value = false
  draft.value = props.modelValue ?? ''
}
</script>

<template>
  <div
    data-slot="color-picker"
    :data-control-size="size"
    :data-disabled="disabled || undefined"
    :class="cn(
      `
        border-input shadow-xs pl-1
        dark:bg-input/30
        inline-flex h-(--control-height) w-fit shrink-0 items-center
        gap-(--control-gap) rounded-full border pr-(--control-px)
        transition-[color,box-shadow]
      `,
      // The focus ring is drawn on the pill: the picker input is `sr-only`.
      // `:focus` rather than `:focus-visible`: a click opening the platform
      // picker is not focus-visible in Chrome, which would leave no feedback.
      `
        has-[input:focus]:border-ring has-[input:focus]:ring-ring/50
        has-[input:focus]:ring-[3px]
      `,
      `
        has-[[aria-invalid=true]]:border-destructive
        has-[[aria-invalid=true]]:ring-destructive/20
        dark:has-[[aria-invalid=true]]:ring-destructive/40
      `,
      'data-disabled:cursor-not-allowed data-disabled:opacity-50',
      props.class,
    )"
  >
    <label
      class="
        relative size-[calc(var(--control-height)-8px)] shrink-0 cursor-pointer
        rounded-full
        in-data-disabled:pointer-events-none
      "
    >
      <slot
        name="swatch"
        :value="modelValue"
        :foreground="contrastColor"
      >
        <span
          class="
            border-border font-bold flex size-full items-center justify-center
            rounded-full border text-[calc((var(--control-height)-8px)/2)]
          "
          :style="{ backgroundColor: modelValue, color: contrastColor }"
          aria-hidden="true"
        >
          {{ swatchText }}
        </span>
      </slot>
      <input
        type="color"
        class="sr-only"
        :value="pickerValue"
        :disabled="disabled"
        :aria-label="T('pick')"
        @input="handlePickerInput"
        @change="handlePickerChange"
      >
    </label>
    <input
      type="text"
      :value="draft"
      class="
        min-w-0 font-mono text-base
        md:text-(length:--control-font-size)
        md:leading-(--control-line-height)
        h-full w-[7.5ch] bg-transparent uppercase outline-none
        disabled:cursor-not-allowed
      "
      v-bind="{ ...formItemAttrs($attrs), ...$attrs }"
      :disabled="disabled"
      :aria-invalid="isInvalid || undefined"
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
      data-1p-ignore
      @focus="editing = true"
      @blur="handleTextBlur"
      @input="handleTextInput"
      @change="handleTextChange"
    >
  </div>
</template>
