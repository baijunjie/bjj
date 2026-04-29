---
name: storybook
description: Storybook story 开发规范。**创建或修改任何 `.stories.ts` 文件前必须调用**。涵盖 story 文件位置、meta 结构、story 拆分原则、Default 作为 Primary / Controls 的载体、Controls 完整性、Docs 页面聚合等规范。适用于本仓库所有带 Storybook 的 Nuxt layer 包。
---

# Storybook Story 开发指南

本仓库的 Nuxt layer 包用 Storybook 作为封装层组件的活文档。每个 story 文件会被聚合到 Docs 页，把该组件的所有使用方式一次性展示给消费方。

## 适用范围

| Package | 封装层目录 | story title 前缀 |
|---|---|---|
| `nuxt-layer-shadcn-ui` | `app/components/ui/` | `UI/` |
| `nuxt-layer-effect` | `app/components/effect/` | `Effect/` |

下文以 `<封装层>` 指代当前包的封装目录（`ui/` 或 `effect/`），以 `<TitlePrefix>` 指代 title 前缀（`UI` 或 `Effect`）。

各 package 的 `.playground/.storybook/main.ts` 已经把 `app/components/**/*.stories.@(ts|tsx)` 配进 glob，story 文件放在组件目录下就会自动被扫到。

---

## ⛔ 硬性规则

- **`app/components/<封装层>/` 下每个组件都必须有 `index.stories.ts`**（和 `index.vue` 同目录）
- `nuxt-layer-shadcn-ui` 的 `app/components/shadcn/` 是 CLI 产物、不可修改，**永远不写 stories**；其他业务组件目录视情况自行决定
- **一个 demo = 一个 story export**（禁止巨石 `Default`：把多个 `<section>` 塞进同一个 render）
- **每个可配置 Prop 至少要有一个专门的演示 story**
- **meta 的 `argTypes` 必须列出所有可配置 Prop**
- **meta 的 `args` 必须给所有可配置 Prop 设默认值**
- **第一个 export 必须是 `Default`**，且为空对象 `{}` 继承 meta.render
- **非 `Default` story 必须关 Controls**：`parameters: { controls: { disable: true }}`
- **非 `Default` story 优先 args-only**，能不写自定义 `render` 就不写

---

## 文件位置

| 组件路径 | story 文件路径 |
|---|---|
| `app/components/ui/Button/index.vue` | `app/components/ui/Button/index.stories.ts` |
| `app/components/effect/AutoScale/index.vue` | `app/components/effect/AutoScale/index.stories.ts` |

---

## Meta 结构

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './index.vue'

