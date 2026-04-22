/**
 * 判断 node 是否包含 subNode
 * @param node    父节点
 * @param subNode 子节点
 * @param strict  严格包含，默认为 false。如果为 true，当 node === subNode 时会返回 false
 */
export function containElement (
  node: HTMLElement | string | null,
  subNode: HTMLElement | string | null,
  strict = false,
): boolean {
  const resolvedNode = typeof node === 'string' ? document.querySelector<HTMLElement>(node) : node
  const resolvedSubNode = typeof subNode === 'string' ? document.querySelector<HTMLElement>(subNode) : subNode

  if (!resolvedNode || !resolvedSubNode) return false
  if (strict) return resolvedNode !== resolvedSubNode && resolvedNode.contains(resolvedSubNode)
  return resolvedNode.contains(resolvedSubNode)
}

/**
 * 动态加载 JS 文件
 * @param src   JS 文件地址
 * @param attrs 附加的 script 标签属性
 */
export async function loadJs (src: string, attrs: Record<string, string> = {}): Promise<Event | void> {
  // 遍历检查避免 CSS 选择器注入
  const scripts = document.getElementsByTagName('script')
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].getAttribute('src') === src) return
  }

  const script = document.createElement('script')
  script.src = src
  script.async = true
  for (const key in attrs) {
    script.setAttribute(key, attrs[key])
  }

  const promise = new Promise<Event>((resolve, reject) => {
    script.onload = resolve
    script.onerror = reject
  })

  document.head.appendChild(script)

  return promise
}
