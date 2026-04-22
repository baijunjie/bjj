import { describe, it, expect, afterEach } from 'vitest'
import { containElement, loadJs } from '../../src/utils-browser/dom'

describe('containElement', () => {
  it('should return false when node is null', () => {
    const subNode = document.createElement('div')
    expect(containElement(null, subNode)).toBe(false)
  })

  it('should return false when subNode is null', () => {
    const node = document.createElement('div')
    expect(containElement(node, null)).toBe(false)
  })

  it('should return true when subNode is a child of node', () => {
    const node = document.createElement('div')
    const middle = document.createElement('div')
    const subNode = document.createElement('span')
    node.appendChild(middle)
    middle.appendChild(subNode)
    expect(containElement(node, subNode)).toBe(true)
  })

  it('should return false when nodes are unrelated', () => {
    const node = document.createElement('div')
    const otherNode = document.createElement('div')
    expect(containElement(node, otherNode)).toBe(false)
  })

  it('should return true when node equals subNode (non-strict)', () => {
    const node = document.createElement('div')
    expect(containElement(node, node)).toBe(true)
  })

  it('should return false when node equals subNode (strict)', () => {
    const node = document.createElement('div')
    expect(containElement(node, node, true)).toBe(false)
  })

  it('should work with CSS selector strings', () => {
    const parent = document.createElement('div')
    parent.id = 'test-parent'
    const child = document.createElement('span')
    child.id = 'test-child'
    parent.appendChild(child)
    document.body.appendChild(parent)

    expect(containElement('#test-parent', '#test-child')).toBe(true)
    expect(containElement('#test-child', '#test-parent')).toBe(false)

    document.body.removeChild(parent)
  })

  it('should return false when selector matches nothing', () => {
    const node = document.createElement('div')
    expect(containElement('#nonexistent', node)).toBe(false)
    expect(containElement(node, '#nonexistent')).toBe(false)
  })

  it('should return true for direct child (strict)', () => {
    const node = document.createElement('div')
    const child = document.createElement('span')
    node.appendChild(child)
    expect(containElement(node, child, true)).toBe(true)
  })
})

describe('loadJs', () => {
  afterEach(() => {
    // 清理测试添加的 script 标签
    const scripts = document.head.querySelectorAll('script')
    scripts.forEach(s => s.remove())
  })

  it('should skip if script with same src already exists', async () => {
    const src = 'https://example.com/test.js'
    const existing = document.createElement('script')
    existing.setAttribute('src', src)
    document.head.appendChild(existing)

    const result = await loadJs(src)
    expect(result).toBeUndefined()

    const scripts = document.querySelectorAll(`script[src="${src}"]`)
    expect(scripts.length).toBe(1)
  })

  it('should set custom attrs on script element', () => {
    const src = 'https://example.com/custom.js'
    loadJs(src, { 'crossorigin': 'anonymous', 'data-id': '123' })

    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement
    expect(script).not.toBeNull()
    expect(script.getAttribute('crossorigin')).toBe('anonymous')
    expect(script.getAttribute('data-id')).toBe('123')
  })

  it('should set async but not defer', () => {
    const src = 'https://example.com/async-test.js'
    loadJs(src)

    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement
    expect(script).not.toBeNull()
    expect(script.async).toBe(true)
    expect(script.hasAttribute('defer')).toBe(false)
  })

  it('should handle src with special characters safely', async () => {
    const src = 'https://example.com/test.js?v=1&t="quoted"'
    const existing = document.createElement('script')
    existing.setAttribute('src', src)
    document.head.appendChild(existing)

    const result = await loadJs(src)
    expect(result).toBeUndefined()
  })
})
