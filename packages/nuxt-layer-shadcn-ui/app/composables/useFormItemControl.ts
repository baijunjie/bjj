import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'

interface FormItemControlEntry {
  /** The control's focus element is natively labelable (input, textarea, button) */
  labelable: boolean
  id: ComputedRef<string | undefined>
}

interface FormItemFieldContext {
  labelId: string
  descriptionId: string
  errorId: string
  hasLabel: ComputedRef<boolean>
  hasDescription: ComputedRef<boolean>
  hasError: ComputedRef<boolean>
  controls: FormItemControlEntry[]
}

const formItemFieldKey: InjectionKey<FormItemFieldContext | null> = Symbol('formItemField')

export interface FormItemFieldState {
  /** Whether the label element is rendered */
  hasLabel: MaybeRefOrGetter<boolean>
  /** Whether the description element is rendered */
  hasDescription: MaybeRefOrGetter<boolean>
  /** Whether the error element is rendered */
  hasError: MaybeRefOrGetter<boolean>
}

/**
 * Called by FormItem: provides the ids of its label, description and error to
 * the controls inside, and resolves how the label is associated.
 *
 * The label names a control only when exactly one control registers; with
 * none or several (a range of two inputs, a list of checkboxes), it names the
 * field group instead, so no control gets a misleading name.
 */
export function provideFormItemField (state: FormItemFieldState) {
  const baseId = useId()
  const ctx: FormItemFieldContext = {
    labelId: `${baseId}-label`,
    descriptionId: `${baseId}-description`,
    errorId: `${baseId}-error`,
    hasLabel: computed(() => toValue(state.hasLabel)),
    hasDescription: computed(() => toValue(state.hasDescription)),
    hasError: computed(() => toValue(state.hasError)),
    controls: shallowReactive<FormItemControlEntry[]>([]),
  }
  provide(formItemFieldKey, ctx)

  const soleControl = computed(() => ctx.controls.length === 1 ? ctx.controls[0] : undefined)

  return {
    labelId: ctx.labelId,
    descriptionId: ctx.descriptionId,
    errorId: ctx.errorId,
    /** `for` of the label: the id of the sole labelable control */
    labelFor: computed(() => soleControl.value?.labelable ? soleControl.value.id.value : undefined),
    /** `aria-labelledby` of the field group, when no sole control takes the label */
    groupLabelledby: computed(() => ctx.hasLabel.value && !soleControl.value ? ctx.labelId : undefined),
  }
}

export interface FormItemControlOptions {
  /**
   * Whether the element receiving focus is natively labelable (input, textarea,
   * button). Such a control gets an id that the label's `for` points at; other
   * controls (custom comboboxes, radio groups) get `aria-labelledby` instead.
   */
  labelable: boolean
  /** The id set by the consumer, which takes precedence over the generated one */
  id?: MaybeRefOrGetter<string | undefined>
}

/**
 * Registers an input-like component with the nearest FormItem so the FormItem's
 * label, description and error are associated with it.
 *
 * Returns a function to call in the template with `$attrs`; bind its result on
 * the element receiving focus, before the consumer's attrs so theirs win. An
 * `aria-label` / `aria-labelledby` set by the consumer suppresses the label
 * association. Input-likes nested inside this one stay out of the association.
 */
export function useFormItemControl (options: FormItemControlOptions) {
  const ctx = inject(formItemFieldKey, null)
  provide(formItemFieldKey, null)

  const generatedId = useId()
  const id = computed(() => {
    const explicit = toValue(options.id)
    if (explicit) return explicit
    return ctx && options.labelable ? generatedId : undefined
  })

  if (ctx) {
    const entry: FormItemControlEntry = { labelable: options.labelable, id }
    ctx.controls.push(entry)
    onScopeDispose(() => {
      const index = ctx.controls.indexOf(entry)
      if (index !== -1) ctx.controls.splice(index, 1)
    })
  }

  const isSole = computed(() => ctx?.controls.length === 1)

  return (attrs: Record<string, unknown>) => {
    const describedby = ctx && [
      ctx.hasDescription.value && ctx.descriptionId,
      ctx.hasError.value && ctx.errorId,
    ].filter(Boolean).join(' ')
    const namedByConsumer = !!attrs['aria-label'] || !!attrs['aria-labelledby']
    const labelledby = ctx && !options.labelable && isSole.value && ctx.hasLabel.value && !namedByConsumer
      ? ctx.labelId
      : undefined
    return {
      'id': id.value,
      'aria-labelledby': labelledby,
      'aria-describedby': describedby || undefined,
    }
  }
}
