import type { InjectionKey, MaybeRefOrGetter, Ref } from 'vue'

const formItemInvalidKey: InjectionKey<Ref<boolean>> = Symbol('formItemInvalid')

/**
 * Resolves the effective invalid state for an input-like component, combining
 * its own `invalid` prop with any ancestor FormItem's error state. Re-provides
 * the combined state so nested input-likes (e.g. Input inside DatePicker)
 * inherit it without manual prop forwarding.
 */
export function useFormItemInvalid (localInvalid?: MaybeRefOrGetter<boolean | undefined>) {
  const ancestor = inject(formItemInvalidKey, ref(false))
  const effective = computed(() => !!toValue(localInvalid) || ancestor.value)
  provide(formItemInvalidKey, effective)
  return effective
}