const variants = [ 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link' ] as const
const sizes = [ 'sm', 'default', 'lg', 'icon-sm', 'icon', 'icon-lg' ] as const

const meta = {
  title: 'UI/Button',                // 固定 <TitlePrefix>/<PascalComponent>，和组件目录名一致
  component: Button,                 // 必填，不要 as any
  argTypes: {                        // 所有可配置 Prop 都要列
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    rounded: { control: 'boolean' },
    icon: { control: 'text' },
    iconPosition: { control: 'select', options: [ 'start', 'end' ]},
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {                            // 所有可配置 Prop 都给默认值
    variant: 'default',
    size: 'default',
    rounded: false,
    icon: '',
    iconPosition: 'start',
    loading: false,
    disabled: false,
  },
  render: args => ({                 // meta 级 render：被 Default 继承
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>',  // 必须 v-bind="args"，Controls 才能驱动
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
```

`control` 类型按 prop 类型选：枚举 `'select'` + `options`、布尔 `'boolean'`、字符串 `'text'`、数字 `'number'`。

**类型导入**：用到相邻 `types.ts` 的类型时显式 import：

```ts
import type { AccordionItem } from './types'
```

---

## Story 编写

### Default

第一个 export，空对象，继承 `meta.render`。**不要给它写自己的 `render`**——一写就脱离 args 绑定，Controls 失效。

```ts
export const Default: Story = {}
```

如果想覆盖默认 args（比如把 outline 变体作为 Primary 展示）：

```ts
export const Default: Story = {
  args: { variant: 'outline' },
}
```

Storybook Docs 把第一个 story 当作 Primary、紧跟其下渲染 ArgsTable（Controls）。Default 继承 `<X v-bind="args" />` 模板后，用户在 Controls 里改动会立即反映到 Default 上。

### 非 Default story

非 Default 都是**固定展示**，不接受用户改 args。

#### 关 Controls

文件顶部抽常量复用：

```ts
const noControls = { controls: { disable: true }} satisfies Story['parameters']
```

#### args-only vs 自定义 render

| 适用情形 | 写法 | "Show code" |
|---|---|---|
| 只是 props 差异 | **args-only**（不写 `render`，只覆盖 `args`） | ✅ 自动 dynamic 生成 |
| 涉及 slot 内容 / 多组件并列 / 内部状态 / 事件 demo | 自定义 `render` + 手动 `parameters.docs.source.code` | ⚠️ 需手抄一段干净 HTML |

**为什么这个分叉很关键**：args-only 继承 `meta.render` 的 `<X v-bind="args" />` 模板，Storybook 的 `dynamic` source 路径会自动从 args 序列化出代码。一旦写了自定义 `render`，要切到 `code` source（从源文件静态抽取），但 `@storybook-vue/nuxt` 没内置 `csf-plugin`，默认抽不到东西，"Show code" 会空——必须手动补 `source.code`。

**args-only 写法（首选）**：

```ts
export const WithDescription: Story = {
  parameters: noControls,
  args: {
    title: 'Delete Project',
    description: 'This will permanently remove the project.',
    confirmVariant: 'destructive',
    confirmText: 'Delete',
  },
}
```

**自定义 render 写法**（具体示例见后文 [Slots 演示](#slots-演示)、[Events 演示](#events-演示)）：

```ts
export const SomeDemo: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <X ... />
</template>
`.trim(),    // 给消费方看的干净示例，不是 render 函数原文
      },
    },
  },
  render: () => ({ /* ... */ }),
}
```

**两条强制**：

- **不要写 `language` 字段**，Storybook 框架默认就是 `html`
- **`code` 内容必须用 `<template>` 包裹**——和自动生成的 Default source 保持一致

少数确实不值得展示代码的 demo，可以彻底关掉 Show code 按钮：

```ts
parameters: { ...noControls, docs: { source: { code: null }}}
```

注意是 `code: null`——`code: ''` 按钮还在但点开是空。

#### 命名

Story export 用 PascalCase，名字跟 prop 名走（`Variants` / `Sizes` / `Disabled` 等），写者自由判断。两个枚举 prop 矩阵组合用 `<A><B>Matrix`（如 `VariantColorMatrix`）。

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

## 必备 story 类型

### 每个 Prop 一个演示

假设组件有 `variant`、`size`、`disabled`、`loading`、`icon`、`rounded` 这些 Prop，story 文件里应**至少**有：

- `Default`（args 驱动，继承 meta.render）
- 覆盖 `variant` 的 story
- 覆盖 `size` 的 story
- 覆盖 `icon` / `iconPosition` 的 story
- 覆盖 `disabled` 的 story
- 覆盖 `loading` 的 story
- 覆盖 `rounded` 的 story

可以合并相关 Prop 到一个 story（比如 `iconPosition` 作为图标 demo 的一部分），但不能跳过。

### 矩阵演示

某些 Prop 配合使用才有意义（比如 `variant × color`），用矩阵展开：

```ts
export const VariantColorMatrix: Story = {
  parameters: noControls,
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

### Slots 演示

组件有命名 slot 时，至少给每个 slot 一个演示 story。自定义 render 必须手动补 `source.code`：

```ts
export const CustomSlots: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Dropdown :menus="customMenus">
    <Button variant="outline">Custom Slots</Button>
    <template #profile="{ item }">
      <div class="flex flex-col gap-1 px-2 py-1.5">
        <span class="font-semibold text-sm">{{ item.title }}</span>
        <span class="text-xs text-muted-foreground">{{ item.email }}</span>
      </div>
    </template>
  </Dropdown>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Dropdown, Button },
    setup: () => ({ customMenus }),    // customMenus: 文件顶部定义的演示数据
    template: `
      <Dropdown :menus="customMenus">
        <Button variant="outline">Custom Slots</Button>
        <template #profile="{ item }">
          <div class="flex flex-col gap-1 px-2 py-1.5">
            <span class="font-semibold text-sm">{{ item.title }}</span>
            <span class="text-xs text-muted-foreground">{{ item.email }}</span>
          </div>
        </template>
      </Dropdown>
    `,
  }),
}
```

`source.code` 写**给消费方看的干净示例**。如果 render 里只是这一个组件的演示（没有外层触发器、log 容器等），`source.code` 和 `template` 内容会几乎一致。

### Events 演示

组件有 emits 时，新增一个 `EventHandling` story，用 `<EventLog>` 把事件记录到画布内可见的 log 列表里。**不要靠 Storybook 的 Actions 面板**——多数消费方根本不会注意到底部那个 tab，且 Actions 需要 `v-bind="args"` 才能接通，写自定义 render 时容易失效。

#### `<EventLog>` 组件

`packages/nuxt-layer-shadcn-ui/.playground/.storybook/EventLog.vue` 提供一个带 scoped slot 的容器：通过 `v-slot="{ record }"` 暴露 `record(name, ...payload)` 函数，每次调用会在下方 log 列表追加一条带时间戳的记录。

通过 `#storybook` alias 引入（已在 `.playground/nuxt.config.ts` 配置）：

```ts
import EventLog from '#storybook/EventLog.vue'
```

#### 标准写法

```ts
export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { Modal, Button, EventLog },
    setup: () => ({ visible: ref(false) }),
    template: `
      <EventLog v-slot="{ record }">
        <Button @click="visible = true">Open Modal</Button>
        <Modal
          v-model:visible="visible"
          title="Event Demo"
          description="Each emitted event will be appended to the log below."
          showCancel
          confirmText="Confirm"
          @open="record('open')"
          @close="record('close')"
          @closed="record('closed')"
          @confirm="record('confirm')"
          @cancel="record('cancel')"
          @update:visible="(v) => record('update:visible', v)"
        >
          <p>Click Confirm, Cancel, or the close button to see events fire.</p>
        </Modal>
      </EventLog>
    `,
  }),
}
```

#### 调用约定

- **无参数**：`record('event-name')` —— log 显示 `12:34:56 — event-name`
- **带参数**：`record('event-name', payload)` —— log 显示 `12:34:56 — event-name(payload-json)`
- 多个参数会按顺序序列化：`record('foo', a, b)` → `foo(a-json, b-json)`

Story export 名固定为 `EventHandling`——事件演示就这一处。