---
name: storybook
description: Storybook story 开发规范。**创建或修改任何 `.stories.ts` 文件前必须调用**。涵盖 story 文件位置、meta 结构、story 拆分原则、Default 作为 Primary / Controls 的载体、Controls 完整性、Docs 页面聚合等规范。
---

# Storybook Story 开发指南

本包的 Storybook 作为封装层（`app/components/ui/*`）的活文档。每个 story 文件会被聚合到 Docs 页，把该组件的所有使用方式一次性展示给消费方。

---

## ⛔ 硬性规则

- **`app/components/ui/` 下每个组件都必须有 `index.stories.ts`**（和 `index.vue` 同目录）
- `app/components/shadcn/` 是 CLI 产物、不可修改，**永远不写 stories**；其他业务组件目录视情况自行决定
- **一个 demo = 一个 story export**（禁止巨石 `Default`：把多个 `<section>` 塞进同一个 render）
- **每个可配置 Prop 至少要有一个专门的演示 story**
- **meta 的 `argTypes` 必须列出所有可配置 Prop**
- **meta 的 `args` 必须给所有可配置 Prop 设默认值**
- **第一个 export 必须是 `Default`，且为空对象 `{}` 继承 meta.render**
  - 原因：Storybook Docs 页把第一个 story 当作 Primary，紧跟其下渲染 ArgsTable（Controls）。`Default` 继承 meta 的 `<X v-bind="args">` 模板后，用户在 Controls 里改动会立即反映到这个交互演示上。
- **非 `Default` story 一律不受控**：必须写自己的 `render`（不能只重写 `args` 继承 `meta.render`），并加 `parameters: { controls: { disable: true }}` 关闭 Controls 面板
  - 原因：只重写 `args` 会继承 `meta.render` 里的 `v-bind="args"`，story 仍然是 args 驱动，违反"只有 `Default` 受控"的约定。要展示某种 props 组合，应在 `render` 里把 props 硬编码进 template。同时 Controls 面板对硬编码 `render` 改了没反应，留着会误导消费方，因此一并关闭。

---

## 文件位置

| 组件路径 | story 文件路径 |
|---|---|
| `app/components/ui/Button/index.vue` | `app/components/ui/Button/index.stories.ts` |
| `app/components/ui/DataTable/index.vue` | `app/components/ui/DataTable/index.stories.ts` |

`nuxt-layer-shadcn-ui/.playground/.storybook/main.ts` 的 glob 已经覆盖这个路径，放对位置就会自动被扫到。

---

## Meta 结构

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './index.vue'

