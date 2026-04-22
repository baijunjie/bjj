import { effectScope } from 'vue'
import { describe, it, expect } from 'vitest'
import { usePagination } from '../../../src/vue/composables/usePagination'

function runInScope<T> (fn: () => T): T {
  const scope = effectScope()
  let result!: T
  scope.run(() => {
    result = fn()
  })
  return result
}

describe('usePagination', () => {
  it('should initialize with defaults when no args given', () => {
    const p = runInScope(() => usePagination<number>())
    expect(p.items.value).toEqual([])
    expect(p.limit.value).toBe(10)
    expect(p.total.value).toBe(Infinity)
    // offset = [].length - 10 = -10
    expect(p.offset.value).toBe(-10)
  })

  it('should auto-calculate initial offset from items length and limit', () => {
    const p = runInScope(() => usePagination([ 1, 2, 3, 4, 5 ], { limit: 2 }))
    expect(p.offset.value).toBe(3)
    expect(p.limit.value).toBe(2)
  })

  it('should use explicit offset when provided', () => {
    const p = runInScope(() => usePagination([ 1, 2, 3 ], { limit: 2, offset: 0 }))
    expect(p.offset.value).toBe(0)
  })

  it('should compute next pagination when more pages remain', () => {
    const p = runInScope(() => usePagination([ 1, 2 ], { limit: 2, offset: 0, total: 10 }))
    expect(p.next.value).toEqual({ limit: 2, offset: 2 })
  })

  it('should return null for next when at or past total', () => {
    const p = runInScope(() => usePagination([ 1, 2 ], { limit: 2, offset: 8, total: 10 }))
    expect(p.next.value).toBeNull()
  })

  it('should compute prev when offset > 0', () => {
    const p = runInScope(() => usePagination([], { limit: 5, offset: 10 }))
    expect(p.prev.value).toEqual({ limit: 5, offset: 5 })
  })

  it('should return null for prev when offset <= 0', () => {
    const p = runInScope(() => usePagination([], { limit: 5, offset: 0 }))
    expect(p.prev.value).toBeNull()
  })

  it('should clamp prev offset to 0', () => {
    const p = runInScope(() => usePagination([], { limit: 10, offset: 3 }))
    expect(p.prev.value).toEqual({ limit: 10, offset: 0 })
  })

  it('should append items when updating past current length', () => {
    const p = runInScope(() => usePagination([ 1, 2 ], { limit: 2, offset: 0, total: 10 }))
    p.update([ 3, 4 ])
    expect(p.items.value).toEqual([ 1, 2, 3, 4 ])
    expect(p.offset.value).toBe(2)
  })

  it('should replace items when new offset lies within current items', () => {
    const p = runInScope(() => usePagination([ 1, 2, 3, 4 ], { limit: 2, offset: 0, total: 10 }))
    p.update([ 10, 20 ], { offset: 2 })
    expect(p.items.value).toEqual([ 1, 2, 10, 20 ])
    expect(p.offset.value).toBe(2)
  })

  it('should auto-update total when received items are less than limit', () => {
    const p = runInScope(() => usePagination<number>([], { limit: 5, offset: 0, total: Infinity }))
    p.update([ 1, 2, 3 ]) // 3 < limit=5, signals "no more pages"
    expect(p.items.value).toEqual([ 1, 2, 3 ])
    expect(p.total.value).toBe(3)
  })

  it('should reset pagination state', () => {
    const p = runInScope(() => usePagination([ 1, 2, 3 ], { limit: 2, offset: 1, total: 5 }))
    p.reset([ 9 ], { limit: 1 })
    expect(p.items.value).toEqual([ 9 ])
    expect(p.limit.value).toBe(1)
    expect(p.offset.value).toBe(0)
    expect(p.total.value).toBe(Infinity)
  })

  it('should reset to empty when called with no args', () => {
    const p = runInScope(() => usePagination([ 1, 2, 3 ], { limit: 2 }))
    p.reset()
    expect(p.items.value).toEqual([])
  })
})
