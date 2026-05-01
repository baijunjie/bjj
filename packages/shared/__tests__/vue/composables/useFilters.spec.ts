import { defineComponent, h, createApp } from 'vue'
import type { Router } from 'vue-router'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { useFilters } from '../../../src/vue/composables/useFilters'

/**
 * Mount `useFilters` inside a real Vue app + memory-history router so
 * we can drive URL ↔ filter sync end-to-end. Returns the reactive
 * filters record plus the router for navigation assertions.
 */
async function mount<T> (
  initialPath: string,
  fn: () => T,
): Promise<{ result: T, router: Router, unmount: () => void }> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' }}],
  })
  await router.push(initialPath)
  await router.isReady()

  let result!: T
  const App = defineComponent({
    setup () {
      result = fn()
      return () => h('div')
    },
  })
  const app = createApp(App)
  app.use(router)
  const root = document.createElement('div')
  app.mount(root)
  await flush()
  return { result, router, unmount: () => app.unmount() }
}

/** Wait for reactive watches AND any in-flight `router.replace` to
 *  land in `router.currentRoute`. */
function flush (): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0))
}

describe('useFilters', () => {
  let unmount: (() => void) | null = null

  beforeEach(() => {
    unmount?.()
    unmount = null
  })

  // ── initialization ───────────────────────────────────────────────────

  it('falls back to the type-natural empty when URL has nothing', async () => {
    const { result, unmount: u } = await mount('/', () =>
      useFilters({ a: String, b: Number, c: Boolean, d: Array, e: Object }),
    )
    unmount = u
    expect(result).toEqual({ a: '', b: 0, c: false, d: [], e: {}})
  })

  it('parses URL values according to the declared types', async () => {
    const { result, unmount: u } = await mount(
      '/?a=hello&b=42&c=true&d=x&d=y&e=%7B%22k%22%3A1%7D',
      () => useFilters({ a: String, b: Number, c: Boolean, d: Array, e: Object }),
    )
    unmount = u
    expect(result).toEqual({
      a: 'hello',
      b: 42,
      c: true,
      d: [ 'x', 'y' ],
      e: { k: 1 },
    })
  })

  it('treats `1` and `true` as boolean true; everything else as false', async () => {
    const { result: r1, unmount: u1 } = await mount('/?x=1', () => useFilters({ x: Boolean }))
    expect(r1.x).toBe(true)
    u1()

    const { result: r2, unmount: u2 } = await mount('/?x=true', () => useFilters({ x: Boolean }))
    expect(r2.x).toBe(true)
    u2()

    const { result: r3, unmount: u3 } = await mount('/?x=0', () => useFilters({ x: Boolean }))
    expect(r3.x).toBe(false)
    unmount = u3
  })

  it('falls back to type-empty when Number URL value is NaN', async () => {
    const { result, unmount: u } = await mount('/?n=abc', () => useFilters({ n: Number }))
    unmount = u
    expect(result.n).toBe(0)
  })

  it('falls back to {} when Object URL value is unparseable', async () => {
    const { result, unmount: u } = await mount('/?o=not-json', () => useFilters({ o: Object }))
    unmount = u
    expect(result.o).toEqual({})
  })

  // ── advanced default ─────────────────────────────────────────────────

  it('uses the advanced `default` as the empty-state target', async () => {
    const { result, unmount: u } = await mount('/', () =>
      useFilters({ size: { type: Number, default: 20 }}),
    )
    unmount = u
    expect(result.size).toBe(20)
  })

  it('strips URL when value reverts to the advanced default', async () => {
    const { result, router, unmount: u } = await mount('/?size=50', () =>
      useFilters({ size: { type: Number, default: 20 }}),
    )
    unmount = u
    expect(result.size).toBe(50)

    result.size = 20
    await flush()
    expect(router.currentRoute.value.query.size).toBeUndefined()
  })

  // ── initialValues ────────────────────────────────────────────────────

  it('seeds initialValues into keys absent from the URL', async () => {
    const { result, router, unmount: u } = await mount('/', () =>
      useFilters({ a: String, b: Object }, { a: 'seeded', b: { x: 1 }}),
    )
    unmount = u
    expect(result.a).toBe('seeded')
    expect(result.b).toEqual({ x: 1 })
    await flush()
    expect(router.currentRoute.value.query.a).toBe('seeded')
  })

  it('lets URL win over initialValues on first load', async () => {
    const { result, unmount: u } = await mount('/?a=fromUrl', () =>
      useFilters({ a: String }, { a: 'seeded' }),
    )
    unmount = u
    expect(result.a).toBe('fromUrl')
  })

  it('keeps a cleared filter cleared (initialValues do not re-apply)', async () => {
    const { result, router, unmount: u } = await mount('/', () =>
      useFilters({ a: String }, { a: 'seeded' }),
    )
    unmount = u
    await flush()
    expect(result.a).toBe('seeded')

    result.a = ''
    await flush()
    expect(router.currentRoute.value.query.a).toBeUndefined()
    expect(result.a).toBe('')
  })

  // ── writes → URL ─────────────────────────────────────────────────────

  it('writes scalar updates back to the URL', async () => {
    const { result, router, unmount: u } = await mount('/', () =>
      useFilters({ a: String, n: Number, b: Boolean }),
    )
    unmount = u

    result.a = 'foo'
    result.n = 42
    result.b = true
    await flush()
    expect(router.currentRoute.value.query.a).toBe('foo')
    expect(router.currentRoute.value.query.n).toBe('42')
    expect(router.currentRoute.value.query.b).toBe('true')
  })

  it('serializes Array as repeated keys', async () => {
    const { result, router, unmount: u } = await mount('/', () =>
      useFilters({ tags: Array }),
    )
    unmount = u
    result.tags = [ 'a', 'b', 'c' ]
    await flush()
    expect(router.currentRoute.value.query.tags).toEqual([ 'a', 'b', 'c' ])
  })

  it('serializes Object as JSON', async () => {
    const { result, router, unmount: u } = await mount('/', () =>
      useFilters({ range: Object }),
    )
    unmount = u
    result.range = { start: '1', end: '2' }
    await flush()
    expect(router.currentRoute.value.query.range).toBe('{"start":"1","end":"2"}')
  })

  it('strips URL keys whose value goes back to type-empty', async () => {
    const { result, router, unmount: u } = await mount('/?a=foo', () =>
      useFilters({ a: String }),
    )
    unmount = u
    result.a = ''
    await flush()
    expect(router.currentRoute.value.query.a).toBeUndefined()
  })

  it('strips URL when an Object becomes all-empty', async () => {
    const { result, router, unmount: u } = await mount('/?range=%7B%22start%22%3A%221%22%7D', () =>
      useFilters({ range: Object }),
    )
    unmount = u
    expect(result.range).toEqual({ start: '1' })

    result.range = { start: '', end: '' }
    await flush()
    expect(router.currentRoute.value.query.range).toBeUndefined()
  })

  it('drops null/undefined entries from Array when serializing', async () => {
    const { result, router, unmount: u } = await mount('/', () =>
      useFilters({ tags: Array as unknown as ArrayConstructor }),
    )
    unmount = u
    result.tags = [ 'a', null as unknown as string, 'b', undefined as unknown as string ]
    await flush()
    expect(router.currentRoute.value.query.tags).toEqual([ 'a', 'b' ])
  })

  it('drops empty-string entries from Array when serializing', async () => {
    const { result, router, unmount: u } = await mount('/', () =>
      useFilters({ tags: Array }),
    )
    unmount = u
    result.tags = [ '', 'a', '' ]
    await flush()
    expect(router.currentRoute.value.query.tags).toEqual([ 'a' ])
  })

  it('strips URL when an Array contains only empty entries', async () => {
    const { result, router, unmount: u } = await mount('/?tags=a&tags=b', () =>
      useFilters({ tags: Array }),
    )
    unmount = u
    result.tags = [ '', '' ]
    await flush()
    expect(router.currentRoute.value.query.tags).toBeUndefined()
  })

  it('strips URL when an Array becomes empty', async () => {
    const { result, router, unmount: u } = await mount('/?tags=a&tags=b', () =>
      useFilters({ tags: Array }),
    )
    unmount = u
    result.tags = []
    await flush()
    expect(router.currentRoute.value.query.tags).toBeUndefined()
  })

  it('preserves non-filter query params when writing', async () => {
    const { result, router, unmount: u } = await mount('/?other=keep&a=foo', () =>
      useFilters({ a: String }),
    )
    unmount = u
    result.a = 'bar'
    await flush()
    expect(router.currentRoute.value.query.other).toBe('keep')
    expect(router.currentRoute.value.query.a).toBe('bar')
  })

  // ── URL → filters ────────────────────────────────────────────────────

  it('reflects external URL changes back into filters', async () => {
    const { result, router, unmount: u } = await mount('/?a=one', () =>
      useFilters({ a: String, n: Number }),
    )
    unmount = u
    expect(result.a).toBe('one')

    await router.push('/?a=two&n=5')
    await flush()
    expect(result.a).toBe('two')
    expect(result.n).toBe(5)
  })

  it('resets a key to default when removed from the URL', async () => {
    const { result, router, unmount: u } = await mount('/?a=one', () =>
      useFilters({ a: String }),
    )
    unmount = u
    expect(result.a).toBe('one')

    await router.push('/')
    await flush()
    expect(result.a).toBe('')
  })

  it('resets to advanced `default` when URL clears the key', async () => {
    const { result, router, unmount: u } = await mount('/?size=50', () =>
      useFilters({ size: { type: Number, default: 20 }}),
    )
    unmount = u
    expect(result.size).toBe(50)

    await router.push('/')
    await flush()
    expect(result.size).toBe(20)
  })
})
