import { effectScope } from 'vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCountdown } from '../../../src/vue/composables/useCountdown'

function runInScope<T> (fn: () => T): { result: T, stop: () => void } {
  const scope = effectScope()
  let result!: T
  scope.run(() => {
    result = fn()
  })
  return { result, stop: () => scope.stop() }
}

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should start with remaining=0 and isActive=false', () => {
    const { result } = runInScope(() => useCountdown({ duration: 5 }))
    expect(result.remaining.value).toBe(0)
    expect(result.isActive.value).toBe(false)
  })

  it('should set remaining to duration when started', () => {
    const { result } = runInScope(() => useCountdown({ duration: 3 }))
    result.start()
    expect(result.remaining.value).toBe(3)
    expect(result.isActive.value).toBe(true)
  })

  it('should decrement remaining every second', () => {
    const { result } = runInScope(() => useCountdown({ duration: 3 }))
    result.start()

    vi.advanceTimersByTime(1000)
    expect(result.remaining.value).toBe(2)

    vi.advanceTimersByTime(1000)
    expect(result.remaining.value).toBe(1)
  })

  it('should call onFinish when countdown reaches zero', () => {
    const onFinish = vi.fn()
    const { result } = runInScope(() => useCountdown({ duration: 2, onFinish }))
    result.start()

    vi.advanceTimersByTime(2000)
    expect(result.remaining.value).toBe(0)
    expect(result.isActive.value).toBe(false)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('should stop without resetting remaining', () => {
    const { result } = runInScope(() => useCountdown({ duration: 5 }))
    result.start()
    vi.advanceTimersByTime(2000)
    expect(result.remaining.value).toBe(3)

    result.stop()
    vi.advanceTimersByTime(3000)
    expect(result.remaining.value).toBe(3)
  })

  it('should reset remaining to 0', () => {
    const { result } = runInScope(() => useCountdown({ duration: 5 }))
    result.start()
    vi.advanceTimersByTime(1000)
    expect(result.remaining.value).toBe(4)

    result.reset()
    expect(result.remaining.value).toBe(0)
    expect(result.isActive.value).toBe(false)
  })

  it('should use default duration of 60 seconds', () => {
    const { result } = runInScope(() => useCountdown())
    result.start()
    expect(result.remaining.value).toBe(60)
  })

  it('should restart and clear previous timer when start is called again', () => {
    const onFinish = vi.fn()
    const { result } = runInScope(() => useCountdown({ duration: 3, onFinish }))
    result.start()
    vi.advanceTimersByTime(1000)
    expect(result.remaining.value).toBe(2)

    // Restart — should reset to full duration
    result.start()
    expect(result.remaining.value).toBe(3)

    vi.advanceTimersByTime(3000)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('should stop timer on scope dispose', () => {
    const onFinish = vi.fn()
    const { result, stop } = runInScope(() => useCountdown({ duration: 3, onFinish }))
    result.start()

    stop()
    vi.advanceTimersByTime(5000)
    expect(onFinish).not.toHaveBeenCalled()
  })

  it('should expose readonly remaining', () => {
    const { result } = runInScope(() => useCountdown({ duration: 5 }))
    // Vue emits a runtime warning when writing to a readonly ref;
    // silence it so the test output stays clean.
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // @ts-expect-error remaining is readonly
    result.remaining.value = 99
    expect(result.remaining.value).toBe(0)
    warnSpy.mockRestore()
  })
})