const variants = [ 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link' ] as const
const sizes = [ 'sm', 'default', 'lg', 'icon-sm', 'icon', 'icon-lg' ] as const

const meta = {
  title: 'UI/Button',              // ① 固定前缀 UI/
  component: Button,               // ② 必填，Docs 会据此生成 Props 表
  argTypes: {                      // ③ 列出所有可配置 Prop
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    rounded: { control: 'boolean' },
    icon: { control: 'text' },
    iconPosition: { control: 'select', options: [ 'start', 'end' ]},
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {                          // ④ 所有可配置 Prop 都给默认值
    variant: 'default',
    size: 'default',
    rounded: false,
    icon: '',
    iconPosition: 'start',
    loading: false,
    disabled: false,
  },
  render: args => ({               // ⑤ meta 级 render：被 Default 继承
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
```

### 各字段要点

| 字段 | 规范 |
|---|---|
| `title` | 固定 `UI/<PascalComponent>`，和组件目录名一致 |
| `component` | 必填，**不要加 `as any`**（除非真的遇到无法解决的类型冲突） |
| `argTypes` | 列出**所有** Prop；用 `control: 'select'`/`'boolean'`/`'text'`/`'number'` 配合 `options` |
| `args` | 每个 Prop 都给默认值，消费方在 Controls 里改动会基于这套默认值 |
| `render` | 提升到 meta，供 `Default` 继承；template 里**必须**用 `<X v-bind="args">` 让 Controls 驱动 |

---

## Story 命名与排布

### 顺序

```
export const Default       // ① 第一个：args 驱动的 Primary，Controls 面板挂在它下面
export const <FeatureA>    // ② 起 各 feature story（覆盖每个 Prop / 特性）
export const <FeatureB>
...
```

### `Default` story

`Default` 是空对象，继承 `meta.render`——用户在 Controls 里改 args，这里会直接响应：

```ts
export const Default: Story = {}
```

如需覆盖 meta 的默认 args，可以：

```ts
export const Default: Story = {
  args: { variant: 'outline' },
}
```

**不要给 `Default` 写自己的 `render`**。一写 render 就脱离 args 绑定，Controls 就没用了。

### 非 `Default` story 关闭 Controls

非 `Default` 的 story 都是**展示型**演示（硬编码 `render`、不绑定 `args`）。如果不显式关闭 Controls 面板，消费方会看到一个改了没反应的面板，造成误导。

文件顶层抽一个常量，所有非 `Default` story 复用：

```ts
const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Variants: Story = {
  parameters: noControls,
  render: () => ({ ... }),
}

export const Sizes: Story = {
  parameters: noControls,
  render: () => ({ ... }),
}
```

如果某个 story 还需要其他 `parameters`（比如 `docs.source`），用展开合并：

```ts
export const Variants: Story = {
  parameters: {
    ...noControls,
    docs: { source: { code: '...' }},
  },
  render: () => ({ ... }),
}
```

### 命名约定（PascalCase）

| 演示内容 | export 名 |
|---|---|
| **首个 Primary，args 驱动** | **`Default`**（空对象 `{}`） |
| 列举某枚举型 prop 的所有取值 | 用 prop 名的复数形式，如 `Variants` / `Sizes` / `Types` / `Colors` |
| 带图标 | `WithIcons` / `WithPrefix` / `WithSuffix` |
| 带描述 | `WithDescription` |
| 带默认值/预选 | `Preselected` |
| 水平排列 | `Horizontal` |
| 多选模式 | `Multiple` |
| 不同位置 | `Positions` |
| 禁用 | `Disabled` |
| 加载中 | `Loading` |
| 圆角 | `Rounded` |
| 链接形式 | `AsLink` / `LinkButtons` |
| 自定义 slot | `CustomSlots` |
| 两个枚举 prop 的矩阵组合 | `<A><B>Matrix`，如 `VariantColorMatrix` |

---

## 演示覆盖度

### 每个 Prop 必有一个演示

假设组件有 `variant`、`size`、`disabled`、`loading`、`icon`、`rounded` 这些 Prop，story 文件里应**至少**有：

- `Default`（args 驱动，继承 meta.render）
- `Variants`（覆盖 `variant`）
- `Sizes`（覆盖 `size`）
- `WithIcons`（覆盖 `icon` / `iconPosition`）
- `Disabled`（覆盖 `disabled`）
- `Loading`（覆盖 `loading`）
- `Rounded`（覆盖 `rounded`）

可以合并相关 Prop 到一个 story（比如 `iconPosition` 可以作为 `WithIcons` 的一部分），但不能跳过。

### 组合型演示

某些 Prop 配合使用才有意义（比如 `variant × color`），用矩阵演示：

```ts
export const VariantColorMatrix: Story = {
  render: () => ({
    components: { Tag },
    setup: () => ({ colors, variants }),
    template: `
      <div class="space-y-3">
        <div v-for="v in variants" :key="v" class="flex flex-wrap items-center gap-3">
          <span class="w-20 text-sm text-muted-foreground">{{ v }}</span>
          <Tag v-for="c in colors" :key="c" :color="c" :variant="v">{{ c }}</Tag>
        </div>
      </div>
    `,
  }),
}
```

---

## Template 书写规范

### 不要写章节标题

**错误**：

```vue
<section>
  <h3 class="mb-4 text-lg font-medium">Variants</h3>
  <div class="flex gap-3"> <!-- ... --> </div>
</section>
```

**正确**：

```vue
<div class="flex flex-wrap gap-3">
  <!-- ... -->
</div>
```

Docs 页已经用 story 的 export 名做标题，template 里再写 `<h3>Variants</h3>` 就是重复。

### 只渲染本 story 要展示的东西

每个 story 的 template 只保留**这个主题**相关的内容，不要混入其他 Prop 的演示。

### 用 `v-for` 展开同质内容

```vue
<div class="flex flex-wrap gap-3">
  <Button v-for="v in variants" :key="v" :variant="v">{{ v }}</Button>
</div>
```

比手写 6 个 `<Button variant="...">` 更简洁、列变化时一次改全。`variants` / `sizes` / `types` 这类常量在文件顶层定义，meta 和 story 共享。

### 组件内部状态用 `setup()`

需要 `ref` / `computed` 的放 `setup`，不要用 script 顶层（story 不是 SFC，没有自动 unref）：

```ts
export const Controlled: Story = {
  render: () => ({
    components: { Switch },
    setup () {
      const on = ref(true)
      return { on }
    },
    template: `
      <div class="flex items-center gap-4">
        <Switch v-model="on" />
        <div class="text-sm text-muted-foreground">Value: {{ on }}</div>
      </div>
    `,
  }),
}
```

---

## 处理 "Show code"

Storybook 自动从 VNode tree 反推 source code（不读你的 template 字符串）。复杂 story（多层包装 / 复杂 props / v-model）经常吐空。两种办法：

### a. 手动覆盖

```ts
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        language: 'vue',
        code: `<Button v-for="v in variants" :key="v" :variant="v">{{ v }}</Button>`,
      },
    },
  },
  render: () => ({ ... }),
}
```

### b. 关闭

```ts
parameters: {
  docs: { source: { code: null }}
}
```

原则：**`Default`**（继承 meta.render 的 `<Component v-bind="args" />`）的 source 必须能自动生成。其他展示型 story 的 source 不重要时可以放弃或关闭。

---

## Slots 演示

组件有命名 slot 时，至少给每个 slot 一个演示 story：

```ts
export const CustomSlots: Story = {
  render: () => ({
    components: { Accordion, Icon },
    setup: () => ({ items }),
    template: `
      <Accordion :items="items">
        <template #title="{ item, open }">
          <Icon :name="open ? 'minus' : 'plus'" />
          {{ item.title }}
        </template>
        <template #content="{ item }">
          <p>{{ item.content }}</p>
        </template>
      </Accordion>
    `,
  }),
}
```

---

## Events 演示

组件有 emits 时，用 `actions` 展示（Actions 面板会显示触发记录）：

```ts
// meta 里不用特殊配置，Storybook 会自动捕获所有 emit
export const EventHandling: Story = {
  render: () => ({
    components: { Modal },
    setup () {
      const open = ref(false)
      return { open }
    },
    template: `
      <Button @click="open = true">Open</Button>
      <Modal v-model:open="open" @close="() => {}">
        <p>Content</p>
      </Modal>
    `,
  }),
}
```

---

## 类型导入

stories.ts 里会用到相邻 `types.ts` 的类型或组件 Prop 类型，**显式 import**：

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import type { AccordionItem } from './types'
import Accordion from './index.vue'
```
