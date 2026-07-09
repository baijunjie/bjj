import { effectScope, nextTick, reactive, ref } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import {
  isEqualWithOriginData,
  nonFlatObject,
  setFieldsValue,
  useForm,
} from '../../../src/vue/composables/useForm'

// useForm calls useI18n() at init for error-message translation. Stub it so the
// composable can run inside a bare effect scope (translation is not exercised).
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

function runInScope<T> (fn: () => T): { result: T, stop: () => void } {
  const scope = effectScope()
  let result!: T
  scope.run(() => {
    result = fn()
  })
  return { result, stop: () => scope.stop() }
}

describe('nonFlatObject', () => {
  it('should convert dot-notation keys to nested object', () => {
    expect(nonFlatObject({ 'a.b.c': 1 })).toEqual({ a: { b: { c: 1 }}})
  })

  it('should support array indices', () => {
    expect(nonFlatObject({ 'items.0': 1, 'items.1': 2 })).toEqual({ items: [ 1, 2 ]})
  })

  it('should handle flat keys', () => {
    expect(nonFlatObject({ foo: 1, bar: 2 })).toEqual({ foo: 1, bar: 2 })
  })

  it('should merge keys with shared prefix', () => {
    expect(nonFlatObject({ 'user.name': 'a', 'user.age': 3 }))
      .toEqual({ user: { name: 'a', age: 3 }})
  })
})

describe('setFieldsValue', () => {
  it('should copy nested values into flat form state', () => {
    const formState = { 'user.name': '', 'user.age': 0 }
    setFieldsValue(formState, { user: { name: 'Alice', age: 30 }})
    expect(formState).toEqual({ 'user.name': 'Alice', 'user.age': 30 })
  })

  it('should skip undefined values by default', () => {
    const formState = { 'user.name': 'keep', 'user.age': 0 }
    setFieldsValue(formState, { user: { age: 5 }})
    expect(formState['user.name']).toBe('keep')
    expect(formState['user.age']).toBe(5)
  })

  it('should support a custom ignore list', () => {
    const formState: Record<string, unknown> = { a: 1, b: 2 }
    setFieldsValue(formState, { a: null, b: 3 }, [ null ])
    expect(formState).toEqual({ a: 1, b: 3 })
  })

  it('should unwrap formState refs', () => {
    const formStateRef = ref<{ 'user.name': string }>({ 'user.name': '' })
    setFieldsValue(formStateRef, { user: { name: 'Bob' }})
    expect(formStateRef.value['user.name']).toBe('Bob')
  })

  it('should not overwrite when new value equals existing', () => {
    const obj = { foo: [ 1, 2 ]} as Record<string, unknown>
    const formState = { foo: obj.foo }
    setFieldsValue(formState, { foo: [ 1, 2 ]})
    expect(formState.foo).toBe(obj.foo) // reference preserved
  })
})

describe('isEqualWithOriginData', () => {
  it('should return true for equal values', () => {
    const formState = { 'user.name': 'Alice', 'user.age': 30 }
    const origin = { user: { name: 'Alice', age: 30 }}
    expect(isEqualWithOriginData(formState, origin)).toBe(true)
  })

  it('should return false for differing values', () => {
    const formState = { 'user.name': 'Alice', 'user.age': 30 }
    const origin = { user: { name: 'Bob', age: 30 }}
    expect(isEqualWithOriginData(formState, origin)).toBe(false)
  })

  it('should treat empty form value + undefined origin as equal', () => {
    // origin.foo is undefined, form.foo is falsy — considered equal
    expect(isEqualWithOriginData({ foo: '' }, {})).toBe(true)
    expect(isEqualWithOriginData({ foo: 0 }, {})).toBe(true)
    expect(isEqualWithOriginData({ foo: false }, {})).toBe(true)
    expect(isEqualWithOriginData({ foo: null }, {})).toBe(true)
  })

  it('should return false when origin has value and form is different', () => {
    expect(isEqualWithOriginData({ foo: 0 }, { foo: 1 })).toBe(false)
  })

  it('should return true when form does not track a key', () => {
    expect(isEqualWithOriginData({}, { foo: 1 })).toBe(true)
  })

  it('should unwrap refs for both args', () => {
    const formState = ref({ 'user.name': 'x' })
    const origin = ref({ user: { name: 'x' }})
    expect(isEqualWithOriginData(formState, origin)).toBe(true)
  })
})

describe('useForm — origin never aliases reactive state', () => {
  it('re-baselining origin from current.value does not clobber sibling fields on a later nested mutation', async () => {
    const formState = reactive({ zip: '', address: { pref: '', city: '' }})
    const { result, stop } = runInScope(() => useForm(formState, { autoValidate: false }))

    // Mimics create.vue re-baselining after a derived edit: `current.value`
    // shares the reactive `address` object with `formState`.
    result.origin.value = result.current.value
    await nextTick()

    formState.zip = '123-4567'
    await nextTick()

    // The postal-code autofill mutates the nested address object; that must not
    // trigger an origin->state sync that wipes the sibling `zip`.
    formState.address.pref = 'Tokyo'
    await nextTick()

    expect(formState.zip).toBe('123-4567')
    expect(formState.address.pref).toBe('Tokyo')
    stop()
  })

  it('deep-clones the assigned origin so later external mutation cannot leak in', async () => {
    const formState = reactive({ name: '' })
    const { result, stop } = runInScope(() => useForm(formState, { autoValidate: false }))

    const server = { name: 'John' }
    result.origin.value = server
    await nextTick()
    expect(formState.name).toBe('John')

    server.name = 'MUTATED'
    await nextTick()
    expect(formState.name).toBe('John')
    stop()
  })

  it('still syncs server data assigned to origin into the form state', async () => {
    const formState = reactive({ name: '', email: '' })
    const { result, stop } = runInScope(() => useForm(formState, { autoValidate: false }))

    result.origin.value = { name: 'Jane', email: 'jane@example.com' }
    await nextTick()

    expect(formState.name).toBe('Jane')
    expect(formState.email).toBe('jane@example.com')
    expect(result.changed.value).toBe(false)
    stop()
  })
})
