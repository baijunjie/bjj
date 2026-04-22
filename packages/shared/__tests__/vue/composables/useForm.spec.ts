import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import {
  isEqualWithOriginData,
  nonFlatObject,
  setFieldsValue,
} from '../../../src/vue/composables/useForm'

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
